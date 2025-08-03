import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sui Testnet Faucet',
  description: 'Get SUI testnet tokens quickly and easily. Built for developers and builders in the Sui ecosystem.',
  keywords: ['sui', 'faucet', 'testnet', 'blockchain', 'cryptocurrency', 'tokens'],
  authors: [{ name: 'Sui Faucet Team' }],
  creator: 'Sui Faucet Team',
  publisher: 'Sui Faucet Team',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Sui Testnet Faucet',
    description: 'Get SUI testnet tokens quickly and easily. Built for developers and builders in the Sui ecosystem.',
    siteName: 'Sui Testnet Faucet',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Sui Testnet Faucet',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sui Testnet Faucet',
    description: 'Get SUI testnet tokens quickly and easily. Built for developers and builders in the Sui ecosystem.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster
              position="top-right"
              richColors
              closeButton
              duration={5000}
            />
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
} 