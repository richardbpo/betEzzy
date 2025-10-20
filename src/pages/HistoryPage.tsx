import { useEffect, useState } from 'react';
import { Trophy, TrendingUp, X, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Prediction } from '../types';
import DashboardLayout from '../components/DashboardLayout';

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

  const getResultLabel = (result: string, match: any) => {
    if (result === 'home_win') return match.home_team;
    if (result === 'away_win') return match.away_team;
    return 'Draw';
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
              {predictions.map((prediction) => (
                <div key={prediction.id} className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white mb-1">
                        {prediction.match?.home_team} vs {prediction.match?.away_team}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {prediction.match?.league}
                      </p>
                    </div>
                    {prediction.is_correct !== null && (
                      <div className={`flex items-center px-3 py-1 rounded-full ${
                        prediction.is_correct
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      }`}>
                        {prediction.is_correct ? (
                          <Check className="w-4 h-4 mr-1" />
                        ) : (
                          <X className="w-4 h-4 mr-1" />
                        )}
                        <span className="text-sm font-semibold">
                          {prediction.is_correct ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Your Prediction</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {getResultLabel(prediction.predicted_result, prediction.match)}
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
              ))}
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
