'use client';


import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trophy, TrendingUp, Coins, Target, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthProvider';
import { supabase } from '@/lib/supabase-client';
import { Match, Token } from '@/types';
import DashboardLayout from '@/components/DashboardLayout';

export default function DashboardHome() {
  const { profile } = useAuth();
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [activeTokens, setActiveTokens] = useState<Token | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [matchesRes, tokensRes] = await Promise.all([
        supabase
          .from('matches')
          .select('*')
          .eq('status', 'upcoming')
          .order('match_date', { ascending: true })
          .limit(3),
        supabase
          .from('tokens')
          .select('*')
          .eq('user_id', profile?.id)
          .eq('status', 'active')
          .gt('remaining', 0)
          .maybeSingle()
      ]);

      if (matchesRes.data) setUpcomingMatches(matchesRes.data);
      if (tokensRes.data) setActiveTokens(tokensRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      icon: Trophy,
      label: 'Win Rate',
      value: `${profile?.win_rate.toFixed(1)}%`,
      color: 'from-green-500 to-green-600',
      textColor: 'text-green-600 dark:text-green-400'
    },
    {
      icon: Target,
      label: 'Total Predictions',
      value: profile?.total_predictions || 0,
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: TrendingUp,
      label: 'Correct Picks',
      value: profile?.correct_predictions || 0,
      color: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      icon: Coins,
      label: 'Available Tokens',
      value: activeTokens?.remaining || 0,
      color: 'from-orange-500 to-orange-600',
      textColor: 'text-orange-600 dark:text-orange-400'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {profile?.full_name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with your predictions today
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-xl`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upcoming Matches</h2>
              <Link
                href="/dashboard/predictions"
                className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm font-semibold flex items-center"
              >
                View all
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-700 h-20 rounded-xl" />
                ))}
              </div>
            ) : upcomingMatches.length > 0 ? (
              <div className="space-y-4">
                {upcomingMatches.map((match) => (
                  <Link
                    key={match.id}
                    href="/dashboard/predictions"
                    className="block bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{match.league}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(match.match_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white">{match.home_team}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">vs {match.away_team}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Odds</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {match.home_odds} / {match.draw_odds} / {match.away_odds}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No upcoming matches available
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
            <h2 className="text-2xl font-bold mb-4">Need More Tokens?</h2>
            <p className="mb-6 text-white/90">
              Purchase tokens to continue making predictions and track your winning streak!
            </p>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/90">Daily Plan</span>
                <span className="text-2xl font-bold">5 Tokens</span>
              </div>
              <p className="text-sm text-white/75">Perfect for casual predictors</p>
            </div>
            <Link
              href="/dashboard/tokens"
              className="block w-full bg-white text-green-600 font-bold py-3 rounded-xl text-center hover:bg-gray-100 transition-colors"
            >
              Purchase Tokens
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/dashboard/predictions"
              className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-4 hover:from-green-600 hover:to-green-700 transition-all"
            >
              <TrendingUp className="w-8 h-8 mb-2" />
              <p className="font-semibold mb-1">Make Prediction</p>
              <p className="text-sm text-white/80">Predict upcoming matches</p>
            </Link>
            <Link
              href="/dashboard/history"
              className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4 hover:from-blue-600 hover:to-blue-700 transition-all"
            >
              <Trophy className="w-8 h-8 mb-2" />
              <p className="font-semibold mb-1">View History</p>
              <p className="text-sm text-white/80">See your past predictions</p>
            </Link>
            <Link
              href="/dashboard/support"
              className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4 hover:from-purple-600 hover:to-purple-700 transition-all"
            >
              <Target className="w-8 h-8 mb-2" />
              <p className="font-semibold mb-1">Get Support</p>
              <p className="text-sm text-white/80">Contact our team</p>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
