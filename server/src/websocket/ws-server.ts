import { WebSocketServer as WSServer, WebSocket } from 'ws';
import { verifyToken } from '../utils/jwt';
import redisClient from '../services/cache.service';
import { Server } from 'http';

interface ExtWebSocket extends WebSocket {
  isAlive: boolean;
  userId?: string;
  rooms: Set<string>;
}

export class WebSocketServer {
  private wss: WSServer;

  constructor(server: Server) {
    this.wss = new WSServer({ server, path: '/ws' });
    this.init();
  }

  private init() {
    this.wss.on('connection', (ws: ExtWebSocket, req: any) => {
      ws.isAlive = true;
      ws.rooms = new Set();

      ws.on('pong', () => {
        ws.isAlive = true;
      });

      ws.on('message', (message: string) => {
        try {
          const data = JSON.parse(message);
          this.handleMessage(ws, data);
        } catch (err) {
          console.error('Invalid WS message', err);
        }
      });

      ws.on('close', () => {
        // Cleanup rooms if needed
      });
    });

    // Heartbeat to detect dead connections
    setInterval(() => {
      this.wss.clients.forEach((ws: WebSocket) => {
        const extWs = ws as ExtWebSocket;
        if (!extWs.isAlive) return extWs.terminate();

        extWs.isAlive = false;
        extWs.ping();
      });
    }, 30000);

    // Subscribe to Redis pub/sub for cross-instance broadcasts
    const subscriber = redisClient.duplicate();
    subscriber.connect().then(() => {
      subscriber.subscribe('stock_prices', (message) => {
        const data = JSON.parse(message);
        this.broadcastToRoom(`stock:${data.symbol}`, JSON.stringify({
          event: 'price_update',
          data
        }));
      });
    });
  }

  private handleMessage(ws: ExtWebSocket, message: any) {
    switch (message.type) {
      case 'auth':
        this.handleAuth(ws, message.token);
        break;
      case 'subscribe':
        if (ws.userId && message.symbol) {
          ws.rooms.add(`stock:${message.symbol}`);
          // Should also trigger Finnhub price feed subscription here
        }
        break;
      case 'unsubscribe':
        if (message.symbol) {
          ws.rooms.delete(`stock:${message.symbol}`);
        }
        break;
    }
  }

  private handleAuth(ws: ExtWebSocket, token: string) {
    try {
      const decoded = verifyToken(token);
      ws.userId = decoded.userId;
      ws.send(JSON.stringify({ event: 'connected', clientId: ws.userId }));
    } catch (err) {
      ws.send(JSON.stringify({ event: 'error', error: 'Authentication failed' }));
      ws.close();
    }
  }

  private broadcastToRoom(room: string, message: string) {
    this.wss.clients.forEach((ws: WebSocket) => {
      const extWs = ws as ExtWebSocket;
      if (extWs.readyState === WebSocket.OPEN && extWs.rooms?.has(room)) {
        extWs.send(message);
      }
    });
  }
}
