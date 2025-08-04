import "./App.css";
import { useEffect, useState } from "react";
import { requestTokens } from "./useTokenRequest";
import { Toaster, toast } from "react-hot-toast";
import { useCurrentAccount } from "@mysten/dapp-kit";

// Import modular components
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import WalletCard from "./components/WalletCard";
import FaucetInfoCard from "./components/FaucetInfoCard";
import Footer from "./components/Footer";
import BackgroundEffects from "./components/BackgroundEffects";

async function checkSuiAccountExists(address: string): Promise<boolean> {
  // Accepts 0x-prefixed hex strings up to 64 chars (Sui address format)
  const isFormatValid = /^0x[a-fA-F0-9]{64}$/.test(address);
  return isFormatValid;
}

function App() {
  const [wallet, setWallet] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [lastTransaction, setLastTransaction] = useState<{
    hash: string;
    status: string;
  } | null>(null);

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

      console.log("Full API response:", res);

      // Check for different possible transaction hash field names
      const transactionHash =
        res.transactionHash || res.txHash || res.hash || res.transaction_id;

      if (transactionHash) {
        console.log("Transaction hash found:", transactionHash);
        setLastTransaction({ hash: transactionHash, status: "Success" });
        setMessage("Transaction successful! You have received 0.001 SUI");
      } else {
        console.log(
          "No transaction hash found in response. Available fields:",
          Object.keys(res)
        );
        setMessage(res.message || "Tokens requested successfully!");
      }
    } catch (err: unknown) {
      const error = err as {
        response?: { error?: { code?: string; retryAfter?: number } };
      };
      const errorCode = error?.response?.error?.code;
      const retryAfter = error?.response?.error?.retryAfter;

      if (errorCode === "RATE_LIMIT_EXCEEDED" && retryAfter) {
        const totalMinutes = Math.ceil(retryAfter / 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        let timeString = "";
        if (hours > 0 && minutes > 0) {
          timeString = `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minute${
            minutes > 1 ? "s" : ""
          }`;
        } else if (hours > 0) {
          timeString = `${hours} hour${hours > 1 ? "s" : ""}`;
        } else {
          timeString = `${minutes} minute${minutes > 1 ? "s" : ""}`;
        }

        setMessage(`Rate limit exceeded. Try again in ${timeString}.`);
      } else {
        setMessage("Failed to request tokens. Please try again.");
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

  useEffect(() => {
    console.log("lastTransaction changed:", lastTransaction);
  }, [lastTransaction]);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <BackgroundEffects />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        {/* Main Content */}
        <main className="flex-1 flex flex-row justify-center items-center h-screen w-full overflow-hidden">
          <HeroSection />
          
          {/* Right Column: Two stacked cards */}
          <div className="flex flex-col justify-center items-center w-1/2 h-full px-16 gap-6">
            <WalletCard
              wallet={wallet}
              isValid={isValid}
              loading={loading}
              message={message}
              onWalletChange={handleChange}
              onRequest={handleRequest}
            />
            <FaucetInfoCard />
          </div>
        </main>

        <Footer />
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
    </div>
  );
}

export default App;
