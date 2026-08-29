const MODELS_TO_TRY = [
  process.env.GEMINI_MODEL,
  'gemini-3.6-flash',
  'gemini-1.5-flash',
  'gemini-1.5-pro'
].filter(Boolean);

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const requestLog = new Map();

function getClientId(request) {
  const forwarded = request.headers?.['x-forwarded-for'];
  return (Array.isArray(forwarded) ? forwarded[0] : forwarded || request.socket?.remoteAddress || 'unknown').split(',')[0].trim();
}

function isRateLimited(clientId) {
  const now = Date.now();
  const recent = (requestLog.get(clientId) || []).filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) return true;
  recent.push(now);
  requestLog.set(clientId, recent);
  return false;
}

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function handler(request, response) {
  if (request.method !== 'POST') { response.setHeader('Allow', 'POST'); return response.status(405).json({ error: 'Method not allowed.' }); }
  const apiKey = process.env.GEMINI_API_KEY || process.env.REACT_APP_GEMINI_API_KEY;
  if (!apiKey) return response.status(503).json({ error: 'DegreeAI is initializing. Please try again shortly.' });
  if (isRateLimited(getClientId(request))) return response.status(429).json({ error: 'DegreeAI rate limit reached. Please wait a minute and try again.' });
  
  const { prompt, systemInstruction, history } = request.body || {};
  if (typeof prompt !== 'string' || !prompt.trim()) return response.status(400).json({ error: 'A study question is required.' });
  
  const validHistory = [];
  let expectedRole = 'user';
  if (Array.isArray(history)) {
    for (const turn of history.slice(-8)) {
      if (!turn || typeof turn.content !== 'string' || !turn.content.trim()) continue;
      const role = (turn.role === 'model' || turn.role === 'assistant') ? 'model' : 'user';
      if (role === expectedRole) {
        validHistory.push({ role, parts: [{ text: turn.content.trim().slice(0, 4000) }] });
        expectedRole = role === 'user' ? 'model' : 'user';
      }
    }
  }
  if (validHistory.length > 0 && validHistory[validHistory.length - 1].role === 'user') {
    validHistory.pop();
  }
  const contents = [...validHistory, { role: 'user', parts: [{ text: prompt.trim().slice(0, 16000) }] }];

  // Dual-Server / Multi-Model Redundancy: Attempt primary, if busy or rate-limited, auto-failover to backup
  for (const model of MODELS_TO_TRY) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 24000);
      
      const upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey.trim() },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: String(systemInstruction || '').slice(0, 12000) }] },
          contents,
          generationConfig: { temperature: 0.4, maxOutputTokens: 1500 }
        }),
      });
      clearTimeout(timeout);

      if (upstream.ok) {
        const data = await upstream.json().catch(() => ({}));
        const content = data.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim();
        if (content) {
          return response.status(200).json({
            content,
            provider: 'DegreeAI Academic Core',
            status: 'success'
          });
        }
      }
    } catch (err) {
      console.warn(`[DegreeAI Server] Failover from ${model}:`, err?.message);
    }
    await pause(300);
  }

  return response.status(502).json({ error: 'DegreeAI servers are experiencing high academic traffic. Please try your question again.' });
}

module.exports = handler;

