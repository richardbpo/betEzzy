'use client';

import Link from 'next/link';
import { Trophy, TrendingUp, Shield, Users, ArrowRight, Star, CheckCircle, Sun, Moon, Zap, Target } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeProvider';

export const dynamic = 'force-dynamic';

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <nav className="bg-gray-900 dark:bg-black border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-beteasy-lime p-2 rounded-lg">
                <Trophy className="w-6 h-6 text-gray-900" />
              </div>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-white">bet</span>
                <span className="text-2xl font-bold text-beteasy-lime">Easy</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <Link
                href="/login"
                className="text-white hover:text-beteasy-lime transition-colors px-4 py-2 font-semibold"
              >
                LOGIN
              </Link>
              <Link
                href="/register"
                className="bg-beteasy-lime hover:bg-beteasy-lime-dark text-gray-900 font-bold px-6 py-2 rounded transition-all uppercase text-sm"
              >
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 dark:from-red-900 dark:via-red-800 dark:to-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(164, 208, 55, 0.3) 0%, transparent 50%)',
          }}></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 80% 50%, rgba(164, 208, 55, 0.3) 0%, transparent 50%)',
          }}></div>
        </div>

        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-beteasy-lime/10 border border-beteasy-lime/30 text-beteasy-lime px-4 py-2 rounded-full mb-8">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-semibold">AI-Powered Predictions</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
              Win Smarter with
              <span className="block text-beteasy-lime">Data-Driven Insights</span>
            </h1>

            <p className="text-xl text-gray-200 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
              Transform your betting strategy with advanced analytics, real-time predictions,
              and expert insights. Join thousands of successful bettors.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/register"
                className="bg-beteasy-lime hover:bg-beteasy-lime-dark text-gray-900 font-bold px-8 py-4 rounded-lg transition-all flex items-center justify-center space-x-2 text-lg uppercase"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/login"
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-lg transition-all backdrop-blur-sm border border-white/20"
              >
                Sign In
              </Link>
            </div>

            <div className="flex items-center justify-center gap-8 text-white/80">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-beteasy-lime" />
                <span>No Credit Card</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-beteasy-lime" />
                <span>Free Tokens</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-beteasy-lime" />
                <span>Cancel Anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose BetEasy?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Everything you need to make informed betting decisions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700">
              <div className="bg-beteasy-lime/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-beteasy-lime" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Accurate Predictions
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Advanced algorithms analyze team stats, form, and historical data for precise predictions.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700">
              <div className="bg-beteasy-lime/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-beteasy-lime" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Real-Time Analysis
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get instant updates and insights on matches as odds and conditions change.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700">
              <div className="bg-beteasy-lime/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-beteasy-lime" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Risk Management
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Smart bet sizing and portfolio management to protect your bankroll.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700">
              <div className="bg-beteasy-lime/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-beteasy-lime" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Community Insights
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Learn from expert bettors and share strategies with our community.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-900 dark:bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-beteasy-lime/10 border border-beteasy-lime/30 text-beteasy-lime px-4 py-2 rounded-full mb-8">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-semibold">Trusted by Thousands</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Betting?
            </h2>

            <p className="text-xl text-gray-300 mb-10">
              Join our community today and start making data-driven decisions
            </p>

            <Link
              href="/register"
              className="inline-flex items-center space-x-2 bg-beteasy-lime hover:bg-beteasy-lime-dark text-gray-900 font-bold px-10 py-5 rounded-lg transition-all text-lg uppercase"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-black dark:bg-gray-950 text-gray-400 py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-beteasy-lime p-1.5 rounded">
                  <Trophy className="w-4 h-4 text-gray-900" />
                </div>
                <div className="flex items-center">
                  <span className="text-lg font-bold text-white">bet</span>
                  <span className="text-lg font-bold text-beteasy-lime">Easy</span>
                </div>
              </div>
              <p className="text-sm">
                AI-powered football predictions to help you win smarter.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/dashboard/predictions" className="hover:text-beteasy-lime transition-colors">Predictions</Link></li>
                <li><Link href="/dashboard/upcoming-matches" className="hover:text-beteasy-lime transition-colors">Matches</Link></li>
                <li><Link href="/dashboard/tokens" className="hover:text-beteasy-lime transition-colors">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-beteasy-lime transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-beteasy-lime transition-colors">Contact</a></li>
                <li><Link href="/dashboard/support" className="hover:text-beteasy-lime transition-colors">Support</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-beteasy-lime transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-beteasy-lime transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-beteasy-lime transition-colors">Responsible Betting</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-sm text-center">
            <p>&copy; 2024 BetEasy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
