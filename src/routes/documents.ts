import { Router } from 'express';
import {
  uploadDocument,
  getDocuments,
  getDocumentById,
  deleteDocument,
} from '../controllers/documents.js';

const documentsRouter = Router();

documentsRouter.post('/', uploadDocument);
documentsRouter.get('/', getDocuments);
documentsRouter.get('/:id', getDocumentById);
documentsRouter.delete('/:id', deleteDocument);

export { documentsRouter };
