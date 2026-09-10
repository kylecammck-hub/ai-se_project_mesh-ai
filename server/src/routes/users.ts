import { Router } from 'express';
import auth from '../middleware/auth.js';
import { getMe } from '../controllers/users.js';

const usersRouter = Router();

usersRouter.use(auth);

usersRouter.get('/me', getMe);

export { usersRouter };
