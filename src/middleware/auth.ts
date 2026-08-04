mport { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const auth = (req: Request, res: Response, next: NextFunction): void => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
          res.status(401).json({
                  success: false,
                  data: null,
                  error: { message: 'authorization token required' },
          });
          return;
    }

    try {
          const token = header.split(' ')[1];
          req.user = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
          next();
    } catch {
          res.status(401).json({
                  success: false,
                  data: null,
                  error: { message: 'invalid or expired token' },
          });
    }
};

export default auth;
