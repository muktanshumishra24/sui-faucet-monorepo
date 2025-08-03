import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server Configuration
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database Configuration
  database: {
    url: process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/sui_faucet',
  },
  
  // Redis Configuration
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  
  // Sui Configuration
  sui: {
    network: process.env.SUI_NETWORK || 'testnet',
    privateKey: process.env.SUI_PRIVATE_KEY || '',
    rpcUrl: process.env.SUI_RPC_URL || 'https://fullnode.testnet.sui.io',
    faucetAmount: BigInt(process.env.SUI_FAUCET_AMOUNT || '1000000000'), // 1 SUI in MIST
  },
  
  // Rate Limiting Configuration
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '3', 10),
    blockDuration: parseInt(process.env.RATE_LIMIT_BLOCK_DURATION || '3600000', 10), // 1 hour
  },
  
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_here',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  
  // CORS Configuration
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  },
  
  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    filePath: process.env.LOG_FILE_PATH || './logs/app.log',
  },
  
  // Admin Configuration
  admin: {
    emails: process.env.ADMIN_EMAILS?.split(',') || [],
  },
  
  // Discord Configuration
  discord: {
    webhookUrl: process.env.DISCORD_WEBHOOK_URL || '',
  },
  
  // Monitoring Configuration
  monitoring: {
    enableMetrics: process.env.ENABLE_METRICS === 'true',
    metricsPort: parseInt(process.env.METRICS_PORT || '9090', 10),
  },
  
  // Security Configuration
  security: {
    enableHelmet: process.env.ENABLE_HELMET !== 'false',
    enableCompression: process.env.ENABLE_COMPRESSION !== 'false',
    trustProxy: process.env.TRUST_PROXY === 'true',
  },
} as const;

export type Config = typeof config; 