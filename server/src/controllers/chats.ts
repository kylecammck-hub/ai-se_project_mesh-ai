import type { Request, Response } from 'express';
import Chat from '../models/chat.js';
import Message from '../models/message.js';
import Document from '../models/document.js';
import Chunk from '../models/chunk.js';
import { createEmbedding } from '../utils/embeddings.js';
import { rankBySimilarity } from '../utils/vector-search.js';
import { getClient, LLM_MODEL, buildContext } from '../utils/openai-client.js';

export const getChats = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const chats = await Chat.find({ userId });

    res.status(200).json({
          success: true,
          data: chats,
          error: null,
    });
};

export const createChat = async (req: Request, res: Response): Promise<void> => {
    const { title } = req.body;
    const userId = req.user!.userId;

    if (!title) {
          res.status(400).json({
                  success: false,
                  data: null,
                  error: { message: 'title is required' },
          });
          return;
    }

    const chat = await Chat.create({ title, userId });

    res.status(201).json({
          success: true,
          data: chat,
          error: null,
    });
};

export const getChatById = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const chat = await Chat.findOne({ _id: req.params.id, userId });

    if (!chat) {
          res.status(404).json({
                  success: false,
                  data: null,
                  error: { message: 'chat not found' },
          });
          return;
    }

    const messages = await Message.find({ chatId: chat._id }).sort({ createdAt: 1 });

    res.status(200).json({
          success: true,
          data: { chat, messages },
          error: null,
    });
};

export const deleteChat = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    await Chat.findOneAndDelete({ _id: req.params.id, userId });
    res.status(204).send();
};

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
    const { question } = req.body;
    const chatId = req.params.id;
    const userId = req.user!.userId;

    if (!question) {
          res.status(400).json({
                  success: false,
                  data: null,
                  error: { message: 'question is required' },
          });
          return;
    }

    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) {
          res.status(404).json({
                  success: false,
                  data: null,
                  error: { message: 'chat not found' },
          });
          return;
    }

    const userDocs = await Document.find({ userId }, '_id');
    const docIds = userDocs.map((d) => d._id);
    const chunkRecords = await Chunk.find({ documentId: { $in: docIds } });
    const chunks = chunkRecords.map((c) => ({
          id: String(c._id),
          documentId: String(c.documentId),
          text: c.text,
          embedding: c.embedding,
    }));

    const queryEmbedding = await createEmbedding(question);
    const ranked = rankBySimilarity(queryEmbedding, chunks, 5);
    const context = buildContext(ranked);

    const completion = await getClient().chat.completions.create({
          model: LLM_MODEL,
          messages: [
            {
                      role: 'system',
                      content: 'Answer using only the provided context. If the answer is not in the context, say you do not know.',
            },
            { role: 'user', content: `Context:\n${context}\n\nQuestion: ${question}` },
                ],
    });

    const answer = completion.choices[0]?.message?.content ?? '';

    const userMessage = await Message.create({ chatId, role: 'user', content: question });
    const assistantMessage = await Message.create({ chatId, role: 'assistant', content: answer });

    res.status(201).json({
          success: true,
          data: [userMessage, assistantMessage],
          error: null,
    });
};
