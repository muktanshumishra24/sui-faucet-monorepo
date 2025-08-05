import React, { useState } from 'react';
import RoadmapModal from './RoadmapModal';

const HeroSection: React.FC = () => {
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);

  return (
    <div className="flex flex-col justify-center items-center w-1/2 h-full px-16">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-extrabold text-white leading-tight animate-fade-in-up">
            SUIss Knife
          </h1>
          <div className="w-24 h-1 bg-blue-400 rounded-full animate-scale-in"></div>
        </div>
                  <div className="space-y-4 animate-fade-in-up delay-200">
            <p className="text-xl text-gray-300 leading-relaxed max-w-md">
              Your very own Sui Faucet, with the Speed!
            </p>
            <button
              onClick={() => setIsRoadmapOpen(true)}
              className="text-sm text-blue-400 leading-relaxed max-w-lg font-light hover:text-blue-300 transition-colors cursor-pointer"
            >
              Evolving into the ultimate Swiss Knife for SUI Ecosystem
            </button>
          </div>
        <div className="flex items-center space-x-4 pt-4 animate-fade-in-up delay-300">
          <div className="flex items-center space-x-2 text-sm text-gray-400 hover:text-gray-300 transition-colors duration-300">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-normal">Live & Secure</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-400 hover:text-gray-300 transition-colors duration-300">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="font-normal">Testnet Ready</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-400 hover:text-gray-300 transition-colors duration-300">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <span className="font-normal">Swiss Knife Vision</span>
          </div>
        </div>
      </div>

      <RoadmapModal
        isOpen={isRoadmapOpen}
        onClose={() => setIsRoadmapOpen(false)}
      />
    </div>
  );
};

export default HeroSection; 