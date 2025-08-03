'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { WalletMultiButton } from '@suiet/wallet-kit';
import { Sun, Moon, Menu, X } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-sui-500 to-sui-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold gradient-text">Sui Faucet</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#faucet"
              className="text-gray-700 dark:text-gray-300 hover:text-sui-600 dark:hover:text-sui-400 transition-colors"
            >
              Faucet
            </a>
            <a
              href="#stats"
              className="text-gray-700 dark:text-gray-300 hover:text-sui-600 dark:hover:text-sui-400 transition-colors"
            >
              Stats
            </a>
            <a
              href="#docs"
              className="text-gray-700 dark:text-gray-300 hover:text-sui-600 dark:hover:text-sui-400 transition-colors"
            >
              API Docs
            </a>
            <a
              href={process.env.NEXT_PUBLIC_DISCORD_INVITE}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-gray-300 hover:text-sui-600 dark:hover:text-sui-400 transition-colors"
            >
              Discord
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>
            <WalletMultiButton />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            ) : (
              <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col space-y-4">
              <a
                href="#faucet"
                className="text-gray-700 dark:text-gray-300 hover:text-sui-600 dark:hover:text-sui-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Faucet
              </a>
              <a
                href="#stats"
                className="text-gray-700 dark:text-gray-300 hover:text-sui-600 dark:hover:text-sui-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Stats
              </a>
              <a
                href="#docs"
                className="text-gray-700 dark:text-gray-300 hover:text-sui-600 dark:hover:text-sui-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                API Docs
              </a>
              <a
                href={process.env.NEXT_PUBLIC_DISCORD_INVITE}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 dark:text-gray-300 hover:text-sui-600 dark:hover:text-sui-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Discord
              </a>
              <div className="flex items-center space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  )}
                </button>
                <WalletMultiButton />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 