import axios from 'axios';
import { logger } from '../utils/logger';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';

interface FaucetResponse {
  success: boolean;
  transactionUrl?: string;
  error?: string;
  requestId?: string;
}

export async function requestFaucet(address: string, amount: number): Promise<FaucetResponse> {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/faucet/request`, {
      walletAddress: address,
      amount: amount.toString(),
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 second timeout
    });

    if (response.data.success) {
      return {
        success: true,
        transactionUrl: response.data.transactionUrl,
        requestId: response.data.requestId,
      };
    } else {
      return {
        success: false,
        error: response.data.error || 'Unknown error occurred',
      };
    }
  } catch (error: any) {
    logger.error('API request failed:', error);
    
    if (error.response) {
      // Server responded with error status
      const errorMessage = error.response.data?.error || `HTTP ${error.response.status}`;
      return {
        success: false,
        error: errorMessage,
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        success: false,
        error: 'Server is not responding. Please try again later.',
      };
    } else {
      // Something else happened
      return {
        success: false,
        error: 'An unexpected error occurred.',
      };
    }
  }
}

export async function getFaucetStats(): Promise<any> {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/stats`);
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch faucet stats:', error);
    return null;
  }
} 