import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
          res.status(400).json({
                  success: false,
                  data: null,
                  error: { message: 'email, password, and name are required' },
          });
          return;
    }

    if (password.length < 8) {
          res.status(400).json({
                  success: false,
                  data: null,
                  error: { message: 'password must be at least 8 characters' },
          });
          return;
    }

    const existing = await User.findOne({ email });
    if (existing) {
          res.status(409).json({
                  success: false,
                  data: null,
                  error: { message: 'user already exists' },
          });
          return;
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed, name });

    res.status(201).json({
          success: true,
          data: { id: user._id, email: user.email, name: user.name },
          error: null,
    });
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
          res.status(400).json({
                  success: false,
                  data: null,
                  error: { message: 'email and password are required' },
          });
          return;
    }

    const user = await User.findOne({ email });
    if (!user) {
          res.status(401).json({
                  success: false,
                  data: null,
                  error: { message: 'invalid email or password' },
          });
          return;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
          res.status(401).json({
                  success: false,
                  data: null,
                  error: { message: 'invalid email or password' },
          });
          return;
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '1d' });

    res.status(200).json({
          success: true,
          data: { token, user: { id: user._id, email: user.email, name: user.name } },
          error: null,
    });
};

export const getCurrentUser = (req: Request, res: Response): void => {
    res.status(200).json({
          success: true,
          data: {
                  id: 'user_001',
                  username: 'demo_user',
                  email: 'demo@example.com',
          },
          error: null,
    });
};
