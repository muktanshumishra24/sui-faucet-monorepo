import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import { config } from './config';
import logger from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { rateLimiter } from './middleware/rateLimiter';
import { corsOptions } from './middleware/cors';
import { initializeDatabase } from './utils/database';
import { initializeRedis } from './utils/redis';
import { initializeSuiClient } from './utils/suiClient';

// Import routes
import faucetRoutes from './routes/faucet';
import adminRoutes from './routes/admin';
import authRoutes from './routes/auth';
import healthRoutes from './routes/health';
import statsRoutes from './routes/stats';

dotenv.config();

async function main() {
  try {
    logger.info('🚀 Starting Sui Faucet Backend...');

    // Initialize services
    await initializeDatabase();
    await initializeRedis();
    await initializeSuiClient();

    const app = express();

    // Security middleware
    if (config.security.enableHelmet) {
      app.use(helmet());
    }

    // Trust proxy for rate limiting
    if (config.security.trustProxy) {
      app.set('trust proxy', true);
    }

    // Compression middleware
    if (config.security.enableCompression) {
      app.use(compression());
    }

    // CORS middleware
    app.use(cors(corsOptions));

    // Body parsing middleware
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    app.use(cookieParser());

    // Request logging middleware
    app.use(requestLogger);

    // Rate limiting middleware
    app.use(rateLimiter);

    // Health check endpoint
    app.get('/', (req, res) => {
      res.status(200).json({
        status: 'success',
        message: 'Sui Faucet Backend is running',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        environment: config.nodeEnv,
      });
    });

    // API routes
    app.use('/api/health', healthRoutes);
    app.use('/api/faucet', faucetRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api/stats', statsRoutes);

    // 404 handler
    app.use('*', (req, res) => {
      res.status(404).json({
        status: 'error',
        message: 'Route not found',
        path: req.originalUrl,
      });
    });

    // Error handling middleware
    app.use(errorHandler);

    // Start server
    const port = config.port;
    app.listen(port, () => {
      logger.info(`✅ Server running on port ${port}`);
      logger.info(`🌍 Environment: ${config.nodeEnv}`);
      logger.info(`🔗 Health check: http://localhost:${port}/api/health`);
      logger.info(`📊 API Documentation: http://localhost:${port}/api/docs`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, shutting down gracefully');
      process.exit(0);
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT received, shutting down gracefully');
      process.exit(0);
    });

  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  logger.error('❌ Unhandled error:', error);
  process.exit(1);
}); 