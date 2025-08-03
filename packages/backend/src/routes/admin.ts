import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { getPrismaClient } from '../utils/database';
import { getFaucetBalance } from '../utils/suiClient';
import { adminRateLimiter } from '../middleware/rateLimiter';
import { validateRequest, validateQuery } from '../middleware/validation';
import { authenticateAdmin } from '../middleware/auth';
import logger from '../utils/logger';

const router = Router();

// Apply admin authentication to all routes
router.use(authenticateAdmin);

// Validation schemas
const blacklistSchema = z.object({
  target: z.string().min(1, 'Target is required'),
  type: z.enum(['ip', 'wallet'], { required_error: 'Type must be ip or wallet' }),
  reason: z.string().min(1, 'Reason is required'),
  expiresAt: z.string().optional(), // ISO date string
});

const configUpdateSchema = z.object({
  key: z.string().min(1, 'Config key is required'),
  value: z.string().min(1, 'Config value is required'),
  description: z.string().optional(),
  isPublic: z.boolean().optional(),
});

// Get faucet statistics
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const prisma = getPrismaClient();
    
    // Get basic stats
    const [
      totalRequests,
      successfulRequests,
      failedRequests,
      totalTokensDistributed,
      requestsToday,
      requestsThisWeek,
      requestsThisMonth,
    ] = await Promise.all([
      prisma.faucetRequest.count(),
      prisma.faucetRequest.count({ where: { status: 'success' } }),
      prisma.faucetRequest.count({ where: { status: 'failed' } }),
      prisma.faucetRequest.aggregate({
        where: { status: 'success' },
        _sum: { amount: true },
      }),
      prisma.faucetRequest.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.faucetRequest.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.faucetRequest.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    // Get top requested addresses
    const topAddresses = await prisma.faucetRequest.groupBy({
      by: ['walletAddress'],
      where: { status: 'success' },
      _count: { walletAddress: true },
      orderBy: { _count: { walletAddress: 'desc' } },
      take: 10,
    });

    // Get top requesting countries
    const topCountries = await prisma.faucetRequest.groupBy({
      by: ['country'],
      where: { 
        status: 'success',
        country: { not: null },
      },
      _count: { country: true },
      orderBy: { _count: { country: 'desc' } },
      take: 10,
    });

    // Get average response time
    const avgResponseTime = await prisma.faucetRequest.aggregate({
      where: { 
        status: 'success',
        responseTime: { not: null },
      },
      _avg: { responseTime: true },
    });

    // Get faucet balance
    const balance = await getFaucetBalance();

    const stats = {
      totalRequests,
      successfulRequests,
      failedRequests,
      totalTokensDistributed: totalTokensDistributed._sum.amount?.toString() || '0',
      averageResponseTime: Math.round(avgResponseTime._avg.responseTime || 0),
      requestsToday,
      requestsThisWeek,
      requestsThisMonth,
      topRequestedAddresses: topAddresses.map(item => ({
        address: item.walletAddress,
        count: item._count.walletAddress,
      })),
      topRequestingCountries: topCountries.map(item => ({
        country: item.country || 'Unknown',
        count: item._count.country,
      })),
      faucetBalance: {
        address: balance.address,
        balance: balance.balance,
        coinType: balance.coinType,
      },
    };

    res.status(200).json({
      status: 'success',
      data: stats,
    });
  } catch (error) {
    logger.error('Error getting admin stats:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

// Get all requests with pagination
router.get('/requests', validateQuery(z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.enum(['pending', 'success', 'failed']).optional(),
  walletAddress: z.string().optional(),
})), async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '20', status, walletAddress } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = Math.min(parseInt(limit as string), 100);
    const offset = (pageNum - 1) * limitNum;

    const prisma = getPrismaClient();
    
    const where: any = {};
    if (status) where.status = status;
    if (walletAddress) where.walletAddress = { contains: walletAddress as string };

    const [requests, total] = await Promise.all([
      prisma.faucetRequest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limitNum,
      }),
      prisma.faucetRequest.count({ where }),
    ]);

    res.status(200).json({
      status: 'success',
      data: requests.map(req => ({
        ...req,
        amount: req.amount.toString(),
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    logger.error('Error getting admin requests:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

// Blacklist an IP or wallet address
router.post('/blacklist', adminRateLimiter, validateRequest(blacklistSchema), async (req: Request, res: Response) => {
  try {
    const { target, type, reason, expiresAt } = req.body;
    
    const prisma = getPrismaClient();
    
    // Check if already blacklisted
    const existing = await prisma.blacklistedEntity.findFirst({
      where: { target, type },
    });

    if (existing) {
      return res.status(400).json({
        status: 'error',
        message: `${type.toUpperCase()} is already blacklisted`,
      });
    }

    // Create blacklist entry
    const blacklistEntry = await prisma.blacklistedEntity.create({
      data: {
        target,
        type,
        reason,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        createdBy: (req as any).user?.email || 'admin',
      },
    });

    logger.info('Admin blacklisted entity', {
      admin: (req as any).user?.email,
      target,
      type,
      reason,
      expiresAt,
    });

    res.status(201).json({
      status: 'success',
      message: `${type.toUpperCase()} blacklisted successfully`,
      data: blacklistEntry,
    });
  } catch (error) {
    logger.error('Error blacklisting entity:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

// Remove from blacklist
router.delete('/blacklist/:type/:target', adminRateLimiter, async (req: Request, res: Response) => {
  try {
    const { type, target } = req.params;
    
    const prisma = getPrismaClient();
    
    const deleted = await prisma.blacklistedEntity.deleteMany({
      where: { target, type },
    });

    if (deleted.count === 0) {
      return res.status(404).json({
        status: 'error',
        message: `${type.toUpperCase()} not found in blacklist`,
      });
    }

    logger.info('Admin removed entity from blacklist', {
      admin: (req as any).user?.email,
      target,
      type,
    });

    res.status(200).json({
      status: 'success',
      message: `${type.toUpperCase()} removed from blacklist`,
    });
  } catch (error) {
    logger.error('Error removing from blacklist:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

// Get blacklist
router.get('/blacklist', validateQuery(z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  type: z.enum(['ip', 'wallet']).optional(),
})), async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '20', type } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = Math.min(parseInt(limit as string), 100);
    const offset = (pageNum - 1) * limitNum;

    const prisma = getPrismaClient();
    
    const where: any = {};
    if (type) where.type = type;

    const [blacklist, total] = await Promise.all([
      prisma.blacklistedEntity.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limitNum,
      }),
      prisma.blacklistedEntity.count({ where }),
    ]);

    res.status(200).json({
      status: 'success',
      data: blacklist,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    logger.error('Error getting blacklist:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

// Update configuration
router.post('/config', adminRateLimiter, validateRequest(configUpdateSchema), async (req: Request, res: Response) => {
  try {
    const { key, value, description, isPublic } = req.body;
    
    const prisma = getPrismaClient();
    
    const config = await prisma.faucetConfig.upsert({
      where: { key },
      update: {
        value,
        description,
        isPublic,
      },
      create: {
        key,
        value,
        description,
        isPublic: isPublic || false,
      },
    });

    logger.info('Admin updated config', {
      admin: (req as any).user?.email,
      key,
      value,
    });

    res.status(200).json({
      status: 'success',
      message: 'Configuration updated successfully',
      data: config,
    });
  } catch (error) {
    logger.error('Error updating config:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

// Get configuration
router.get('/config', async (req: Request, res: Response) => {
  try {
    const prisma = getPrismaClient();
    
    const configs = await prisma.faucetConfig.findMany({
      orderBy: { key: 'asc' },
    });

    res.status(200).json({
      status: 'success',
      data: configs,
    });
  } catch (error) {
    logger.error('Error getting config:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

export default router; 