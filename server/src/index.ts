import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import routes from './routes/index.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler, errorHandler } from './middleware/error.js';

const app = express();
const port = process.env.PORT || 3000;

// The client (Vite dev server) runs on a different origin/port than this
// API, so the browser blocks requests without CORS headers. Restrict to the
// configured client origin in production; default to the Vite dev origin.
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  }),
);
app.use(express.json());
app.use(logger);

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
        console.log('MongoDB connected');
        app.listen(port, () => {
                console.log(`Server running on port ${port}`);
        });
  })
  .catch((err) => {
        console.error('Connection error', err);
  });
