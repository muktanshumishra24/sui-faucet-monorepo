import { PrismaClient } from '@prisma/client';
import logger from './logger';

let prisma: PrismaClient;

export const initializeDatabase = async () => {
  try {
    prisma = new PrismaClient({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ],
    });

    // Test the connection
    await prisma.$connect();
    
    logger.info('✅ Database connected successfully');

    // Log queries in development
    if (process.env.NODE_ENV === 'development') {
      prisma.$on('query', (e) => {
        logger.debug('Query:', {
          query: e.query,
          params: e.params,
          duration: `${e.duration}ms`,
        });
      });
    }

    // Log errors
    prisma.$on('error', (e) => {
      logger.error('Database error:', e);
    });

  } catch (error) {
    logger.error('❌ Failed to connect to database:', error);
    throw error;
  }
};

export const getPrismaClient = () => {
  if (!prisma) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return prisma;
};

export const closeDatabase = async () => {
  if (prisma) {
    await prisma.$disconnect();
    logger.info('Database connection closed');
  }
}; 