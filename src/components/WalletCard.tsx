import React from 'react';
import { ArrowRightIcon } from "@phosphor-icons/react";
import { useCurrentAccount } from "@mysten/dapp-kit";

interface WalletCardProps {
  wallet: string;
  isValid: boolean;
  loading: boolean;
  message: string;
  onWalletChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRequest: () => void;
}

const WalletCard: React.FC<WalletCardProps> = ({
  wallet,
  isValid,
  loading,
  message,
  onWalletChange,
  onRequest
}) => {
  const currentAccount = useCurrentAccount();

  return (
    <div className="glass-card rounded-2xl shadow-2xl p-8 w-full max-w-md hover:glass-card-hover transition-all duration-300 animate-fade-in-up delay-100">
      <h3 className="text-xl font-normal mb-6 flex items-center gap-3 text-white">
        Request Tokens
      </h3>

      {/* Wallet Input */}
      <div className="mb-6">
        <label className="block text-xs font-normal text-white mb-3">
          Wallet Address
        </label>
        {currentAccount?.address ? (
          <div className="w-full p-3 rounded-xl glass-green text-green-200 text-sm hover:bg-green-500/15 hover:border-green-500/40 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs truncate">
                {currentAccount.address}
              </span>
              <div className="flex items-center gap-1 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-normal">Connected</span>
              </div>
            </div>
          </div>
        ) : (
          <input
            type="text"
            value={wallet}
            onChange={onWalletChange}
            placeholder="Your Wallet Address"
            className="w-full p-3 rounded-xl glass-card text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        )}
        {!isValid && wallet && !currentAccount?.address && (
          <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
            <span className="w-1 h-1 bg-red-400 rounded-full"></span>
            Invalid wallet address format
          </p>
        )}
        {!currentAccount?.address && (
          <p className="text-blue-400 text-xs mt-2 flex items-center gap-1">
            <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
            Connect your wallet to request tokens.
          </p>
        )}
      </div>

      {/* Transaction Status Display */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-xl ${
            message.includes("successful") ||
            message.includes("Success")
              ? "glass-green"
              : message.includes("Failed") ||
                message.includes("exceeded")
              ? "glass-red"
              : "glass-blue"
          }`}
        >
          <h4 className="text-sm font-semibold mb-2 text-white">
            {message.includes("successful") ||
            message.includes("Success")
              ? "Transaction Successful"
              : message.includes("Failed") ||
                message.includes("exceeded")
              ? "Transaction Failed"
              : "Transaction Info"}
          </h4>
          <div className="flex items-center gap-2 mb-2">
            <div
              className={`w-2 h-2 rounded-full ${
                message.includes("successful") ||
                message.includes("Success")
                  ? "bg-green-400 animate-pulse"
                  : message.includes("Failed") ||
                    message.includes("exceeded")
                  ? "bg-red-400"
                  : "bg-blue-400"
              }`}
            ></div>
            <span
              className={`text-sm font-normal ${
                message.includes("successful") ||
                message.includes("Success")
                  ? "text-green-200"
                  : message.includes("Failed") ||
                    message.includes("exceeded")
                  ? "text-red-200"
                  : "text-blue-200"
              }`}
            >
              {message.includes("successful") ||
              message.includes("Success")
                ? "Transaction Status"
                : message.includes("Failed") ||
                  message.includes("exceeded")
                ? "Error"
                : "Info"}
            </span>
          </div>
          <p
            className={`text-sm ${
              message.includes("successful") ||
              message.includes("Success")
                ? "text-green-100"
                : message.includes("Failed") ||
                  message.includes("exceeded")
                ? "text-red-100"
                : "text-blue-100"
            }`}
          >
            {message}
          </p>
        </div>
      )}

      {/* Request Button */}
      <button
        onClick={onRequest}
        disabled={!currentAccount?.address || loading}
        className={`w-full py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
          !currentAccount?.address || loading
            ? "bg-gray-600/50 cursor-not-allowed text-gray-400"
            : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transform hover:scale-105 hover:shadow-xl shadow-lg"
        }`}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Requesting...
          </>
        ) : !currentAccount?.address ? (
          <>
            Connect Wallet to Request
          </>
        ) : (
          <>
            Request Tokens
            <ArrowRightIcon size={16} />
          </>
        )}
      </button>
    </div>
  );
};

export default WalletCard; 