import type { Request, Response } from 'express';

export const postQuery = (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    data: {
      answer: 'This is a stubbed answer based on your documents.',
      sources: ['doc_001'],
    },
    error: null,
  });
};
