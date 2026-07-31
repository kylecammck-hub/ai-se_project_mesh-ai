import type { Request, Response } from 'express';

export const getChats = (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    data: [
      { id: 'chat_001', title: 'First chat', createdAt: '2026-01-01T00:00:00Z' },
      ],
    error: null,
  });
};

export const createChat = (req: Request, res: Response): void => {
  res.status(201).json({
    success: true,
    data: { id: 'chat_002', title: 'New chat', createdAt: '2026-01-01T00:00:00Z' },
    error: null,
  });
};

export const getChatById = (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    data: {
      id: req.params.id,
      title: 'First chat',
      messages: [],
    },
    error: null,
  });
};

export const deleteChat = (req: Request, res: Response): void => {
  res.status(204).send();
};

export const sendMessage = (req: Request, res: Response): void => {
  res.status(201).json({
    success: true,
    data: {
      id: 'msg_001',
      chatId: req.params.id,
      role: 'assistant',
      content: 'This is a stubbed reply.',
    },
    error: null,
  });
};
