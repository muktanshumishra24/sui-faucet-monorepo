import { Suspense } from 'react';
import { WalletKitProvider } from '@suiet/wallet-kit';
import { Header } from '@/components/Header';
import { FaucetForm } from '@/components/FaucetForm';
import { Stats } from '@/components/Stats';
import { Footer } from '@/components/Footer';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function HomePage() {
  return (
    <WalletKitProvider>
      <div className="min-h-screen bg-gradient-to-br from-sui-50 via-white to-sui-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <section className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="gradient-text">Sui Testnet</span>
                <br />
                <span className="text-gray-900 dark:text-white">Faucet</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Get SUI testnet tokens quickly and easily. Built for developers and builders in the Sui ecosystem.
              </p>
              
              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="card text-center">
                  <div className="w-12 h-12 bg-sui-100 dark:bg-sui-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-sui-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Fast & Reliable</h3>
                  <p className="text-gray-600 dark:text-gray-400">Get tokens within 30 seconds</p>
                </div>
                
                <div className="card text-center">
                  <div className="w-12 h-12 bg-sui-100 dark:bg-sui-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-sui-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Secure</h3>
                  <p className="text-gray-600 dark:text-gray-400">Rate-limited and abuse-protected</p>
                </div>
                
                <div className="card text-center">
                  <div className="w-12 h-12 bg-sui-100 dark:bg-sui-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-sui-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Developer Friendly</h3>
                  <p className="text-gray-600 dark:text-gray-400">Simple API and documentation</p>
                </div>
              </div>
            </section>

            {/* Faucet Form */}
            <section className="mb-12">
              <div className="card max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
                  Request Testnet Tokens
                </h2>
                <Suspense fallback={<LoadingSpinner />}>
                  <FaucetForm />
                </Suspense>
              </div>
            </section>

            {/* Stats Section */}
            <section className="mb-12">
              <Suspense fallback={<LoadingSpinner />}>
                <Stats />
              </Suspense>
            </section>

            {/* How it works */}
            <section className="mb-12">
              <div className="card">
                <h2 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
                  How It Works
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-sui-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                      1
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Enter Address</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Paste your Sui wallet address in the input field above
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-sui-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                      2
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Submit Request</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Click the request button and wait for processing
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-sui-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                      3
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Receive Tokens</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Get your SUI testnet tokens within 30 seconds
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="mb-12">
              <div className="card">
                <h2 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      How many tokens can I request?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      You can request up to 1 SUI per wallet address every 15 minutes.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      How long does it take to receive tokens?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Tokens are typically sent within 30 seconds of your request.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      What network are these tokens for?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      These are SUI testnet tokens for development and testing purposes only.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Can I use these tokens on mainnet?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      No, these are testnet tokens and have no value on mainnet.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </WalletKitProvider>
  );
} 