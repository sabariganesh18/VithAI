import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Flame, Star, Coins, Bot, Sun, Moon, Calendar, LogOut, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLearning } from '../../context/LearningContext';
import { useTheme } from '../../context/ThemeContext';
import AITutorModal from '../common/AITutorModal';
import { NATIVE_LANGUAGES } from '../../data/languagesData';

export default function Header() {
  const { user, logout } = useAuth();
  const { progress } = useLearning();
  const { theme, toggleTheme } = useTheme();
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const nativeLang = NATIVE_LANGUAGES.find(l => l.id === user?.nativeLanguage) || NATIVE_LANGUAGES[0];

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="navbar navbar-expand border-bottom sticky-top bg-white dark:bg-dark shadow-sm py-1.5">
        <div className="container-fluid px-2 px-sm-3 px-md-4">

          {/* Brand Logo */}
          <Link to={user ? "/dashboard" : "/"} className="navbar-brand d-flex align-items-center gap-1 me-auto p-0">
            <img 
              src="/vithai-logo.png" 
              alt="VithAI Logo" 
              className="rounded-3 shadow-sm shrink-0" 
              style={{ width: '28px', height: '28px', objectFit: 'cover' }} 
            />
            <div className="d-flex flex-column leading-tight">
              <div className="d-flex align-items-center gap-1">
                <span className="fw-black fs-6 fs-sm-5 text-indigo">
                  VithAI
                </span>
                <span className="badge bg-indigo-subtle-custom text-indigo border border-indigo rounded-pill px-1 py-0.5 d-none d-sm-inline-block" style={{ fontSize: '0.62rem' }}>
                  PRO
                </span>
              </div>
            </div>
          </Link>

          {/* Header Right Bar Controls */}
          <div className="d-flex align-items-center gap-1 shrink-0">
            {user ? (
              <>
                {/* Streak Counter */}
                <div className="badge rounded-pill bg-warning-subtle text-warning border border-warning px-1.5 py-0.5 px-sm-2 py-sm-1 d-flex align-items-center gap-0.5" style={{ fontSize: '0.7rem' }}>
                  <Flame className="w-3 h-3 fill-warning text-warning animate-pulse" />
                  <span className="fw-bold">{progress.streak}<span className="d-none d-sm-inline"> Days</span></span>
                </div>

                {/* XP Counter */}
                <div className="badge rounded-pill bg-primary-subtle text-primary border border-primary px-1.5 py-0.5 px-sm-2 py-sm-1 d-flex align-items-center gap-0.5" style={{ fontSize: '0.7rem' }}>
                  <Star className="w-3 h-3 fill-primary text-primary" />
                  <span className="fw-bold">{progress.xp.toLocaleString()}<span className="d-none d-sm-inline"> XP</span></span>
                </div>

                {/* Coins Counter */}
                <div className="badge rounded-pill bg-warning-subtle text-dark border border-warning px-2 py-1 d-none d-lg-flex align-items-center gap-1">
                  <Coins className="w-3.5 h-3.5 text-warning" />
                  <span className="fw-bold">{progress.coins}</span>
                </div>

                {/* Real-Time Calendar Day Badge */}
                <div className="badge rounded-pill bg-purple-subtle text-purple border border-purple px-2 py-1 d-none d-md-flex align-items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="fw-bold small">{progress.simulatedDay || 'Today'}</span>
                </div>

                {/* AI Tutor Button */}
                <button
                  onClick={() => setIsAiModalOpen(true)}
                  className="btn btn-sm btn-indigo rounded-3 fw-bold d-flex align-items-center gap-1 shadow-sm p-1 p-sm-1.5 px-sm-2.5"
                  title="Ask AI Tutor"
                  style={{ fontSize: '0.78rem' }}
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span className="d-none d-sm-inline">Ask AI</span>
                </button>

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="btn btn-sm btn-light rounded-3 text-secondary p-1 p-sm-1.5 border"
                  aria-label="Toggle Theme"
                >
                  {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-warning" /> : <Moon className="w-3.5 h-3.5 text-dark" />}
                </button>

                {/* User Avatar Menu Dropdown */}
                <div className="position-relative shrink-0">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="btn p-0 border-0 rounded-circle"
                    title="User Profile Menu"
                  >
                    <div className="rounded-circle bg-indigo text-white fw-bold d-flex align-items-center justify-content-center shadow-sm" style={{ width: '28px', height: '28px', fontSize: '0.8rem' }}>
                      {user.avatar || '🎓'}
                    </div>
                  </button>

                  {isUserMenuOpen && (
                    <div className="position-absolute end-0 mt-2 card shadow-lg z-3 border-0 rounded-4 p-2" style={{ width: '230px' }}>
                      <div className="px-3 py-2 border-bottom">
                        <p className="fw-bold m-0 small d-flex align-items-center justify-content-between">
                          {user.name}
                          {user.isAdmin && <span className="badge bg-warning text-dark font-mono">ADMIN</span>}
                        </p>
                        <p className="text-muted m-0 text-truncate" style={{ fontSize: '0.75rem' }}>{user.email}</p>
                        <span className="badge bg-indigo-subtle-custom text-indigo mt-1">
                          Native: {nativeLang.name} ({nativeLang.nativeName})
                        </span>
                      </div>

                      {user.isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="btn btn-warning btn-sm text-start text-dark fw-bold my-1 mx-2 rounded-3 d-flex align-items-center gap-1.5"
                        >
                          <ShieldAlert className="w-4 h-4" /> Admin Control Panel
                        </Link>
                      )}

                      <Link
                        to="/settings"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="btn btn-link text-decoration-none text-start text-dark small py-2 px-3 border-0"
                      >
                        Settings
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="btn btn-link text-decoration-none text-start text-dark small py-2 px-3 border-0"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/progress"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="btn btn-link text-decoration-none text-start text-dark small py-2 px-3 border-0"
                      >
                        Learning Analytics
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="btn btn-link text-decoration-none text-start text-danger small py-2 px-3 border-0 border-top mt-1 d-flex align-items-center gap-1.5 w-100 fw-bold"
                      >
                        <LogOut className="w-4 h-4 text-danger" /> Logout / Sign Out
                      </button>
                    </div>
                  )}
                </div>

                {/* Direct Red Logout Button (Desktop only, available in avatar dropdown on mobile) */}
                <button
                  onClick={handleLogout}
                  className="btn btn-sm btn-outline-danger rounded-3 fw-bold px-2.5 py-1.5 d-none d-md-flex align-items-center gap-1 ms-1"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <>
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="btn btn-sm btn-light rounded-3 text-secondary p-1.5 border me-2"
                  aria-label="Toggle Theme"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4 text-warning" /> : <Moon className="w-4 h-4 text-dark" />}
                </button>

                <Link to="/login" className="btn btn-sm btn-link text-dark text-decoration-none fw-bold">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-sm btn-indigo rounded-3 fw-bold px-3">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* AI Tutor Modal */}
      <AITutorModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
    </>
  );
}
