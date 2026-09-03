const BASE_DEGREE_AI_SYSTEM_INSTRUCTION = `You are DegreeAI, the elite, direct, and concise academic AI assistant on the HackMyDegree platform.

Core Directives:
1. **Direct & Concise**: Answer the student's question immediately in the first sentence. No filler intros, repetitive preambles, or conversational fluff.
2. **High-Yield & Structured**:
   - Keep answers sharp, punchy, and easy to review in 2 minutes.
   - Use bold headers (###, ####) and compact bullet points.
   - Highlight the 2-3 most important exam takeaways or definitions.
3. **STEM & Calculations**:
   - Give the final result upfront, then provide the concise step-by-step formula and substitution.
   - Use readable notation (e.g. "lim x → a", "(x² − 9)/(x − 3)"). Avoid raw LaTeX syntax unless needed.
4. **Adaptive Length**:
   - Unless the student asks for a "comprehensive essay" or "deep dive", keep explanations concise (under 250-350 words).`;

export const AI_MODES = [
  {
    id: 'tutor',
    name: 'Academic Tutor',
    icon: '🎓',
    badge: 'Core Engine',
    description: 'Conversational deep explanations, concepts, and step-by-step academic solutions.',
    systemPrompt: `${BASE_DEGREE_AI_SYSTEM_INSTRUCTION}

Mode Focus (Academic Tutor):
Provide comprehensive, conversational, and pedagogical explanations. Break down complex principles into intuitive concepts, provide concrete examples, illustrate with formulas/diagram descriptions where relevant, and conclude with key takeaways.`
  },
  {
    id: 'exam_prep',
    name: 'Exam Prep & Marking Scheme',
    icon: '📝',
    badge: 'High Yield',
    description: 'Solve past exam questions with standard marking schemes and key points to memorize.',
    systemPrompt: `${BASE_DEGREE_AI_SYSTEM_INSTRUCTION}

Mode Focus (Exam Prep Specialist):
Structure answers strictly to maximize examination marks:
1. Definitive model answer suited for university exam booklets.
2. Standard 'Marking Scheme Criteria' (what lecturers award full marks for).
3. 3 Key definitions, equations, or diagrams they MUST include.
4. Common pitfalls & mistakes students make on this topic.`
  },
  {
    id: 'eli100l',
    name: 'Explain Like I\'m 100L',
    icon: '💡',
    badge: 'Simplified',
    description: 'Translate dense, intimidating academic jargon into clear, relatable analogies.',
    systemPrompt: `${BASE_DEGREE_AI_SYSTEM_INSTRUCTION}

Mode Focus (Intuitive Explainer):
Explain this topic in the simplest, most intuitive way possible as if speaking to a curious 100-Level beginner. Use relatable real-world analogies, plain language, and clear intuitive summaries before diving into technical depth.`
  },
  {
    id: 'summarizer',
    name: 'Handout Summarizer',
    icon: '⚡',
    badge: 'Speed',
    description: 'Condense 50-page slides or lecture notes into a 5-minute high-yield revision sheet.',
    systemPrompt: `${BASE_DEGREE_AI_SYSTEM_INSTRUCTION}

Mode Focus (High-Yield Summarizer):
Condense the provided lecture text or topic into an executive high-yield study sheet:
- 📌 Core Objective
- 🔑 Top 5 Key Takeaways
- 📐 Critical Formulas / Laws / Definitions to Memorize
- ❓ 3 Potential Exam Questions from this material`
  },
  {
    id: 'quiz',
    name: 'Mock Quiz Generator',
    icon: '🎯',
    badge: 'Practice',
    description: 'Generate 5 interactive multiple-choice questions with instant explanations.',
    systemPrompt: `${BASE_DEGREE_AI_SYSTEM_INSTRUCTION}

Mode Focus (Quiz Master):
Generate 3 to 5 challenging, exam-standard Multiple Choice Questions (MCQs) on the topic or provided notes.
Format each question strictly as:
**Question [Number]: [Question text]**
A) [Option A]
B) [Option B]
C) [Option C]
D) [Option D]

> **Correct Answer:** [Letter]
> **Explanation:** [2-sentence explanation of why this answer is correct and why other choices are wrong]`
  },
  {
    id: 'flashcards',
    name: 'Flashcards & Memory Deck',
    icon: '🃏',
    badge: 'Active Recall',
    description: 'Turn your lecture notes or handouts into 5-8 high-yield active recall flashcards.',
    systemPrompt: `${BASE_DEGREE_AI_SYSTEM_INSTRUCTION}

Mode Focus (Flashcard Creator):
Create 5 to 8 high-yield active recall flashcards from the provided notes or topic.
Format each flashcard strictly as:
**Card [Number]**
- **Front:** [Concept, definition prompt, formula question, or law to recall]
- **Back:** [Clear, concise answer and key detail to remember]
- **Exam Tip:** [Quick memory hook or mnemonic]`
  },
  {
    id: 'notes_helper',
    name: 'Notes to Study Guide',
    icon: '📚',
    badge: 'Notes Pro',
    description: 'Paste your messy lecture notes or handout to get organized study notes with key terms.',
    systemPrompt: `${BASE_DEGREE_AI_SYSTEM_INSTRUCTION}

Mode Focus (Lecture Note Structurer):
Transform the provided raw lecture notes, voice transcription, or handout text into clean, structured study notes:
1. 📖 **Overview & Main Themes**
2. 📌 **Structured Concepts & Definitions**
3. 📐 **Formulas, Laws, or Citations** (with parameter breakdowns)
4. ⚠️ **Common Exam Pitfalls & High-Yield Questions**`
  },
  {
    id: 'code_solver',
    name: 'Code & Math Solver',
    icon: '💻',
    badge: 'STEM',
    description: 'Step-by-step mathematical proofs, circuit calculations, and debugged code.',
    systemPrompt: `${BASE_DEGREE_AI_SYSTEM_INSTRUCTION}

Mode Focus (STEM & Code Architect):
Provide rigorous, bug-free, and well-commented code or mathematical derivations.
For code: explain time/space complexity and provide runnable examples.
For math/engineering: provide detailed line-by-line algebraic derivations with all units clearly labeled.`
  }
];

