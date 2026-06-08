import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { rateLimit } from 'express-rate-limit';

import authRoutes from './routes/auth.routes';
import stocksRoutes from './routes/stocks.routes';
import watchlistRoutes from './routes/watchlist.routes';
import { WebSocketServer } from './websocket/ws-server';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const server = createServer(app);

// Initialize WebSocket Server
new WebSocketServer(server);

if (!process.env.CORS_ORIGIN) {
  throw new Error('CORS_ORIGIN environment variable is missing');
}

// Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json());

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

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  const code = err.code || 'INTERNAL_ERROR';
  res.status(status).json({ success: false, error: message, code });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
