'use client';

import { Calendar } from 'lucide-react';

export default function UpcomingMatchesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Upcoming Matches</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          View all upcoming football matches and their details
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
            <Calendar className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Upcoming Matches
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            No upcoming matches available at the moment.
          </p>
        </div>
      </div>
    </div>
  );
}
