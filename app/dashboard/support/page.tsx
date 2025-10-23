'use client';

import { useState } from 'react';
import { LifeBuoy, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthProvider';
import { supabase } from '@/lib/supabase-client';
import { TicketSeverity } from '@/types';
import DashboardLayout from '@/components/DashboardLayout';

export default function SupportPage() {
  const { profile } = useAuth();
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<TicketSeverity>('medium');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.from('tickets').insert([
        {
          user_id: profile?.id,
          subject,
          description,
          severity,
        },
      ]);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Support ticket submitted successfully!' });
      setSubject('');
      setDescription('');
      setSeverity('medium');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to submit ticket' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Support Center
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Need help? Submit a support ticket and our team will assist you
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
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            )}
            <p className={message.type === 'success' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
              {message.text}
            </p>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-6">
            <div className="bg-gradient-to-br from-green-400 to-green-600 p-3 rounded-xl mr-3">
              <LifeBuoy className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Submit a Support Ticket
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Brief description of your issue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'low' as TicketSeverity, label: 'Low', color: 'blue' },
                  { value: 'medium' as TicketSeverity, label: 'Medium', color: 'yellow' },
                  { value: 'high' as TicketSeverity, label: 'High', color: 'red' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSeverity(option.value)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      severity === option.value
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-300 dark:border-gray-700 hover:border-green-500/50'
                    }`}
                  >
                    <span className="font-semibold text-gray-900 dark:text-white">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={6}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                placeholder="Please provide as much detail as possible about your issue"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? 'Submitting...' : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Submit Ticket
                </>
              )}
            </button>
          </form>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            Common Questions
          </h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li>• How do I purchase tokens?</li>
            <li>• What happens if my prediction is incorrect?</li>
            <li>• How is my win rate calculated?</li>
            <li>• Can I get a refund on unused tokens?</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
