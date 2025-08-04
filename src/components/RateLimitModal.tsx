import { XIcon } from "@phosphor-icons/react";
import { ClockIcon, LightningIcon } from "@phosphor-icons/react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function RateLimitModal({ open, onClose }: Props) {
  const handleBackdropClick = () => {
    onClose();
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent closing when clicking inside drawer
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleBackdropClick}
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      
      {/* Side Drawer */}
      <div
        onClick={stopPropagation}
        className={`fixed top-0 right-0 h-full w-80 max-w-[90vw] z-50 bg-[#0f0f0f] border-l border-[#60A5FA] shadow-2xl transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-[#60A5FA]">
            <ClockIcon size={18} />
            Rate Limits
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-white/10 transition-colors"
          >
            <XIcon size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div>
            <p className="text-sm text-gray-300 mb-6">
              Information about rate limits for the selected chain
            </p>
          </div>

          {/* Rate Limit Box */}
          <div className="bg-[#1e293b] border border-white/10 rounded-xl p-4">
            <h3 className="font-semibold flex items-center gap-2 text-[#60A5FA] text-sm mb-2">
              <ClockIcon size={16} />
              Rate Limit:
            </h3>
            <p className="text-sm text-white">2 requests per day (12 hours)</p>
          </div>

          {/* Token Amount Box */}
          <div className="bg-[#1e222b] border border-white/10 rounded-xl p-4">
            <h3 className="font-semibold flex items-center gap-2 text-[#60A5FA] text-sm mb-2">
              <LightningIcon size={16} />
              Token Amount per Request:
            </h3>
            <p className="text-sm text-white mb-2">0.001 SUI</p>
            <p className="text-xs text-gray-400">
              Each successful request will send <strong>0.001 SUI</strong> tokens
              to your address.
            </p>
          </div>

          {/* Additional Info */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <h3 className="font-semibold text-blue-400 text-sm mb-2">
              💡 Tips
            </h3>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• Make sure your wallet is connected</li>
              <li>• Wait 12 hours between requests</li>
              <li>• Keep your private keys safe</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
