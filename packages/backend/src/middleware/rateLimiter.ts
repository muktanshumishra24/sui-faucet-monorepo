import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { config } from '../config';
import logger from '../utils/logger';

// Global rate limiter
export const rateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    status: 'error',
    message: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      url: req.url,
      userAgent: req.get('User-Agent'),
    });
    
    res.status(429).json({
      status: 'error',
      message: 'Too many requests, please try again later.',
      retryAfter: Math.ceil(config.rateLimit.windowMs / 1000),
    });
  },
  keyGenerator: (req: Request) => {
    // Use IP address as the key for rate limiting
    return req.ip || 'unknown';
  },
});

// Specific rate limiter for faucet requests
export const faucetRateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    status: 'error',
    message: 'Faucet rate limit exceeded. Please wait before requesting more tokens.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    logger.warn('Faucet rate limit exceeded', {
      ip: req.ip,
      walletAddress: req.body?.walletAddress,
      userAgent: req.get('User-Agent'),
    });
    
    res.status(429).json({
      status: 'error',
      message: 'Faucet rate limit exceeded. Please wait before requesting more tokens.',
      retryAfter: Math.ceil(config.rateLimit.windowMs / 1000),
    });
  },
  keyGenerator: (req: Request) => {
    // Use both IP and wallet address for faucet requests
    const walletAddress = req.body?.walletAddress || 'unknown';
    return `${req.ip || 'unknown'}:${walletAddress}`;
  },
});

// Admin rate limiter (more lenient)
export const adminRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: {
    status: 'error',
    message: 'Too many admin requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    logger.warn('Admin rate limit exceeded', {
      ip: req.ip,
      url: req.url,
      userAgent: req.get('User-Agent'),
    });
    
    res.status(429).json({
      status: 'error',
      message: 'Too many admin requests, please try again later.',
      retryAfter: 900, // 15 minutes
    });
  },
  keyGenerator: (req: Request) => {
    return req.ip || 'unknown';
  },
}); 