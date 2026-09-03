// server.js - Standalone Node.js Backend Server for Render / Cloud Hosting
import { createServer } from 'node:http';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const apiHandler = require('./api/degree-ai.js');
const PORT = Number(process.env.PORT || process.env.DEGREE_AI_API_PORT || 10000);

function loadLocalEnv() {
  const envPath = new URL('./.env', import.meta.url);
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match || process.env[match[1]] !== undefined) continue;
    const value = match[2].replace(/^(['"])(.*)\1$/, '$2');
    process.env[match[1]] = value;
  }
}

loadLocalEnv();

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, apikey');
}

const server = createServer(async (request, response) => {
  setCorsHeaders(response);

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    response.writeHead(204);
    response.end();
    return;
  }

  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);

  // Health check endpoints for Render
  if (url.pathname === '/' || url.pathname === '/health' || url.pathname === '/api/health') {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({
      status: 'ok',
      service: 'HackMyDegree DegreeAI Backend',
      version: '1.0.0',
      uptime: process.uptime()
    }));
    return;
  }

  // DegreeAI API endpoints
  if (url.pathname === '/api/degree-ai' || url.pathname === '/degree-ai') {
    let rawBody = '';
    for await (const chunk of request) rawBody += chunk;
    try {
      request.body = rawBody ? JSON.parse(rawBody) : {};
    } catch {
      request.body = {};
    }

    response.status = (code) => {
      response.statusCode = code;
      return response;
    };

    response.json = (payload) => {
      setCorsHeaders(response);
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify(payload));
    };

    try {
      await apiHandler(request, response);
    } catch (err) {
      console.error('[Server] API handler error:', err);
      response.writeHead(500, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ error: 'Internal server error.' }));
    }
    return;
  }

  // 404 Not Found
  response.writeHead(404, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify({ error: 'Route not found.' }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 HackMyDegree Backend API running on port ${PORT}`);
});
