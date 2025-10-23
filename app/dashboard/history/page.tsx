'use client';


import { useEffect, useState } from 'react';
import { Trophy, TrendingUp, X, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthProvider';
import { supabase } from '@/lib/supabase-client';
import { Prediction } from '@/types';
import DashboardLayout from '@/components/DashboardLayout';

export default function HistoryPage() {
  const { profile } = useAuth();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      const { data, error } = await supabase
        .from('predictions')
        .select(`
          *,
          match:matches(*)
        `)
        .eq('user_id', profile?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPredictions(data || []);
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getResultLabel = (result: string, prediction: any) => {
    const homeTeam = prediction.home_team || prediction.match?.home_team;
    const awayTeam = prediction.away_team || prediction.match?.away_team;

    if (result === 'home_win') return homeTeam;
    if (result === 'away_win') return awayTeam;
    return 'Draw';
  };

  const getResultStatusBadge = (status: string) => {
    if (status === 'won') {
      return (
        <div className="flex items-center px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
          <Check className="w-4 h-4 mr-1" />
          <span className="text-sm font-semibold">Won</span>
        </div>
      );
    } else if (status === 'lost') {
      return (
        <div className="flex items-center px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
          <X className="w-4 h-4 mr-1" />
          <span className="text-sm font-semibold">Lost</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400">
          <span className="text-sm font-semibold">Pending</span>
        </div>
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Prediction History
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your prediction performance and win rate
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6">
            <Trophy className="w-8 h-8 mb-2" />
            <p className="text-sm opacity-90 mb-1">Win Rate</p>
            <p className="text-3xl font-bold">{profile?.win_rate.toFixed(1)}%</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6">
            <TrendingUp className="w-8 h-8 mb-2" />
            <p className="text-sm opacity-90 mb-1">Total Predictions</p>
            <p className="text-3xl font-bold">{profile?.total_predictions || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6">
            <Check className="w-8 h-8 mb-2" />
            <p className="text-sm opacity-90 mb-1">Correct</p>
            <p className="text-3xl font-bold">{profile?.correct_predictions || 0}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-700 h-20 rounded-xl" />
              ))}
            </div>
          ) : predictions.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {predictions.map((prediction) => {
                const homeTeam = prediction.home_team || prediction.match?.home_team;
                const awayTeam = prediction.away_team || prediction.match?.away_team;
                const league = prediction.league || prediction.match?.league;

                return (
                  <div key={prediction.id} className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white mb-1">
                          {homeTeam} vs {awayTeam}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {league}
                        </p>
                        {!prediction.match_id && (
                          <span className="inline-block mt-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded">
                            Manual Entry
                          </span>
                        )}
                      </div>
                      {getResultStatusBadge(prediction.result_status || 'pending')}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Your Prediction</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {getResultLabel(prediction.predicted_result, prediction)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Confidence</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {prediction.confidence}%
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                      {new Date(prediction.created_at).toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
              No predictions yet. Start predicting to see your history!
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
