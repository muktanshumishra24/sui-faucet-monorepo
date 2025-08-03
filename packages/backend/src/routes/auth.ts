import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { getPrismaClient } from '../utils/database';
import { validateRequest } from '../middleware/validation';
import { comparePassword, generateToken, hashPassword } from '../middleware/auth';
import logger from '../utils/logger';

const router = Router();

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['admin', 'moderator']).optional(),
});

// Admin login
router.post('/login', validateRequest(loginSchema), async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    const prisma = getPrismaClient();
    
    // Find user by email
    const user = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!user) {
      logger.warn('Login attempt with non-existent email:', { email });
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
      });
    }

    if (!user.isActive) {
      logger.warn('Login attempt with inactive account:', { email });
      return res.status(401).json({
        status: 'error',
        message: 'Account is inactive',
      });
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      logger.warn('Login attempt with invalid password:', { email });
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
      });
    }

    // Update last login
    await prisma.adminUser.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Generate JWT token
    const token = generateToken(user.id, user.email, user.role);

    logger.info('Admin login successful:', { email, role: user.role });

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          permissions: user.permissions,
        },
      },
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

// Admin registration (protected, only for initial setup)
router.post('/register', validateRequest(registerSchema), async (req: Request, res: Response) => {
  try {
    const { email, password, role = 'moderator' } = req.body;
    
    const prisma = getPrismaClient();
    
    // Check if user already exists
    const existingUser = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists',
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.adminUser.create({
      data: {
        email,
        password: hashedPassword,
        role,
        permissions: role === 'admin' 
          ? ['read', 'write', 'delete', 'admin'] 
          : ['read', 'write'],
      },
    });

    logger.info('Admin user created:', { email, role });

    res.status(201).json({
      status: 'success',
      message: 'User created successfully',
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
      },
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

// Get current user profile
router.get('/profile', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        permissions: req.user.permissions,
      },
    });
  } catch (error) {
    logger.error('Profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

// Change password
router.post('/change-password', validateRequest(z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
})), async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required',
      });
    }

    const { currentPassword, newPassword } = req.body;
    
    const prisma = getPrismaClient();
    
    // Get current user with password
    const user = await prisma.adminUser.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    // Verify current password
    const isValidPassword = await comparePassword(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Current password is incorrect',
      });
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update password
    await prisma.adminUser.update({
      where: { id: req.user.id },
      data: { password: hashedNewPassword },
    });

    logger.info('Password changed successfully:', { email: req.user.email });

    res.status(200).json({
      status: 'success',
      message: 'Password changed successfully',
    });
  } catch (error) {
    logger.error('Change password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

export default router; 