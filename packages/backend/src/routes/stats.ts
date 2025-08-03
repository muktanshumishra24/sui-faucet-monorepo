import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { getPrismaClient } from '../utils/database';
import { validateQuery } from '../middleware/validation';
import logger from '../utils/logger';

const router = Router();

// Get public faucet statistics
router.get('/', async (req: Request, res: Response) => {
  try {
    const prisma = getPrismaClient();
    
    // Get basic public stats
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

    // Get average response time
    const avgResponseTime = await prisma.faucetRequest.aggregate({
      where: { 
        status: 'success',
        responseTime: { not: null },
      },
      _avg: { responseTime: true },
    });

    const stats = {
      totalRequests,
      successfulRequests,
      failedRequests,
      successRate: totalRequests > 0 ? ((successfulRequests / totalRequests) * 100).toFixed(2) : '0',
      totalTokensDistributed: totalTokensDistributed._sum.amount?.toString() || '0',
      averageResponseTime: Math.round(avgResponseTime._avg.responseTime || 0),
      requestsToday,
      requestsThisWeek,
      requestsThisMonth,
      lastUpdated: new Date().toISOString(),
    };

    res.status(200).json({
      status: 'success',
      data: stats,
    });
  } catch (error) {
    logger.error('Error getting public stats:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

// Get recent successful transactions
router.get('/recent', validateQuery(z.object({
  limit: z.string().optional(),
})), async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);
    
    const prisma = getPrismaClient();
    
    const recentTransactions = await prisma.faucetRequest.findMany({
      where: { 
        status: 'success',
        txHash: { not: null },
      },
      select: {
        walletAddress: true,
        amount: true,
        txHash: true,
        responseTime: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    res.status(200).json({
      status: 'success',
      data: recentTransactions.map(tx => ({
        ...tx,
        amount: tx.amount.toString(),
        responseTime: tx.responseTime ? `${tx.responseTime}ms` : null,
      })),
    });
  } catch (error) {
    logger.error('Error getting recent transactions:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

// Get top requesting countries (public version)
router.get('/countries', async (req: Request, res: Response) => {
  try {
    const prisma = getPrismaClient();
    
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

    res.status(200).json({
      status: 'success',
      data: topCountries.map(item => ({
        country: item.country || 'Unknown',
        count: item._count.country,
      })),
    });
  } catch (error) {
    logger.error('Error getting country stats:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

// Get hourly/daily request trends
router.get('/trends', validateQuery(z.object({
  period: z.enum(['hourly', 'daily']).optional(),
  days: z.string().optional(),
})), async (req: Request, res: Response) => {
  try {
    const period = req.query.period || 'daily';
    const days = parseInt(req.query.days as string) || 7;
    
    const prisma = getPrismaClient();
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - (days * 24 * 60 * 60 * 1000));
    
    // Get requests within date range
    const requests = await prisma.faucetRequest.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        status: true,
        createdAt: true,
      },
    });

    // Group by period
    const trends: Record<string, { total: number; success: number; failed: number }> = {};
    
    requests.forEach(request => {
      let key: string;
      
      if (period === 'hourly') {
        key = request.createdAt.toISOString().slice(0, 13) + ':00:00.000Z';
      } else {
        key = request.createdAt.toISOString().slice(0, 10);
      }
      
      if (!trends[key]) {
        trends[key] = { total: 0, success: 0, failed: 0 };
      }
      
      trends[key].total++;
      if (request.status === 'success') {
        trends[key].success++;
      } else if (request.status === 'failed') {
        trends[key].failed++;
      }
    });

    // Convert to array and sort
    const trendsArray = Object.entries(trends)
      .map(([period, stats]) => ({
        period,
        ...stats,
      }))
      .sort((a, b) => a.period.localeCompare(b.period));

    res.status(200).json({
      status: 'success',
      data: {
        period,
        days,
        trends: trendsArray,
      },
    });
  } catch (error) {
    logger.error('Error getting trends:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

export default router; 