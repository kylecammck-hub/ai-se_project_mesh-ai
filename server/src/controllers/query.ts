import type { Request, Response } from 'express';
import Document from '../models/document.js';
import Chunk from '../models/chunk.js';
import { createEmbedding } from '../utils/embeddings.js';
import { rankBySimilarity } from '../utils/vector-search.js';
import { getClient, LLM_MODEL, buildContext } from '../utils/openai-client.js';

export const postQuery = async (req: Request, res: Response): Promise<void> => {
    const { question } = req.body;

    if (!question) {
          res.status(400).json({
                  success: false,
                  data: null,
                  error: { message: 'question is required' },
          });
          return;
    }

    const userId = req.user!.userId;
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

    res.status(200).json({
          success: true,
          data: { answer, sources: ranked.map((r) => r.documentId) },
          error: null,
    });
};
