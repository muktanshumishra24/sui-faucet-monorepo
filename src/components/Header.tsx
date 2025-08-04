import React from 'react';
import CustomWalletButton from './CustomWalletButton';

const Header: React.FC = () => {
  return (
    <header className="glass-card-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <img
                src="/suidrop-logo.svg"
                alt="SUIssKnife"
                className="w-8 h-8"
              />
              <span className="ml-2 text-xl font-normal text-white">
                SUIss Knife
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-1 text-sm text-gray-300">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <CustomWalletButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 