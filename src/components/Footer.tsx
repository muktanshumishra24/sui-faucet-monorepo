import React from 'react';
import {
  GithubLogoIcon,
  TwitterLogoIcon,
  DiscordLogoIcon,
} from "@phosphor-icons/react";

const Footer: React.FC = () => {
  return (
    <footer className="glass-card-footer mt-auto">
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
                className="text-gray-300 hover:text-white transition-colors duration-300 hover:scale-110 transform"
              >
                <GithubLogoIcon size={20} />
              </a>
              <a
                href="https://x.com/SuiNetwork"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors duration-300 hover:scale-110 transform"
              >
                <TwitterLogoIcon size={20} />
              </a>
              <a
                href="https://discord.gg/sui"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors duration-300 hover:scale-110 transform"
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
  );
};

export default Footer; 