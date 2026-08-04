import { Router } from 'express';
import auth from '../middleware/auth.js';
import {
    getChats,
    createChat,
    getChatById,
    deleteChat,
    sendMessage,
} from '../controllers/chats.js';

const chatsRouter = Router();

chatsRouter.use(auth);

chatsRouter.get('/', getChats);
chatsRouter.post('/', createChat);
chatsRouter.get('/:id', getChatById);
chatsRouter.delete('/:id', deleteChat);
chatsRouter.post('/:id/messages', sendMessage);

export { chatsRouter };
