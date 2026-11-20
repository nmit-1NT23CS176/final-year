import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { rateLimit } from 'express-rate-limit';

import authRoutes from './routes/auth.routes';
import stocksRoutes from './routes/stocks.routes';
import watchlistRoutes from './routes/watchlist.routes';
import mlRoutes from './routes/ml.routes';
import { WebSocketServer } from './websocket/ws-server';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const server = createServer(app);

  // Initialize WebSocket Server only when not in serverless environment
  if (!process.env.VERCEL) {
    new WebSocketServer(server);
  }

  // CORS Origin configuration
  const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
    : ['http://localhost:3000'];

  // Middlewares
  app.use(helmet());
  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  }));
  app.use(express.json());

  // Health check endpoints
  app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'AlphaPulse Express Server' });
  });
  app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', service: 'AlphaPulse Express Server' });
  });

  // Rate limiting
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  });
  app.use('/api', globalLimiter);

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/stocks', stocksRoutes);
  app.use('/api/watchlist', watchlistRoutes);
  app.use('/api/ml', mlRoutes);

  // Error handling middleware
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    const status = err.status || 500;
    const message = err.message || 'Internal server error';
    const code = err.code || 'INTERNAL_ERROR';
    res.status(status).json({ success: false, error: message, code });
  });

  // Server listen only in standalone / local mode
  if (!process.env.VERCEL) {
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }

  export default app;
  export { app, server };
