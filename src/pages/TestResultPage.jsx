import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Trophy, Award, CheckCircle2, RefreshCw, ArrowRight, BarChart3, Star, Sparkles } from 'lucide-react';
import Header from '../components/layout/Header';
import Navbar from '../components/layout/Navbar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import Footer from '../components/layout/Footer';

export default function TestResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const result = location.state?.result || {
    score: 52,
    total: 60,
    percentage: 87,
    xpEarned: 50,
    categoryScores: { vocabulary: 92, grammar: 81, listening: 85, speaking: 88 }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors pb-16 md:pb-0">
      <Header />
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-8 flex-1 w-full text-center">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl relative overflow-hidden">
          <div className="w-20 h-20 bg-gradient-to-tr from-amber-400 to-indigo-600 rounded-3xl flex items-center justify-center text-white text-4xl mx-auto mb-4 shadow-lg animate-bounce">
            🏆
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Sunday Challenge Complete
          </span>

          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
            Weekly Result Breakdown
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-8">
            Great job! You completed all 60 vocabulary and grammar concepts this week.
          </p>

          {/* Big Score Ring / Box */}
          <div className="max-w-xs mx-auto p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-800/60 border border-indigo-200 dark:border-indigo-800 rounded-3xl mb-8">
            <div className="text-5xl font-black text-indigo-600 dark:text-indigo-400 mb-1">
              {result.percentage}%
            </div>
            <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
              {result.score} / {result.total} Total Points
            </div>
          </div>

          {/* Category Breakdown Bar Grid */}
          <div className="grid grid-cols-2 gap-4 text-left max-w-lg mx-auto mb-8">
            {Object.entries(result.categoryScores).map(([cat, score]) => (
              <div key={cat} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between text-xs font-bold capitalize mb-1">
                  <span className="text-slate-600 dark:text-slate-300">{cat}</span>
                  <span className="text-indigo-600 dark:text-indigo-400">{score}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full" style={{ width: `${score}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          {/* XP & Rewards Alert */}
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl mb-8 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" /> +{result.xpEarned} XP Earned
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <Award className="w-5 h-5 text-amber-500" /> Badge Unlocked: Sunday Champ
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              Start Next Week <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/progress"
              className="w-full sm:w-auto py-3.5 px-6 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2"
            >
              <BarChart3 className="w-4 h-4" /> View Analytics
            </Link>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
