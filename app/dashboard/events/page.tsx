import { Calendar } from 'lucide-react';

import DashboardLayout from '@/components/DashboardLayout';

export default function EventsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Events & Training
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Join training sessions and coaching events to improve your prediction skills
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-12 text-center">
          <Calendar className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
          <p className="text-white/90">
            Event management and training registration will be available soon.
            Check back later for upcoming events!
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
