// server.js
import http from 'http';
import { WebSocketServer } from 'ws';

// Seaded
const HOST = '0.0.0.0';
const PORT = 25565;

// HTTP server (vajalik WS jaoks)
const server = http.createServer();
const wss = new WebSocketServer({ server });

// Kui klient ühendub
wss.on('connection', (ws, req) => {
  const ip = req.socket.remoteAddress;
  console.log(`[INFO] Client connected: ${ip}`);

  ws.on('message', (message) => {
    console.log(`[RECV] ${message}`);
    // Siia saad hiljem lisada käsu- ja protokolliloogika
  });

  ws.on('close', () => {
    console.log(`[INFO] Client disconnected: ${ip}`);
  });

  // Näidis tervitussõnum
  ws.send(JSON.stringify({ type: 'hello', msg: 'Server online' }));
});

// Käivitamine
server.listen(PORT, HOST, () => {
  console.log(`[INFO] Server listening on ${HOST}:${PORT}`);
});
