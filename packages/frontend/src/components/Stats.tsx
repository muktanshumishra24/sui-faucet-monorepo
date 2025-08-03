'use client';

import { useQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { CountUp } from 'react-countup';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Users, Coins, Zap, Globe, Clock } from 'lucide-react';
import { faucetApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatNumber, formatAmount } from '@/lib/utils';

interface StatsData {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  successRate: string;
  totalTokensDistributed: string;
  averageResponseTime: number;
  requestsToday: number;
  requestsThisWeek: number;
  requestsThisMonth: number;
  topRequestedAddresses: Array<{ address: string; count: number }>;
  topRequestingCountries: Array<{ country: string; count: number }>;
  faucetBalance: {
    address: string;
    balance: string;
    coinType: string;
  };
  lastUpdated: string;
}

export function Stats() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { data: stats, isLoading, error } = useQuery<StatsData>({
    queryKey: ['faucet-stats'],
    queryFn: async () => {
      const response = await faucetApi.get('/stats');
      return response.data.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">Failed to load statistics</p>
      </Card>
    );
  }

  const statCards = [
    {
      title: 'Total Requests',
      value: stats.totalRequests,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Success Rate',
      value: parseFloat(stats.successRate),
      suffix: '%',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Tokens Distributed',
      value: formatAmount(stats.totalTokensDistributed),
      suffix: ' SUI',
      icon: Coins,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
    {
      title: 'Avg Response Time',
      value: stats.averageResponseTime,
      suffix: 'ms',
      icon: Zap,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ];

  const recentActivity = [
    { name: 'Today', requests: stats.requestsToday },
    { name: 'This Week', requests: stats.requestsThisWeek },
    { name: 'This Month', requests: stats.requestsThisMonth },
  ];

  return (
    <div ref={ref} className="space-y-8">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  <CountUp
                    end={stat.value}
                    duration={2}
                    decimals={stat.title === 'Success Rate' ? 1 : 0}
                    suffix={stat.suffix}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Last updated: {new Date(stats.lastUpdated).toLocaleTimeString()}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={recentActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="requests" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Countries Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Top Countries</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.topRequestingCountries.slice(0, 5).map((country, index) => (
                  <div key={country.country} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full bg-sui-500 flex items-center justify-center">
                        <span className="text-xs text-white font-bold">{index + 1}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {country.country}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-sui-500 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${(country.count / Math.max(...stats.topRequestingCountries.map(c => c.count))) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400 w-8 text-right">
                        {country.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Faucet Balance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="bg-gradient-to-r from-sui-50 to-sui-100 dark:from-sui-900/20 dark:to-sui-800/20 border-sui-200 dark:border-sui-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Coins className="h-5 w-5 text-sui-600" />
              <span>Faucet Balance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Address</p>
                <p className="font-mono text-sm text-gray-900 dark:text-white">
                  {stats.faucetBalance.address.slice(0, 8)}...{stats.faucetBalance.address.slice(-6)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Balance</p>
                <p className="text-lg font-bold text-sui-600">
                  {formatAmount(stats.faucetBalance.balance)} SUI
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Coin Type</p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {stats.faucetBalance.coinType}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 