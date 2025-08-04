import React from "react";

const FaucetInfoCard: React.FC = () => {
  return (
    <div className="glass-card rounded-2xl shadow-2xl p-6 w-full max-w-md hover:glass-card-hover transition-all duration-500 animate-fade-in-up delay-200 border border-white/5 backdrop-blur-xl">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-3 text-white">
        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></span>
        Faucet Information
      </h3>

      <div className="space-y-3">
        {/* Chain Info */}
        <div className="group flex items-center justify-between p-3 glass-blue rounded-xl hover:bg-blue-500/15 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 transform hover:scale-[1.02] border border-blue-500/10">
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">
                Supported Chains
              </p>
              <p className="text-sm text-blue-400 font-semibold">Sui Testnet</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="w-8 h-8 glass-blue rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/20">
              <img src="/sui-token.png" alt="Sui Token" className="w-5 h-5 drop-shadow-sm" />
            </div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-150 shadow-lg shadow-blue-400/50"></div>
          </div>
        </div>

        {/* Rate Limit Info */}
        <div className="group flex items-center justify-between p-3 glass-orange rounded-xl hover:bg-orange-500/15 hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300 transform hover:scale-[1.02] border border-orange-500/10">
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">
                Rate Limit
              </p>
              <p className="text-sm text-orange-400 font-semibold">
                Twice a Day{" "}
                <span className="text-xs text-white font-medium">
                  (12 Hour Cooldown)
                </span>
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="w-8 h-8 glass-orange rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-orange-500/20">
              <svg
                className="w-5 h-5 text-orange-400 drop-shadow-sm"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-150 shadow-lg shadow-orange-400/50"></div>
          </div>
        </div>

        {/* Amount Info */}
        <div className="group flex items-center justify-between p-3 glass-green rounded-xl hover:bg-green-500/15 hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 transform hover:scale-[1.02] border border-green-500/10">
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">
                Amount per Request
              </p>
              <p className="text-sm text-green-400 font-semibold">0.001 SUI</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="w-8 h-8 glass-green rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-green-500/20">
              <span className="text-sm font-semibold text-green-400 tracking-wide">
                $
              </span>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-150 shadow-lg shadow-green-400/50"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaucetInfoCard;
