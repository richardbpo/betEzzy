'use client';

import { Coins, TrendingUp } from 'lucide-react';

export default function TokensPage() {
  const plans = [
    {
      name: 'Daily Plan',
      tokens: 5,
      price: '$4.99',
      description: 'Perfect for casual predictors',
      features: ['5 Predictions', 'Basic Analytics', '24h Support']
    },
    {
      name: 'Weekly Plan',
      tokens: 50,
      price: '$39.99',
      description: 'Best value for regular users',
      features: ['50 Predictions', 'Advanced Analytics', 'Priority Support', 'Save 20%'],
      popular: true
    },
    {
      name: 'Monthly Plan',
      tokens: 200,
      price: '$129.99',
      description: 'For serious predictors',
      features: ['200 Predictions', 'Premium Analytics', '24/7 Priority Support', 'Save 35%']
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Token Plans</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Choose the perfect plan for your prediction needs
        </p>
      </div>

      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm font-medium">Available Tokens</p>
            <p className="text-4xl font-bold mt-1">0</p>
          </div>
          <div className="bg-white/20 p-4 rounded-xl">
            <Coins className="w-8 h-8" />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 p-6 relative ${
              plan.popular
                ? 'border-green-500 dark:border-green-600'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {plan.name}
              </h3>
              <div className="flex items-baseline justify-center">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  {plan.price}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
                {plan.description}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-center text-gray-700 dark:text-gray-300">
                  <TrendingUp className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <button
              className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                plan.popular
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
              }`}
            >
              Purchase Tokens
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
