'use client';

import { useState } from 'react';
import { Search, Trophy, Calendar, TrendingUp } from 'lucide-react';

interface MatchOdds {
  homeTeam: string;
  awayTeam: string;
  homeOdds: string;
  drawOdds: string;
  awayOdds: string;
  matchDate: string;
  league: string;
}

export default function TeamSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [matchData, setMatchData] = useState<MatchOdds | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a team name');
      return;
    }

    setLoading(true);
    setError('');
    setMatchData(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockData: MatchOdds = {
        homeTeam: searchQuery,
        awayTeam: 'Liverpool',
        homeOdds: '1.80',
        drawOdds: '3.58',
        awayOdds: '2.91',
        matchDate: '2025-10-20',
        league: 'Premier League'
      };

      setMatchData(mockData);
    } catch (err) {
      setError('Failed to fetch match data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Team Match Search
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Search for any team to find their next match and betting odds
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search for a team (e.g., Man U, Arsenal, Barcelona)"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-beteasy-lime"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-beteasy-lime hover:bg-beteasy-lime-dark text-gray-900 font-bold px-8 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500/50 rounded-xl p-4">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}
      </div>

      {matchData && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
            <Calendar className="w-4 h-4" />
            <span>{new Date(matchData.matchDate).toLocaleDateString('en-GB', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
            <span className="mx-2">•</span>
            <Trophy className="w-4 h-4" />
            <span>{matchData.league}</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
              Next Match
            </h2>
            <div className="flex items-center justify-center gap-4">
              <div className="text-right flex-1">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {matchData.homeTeam}
                </h3>
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-2xl font-bold">vs</div>
              <div className="text-left flex-1">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {matchData.awayTeam}
                </h3>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-beteasy-lime" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Betting Odds
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Home Win</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{matchData.homeOdds}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{matchData.homeTeam}</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Draw</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{matchData.drawOdds}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Draw</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Away Win</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{matchData.awayOdds}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{matchData.awayTeam}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-beteasy-lime/10 border border-beteasy-lime rounded-xl p-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
              <span className="font-semibold">Note:</span> Odds are provided for reference and may vary. Always check with your betting provider.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
