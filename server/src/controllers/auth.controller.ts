import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/user.model';
import { signToken } from '../utils/jwt';
import { AuthRequest } from '../middlewares/auth.middleware';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        res.status(409).json({ success: false, error: 'User with this email already exists', code: 'CONFLICT' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await UserModel.create(name, email, hashedPassword);

      const token = signToken({ userId: user.id, email: user.email });

      res.status(201).json({
        success: true,
        data: { user, token }
      });
    } catch (err) {
      console.error('Registration error:', err);
      res.status(500).json({ success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findByEmail(email);
      if (!user || !user.password) {
        res.status(401).json({ success: false, error: 'Invalid email or password', code: 'UNAUTHORIZED' });
        return;
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        res.status(401).json({ success: false, error: 'Invalid email or password', code: 'UNAUTHORIZED' });
        return;
      }

      const token = signToken({ userId: user.id, email: user.email });

      // Remove password before sending to client
      const userResponse = { ...user };
      delete userResponse.password;

      res.status(200).json({
        success: true,
        data: { user: userResponse, token }
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' });
    }
  }

  static async getProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized', code: 'UNAUTHORIZED' });
        return;
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        res.status(404).json({ success: false, error: 'User not found', code: 'NOT_FOUND' });
        return;
      }

      const userResponse = { ...user };
      delete userResponse.password;

      res.status(200).json({
        success: true,
        data: userResponse
      });
    } catch (err) {
      console.error('Profile error:', err);
      res.status(500).json({ success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' });
    }
  }
}
