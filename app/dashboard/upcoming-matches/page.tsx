'use client';

import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';

interface Match {
  id: string;
  home_team: string;
  away_team: string;
  league: string;
  match_date: string;
  home_odds: number;
  draw_odds: number;
  away_odds: number;
  status: string;
}

export default function UpcomingMatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'tomorrow'>('all');
  const [refreshing, setRefreshing] = useState(false);

  const fetchMatches = async (filter: 'all' | 'today' | 'tomorrow' = 'all') => {
    try {
      setLoading(true);
      setError('');

      const apiUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/fetch-matches${filter !== 'all' ? `?date=${filter}` : ''}`;
      const headers = {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, { headers });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to fetch matches' }));
        console.error('API Error:', errorData);
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to fetch matches`);
      }

      const data = await response.json();
      console.log('Fetched matches:', data);
      setMatches(data.matches || []);
    } catch (err: any) {
      console.error('Error fetching matches:', err);
      setError(err.message || 'Failed to load matches');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMatches(dateFilter);
  }, [dateFilter]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMatches(dateFilter);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const matchDate = new Date(date);
    matchDate.setHours(0, 0, 0, 0);

    if (matchDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (matchDate.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    }

    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Upcoming Matches
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Real-time football matches with betting odds
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 bg-beteasy-lime hover:bg-beteasy-lime-dark text-white font-bold px-6 py-3 rounded-xl transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setDateFilter('all')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              dateFilter === 'all'
                ? 'bg-beteasy-lime text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-beteasy-lime'
            }`}
          >
            All Matches
          </button>
          <button
            onClick={() => setDateFilter('today')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              dateFilter === 'today'
                ? 'bg-beteasy-lime text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-beteasy-lime'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setDateFilter('tomorrow')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              dateFilter === 'tomorrow'
                ? 'bg-beteasy-lime text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-beteasy-lime'
            }`}
          >
            Tomorrow
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-beteasy-lime"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 flex items-start">
          <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-red-800 dark:text-red-200 font-semibold mb-1">Error Loading Matches</h3>
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        </div>
      ) : matches.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            No Matches Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            There are no upcoming matches for the selected filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => (
            <div
              key={match.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-beteasy-lime transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                    {match.league}
                  </span>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(match.match_date)}</span>
                    <span className="mx-1">•</span>
                    <span>{formatTime(match.match_date)}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {match.home_team}
                    </h3>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">vs</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {match.away_team}
                  </h3>
                </div>

                <div className="border-l border-gray-200 dark:border-gray-700 pl-6">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-beteasy-lime" />
                    <h4 className="font-bold text-gray-900 dark:text-white">Odds</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Home</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{match.home_odds}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Draw</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{match.draw_odds}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Away</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{match.away_odds}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
