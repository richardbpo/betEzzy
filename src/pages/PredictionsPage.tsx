import { useEffect, useState } from 'react';
import { Trophy, AlertCircle, CheckCircle, TrendingUp, Search, RefreshCw, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Match, Token, MatchResult } from '../types';
import DashboardLayout from '../components/DashboardLayout';
import { calculateLuckySector } from '../utils/predictionAlgorithm';

export default function PredictionsPage() {
  const { profile } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [activeTokens, setActiveTokens] = useState<Token | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [prediction, setPrediction] = useState<MatchResult | ''>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedMatch, setSearchedMatch] = useState<Match | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMatches(matches);
      setSearchedMatch(null);
    } else {
      const filtered = matches.filter(
        (match) =>
          match.home_team.toLowerCase().includes(searchQuery.toLowerCase()) ||
          match.away_team.toLowerCase().includes(searchQuery.toLowerCase()) ||
          match.league.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMatches(filtered);
    }
  }, [searchQuery, matches]);

  const fetchData = async () => {
    try {
      const [matchesRes, tokensRes] = await Promise.all([
        supabase
          .from('matches')
          .select('*')
          .eq('status', 'upcoming')
          .order('match_date', { ascending: true }),
        supabase
          .from('tokens')
          .select('*')
          .eq('user_id', profile?.id)
          .eq('status', 'active')
          .gt('remaining', 0)
          .maybeSingle()
      ]);

      if (matchesRes.data) {
        setMatches(matchesRes.data);
        setFilteredMatches(matchesRes.data);
      }
      if (tokensRes.data) setActiveTokens(tokensRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshMatches = async () => {
    setRefreshing(true);
    setMessage(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-matches`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch matches');
      }

      setMessage({ type: 'success', text: 'Upcoming matches updated successfully!' });
      await fetchData();
    } catch (error) {
      console.error('Error refreshing matches:', error);
      setMessage({ type: 'error', text: 'Failed to update matches. Please try again.' });
    } finally {
      setRefreshing(false);
    }
  };

  const handleSearchTeam = async () => {
    if (!searchQuery.trim()) {
      setMessage({ type: 'error', text: 'Please enter a team name to search' });
      return;
    }

    setSearchLoading(true);
    setSearchedMatch(null);

    const filtered = matches.filter(
      (match) =>
        match.home_team.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.away_team.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filtered.length > 0) {
      setSearchedMatch(filtered[0]);
      setFilteredMatches(filtered);
    } else {
      setMessage({ type: 'error', text: `No upcoming matches found for "${searchQuery}"` });
    }

    setSearchLoading(false);
  };

  const handlePredictSearchedMatch = () => {
    if (searchedMatch) {
      handleSelectMatch(searchedMatch);
    }
  };

  const calculatePrediction = (match: Match): { result: MatchResult; confidence: number } => {
    const homeProb = (1 / match.home_odds) * 100;
    const drawProb = (1 / match.draw_odds) * 100;
    const awayProb = (1 / match.away_odds) * 100;

    let result: MatchResult;
    let confidence: number;

    if (homeProb > drawProb && homeProb > awayProb) {
      result = 'home_win';
      confidence = homeProb;
    } else if (awayProb > homeProb && awayProb > drawProb) {
      result = 'away_win';
      confidence = awayProb;
    } else {
      result = 'draw';
      confidence = drawProb;
    }

    return { result, confidence: Math.round(confidence) };
  };

  const handleSelectMatch = (match: Match) => {
    setSelectedMatch(match);
    const aiPrediction = calculatePrediction(match);
    setPrediction(aiPrediction.result);
    setMessage(null);
  };

  const handleSubmitPrediction = async () => {
    if (!selectedMatch || !prediction || !activeTokens) return;

    setSubmitting(true);
    setMessage(null);

    try {
      const { error: predictionError } = await supabase.from('predictions').insert([
        {
          user_id: profile?.id,
          match_id: selectedMatch.id,
          predicted_result: prediction,
          confidence: calculatePrediction(selectedMatch).confidence,
          token_used: activeTokens.id,
        },
      ]);

      if (predictionError) throw predictionError;

      const { error: tokenError } = await supabase
        .from('tokens')
        .update({ remaining: activeTokens.remaining - 1 })
        .eq('id', activeTokens.id);

      if (tokenError) throw tokenError;

      setMessage({ type: 'success', text: 'Prediction submitted successfully!' });
      setSelectedMatch(null);
      setPrediction('');
      setSearchQuery('');
      setSearchedMatch(null);
      await fetchData();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to submit prediction' });
    } finally {
      setSubmitting(false);
    }
  };

  const getResultLabel = (result: MatchResult, match: Match) => {
    if (result === 'home_win') return `${match.home_team} Win`;
    if (result === 'away_win') return `${match.away_team} Win`;
    return 'Draw';
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Match Predictions
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Use AI-powered insights to predict match outcomes
            </p>
          </div>
          {activeTokens && (
            <div className="bg-green-500 text-white px-6 py-3 rounded-xl">
              <p className="text-sm opacity-90">Available Tokens</p>
              <p className="text-2xl font-bold">{activeTokens.remaining}</p>
            </div>
          )}
        </div>

        {!activeTokens && (
          <div className="bg-orange-500/10 border border-orange-500/50 rounded-xl p-4 flex items-start">
            <AlertCircle className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-orange-700 dark:text-orange-400 font-semibold">No Active Tokens</p>
              <p className="text-orange-600 dark:text-orange-500 text-sm mt-1">
                Purchase tokens to start making predictions
              </p>
            </div>
          </div>
        )}

        {message && (
          <div className={`border rounded-xl p-4 flex items-start ${
            message.type === 'success'
              ? 'bg-green-500/10 border-green-500/50'
              : 'bg-red-500/10 border-red-500/50'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            )}
            <p className={message.type === 'success' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
              {message.text}
            </p>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Search Team</h2>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchTeam()}
                placeholder="Search for a team (e.g., Arsenal, Barcelona, Man United)"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              onClick={handleSearchTeam}
              disabled={searchLoading}
              className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {searchLoading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {searchedMatch && (
            <div className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-500/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{searchedMatch.league}</p>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {searchedMatch.home_team} vs {searchedMatch.away_team}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(searchedMatch.match_date).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={handlePredictSearchedMatch}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl transition-all"
                >
                  <Sparkles className="w-5 h-5" />
                  Predict
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-sm mt-3">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-2">
                  <p className="text-gray-500 dark:text-gray-400">Home</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{searchedMatch.home_odds}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-2">
                  <p className="text-gray-500 dark:text-gray-400">Draw</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{searchedMatch.draw_odds}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-2">
                  <p className="text-gray-500 dark:text-gray-400">Away</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{searchedMatch.away_odds}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-green-500" />
                Upcoming Matches
              </h2>
              <button
                onClick={handleRefreshMatches}
                disabled={refreshing}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Updating...' : 'Update'}
              </button>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-700 h-24 rounded-xl" />
                ))}
              </div>
            ) : filteredMatches.length > 0 ? (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredMatches.map((match) => {
                  const aiPrediction = calculatePrediction(match);
                  const isSelected = selectedMatch?.id === match.id;

                  return (
                    <div
                      key={match.id}
                      onClick={() => handleSelectMatch(match)}
                      className={`border rounded-xl p-4 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-green-500/50 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{match.league}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(match.match_date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="font-semibold text-gray-900 dark:text-white mb-1">
                        {match.home_team} vs {match.away_team}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-gray-600 dark:text-gray-400">
                          Odds: {match.home_odds} / {match.draw_odds} / {match.away_odds}
                        </div>
                        <div className="flex items-center text-green-600 dark:text-green-400">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          {aiPrediction.confidence}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                No upcoming matches available
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Make Your Prediction
            </h2>

            {selectedMatch ? (
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{selectedMatch.league}</p>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    {selectedMatch.home_team} vs {selectedMatch.away_team}
                  </h3>
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Home</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{selectedMatch.home_odds}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Draw</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{selectedMatch.draw_odds}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Away</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{selectedMatch.away_odds}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-500/30">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                    <p className="font-semibold text-green-800 dark:text-green-300">AI Prediction</p>
                  </div>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-400 mb-1">
                    {getResultLabel(calculatePrediction(selectedMatch).result, selectedMatch)}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-500 mb-3">
                    Confidence: {calculatePrediction(selectedMatch).confidence}%
                  </p>
                  <div className="border-t border-green-200 dark:border-green-800 pt-3 mt-3">
                    <p className="text-xs text-green-700 dark:text-green-400 font-medium mb-1">Lucky Sector:</p>
                    <p className="text-sm text-green-800 dark:text-green-300">
                      {calculateLuckySector(selectedMatch.home_odds, selectedMatch.draw_odds, selectedMatch.away_odds)}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Your Prediction
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'home_win' as MatchResult, label: `${selectedMatch.home_team} Win` },
                      { value: 'draw' as MatchResult, label: 'Draw' },
                      { value: 'away_win' as MatchResult, label: `${selectedMatch.away_team} Win` },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setPrediction(option.value)}
                        className={`w-full p-4 rounded-xl border-2 transition-all ${
                          prediction === option.value
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                            : 'border-gray-200 dark:border-gray-700 hover:border-green-500/50'
                        }`}
                      >
                        <p className="font-semibold text-gray-900 dark:text-white">{option.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSubmitPrediction}
                  disabled={!prediction || !activeTokens || submitting}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit Prediction (1 Token)'}
                </button>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                Select a match to make your prediction
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
