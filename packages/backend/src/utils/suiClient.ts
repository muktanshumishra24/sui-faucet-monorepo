import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { config } from '../config';
import logger from './logger';

let suiClient: SuiClient;
let faucetKeypair: Ed25519Keypair;

export const initializeSuiClient = async () => {
  try {
    // Initialize Sui client
    suiClient = new SuiClient({
      url: config.sui.rpcUrl,
    });

    // Test the connection
    const version = await suiClient.getRpcApiVersion();
    logger.info('✅ Sui client connected successfully', { version });

    // Initialize faucet keypair
    if (!config.sui.privateKey) {
      throw new Error('SUI_PRIVATE_KEY is required');
    }

    faucetKeypair = Ed25519Keypair.fromSecretKey(
      Buffer.from(config.sui.privateKey, 'hex')
    );

    logger.info('✅ Faucet keypair initialized');

    // Test the faucet account
    const faucetAddress = faucetKeypair.getPublicKey().toSuiAddress();
    const balance = await suiClient.getBalance({
      owner: faucetAddress,
    });

    logger.info('Faucet account balance:', {
      address: faucetAddress,
      balance: balance.totalBalance,
      coinType: balance.coinType,
    });

  } catch (error) {
    logger.error('❌ Failed to initialize Sui client:', error);
    throw error;
  }
};

export const getSuiClient = () => {
  if (!suiClient) {
    throw new Error('Sui client not initialized. Call initializeSuiClient() first.');
  }
  return suiClient;
};

export const getFaucetKeypair = () => {
  if (!faucetKeypair) {
    throw new Error('Faucet keypair not initialized. Call initializeSuiClient() first.');
  }
  return faucetKeypair;
};

export const sendSuiTokens = async (
  recipientAddress: string,
  amount: bigint
): Promise<{ success: boolean; txDigest?: string; error?: string }> => {
  try {
    const client = getSuiClient();
    const keypair = getFaucetKeypair();

    // Create transaction
    const tx = new TransactionBlock();
    const [coin] = tx.splitCoins(tx.gas, [amount]);
    tx.transferObjects([coin], tx.pure(recipientAddress));

    // Execute transaction
    const result = await client.signAndExecuteTransactionBlock({
      signer: keypair,
      transactionBlock: tx,
      options: {
        showEffects: true,
        showEvents: true,
      },
    });

    if (result.effects?.status.status === 'success') {
      logger.info('SUI tokens sent successfully', {
        recipient: recipientAddress,
        amount: amount.toString(),
        txDigest: result.digest,
      });

      return {
        success: true,
        txDigest: result.digest,
      };
    } else {
      const error = result.effects?.status.error || 'Transaction failed';
      logger.error('Failed to send SUI tokens', {
        recipient: recipientAddress,
        amount: amount.toString(),
        error,
      });

      return {
        success: false,
        error,
      };
    }
  } catch (error) {
    logger.error('Error sending SUI tokens:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const getFaucetBalance = async () => {
  try {
    const client = getSuiClient();
    const keypair = getFaucetKeypair();
    const address = keypair.getPublicKey().toSuiAddress();

    const balance = await client.getBalance({
      owner: address,
    });

    return {
      address,
      balance: balance.totalBalance,
      coinType: balance.coinType,
    };
  } catch (error) {
    logger.error('Error getting faucet balance:', error);
    throw error;
  }
}; 