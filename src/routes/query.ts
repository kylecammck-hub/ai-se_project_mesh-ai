import { Router } from 'express';
import auth from '../middleware/auth.js';
import { postQuery } from '../controllers/query.js';

const queryRouter = Router();

queryRouter.use(auth);

queryRouter.post('/', postQuery);

export { queryRouter };
