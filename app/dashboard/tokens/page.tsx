'use client';

import { useState } from 'react';
import { Coins, Check } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthProvider';
import { SubscriptionPeriod } from '@/types';

export default function TokensPage() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const plans = [
    {
      name: 'Daily',
      period: 'daily' as SubscriptionPeriod,
      tokens: 5,
      price: 1000,
      popular: false,
    },
    {
      name: 'Weekly',
      period: 'weekly' as SubscriptionPeriod,
      tokens: 40,
      price: 5000,
      popular: true,
    },
    {
      name: 'Monthly',
      period: 'monthly' as SubscriptionPeriod,
      tokens: 200,
      price: 20000,
      popular: false,
    },
  ];

  const handlePurchase = async (period: SubscriptionPeriod, amount: number, price: number) => {
    if (!profile) return;

    setLoading(true);
    setMessage('');

    try {
      const expiryDate = new Date();
      if (period === 'daily') expiryDate.setDate(expiryDate.getDate() + 1);
      else if (period === 'weekly') expiryDate.setDate(expiryDate.getDate() + 7);
      else expiryDate.setMonth(expiryDate.getMonth() + 1);

      const { error } = await supabase.from('tokens').insert([
        {
          user_id: profile.id,
          token_type: 'standard',
          subscription_period: period,
          amount,
          remaining: amount,
          price_paid: price,
          status: 'pending',
          expiry_date: expiryDate.toISOString(),
        },
      ]);

      if (error) throw error;

      setMessage('Token request submitted! Please complete payment and wait for admin approval.');
    } catch (error: any) {
      setMessage('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Purchase Tokens
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Choose a plan that fits your prediction needs
          </p>
        </div>

        {message && (
          <div className="bg-green-500/10 border border-green-500/50 rounded-xl p-4">
            <p className="text-green-700 dark:text-green-400">{message}</p>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.period}
              className={`bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 ${
                plan.popular
                  ? 'border-green-500'
                  : 'border-gray-200 dark:border-gray-700'
              } relative`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}
              <div className="text-center mb-6">
                <div className="bg-gradient-to-br from-green-400 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Coins className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-4xl font-bold text-green-600 dark:text-green-400 mb-1">
                  {plan.tokens}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tokens</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>{plan.tokens} predictions</span>
                </div>
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>AI-powered insights</span>
                </div>
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Valid for {plan.period}</span>
                </div>
              </div>

              <div className="text-center mb-4">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  UGX {plan.price.toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => handlePurchase(plan.period, plan.tokens, plan.price)}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Purchase Now'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
