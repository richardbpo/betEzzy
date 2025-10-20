import { Link } from 'react-router-dom';
import { Trophy, TrendingUp, Shield, Users, ArrowRight, Star, CheckCircle, Sun, Moon, Zap, Target } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

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
                to="/login"
                className="text-white hover:text-beteasy-lime transition-colors px-4 py-2 font-semibold"
              >
                LOGIN
              </Link>
              <Link
                to="/register"
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
        </div>
        <div className="container mx-auto px-4 py-12 md:py-16 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-beteasy-lime/20 border border-beteasy-lime rounded px-4 py-2 mb-6">
                <Star className="w-4 h-4 text-beteasy-lime mr-2 fill-current" />
                <span className="text-white text-sm font-semibold uppercase">Record-Breaking Predictions</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
                3,979,035,800
                <span className="block text-3xl md:text-4xl text-beteasy-lime mt-2">UGX</span>
              </h1>
              <p className="text-2xl md:text-3xl text-white/90 mb-8 font-semibold">
                AI Prediction winners celebrated in East Africa
              </p>
              <Link
                to="/register"
                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded text-lg transition-all uppercase"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="text-center mb-6">
                    <div className="w-32 h-32 bg-gradient-to-br from-beteasy-lime to-beteasy-lime-dark rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Trophy className="w-16 h-16 text-gray-900" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Success Story</h3>
                    <p className="text-beteasy-lime font-semibold">Featured Winner</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Win Rate', value: '87%' },
                      { label: 'Total Wins', value: '234' },
                      { label: 'This Month', value: '45' },
                      { label: 'Earnings', value: '12M+' }
                    ].map((stat, index) => (
                      <div key={index} className="bg-white/10 rounded-lg p-4 text-center">
                        <p className="text-3xl font-bold text-beteasy-lime mb-1">{stat.value}</p>
                        <p className="text-white/80 text-sm">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-900 py-6 border-y border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {[
              { label: 'Live', count: '21', color: 'bg-red-500', icon: '📡' },
              { label: 'Premier League', count: '20', color: 'bg-beteasy-lime', icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
              { label: 'Serie A', count: '20', color: 'bg-beteasy-lime', icon: '🇮🇹' },
              { label: 'Bundesliga', count: '18', color: 'bg-beteasy-lime', icon: '🇩🇪' },
              { label: 'LaLiga', count: '20', color: 'bg-beteasy-lime', icon: '🇪🇸' },
              { label: 'Ligue 1', count: '18', color: 'bg-beteasy-lime', icon: '🇫🇷' }
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-3 bg-white dark:bg-gray-800 px-5 py-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-gray-900 dark:text-white font-semibold">{item.label}</span>
                <span className={`${item.color} text-white px-3 py-1 rounded-full text-sm font-bold`}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-900 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose <span className="text-beteasy-lime">BetEasy</span>?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Get AI-powered predictions - we predict for you!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: 'AI Predicts For You',
                description: 'Simply select a match and our AI will generate the prediction. No analysis needed on your part!',
                color: 'from-blue-500 to-blue-600'
              },
              {
                icon: Shield,
                title: 'Secure & Trusted',
                description: 'Bank-level security ensures your data and tokens are always protected.',
                color: 'from-beteasy-lime to-beteasy-lime-dark'
              },
              {
                icon: Users,
                title: 'Massive Community',
                description: 'Join over 100,000 successful users across Uganda, Kenya, Tanzania and beyond.',
                color: 'from-purple-500 to-purple-600'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 hover:border-beteasy-lime"
              >
                <div className={`bg-gradient-to-br ${feature.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-beteasy-lime py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
            Ready to Win Big?
          </h2>
          <p className="text-gray-900 text-xl mb-10 max-w-2xl mx-auto font-semibold">
            Join thousands of successful users across East Africa and start winning today
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="bg-gray-900 hover:bg-black text-white font-bold px-12 py-5 rounded text-lg transition-all uppercase inline-flex items-center"
            >
              Join Now Free
              <ArrowRight className="w-6 h-6 ml-2" />
            </Link>
            <Link
              to="/login"
              className="bg-white hover:bg-gray-100 text-gray-900 font-bold px-12 py-5 rounded text-lg transition-all uppercase"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 dark:bg-black border-t border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-beteasy-lime p-2 rounded-lg">
                  <Trophy className="w-5 h-5 text-gray-900" />
                </div>
                <div className="flex items-center">
                  <span className="text-xl font-bold text-white">bet</span>
                  <span className="text-xl font-bold text-beteasy-lime">Easy</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered football predictions across East Africa
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 uppercase text-sm">Platform</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/register" className="hover:text-beteasy-lime transition-colors">Register</Link></li>
                <li><Link to="/login" className="hover:text-beteasy-lime transition-colors">Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 uppercase text-sm">Coverage</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Uganda</li>
                <li>Kenya</li>
                <li>Tanzania</li>
                <li>Rwanda</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 uppercase text-sm">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-beteasy-lime transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-beteasy-lime transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 BetEasy Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
