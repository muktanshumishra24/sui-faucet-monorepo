import React, { useState } from 'react';
import CustomWalletButton from './CustomWalletButton';
import RoadmapModal from './RoadmapModal';

const Header: React.FC = () => {
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);

  return (
    <>
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

            {/* Roadmap Button */}
            <div className="flex items-center space-x-4">
              <CustomWalletButton />
              <button
                onClick={() => setIsRoadmapOpen(true)}
                className="flex items-center justify-center w-10 h-10 bg-blue-600/50 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                title="View Development Roadmap"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <RoadmapModal
        isOpen={isRoadmapOpen}
        onClose={() => setIsRoadmapOpen(false)}
      />
    </>
  );
};

export default Header; 