import { Router } from 'express';
import { registerUser, loginUser, getCurrentUser } from '../controllers/auth.js';

const authRouter = Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.get('/me', getCurrentUser);

export { authRouter };
