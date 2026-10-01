import rateLimit from 'express-rate-limit';

const authLimiterOptions = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  standardHeaders: 'draft-7' as const,
  legacyHeaders: false,
  message: {
    success: false,
    data: null,
    error: { message: 'Too many attempts. Please try again later.' },
  },
};

export const loginLimiter = rateLimit(authLimiterOptions);
export const registerLimiter = rateLimit(authLimiterOptions);
