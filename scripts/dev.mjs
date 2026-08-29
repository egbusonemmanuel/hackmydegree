import { createServer } from 'node:http';
import { existsSync, readFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const apiHandler = require('../api/degree-ai.js');
const apiPort = Number(process.env.DEGREE_AI_API_PORT || 3001);

function loadLocalEnv() {
  const envPath = new URL('../.env', import.meta.url);
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match || process.env[match[1]] !== undefined) continue;
    const value = match[2].replace(/^(['"])(.*)\1$/, '$2');
    process.env[match[1]] = value;
  }
}

loadLocalEnv();

const apiServer = createServer(async (request, response) => {
  if (request.url !== '/api/degree-ai' && request.url !== '/degree-ai') {
    response.writeHead(404, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ error: 'Not found.' }));
    return;
  }
  let rawBody = '';
  for await (const chunk of request) rawBody += chunk;
  try { request.body = rawBody ? JSON.parse(rawBody) : {}; }
  catch { request.body = {}; }
  response.status = (code) => { response.statusCode = code; return response; };
  response.json = (payload) => {
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(payload));
  };
  await apiHandler(request, response);
});

apiServer.listen(apiPort, () => console.log(`DegreeAI API ready at http://localhost:${apiPort}`));

const react = spawn(process.platform === 'win32' ? 'cmd.exe' : 'npx', process.platform === 'win32' ? ['/d', '/s', '/c', 'react-scripts start'] : ['react-scripts', 'start'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: process.env.PORT || '3000' },
});

const stop = () => { apiServer.close(); react.kill(); };
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
react.on('exit', (code) => { apiServer.close(); process.exit(code ?? 0); });
