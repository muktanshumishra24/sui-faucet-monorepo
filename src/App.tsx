import {
  ArrowRightIcon,
  ClockIcon,
  DropIcon,
  InfoIcon,
  GithubLogoIcon,
  TwitterLogoIcon,
  DiscordLogoIcon,
} from "@phosphor-icons/react";
import "./App.css";
import RateLimitModal from "./components/RateLimitModal";

import { useEffect, useState } from "react";
import { requestTokens } from "./useTokenRequest";
import { Toaster, toast } from "react-hot-toast";

import { useCurrentAccount, ConnectButton } from "@mysten/dapp-kit";

async function checkSuiAccountExists(address: string): Promise<boolean> {
  // Accepts 0x-prefixed hex strings up to 64 chars (Sui address format)
  const isFormatValid = /^0x[a-fA-F0-9]{64}$/.test(address);
  return isFormatValid;
}

function App() {
  const [showModal, setShowModal] = useState(false);
  const [wallet, setWallet] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedChain, setSelectedChain] = useState("");

  const currentAccount = useCurrentAccount();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setWallet(value);
    setMessage("");

    const isFormatValid = /^0x[a-fA-F0-9]{64}$/.test(value);
    if (!isFormatValid) {
      setIsValid(false);
      return;
    }

    const exists = await checkSuiAccountExists(value);
    setIsValid(exists);
    console.log("Exists:", exists);
  };

  const handleRequest = async () => {
    // Only allow requests if wallet is connected
    if (!currentAccount?.address) {
      toast.error("Please connect your wallet first to request tokens.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Use the connected wallet address instead of the input field
      const res = await requestTokens(currentAccount.address);

      if (res.transactionHash) {
        toast.success(
          <span>
            Tokens requested!{" "}
            <a
              href={`https://testnet.suivision.xyz/txblock/${res.transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-300"
            >
              View on Explorer
            </a>
          </span>
        );
      } else {
        toast.success("Tokens requested successfully!");
        setMessage(res.message);
      }
    } catch (err: unknown) {
      const error = err as { response?: { error?: { code?: string; retryAfter?: number } } };
      const errorCode = error?.response?.error?.code;
      const retryAfter = error?.response?.error?.retryAfter;

      if (errorCode === "RATE_LIMIT_EXCEEDED" && retryAfter) {
        const hours = (retryAfter / 3600).toFixed(2);
        toast.error(`Rate limit exceeded. Try again in ${hours} hour(s).`);
      } else {
        toast.error("Failed to request tokens. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentAccount?.address) {
      setWallet(currentAccount.address);
      setIsValid(true);
    }
  }, [currentAccount]);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Subtle blue gradient from top left */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-transparent"></div>

      {/* Subtle animated background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-20 left-20 w-64 h-64 bg-blue-400/3 rounded-full blur-3xl animate-pulse delay-2000"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white/5 backdrop-blur-sm border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <img
                    src="/suidrop-logo.svg"
                    alt="SUIssKnife"
                    className="w-8 h-8"
                  />
                  <span className="ml-2 text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    SUIss Knife
                  </span>
                </div>
                <div className="hidden md:flex items-center space-x-1 text-sm text-gray-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Live</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <ConnectButton />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-4">
                Get Testnet Tokens
              </h1>
              <p className="text-gray-300 text-lg">
                Connect your wallet to receive free testnet tokens
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8">
              {/* Network Info */}
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-4 mb-6 border border-white/10">
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2 text-white">
                  <InfoIcon size={16} className="text-blue-400" />
                  Supported Network
                </h3>
                <div className="flex items-center gap-2">
                  <DropIcon size={16} className="text-blue-400" />
                  <span className="text-sm text-gray-300">Sui Testnet</span>
                </div>
              </div>

              {/* Rate Limits Info */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm text-gray-300">Rate Limits</span>
                <button
                  onClick={() => setShowModal(true)}
                  className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 text-sm"
                >
                  <ClockIcon size={16} />
                  View Details
                </button>
              </div>

              {/* Chain Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Chain
                </label>
                <select
                  value={selectedChain}
                  onChange={(e) => setSelectedChain(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                >
                  <option value="" className="bg-gray-800">
                    Select Chain
                  </option>
                  <option value="sui" className="bg-gray-800">
                    Sui Testnet
                  </option>
                </select>
              </div>

              {/* Wallet Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {currentAccount?.address
                    ? "Connected Wallet"
                    : "Wallet Address"}
                </label>
                {currentAccount?.address ? (
                  <div className="w-full p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-200 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs truncate">
                        {currentAccount.address}
                      </span>
                      <div className="flex items-center gap-1 text-green-400">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs">Connected</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <input
                    type="text"
                    value={wallet}
                    onChange={handleChange}
                    placeholder="Connect your wallet to request tokens"
                    className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
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
                    Connect your wallet using the button in the header
                  </p>
                )}
              </div>

              {/* Message Display */}
              {message && (
                <div className="mb-6 p-3 bg-blue-500/20 border border-blue-500/30 rounded-xl">
                  <p className="text-sm text-blue-200">{message}</p>
                </div>
              )}

              {/* Request Button */}
              <button
                onClick={handleRequest}
                disabled={!currentAccount?.address || !selectedChain || loading}
                className={`w-full py-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                  !currentAccount?.address || !selectedChain || loading
                    ? "bg-gray-600/50 cursor-not-allowed text-gray-400"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white cursor-pointer transform hover:scale-105 shadow-lg"
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
                    <ArrowRightIcon size={16} />
                  </>
                ) : (
                  <>
                    Request Tokens
                    <ArrowRightIcon size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white/5 backdrop-blur-sm border-t border-white/10 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4 text-sm text-gray-300">
                <span>Made by Muktanshu Mishra</span>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-4">
                  <a
                    href="https://github.com/muktanshumishra24"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    <GithubLogoIcon size={20} />
                  </a>
                  <a
                    href="https://x.com/SuiNetwork"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    <TwitterLogoIcon size={20} />
                  </a>
                  <a
                    href="https://discord.gg/sui"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    <DiscordLogoIcon size={20} />
                  </a>
                </div>
                <div className="text-sm text-gray-300">
                  <span>© 2024 SUIss Knife</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#1e293b",
            color: "#fff",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          },
        }}
      />
      <RateLimitModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}

export default App;
