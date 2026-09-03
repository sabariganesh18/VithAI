import React from 'react';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { BarChart3 } from 'lucide-react';
import Header from '../components/layout/Header';
import Navbar from '../components/layout/Navbar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import Footer from '../components/layout/Footer';
import { useLearning } from '../context/LearningContext';

export default function ProgressPage() {
  const { progress } = useLearning();

  const wordsData = [
    { week: 'Week 1', words: 60 },
    { week: 'Week 2', words: 60 },
    { week: 'Week 3', words: 55 },
    { week: 'Week 4', words: 60 }
  ];

  const scoreData = [
    { week: 'Week 1', score: 87 },
    { week: 'Week 2', score: 90 },
    { week: 'Week 3', score: 85 },
    { week: 'Week 4', score: 94 }
  ];

  const xpData = [
    { day: 'Mon', xp: 60 },
    { day: 'Tue', xp: 120 },
    { day: 'Wed', xp: 180 },
    { day: 'Thu', xp: 240 },
    { day: 'Fri', xp: 300 },
    { day: 'Sat', xp: 360 },
    { day: 'Sun', xp: 450 }
  ];

  return (
    <div className="min-vh-100 bg-light dark:bg-dark text-dark dark:text-white d-flex flex-column pb-5 pb-md-0">
      <Header />
      <Navbar />

      <main className="container py-4 flex-grow-1">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
          <div>
            <h2 className="fw-black text-dark dark:text-white mb-1 d-flex align-items-center gap-2">
              <BarChart3 className="w-7 h-7 text-indigo" /> Learning Analytics & Progress
            </h2>
            <p className="small text-muted mb-0">
              Track your weekly word growth, Sunday test retention trends, and XP trajectory.
            </p>
          </div>
        </div>

        {/* Top Summary Cards */}
        <div className="row g-4 mb-4">
          <div className="col-12 col-md-4">
            <div className="card border-0 rounded-5 p-4 shadow-sm h-100">
              <span className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.65rem' }}>Total Words Learned</span>
              <div className="fs-3 fw-black text-dark dark:text-white mt-1">{progress.learnedWordIds.length} Words</div>
              <p className="small text-success fw-bold mb-0">↑ {progress.learnedWordIds.length} new words this week</p>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="card border-0 rounded-5 p-4 shadow-sm h-100">
              <span className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.65rem' }}>Avg Sunday Test Accuracy</span>
              <div className="fs-3 fw-black text-indigo mt-1">89% Score</div>
              <p className="small text-indigo fw-bold mb-0">Top 5% among peer learners</p>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="card border-0 rounded-5 p-4 shadow-sm h-100">
              <span className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.65rem' }}>Weakest Area</span>
              <div className="fs-3 fw-black text-warning mt-1">Grammar (81%)</div>
              <p className="small text-muted mb-0">Recommended revision topic</p>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="row g-4 mb-4">
          {/* Words Learned per Week */}
          <div className="col-12 col-lg-6">
            <div className="card border-0 rounded-5 p-4 shadow-sm h-100">
              <h5 className="fw-bold text-dark dark:text-white mb-4">
                Words Learned Per Week
              </h5>
              <div style={{ height: '260px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={wordsData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="week" stroke="#8884d8" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="words" fill="#6366f1" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Sunday Test Scores */}
          <div className="col-12 col-lg-6">
            <div className="card border-0 rounded-5 p-4 shadow-sm h-100">
              <h5 className="fw-bold text-dark dark:text-white mb-4">
                Sunday Challenge Test Score Trajectory (%)
              </h5>
              <div style={{ height: '260px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={scoreData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="week" stroke="#8884d8" />
                    <YAxis domain={[60, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* XP Growth Chart */}
        <div className="card border-0 rounded-5 p-4 shadow-sm mb-4">
          <h5 className="fw-bold text-dark dark:text-white mb-4">
            Weekly XP Accumulation
          </h5>
          <div style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={xpData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="xp" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