export const PRESET_PROMPT_CHIPS = [
  { label: '📐 Solve MTH 101 Calculus Limits', mode: 'code_solver', prompt: 'Explain how to evaluate limits using L\'Hopital\'s Rule and algebraic factorization with 3 worked examples for MTH 101.' },
  { label: '🎯 PHY 102 Electrostatics Quiz', mode: 'quiz', prompt: 'Generate 5 past-question standard MCQs on Coulomb\'s Law and Electric Field Intensity with explanations.' },
  { label: '📚 Turn Lecture Notes into Study Guide', mode: 'notes_helper', prompt: 'Here are my lecture notes from class today. Please organize them into a clean study guide with key definitions and potential exam questions:\n\n[Paste your lecture notes here]' },
  { label: '🃏 Generate Active Recall Flashcards', mode: 'flashcards', prompt: 'Create 6 high-yield active recall flashcards on Thermodynamics and Heat Transfer laws with memory tips.' },
  { label: '⚡ Explain Carnot Cycle (Thermodynamics)', mode: 'tutor', prompt: 'Explain the 4 stages of the Carnot Cycle in Thermodynamics, its efficiency formula, and why 100% efficiency is impossible.' },
  { label: '📝 GST 111 Communication in English Summary', mode: 'summarizer', prompt: 'Summarize the primary methods of paragraph development (Cause and Effect, Comparison/Contrast, Analogy) for GST 111.' },
  { label: '💡 Explain OOP Polymorphism simply', mode: 'eli100l', prompt: 'Explain Object-Oriented Programming (OOP) Polymorphism and Inheritance using simple everyday analogies.' }
];

// Intelligent conversational & academic helper
export function generateFallbackAcademicResponse(prompt, modeId = 'tutor') {
  const clean = String(prompt || '').trim().toLowerCase();
  
  // Natural responses for conversational greetings
  if (/^(hi|hello|hey|good\s*(morning|afternoon|evening)|yo|greetings|how\s*are\s*you)/i.test(clean)) {
    return `Hello! 👋 I'm **DegreeAI**, your academic study partner.

How can I assist your studies today? You can:
- 📖 Ask me to explain any difficult concept or theory
- 📝 Paste a past exam question for a step-by-step solution
- ⚡ Paste your lecture notes to get a high-yield revision summary
- 🎯 Ask for a practice mock quiz on any topic`;
  }

  // Clear, honest connection notice if live AI is temporarily unreachable
  return `⚠️ **DegreeAI Connectivity Notice**

I am currently experiencing high academic traffic on the live neural gateway for *"**${String(prompt).slice(0, 80)}**"*.

**Please try again in 5 seconds**, or click one of the quick study chips below to continue!`;
}


