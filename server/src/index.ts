import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import routes from './routes/index.js';
import { logger } from './utils/logger.js';
import { notFoundHandler, errorHandler } from './middleware/error.js';

const app = express();
const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Behind Caddy (reverse proxy) — trust the first proxy hop so the rate
// limiters see the real client IP. Must be set before the rate limiters.
app.set('trust proxy', 1);

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  }),
);
app.use(express.json());

// HTTP request logging: concise in development, Apache "combined" in production.
app.use(
  morgan(isProduction ? 'combined' : 'dev', {
    stream: { write: (message: string) => logger.info(message.trim()) },
  }),
);

app.get('/health', (req, res): void => {
  res.status(200).json({
    success: true,
    data: { status: 'ok' },
    error: null,
  });
});

app.use(routes);

// Temporary route for testing the error handler - keep until project is accepted
app.get('/test-error', () => {
  throw new Error('Test error');
});

// routes go above this line
app.use(notFoundHandler);
app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    logger.info('MongoDB connected');
    app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });
  })
  .catch((err: Error) => {
    logger.error(`Connection error: ${err.message}`, { stack: err.stack });
  });
