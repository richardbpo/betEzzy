'use client';

import { Mail, Shield, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthProvider';

export default function ProfilePage() {
  const { profile } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {profile?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {profile?.username || 'User'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {profile?.role || 'Member'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Full Name</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {profile?.full_name || 'Not available'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Role</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {profile?.role || 'Member'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Member Since</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Account Statistics
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400">Win Rate</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {profile?.win_rate || 0}%
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Predictions</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {profile?.total_predictions || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
