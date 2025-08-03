import Redis from 'ioredis';
import { config } from '../config';
import logger from './logger';

let redis: Redis;

export const initializeRedis = async () => {
  try {
    redis = new Redis(config.redis.url, {
      retryDelayOnFailover: 100,
      enableReadyCheck: false,
      maxRetriesPerRequest: null,
      lazyConnect: true,
    });

    // Test the connection
    await redis.ping();
    
    logger.info('✅ Redis connected successfully');

    // Handle Redis events
    redis.on('connect', () => {
      logger.info('Redis client connected');
    });

    redis.on('ready', () => {
      logger.info('Redis client ready');
    });

    redis.on('error', (error) => {
      logger.error('Redis error:', error);
    });

    redis.on('close', () => {
      logger.warn('Redis connection closed');
    });

    redis.on('reconnecting', () => {
      logger.info('Redis reconnecting...');
    });

  } catch (error) {
    logger.error('❌ Failed to connect to Redis:', error);
    throw error;
  }
};

export const getRedisClient = () => {
  if (!redis) {
    throw new Error('Redis not initialized. Call initializeRedis() first.');
  }
  return redis;
};

export const closeRedis = async () => {
  if (redis) {
    await redis.quit();
    logger.info('Redis connection closed');
  }
}; 