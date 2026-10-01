import { Router } from 'express';
import { registerUser, loginUser, getCurrentUser } from '../controllers/auth.js';
import { loginLimiter, registerLimiter } from '../middleware/rate-limit.js';

const authRouter = Router();

authRouter.post('/register', registerLimiter, registerUser);
authRouter.post('/login', loginLimiter, loginUser);
authRouter.get('/me', getCurrentUser);

export { authRouter };
