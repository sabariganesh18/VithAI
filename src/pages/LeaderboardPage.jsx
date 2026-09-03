import React, { useState, useEffect } from 'react';
import { Flame, Star, Trophy, Users, Globe } from 'lucide-react';
import Header from '../components/layout/Header';
import Navbar from '../components/layout/Navbar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { useLearning } from '../context/LearningContext';

export default function LeaderboardPage() {
  const { user } = useAuth();
  const { progress } = useLearning();

  const [rankedUsers, setRankedUsers] = useState([]);

  useEffect(() => {
    // Clean up stale dummy users from storage
    const savedUsersStr = localStorage.getItem('vithai_all_registered_users');
    let registeredUsers = [];

    if (savedUsersStr) {
      try {
        const parsed = JSON.parse(savedUsersStr);
        // Filter out old hardcoded dummy names
        registeredUsers = parsed.filter(u => 
          u.name !== 'Priya Sharma' && 
          u.name !== 'Arun Kumar' && 
          u.name !== 'Karthik Raja' && 
          u.name !== 'Ananya Roy' && 
          u.name !== 'Vikram Singh'
        );
      } catch (e) {
        registeredUsers = [];
      }
    }

    // Ensure current logged-in website user is always present with live XP and Streak
    if (user && user.email) {
      const currentIdx = registeredUsers.findIndex(u => u.email === user.email || u.id === user.id);
      const currentUserData = {
        id: user.id || 'usr_current',
        name: user.name || 'Sabari',
        email: user.email,
        xp: Math.max(progress.xp || 0, registeredUsers[currentIdx]?.xp || 0),
        streak: progress.streak || 0,
        avatar: user.avatar || '🎓',
        isCurrentLoggedInUser: true
      };

      if (currentIdx >= 0) {
        registeredUsers[currentIdx] = currentUserData;
      } else {
        registeredUsers.push(currentUserData);
      }
    } else if (registeredUsers.length === 0) {
      registeredUsers.push({
        id: 'usr_guest',
        name: 'Sabari',
        email: 'sabari@vithai.edu',
        xp: progress.xp || 150,
        streak: progress.streak || 1,
        avatar: '🎓',
        isCurrentLoggedInUser: true
      });
    }

    // Save cleaned list back
    localStorage.setItem('vithai_all_registered_users', JSON.stringify(registeredUsers));

    // Sort users dynamically by XP (Descending)
    const sorted = [...registeredUsers].sort((a, b) => (b.xp || 0) - (a.xp || 0));

    // Assign dynamic ranks
    const ranked = sorted.map((u, idx) => ({
      ...u,
      rank: idx + 1,
      isUser: user && (u.email === user.email || u.isCurrentLoggedInUser)
    }));

    setRankedUsers(ranked);
  }, [user, progress.xp, progress.streak]);

  return (
    <div className="min-vh-100 bg-light dark:bg-dark text-dark dark:text-white d-flex flex-column pb-5 pb-md-0">
      <Header />
      <Navbar />

      <main className="container max-w-4xl py-4 flex-grow-1">
        
        {/* Header Title */}
        <div className="text-center max-w-xl mx-auto mb-4">
          <div className="rounded-circle bg-warning text-dark fw-bold d-flex align-items-center justify-content-center mx-auto mb-2 shadow" style={{ width: '56px', height: '56px', fontSize: '1.75rem' }}>
            🏆
          </div>
          <h2 className="fw-black text-dark dark:text-white mb-1">
            Global Registered Users Leaderboard
          </h2>
          <p className="small text-muted mb-0">
            Real registered website users ranked dynamically by earned XP and daily streak!
          </p>
        </div>

        {/* Global Leaderboard Badge (Only Global Option) */}
        <div className="d-flex align-items-center justify-content-center mb-4">
          <div className="badge bg-indigo text-white rounded-pill px-4 py-2 fw-bold fs-6 d-inline-flex align-items-center gap-2 shadow-sm">
            <Globe className="w-4 h-4 text-white" /> Global Leaderboard ({rankedUsers.length} Registered Website {rankedUsers.length === 1 ? 'User' : 'Users'})
          </div>
        </div>

        {/* Ranks Table */}
        <div className="card border-0 rounded-5 shadow-sm overflow-hidden mb-4">
          <div className="list-group list-group-flush">
            {rankedUsers.map((item) => (
              <div
                key={item.id || item.rank}
                className={`list-group-item p-3 border-0 d-flex align-items-center justify-content-between ${
                  item.isUser ? 'bg-indigo-subtle-custom border-start border-4 border-indigo' : ''
                }`}
              >
                <div className="d-flex align-items-center gap-3">
                  <span className={`fw-black text-center ${
                    item.rank === 1 ? 'text-warning fs-4' : item.rank === 2 ? 'text-secondary fs-5' : item.rank === 3 ? 'text-warning-emphasis fs-5' : 'text-muted'
                  }`} style={{ width: '42px' }}>
                    {item.rank === 1 ? '🥇 #1' : item.rank === 2 ? '🥈 #2' : item.rank === 3 ? '🥉 #3' : `#${item.rank}`}
                  </span>

                  <div className="rounded-circle bg-light d-flex align-items-center justify-content-center text-xl shadow-xs" style={{ width: '40px', height: '40px', fontSize: '1.25rem' }}>
                    {item.avatar || '🎓'}
                  </div>

                  <div>
                    <h6 className="fw-bold text-dark dark:text-white mb-0 d-flex align-items-center gap-1.5">
                      {item.name}
                      {item.isUser && <span className="badge bg-indigo text-white rounded-pill px-2 py-0.5 small">YOU</span>}
                    </h6>
                    <p className="small text-muted mb-0 d-flex align-items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-warning fill-warning" /> {item.streak || 0} day streak
                    </p>
                  </div>
                </div>

                <div className="text-end">
                  <div className="fw-black text-indigo d-flex align-items-center gap-1 fs-5">
                    <Star className="w-4 h-4 fill-indigo text-indigo" /> {(item.xp || 0).toLocaleString()} XP
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="alert alert-indigo-subtle border-indigo border-opacity-20 rounded-4 p-3 text-center small text-indigo fw-bold">
          💡 New users who register or log into VithAI will automatically appear here on the Global Leaderboard in real-time!
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
