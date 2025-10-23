'use client';


import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthProvider';
import { supabase } from '@/lib/supabase-client';

interface PredictionWithUser {
  id: string;
  user_id: string;
  match_id: string | null;
  home_team: string;
  away_team: string;
  league: string;
  home_odds: number;
  draw_odds: number;
  away_odds: number;
  predicted_result: string;
  confidence: number;
  result_status: string;
  created_at: string;
  profiles: {
    username: string;
    full_name: string;
  };
}

export default function AdminPredictionsPage() {
  const { profile } = useAuth();
  const [predictions, setPredictions] = useState<PredictionWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'won' | 'lost'>('all');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (profile?.role === 'system_admin' || profile?.role === 'manager') {
      fetchPredictions();
    }
  }, [profile, filter]);

  const fetchPredictions = async () => {
    try {
      let query = supabase
        .from('predictions')
        .select(`
          *,
          profiles:user_id (username, full_name)
        `)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('result_status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPredictions(data || []);
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePredictionStatus = async (predictionId: string, status: 'won' | 'lost') => {
    setUpdating(predictionId);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('predictions')
        .update({ result_status: status })
        .eq('id', predictionId);

      if (error) throw error;

      setMessage({ type: 'success', text: `Prediction marked as ${status}!` });
      await fetchPredictions();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update prediction' });
    } finally {
      setUpdating(null);
    }
  };

  const getResultLabel = (result: string, prediction: PredictionWithUser) => {
    if (result === 'home_win') return prediction.home_team;
    if (result === 'away_win') return prediction.away_team;
    return 'Draw';
  };

  if (profile?.role !== 'system_admin' && profile?.role !== 'manager') {
    return (
      <div>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-500/50 rounded-xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Access Denied</h2>
            <p className="text-red-600 dark:text-red-500">
              You need admin privileges to access this page.
            </p>
          </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Manage Predictions
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Update prediction results for all users
          </p>
        </div>

        {message && (
          <div className={`border rounded-xl p-4 flex items-start ${
            message.type === 'success'
              ? 'bg-green-500/10 border-green-500/50'
              : 'bg-red-500/10 border-red-500/50'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            )}
            <p className={message.type === 'success' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
              {message.text}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          {(['all', 'pending', 'won', 'lost'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === status
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-700 h-24 rounded-xl" />
              ))}
            </div>
          ) : predictions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Match
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Prediction
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Odds
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {predictions.map((prediction) => (
                    <tr key={prediction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {prediction.profiles?.full_name || 'Unknown'}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            @{prediction.profiles?.username || 'unknown'}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {prediction.home_team} vs {prediction.away_team}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {prediction.league}
                          </p>
                          {!prediction.match_id && (
                            <span className="inline-block mt-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded">
                              Manual
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {getResultLabel(prediction.predicted_result, prediction)}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {prediction.confidence}% confidence
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          <div>{prediction.home_odds} / {prediction.draw_odds} / {prediction.away_odds}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {prediction.result_status === 'won' && (
                          <div className="flex items-center text-green-600 dark:text-green-400">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            <span className="font-semibold">Won</span>
                          </div>
                        )}
                        {prediction.result_status === 'lost' && (
                          <div className="flex items-center text-red-600 dark:text-red-400">
                            <XCircle className="w-4 h-4 mr-1" />
                            <span className="font-semibold">Lost</span>
                          </div>
                        )}
                        {prediction.result_status === 'pending' && (
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Clock className="w-4 h-4 mr-1" />
                            <span className="font-semibold">Pending</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => updatePredictionStatus(prediction.id, 'won')}
                            disabled={updating === prediction.id || prediction.result_status === 'won'}
                            className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Won
                          </button>
                          <button
                            onClick={() => updatePredictionStatus(prediction.id, 'lost')}
                            disabled={updating === prediction.id || prediction.result_status === 'lost'}
                            className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Lost
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
              No predictions found.
            </div>
          )}
        </div>
    </div>
  );
}