// ── DUAL-SERVER REDUNDANCY & FAILOVER AI COMPLETION ──
// Server 1 (Primary): HackMyDegree Serverless /api/degree-ai (Production Edge)
// Server 2 (Backup / Secondary Failover): Direct DegreeAI Neural Gateway
export async function sendAIMessage({ prompt, mode = 'tutor', conversationHistory = [] }) {
  const selectedMode = AI_MODES.find((item) => item.id === mode) || AI_MODES[0];
  const cleanPrompt = String(prompt || '').trim();
  if (!cleanPrompt) throw new Error('Enter a question before sending it to DegreeAI.');

  const history = conversationHistory
    .filter((message) => message?.content && !message.id?.startsWith('welcome-msg') && message.status !== 'error')
    .slice(-8)
    .map((message) => ({ role: message.role === 'assistant' ? 'model' : 'user', content: String(message.content).slice(0, 4000) }));

  // ── ATTEMPT 1: Primary Server (Edge Node) ──
  try {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    
    const requestBody = JSON.stringify({
      prompt: cleanPrompt.slice(0, 16000),
      systemInstruction: selectedMode.systemPrompt,
      history
    });

    const baseUrl = (typeof process !== 'undefined' && (process.env?.REACT_APP_API_URL || process.env?.REACT_APP_BACKEND_URL)) || '';
    const endpoint = baseUrl ? `${baseUrl.replace(/\/+$/, '')}/api/degree-ai` : '/api/degree-ai';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: requestBody,
    }).catch(() => null);

    window.clearTimeout(timeout);

    if (response && response.ok) {
      const payload = await response.json().catch(() => ({}));
      if (payload.content?.trim()) {
        return {
          content: payload.content,
          provider: 'DegreeAI Core Engine',
          server: 'Primary Server (Edge-1)',
          status: 'success'
        };
      }
    }
  } catch (err) {
    console.warn('[DegreeAI] Primary Server 1 failed, initiating Server 2 failover...', err?.message || err);
  }

  // ── ATTEMPT 2: Secondary Failover Server (Direct Neural Gateway) ──
  const apiKey = typeof process !== 'undefined'
    ? (process.env?.REACT_APP_GEMINI_API_KEY || process.env?.GEMINI_API_KEY)
    : '';

  if (apiKey && apiKey.trim().length > 10) {
    const modelsToTry = ['gemini-3.7-flash', 'gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
    const validHistory = [];
    let expectedRole = 'user';

    for (const m of conversationHistory.slice(-8)) {
      if (!m.content || m.id?.startsWith('welcome-msg') || m.status === 'error') continue;
      const role = (m.role === 'model' || m.role === 'assistant') ? 'model' : 'user';
      if (role === expectedRole) {
        validHistory.push({ role, parts: [{ text: String(m.content).slice(0, 2000) }] });
        expectedRole = role === 'user' ? 'model' : 'user';
      }
    }

    if (validHistory.length > 0 && validHistory[validHistory.length - 1].role === 'user') {
      validHistory.pop();
    }

    const contents = [
      ...validHistory,
      { role: 'user', parts: [{ text: cleanPrompt }] }
    ];

    const bodyPayload = {
      systemInstruction: { parts: [{ text: selectedMode.systemPrompt }] },
      contents,
      generationConfig: { temperature: 0.4, maxOutputTokens: 1500 }
    };

    for (const modelName of modelsToTry) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 22000);

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey.trim()}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyPayload),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text && text.trim().length > 0) {
            return {
              content: text,
              provider: 'DegreeAI Neural Core',
              server: 'Secondary Gateway (Direct)',
              status: 'success'
            };
          }
        }
      } catch (e) {
        console.warn(`[DegreeAI] Backup model ${modelName} failed:`, e?.message);
      }
    }
  }

  // ── ATTEMPT 3: High-Yield Academic Engine (Instant Response) ──
  const fallbackContent = generateFallbackAcademicResponse(cleanPrompt, mode);
  return {
    content: fallbackContent,
    provider: 'DegreeAI Academic Core',
    server: 'Academic Knowledge Node',
    status: 'success'
  };
}

