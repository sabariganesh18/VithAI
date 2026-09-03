import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Code, BookmarkCheck, BarChart3, ShoppingBag, Trophy, FileCheck, Sparkles } from 'lucide-react';

export default function Navbar() {
  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null, color: 'indigo' },
    { to: '/code', label: 'CodeLoop', icon: Code, badge: 'AI', color: 'amber' },
    { to: '/mock-tests', label: 'Mock Tests', icon: FileCheck, badge: null, color: 'cyan' },
    { to: '/words', label: 'Word Book', icon: BookmarkCheck, badge: null, color: 'violet' },
    { to: '/progress', label: 'Progress', icon: BarChart3, badge: null, color: 'rose' },
    { to: '/rewards', label: 'Rewards Store', icon: ShoppingBag, badge: '🎁', color: 'gold' },
    { to: '/leaderboard', label: 'Leaderboard', icon: Trophy, badge: '🏆', color: 'yellow' }
  ];

  return (
    <nav className="d-none d-md-block bg-white dark:bg-dark border-bottom sticky-top z-2 shadow-xs transition-all">
      <div className="container-fluid px-3 px-md-4">
        <div className="d-flex align-items-center justify-content-center py-2.5 overflow-x-auto no-scrollbar">
          <div className="d-flex align-items-center gap-1.5 p-1 bg-light dark:bg-slate-900 rounded-pill border border-slate-200 dark:border-slate-800 shadow-inner">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `btn btn-sm text-nowrap d-inline-flex align-items-center gap-2 rounded-pill font-bold transition-all px-3 py-1.5 border-0 ${
                      isActive
                        ? 'bg-indigo text-white shadow-md active-nav-glow scale-102'
                        : 'text-secondary hover:text-dark hover:bg-white dark:hover:bg-slate-800'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`w-4 h-4 transition-transform ${isActive ? 'scale-110' : ''}`} />
                      <span>{link.label}</span>
                      {link.badge && (
                        <span 
                          className={`badge rounded-pill px-1.5 py-0.5 small ${
                            isActive 
                              ? 'bg-white text-indigo font-black shadow-xs' 
                              : 'bg-indigo-subtle-custom text-indigo border border-indigo-subtle'
                          }`}
                          style={{ fontSize: '0.62rem' }}
                        >
                          {link.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
