import React from "react";

const FaucetInfoCard: React.FC = () => {
  return (
    <div className="glass-card rounded-2xl shadow-2xl p-6 w-full max-w-md hover:glass-card-hover transition-all duration-300 animate-fade-in-up delay-200">
      <h3 className="text-lg font-normal mb-4 flex items-center gap-3 text-white">
        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
        Faucet Information
      </h3>

      <div className="space-y-3">
        {/* Chain Info */}
        <div className="group flex items-center justify-between p-3 glass-blue rounded-xl hover:bg-blue-500/15 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 transform hover:scale-[1.02]">
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-xs text-gray-400 font-normal tracking-wide">
                Supported Chains
              </p>
              <p className="text-sm  text-blue-400 font-normal">Sui Testnet</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50">
              <img src="/sui-token.png" alt="Sui Token" className="w-6 h-6" />
            </div>
            <div className="w-2 h-2 bg-blue-500/50 rounded-full animate-pulse delay-150"></div>
          </div>
        </div>

        {/* Rate Limit Info */}
        <div className="group flex items-center justify-between p-3 glass-orange rounded-xl hover:bg-orange-500/15 hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300 transform hover:scale-[1.02]">
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-xs text-gray-400 font-normal tracking-wide">
                Rate Limit
              </p>
              <p className="text-sm text-orange-400 font-normal">
                Twice a Day{" "}
                <span className="text-xs text-white font-normal">
                  (12 Hour Cooldown)
                </span>
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="w-8 h-8 glass-orange rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-sm font-normal text-orange-400">
                {" "}
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
              </span>
            </div>
            <div className="w-1 h-1 bg-orange-500/50 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Amount Info */}
        <div className="group flex items-center justify-between p-3 glass-green rounded-xl hover:bg-green-500/15 hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 transform hover:scale-[1.02]">
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-xs text-gray-300 font-normal tracking-wide">
                Amount per Request
              </p>
              <p className="text-sm text-green-400 font-normal">0.001 SUI</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="px-3 py-1 glass-green rounded-full group-hover:scale-110 transition-transform duration-300">
              <span className="text-xs font-normal text-green-400 tracking-wide">
                FREE
              </span>
            </div>
            <div className="w-1 h-1 bg-green-500/50 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaucetInfoCard;
