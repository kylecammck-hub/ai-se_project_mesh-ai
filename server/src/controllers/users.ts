import type { Request, Response } from 'express';
import User from '../models/user.js';

export const getMe = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const user = await User.findById(userId).select('-password');

    if (!user) {
          res.status(404).json({
                  success: false,
                  data: null,
                  error: { message: 'user not found' },
          });
          return;
    }

    res.status(200).json({
          success: true,
          data: user,
          error: null,
    });
};
