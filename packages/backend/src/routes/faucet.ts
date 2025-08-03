import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { getPrismaClient } from '../utils/database';
import { sendSuiTokens } from '../utils/suiClient';
import { faucetRateLimiter } from '../middleware/rateLimiter';
import { validateRequest } from '../middleware/validation';
import { getClientInfo } from '../utils/clientInfo';
import { config } from '../config';
import logger from '../utils/logger';

const router = Router();

// Validation schema for faucet request
const faucetRequestSchema = z.object({
  walletAddress: z.string().min(1, 'Wallet address is required'),
  amount: z.string().optional(), // Optional custom amount
});

// Request testnet tokens
router.post('/request', faucetRateLimiter, validateRequest(faucetRequestSchema), async (req: Request, res: Response) => {
  const startTime = Date.now();
  
  try {
    const { walletAddress, amount } = req.body;
    const clientInfo = getClientInfo(req);
    
    logger.info('Faucet request received', {
      walletAddress,
      ip: clientInfo.ip,
      userAgent: clientInfo.userAgent,
      amount: amount || 'default',
    });

    // Check if wallet address is blacklisted
    const prisma = getPrismaClient();
    const blacklisted = await prisma.blacklistedEntity.findFirst({
      where: {
        target: walletAddress,
        type: 'wallet',
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
    });

    if (blacklisted) {
      logger.warn('Blacklisted wallet address attempted request', {
        walletAddress,
        reason: blacklisted.reason,
      });
      
      return res.status(403).json({
        status: 'error',
        message: 'This wallet address is blacklisted',
        reason: blacklisted.reason,
      });
    }

    // Check if IP is blacklisted
    const blacklistedIP = await prisma.blacklistedEntity.findFirst({
      where: {
        target: clientInfo.ip,
        type: 'ip',
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
    });

    if (blacklistedIP) {
      logger.warn('Blacklisted IP attempted request', {
        ip: clientInfo.ip,
        reason: blacklistedIP.reason,
      });
      
      return res.status(403).json({
        status: 'error',
        message: 'This IP address is blacklisted',
        reason: blacklistedIP.reason,
      });
    }

    // Determine amount to send
    const sendAmount = amount ? BigInt(amount) : config.sui.faucetAmount;

    // Check if amount is within limits
    const maxAmount = config.sui.faucetAmount * BigInt(10); // 10x default amount
    if (sendAmount > maxAmount) {
      return res.status(400).json({
        status: 'error',
        message: 'Requested amount exceeds maximum allowed',
        maxAmount: maxAmount.toString(),
      });
    }

    // Check recent requests for this wallet
    const recentRequests = await prisma.faucetRequest.findMany({
      where: {
        walletAddress,
        createdAt: {
          gte: new Date(Date.now() - config.rateLimit.windowMs),
        },
        status: 'success',
      },
    });

    if (recentRequests.length >= config.rateLimit.maxRequests) {
      logger.warn('Rate limit exceeded for wallet', {
        walletAddress,
        recentRequests: recentRequests.length,
      });
      
      return res.status(429).json({
        status: 'error',
        message: 'Rate limit exceeded for this wallet address',
        retryAfter: Math.ceil(config.rateLimit.windowMs / 1000),
      });
    }

    // Create faucet request record
    const faucetRequest = await prisma.faucetRequest.create({
      data: {
        walletAddress,
        ipAddress: clientInfo.ip,
        amount: sendAmount,
        status: 'pending',
        userAgent: clientInfo.userAgent,
        country: clientInfo.geolocation?.country,
        region: clientInfo.geolocation?.region,
        city: clientInfo.geolocation?.city,
        timezone: clientInfo.geolocation?.timezone,
        browser: clientInfo.userAgentInfo?.browser,
        os: clientInfo.userAgentInfo?.os,
        device: clientInfo.userAgentInfo?.device,
        isBot: clientInfo.userAgentInfo?.isBot || false,
      },
    });

    // Send SUI tokens
    const result = await sendSuiTokens(walletAddress, sendAmount);
    const responseTime = Date.now() - startTime;

    // Update faucet request with result
    await prisma.faucetRequest.update({
      where: { id: faucetRequest.id },
      data: {
        status: result.success ? 'success' : 'failed',
        txHash: result.success ? result.txDigest : null,
        failureReason: result.success ? null : result.error,
        responseTime,
      },
    });

    if (result.success) {
      logger.info('Faucet request successful', {
        requestId: faucetRequest.id,
        walletAddress,
        amount: sendAmount.toString(),
        txHash: result.txDigest,
        responseTime: `${responseTime}ms`,
      });

      res.status(200).json({
        status: 'success',
        message: 'SUI tokens sent successfully',
        data: {
          requestId: faucetRequest.id,
          txHash: result.txDigest,
          amount: sendAmount.toString(),
          responseTime: `${responseTime}ms`,
        },
      });
    } else {
      logger.error('Faucet request failed', {
        requestId: faucetRequest.id,
        walletAddress,
        amount: sendAmount.toString(),
        error: result.error,
        responseTime: `${responseTime}ms`,
      });

      res.status(500).json({
        status: 'error',
        message: 'Failed to send SUI tokens',
        data: {
          requestId: faucetRequest.id,
          error: result.error,
          responseTime: `${responseTime}ms`,
        },
      });
    }
  } catch (error) {
    logger.error('Error processing faucet request:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

// Get request status
router.get('/status/:requestId', async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    
    const prisma = getPrismaClient();
    const request = await prisma.faucetRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return res.status(404).json({
        status: 'error',
        message: 'Request not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        id: request.id,
        walletAddress: request.walletAddress,
        amount: request.amount.toString(),
        status: request.status,
        txHash: request.txHash,
        failureReason: request.failureReason,
        responseTime: request.responseTime,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
      },
    });
  } catch (error) {
    logger.error('Error getting request status:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

// Get request history for a wallet
router.get('/history/:walletAddress', async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
    const offset = (page - 1) * limit;
    
    const prisma = getPrismaClient();
    
    const [requests, total] = await Promise.all([
      prisma.faucetRequest.findMany({
        where: { walletAddress },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
        select: {
          id: true,
          amount: true,
          status: true,
          txHash: true,
          failureReason: true,
          responseTime: true,
          createdAt: true,
        },
      }),
      prisma.faucetRequest.count({
        where: { walletAddress },
      }),
    ]);

    res.status(200).json({
      status: 'success',
      data: requests.map(req => ({
        ...req,
        amount: req.amount.toString(),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error('Error getting request history:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

export default router; 