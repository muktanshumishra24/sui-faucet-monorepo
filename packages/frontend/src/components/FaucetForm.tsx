'use client';

import { useState } from 'react';
import { useWallet } from '@suiet/wallet-kit';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Copy, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useFaucetRequest } from '@/hooks/useFaucetRequest';

const faucetSchema = z.object({
  walletAddress: z.string().min(1, 'Wallet address is required'),
  amount: z.string().optional(),
});

type FaucetFormData = z.infer<typeof faucetSchema>;

export function FaucetForm() {
  const { connected, account } = useWallet();
  const [copied, setCopied] = useState(false);
  const { mutate: requestTokens, isPending, data: requestResult } = useFaucetRequest();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FaucetFormData>({
    resolver: zodResolver(faucetSchema),
    defaultValues: {
      walletAddress: '',
      amount: '1000000000', // 1 SUI in MIST
    },
  });

  const watchedAddress = watch('walletAddress');

  // Auto-fill wallet address when connected
  if (connected && account?.address && !watchedAddress) {
    setValue('walletAddress', account.address);
  }

  const onSubmit = (data: FaucetFormData) => {
    if (!data.walletAddress) {
      toast.error('Please enter a wallet address');
      return;
    }

    requestTokens({
      walletAddress: data.walletAddress,
      amount: data.amount,
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="space-y-6">
      {/* Connected Wallet Info */}
      {connected && account && (
        <Card className="p-4 bg-sui-50 dark:bg-sui-900/20 border-sui-200 dark:border-sui-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Connected Wallet</p>
              <p className="font-mono text-sm text-gray-900 dark:text-white">
                {formatAddress(account.address)}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => copyToClipboard(account.address)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Faucet Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Wallet Address
          </label>
          <Input
            id="walletAddress"
            type="text"
            placeholder="Enter your Sui wallet address"
            {...register('walletAddress')}
            className={errors.walletAddress ? 'border-red-500' : ''}
          />
          {errors.walletAddress && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.walletAddress.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Amount (MIST)
          </label>
          <Input
            id="amount"
            type="text"
            placeholder="1000000000 (1 SUI)"
            {...register('amount')}
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            1 SUI = 1,000,000,000 MIST
          </p>
        </div>

        <Button
          type="submit"
          disabled={isPending || !watchedAddress}
          className="w-full"
        >
          {isPending ? (
            <div className="flex items-center space-x-2">
              <div className="spinner"></div>
              <span>Processing...</span>
            </div>
          ) : (
            'Request Testnet Tokens'
          )}
        </Button>
      </form>

      {/* Success Result */}
      {requestResult?.success && (
        <Card className="p-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-green-900 dark:text-green-100">
                Tokens Sent Successfully!
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                Your SUI testnet tokens have been sent to your wallet.
              </p>
              {requestResult.data?.txHash && (
                <div className="mt-3">
                  <p className="text-xs text-green-600 dark:text-green-400 mb-1">
                    Transaction Hash:
                  </p>
                  <div className="flex items-center space-x-2">
                    <code className="text-xs bg-green-100 dark:bg-green-800 px-2 py-1 rounded">
                      {requestResult.data.txHash}
                    </code>
                    <button
                      onClick={() => copyToClipboard(requestResult.data.txHash!)}
                      className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <a
                      href={`https://suiexplorer.com/txblock/${requestResult.data.txHash}?network=testnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Error Result */}
      {requestResult && !requestResult.success && (
        <Card className="p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-red-900 dark:text-red-100">
                Request Failed
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                {requestResult.message || 'An error occurred while processing your request.'}
              </p>
              {requestResult.data?.error && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                  Error: {requestResult.data.error}
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            Rate Limits
          </h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• 3 requests per 15 minutes per wallet</li>
            <li>• 3 requests per 15 minutes per IP</li>
            <li>• Maximum 10 SUI per request</li>
          </ul>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            Network Info
          </h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Network: Sui Testnet</li>
            <li>• RPC: {process.env.NEXT_PUBLIC_SUI_NETWORK || 'testnet'}</li>
            <li>• Explorer: <a href="https://suiexplorer.com" target="_blank" rel="noopener noreferrer" className="text-sui-600 dark:text-sui-400 hover:underline">Sui Explorer</a></li>
          </ul>
        </Card>
      </div>
    </div>
  );
} 