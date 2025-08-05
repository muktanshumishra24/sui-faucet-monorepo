import React, { useState, useRef, useEffect } from 'react';
import { useCurrentAccount, useDisconnectWallet } from '@mysten/dapp-kit';
import { ConnectButton } from '@mysten/dapp-kit';
import { createPortal } from 'react-dom';

const CustomWalletButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const currentAccount = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const dropdownElement = document.querySelector('[data-dropdown="wallet-dropdown"]');
      
      console.log('Click outside handler - target:', target);
      console.log('Dropdown element:', dropdownElement);
      
      if (buttonRef.current && 
          !buttonRef.current.contains(target) && 
          dropdownElement && 
          !dropdownElement.contains(target)) {
        console.log('Closing dropdown due to click outside');
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleButtonClick = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.right - 200 + window.scrollX
      });
    }
    setIsOpen(!isOpen);
  };

  const handleDisconnect = () => {
    console.log('Disconnect button clicked');
    try {
      disconnect();
      setIsOpen(false);
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!currentAccount?.address) {
    return (
      <div className="connect-button-wrapper">
        <ConnectButton />
      </div>
    );
  }

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        className="glass-card rounded-lg px-4 py-2 text-white hover:glass-card-hover transition-all duration-200 flex items-center gap-2"
      >
        <span className="text-sm font-normal">
          {formatAddress(currentAccount.address)}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && createPortal(
        <div 
          data-dropdown="wallet-dropdown"
          className="fixed glass-card rounded-xl shadow-2xl z-[9999] min-w-[200px]"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left
          }}
        >
          <div className="p-2 space-y-1">
            <button
              className="w-full text-left px-3 py-2 text-sm text-gray-300 glass-card rounded-lg hover:glass-card-hover transition-colors"
              disabled
            >
              {formatAddress(currentAccount.address)}
            </button>
            <div className="h-px bg-white/10 my-1"></div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Disconnect button clicked - event handler');
                handleDisconnect();
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Disconnect button mousedown');
              }}
              className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 glass-red rounded-lg transition-colors cursor-pointer"
            >
              Disconnect
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default CustomWalletButton; 