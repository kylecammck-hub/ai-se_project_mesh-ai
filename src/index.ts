import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import routes from './routes/index.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler, errorHandler } from './middleware/error.js';

const app = express();
const port = process.env.PORT || 3000;

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
