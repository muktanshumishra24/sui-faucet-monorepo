import { Router, Request, Response } from 'express';
import { getPrismaClient } from '../utils/database';
import { getRedisClient } from '../utils/redis';
import { getSuiClient } from '../utils/suiClient';
import logger from '../utils/logger';

const router = Router();

// Health check endpoint
router.get('/', async (req: Request, res: Response) => {
  try {
    const startTime = Date.now();
    
    // Check database connection
    const prisma = getPrismaClient();
    await prisma.$queryRaw`SELECT 1`;
    
    // Check Redis connection
    const redis = getRedisClient();
    await redis.ping();
    
    // Check Sui client connection
    const suiClient = getSuiClient();
    await suiClient.getRpcApiVersion();
    
    const responseTime = Date.now() - startTime;
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      services: {
        database: 'connected',
        redis: 'connected',
        sui: 'connected',
      },
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Detailed health check
router.get('/detailed', async (req: Request, res: Response) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {} as Record<string, any>,
      system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        nodeVersion: process.version,
        platform: process.platform,
      },
    };

    // Database health
    try {
      const prisma = getPrismaClient();
      const dbStart = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      health.services.database = {
        status: 'connected',
        responseTime: `${Date.now() - dbStart}ms`,
      };
    } catch (error) {
      health.services.database = {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      health.status = 'unhealthy';
    }

    // Redis health
    try {
      const redis = getRedisClient();
      const redisStart = Date.now();
      await redis.ping();
      health.services.redis = {
        status: 'connected',
        responseTime: `${Date.now() - redisStart}ms`,
      };
    } catch (error) {
      health.services.redis = {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      health.status = 'unhealthy';
    }

    // Sui health
    try {
      const suiClient = getSuiClient();
      const suiStart = Date.now();
      const version = await suiClient.getRpcApiVersion();
      health.services.sui = {
        status: 'connected',
        responseTime: `${Date.now() - suiStart}ms`,
        version,
      };
    } catch (error) {
      health.services.sui = {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      health.status = 'unhealthy';
    }

    const statusCode = health.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(health);
  } catch (error) {
    logger.error('Detailed health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router; 