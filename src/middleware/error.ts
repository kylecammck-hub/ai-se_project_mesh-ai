import type { Request, Response, NextFunction } from 'express';

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    data: null,
    error: `Route ${req.method} ${req.path} not found`,
  });
};

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
  ): void => {
    console.error(err);
    res.status(500).json({
      success: false,
      data: null,
      error: 'An error has occurred on the server',
    });
  };
