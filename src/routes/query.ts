import { Router } from 'express';
import { postQuery } from '../controllers/query.js';

const queryRouter = Router();

queryRouter.post('/', postQuery);

export { queryRouter };
