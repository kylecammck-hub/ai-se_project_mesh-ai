import express from 'express';
import routes from './routes/index.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler, errorHandler } from './middleware/error.js';

const app = express();
const port = 3000;

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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
