import { z } from 'zod';

// Faucet Request Schema
export const FaucetRequestSchema = z.object({
  walletAddress: z.string().min(1, 'Wallet address is required'),
  amount: z.string().optional(), // Optional custom amount
});

export type FaucetRequest = z.infer<typeof FaucetRequestSchema>;

// Faucet Response Schema
export const FaucetResponseSchema = z.object({
  status: z.enum(['success', 'error']),
  message: z.string(),
  txHash: z.string().optional(),
  requestId: z.string().optional(),
  error: z.string().optional(),
});

export type FaucetResponse = z.infer<typeof FaucetResponseSchema>;

// Admin Request Schema
export const AdminRequestSchema = z.object({
  action: z.enum(['blacklist', 'whitelist', 'update_config']),
  target: z.string(), // IP address or wallet address
  reason: z.string().optional(),
  config: z.record(z.any()).optional(),
});

export type AdminRequest = z.infer<typeof AdminRequestSchema>;

// User Session Schema
export const UserSessionSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  role: z.enum(['user', 'admin', 'moderator']),
  permissions: z.array(z.string()),
});

export type UserSession = z.infer<typeof UserSessionSchema>;

// Rate Limit Info
export interface RateLimitInfo {
  remaining: number;
  resetTime: Date;
  limit: number;
}

// Geolocation Info
export interface GeolocationInfo {
  country: string;
  region: string;
  city: string;
  timezone: string;
  ip: string;
}

// User Agent Info
export interface UserAgentInfo {
  browser: string;
  version: string;
  os: string;
  device: string;
  isBot: boolean;
}

// Request Context
export interface RequestContext {
  ip: string;
  userAgent: string;
  geolocation?: GeolocationInfo;
  userAgentInfo?: UserAgentInfo;
  session?: UserSession;
}

// Faucet Transaction Status
export enum TransactionStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  EXPIRED = 'expired',
}

// Database Models
export interface FaucetRequest {
  id: string;
  walletAddress: string;
  ipAddress: string;
  amount: bigint;
  status: TransactionStatus;
  txHash?: string;
  failureReason?: string;
  userAgent?: string;
  geolocation?: GeolocationInfo;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'moderator';
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BlacklistedEntity {
  id: string;
  target: string; // IP address or wallet address
  type: 'ip' | 'wallet';
  reason: string;
  expiresAt?: Date;
  createdAt: Date;
  createdBy: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Statistics Types
export interface FaucetStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalTokensDistributed: bigint;
  averageResponseTime: number;
  requestsToday: number;
  requestsThisWeek: number;
  requestsThisMonth: number;
  topRequestedAddresses: Array<{
    address: string;
    count: number;
  }>;
  topRequestingCountries: Array<{
    country: string;
    count: number;
  }>;
}

// Discord Integration Types
export interface DiscordWebhookPayload {
  content?: string;
  embeds?: Array<{
    title?: string;
    description?: string;
    color?: number;
    fields?: Array<{
      name: string;
      value: string;
      inline?: boolean;
    }>;
    timestamp?: string;
  }>;
}

// Configuration Types
export interface FaucetConfig {
  enabled: boolean;
  faucetAmount: bigint;
  maxRequestsPerWindow: number;
  windowMs: number;
  blockDuration: number;
  allowedCountries: string[];
  blockedCountries: string[];
  maintenanceMode: boolean;
  maintenanceMessage?: string;
} 