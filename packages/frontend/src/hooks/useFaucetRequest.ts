import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { faucetApi } from '@/lib/api';

interface FaucetRequestData {
  walletAddress: string;
  amount?: string;
}

interface FaucetResponse {
  status: 'success' | 'error';
  message: string;
  data?: {
    requestId: string;
    txHash?: string;
    amount: string;
    responseTime: string;
    error?: string;
  };
}

export function useFaucetRequest() {
  return useMutation<FaucetResponse, Error, FaucetRequestData>({
    mutationFn: async (data: FaucetRequestData) => {
      const response = await faucetApi.post('/faucet/request', data);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.status === 'success') {
        toast.success('SUI tokens sent successfully!', {
          description: `Transaction: ${data.data?.txHash}`,
        });
      } else {
        toast.error('Failed to send tokens', {
          description: data.message,
        });
      }
    },
    onError: (error) => {
      toast.error('Request failed', {
        description: error.message || 'An unexpected error occurred',
      });
    },
  });
} 