import type { Request, Response } from 'express';

export const registerUser = (req: Request, res: Response): void => {
  res.status(201).json({
    success: true,
    data: {
      id: 'user_001',
      username: 'demo_user',
      email: 'demo@example.com',
    },
    error: null,
  });
};

export const loginUser = (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    data: {
      id: 'user_001',
      username: 'demo_user',
      email: 'demo@example.com',
      token: 'fake-jwt-token',
    },
    error: null,
  });
};

export const getCurrentUser = (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    data: {
      id: 'user_001',
      username: 'demo_user',
      email: 'demo@example.com',
    },
    error: null,
  });
};
