import React, { useState, useEffect } from 'react';
import { Settings, Moon, Sun, Volume2, UserCheck, Play } from 'lucide-react';
import Header from '../components/layout/Header';
import Navbar from '../components/layout/Navbar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { NATIVE_LANGUAGES } from '../data/languagesData';
import { getVoiceGender, setVoiceGender, speakText } from '../utils/speechUtils';

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [voiceGender, setVoiceGenderState] = useState(getVoiceGender());
  const [reminderTime, setReminderTime] = useState('20:00');
  const [successMsg, setSuccessMsg] = useState('');

  const handleVoiceChange = (gender) => {
    setVoiceGenderState(gender);
    setVoiceGender(gender);
    const text = gender === 'male' ? 'Hello Sabari! Male voice activated.' : 'Hello Sabari! Female voice activated.';
    speakText(text, 'en-US', gender);
  };

  const handleSave = () => {
    setSuccessMsg('Settings and Voice preferences saved successfully!');
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  return (
    <div className="min-vh-100 bg-light dark:bg-dark text-dark dark:text-white d-flex flex-column pb-5 pb-md-0">
      <Header />
      <Navbar />

      <main className="container max-w-3xl py-4 flex-grow-1">
        <div className="mb-4">
          <h2 className="fw-black text-dark dark:text-white mb-1 d-flex align-items-center gap-2">
            <Settings className="w-7 h-7 text-indigo" /> Platform Settings
          </h2>
          <p className="small text-muted mb-0">
            Customize native language, voice assistant gender (Male/Female), theme preferences, and platform options.
          </p>
        </div>

        {successMsg && (
          <div className="alert alert-success border-0 rounded-4 fw-bold mb-4 text-center shadow-sm">
            {successMsg}
          </div>
        )}

        <div className="card border-0 rounded-5 p-4 p-md-5 shadow-sm space-y-4">
          


          {/* Voice Gender Selection (Male 👨 vs Female 👩) */}
          <div className="pt-3 border-top mb-3">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <div>
                <h6 className="fw-bold text-dark dark:text-white mb-0 d-flex align-items-center gap-2">
                  <Volume2 className="w-4 h-4 text-indigo" /> Voice Assistant Gender (குரல் தேர்வு)
                </h6>
                <p className="small text-muted mb-0">Switch between Male 👨 and Female 👩 pronunciation voices across all lessons.</p>
              </div>

              <button
                type="button"
                onClick={() => speakText('Welcome to VithAI learning platform!', 'en-US', voiceGender)}
                className="btn btn-sm btn-outline-indigo rounded-pill px-3 py-1 fw-bold d-inline-flex align-items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-indigo" /> Test Voice
              </button>
            </div>

            <div className="row g-3 pt-2">
              <div className="col-6">
                <button
                  type="button"
                  onClick={() => handleVoiceChange('female')}
                  className={`w-100 p-3 rounded-4 border text-center transition-all btn d-flex flex-column align-items-center gap-1 ${
                    voiceGender === 'female'
                      ? 'btn-indigo text-white fw-bold shadow'
                      : 'btn-light border-slate-200 text-dark hover:border-indigo'
                  }`}
                >
                  <span className="fs-2">👩</span>
                  <span className="fw-black small">Female Voice (பெண் குரல்)</span>
                  <span className="small opacity-75" style={{ fontSize: '0.7rem' }}>Soft & Clear</span>
                </button>
              </div>

              <div className="col-6">
                <button
                  type="button"
                  onClick={() => handleVoiceChange('male')}
                  className={`w-100 p-3 rounded-4 border text-center transition-all btn d-flex flex-column align-items-center gap-1 ${
                    voiceGender === 'male'
                      ? 'btn-indigo text-white fw-bold shadow'
                      : 'btn-light border-slate-200 text-dark hover:border-indigo'
                  }`}
                >
                  <span className="fs-2">👨</span>
                  <span className="fw-black small">Male Voice (ஆண் குரல்)</span>
                  <span className="small opacity-75" style={{ fontSize: '0.7rem' }}>Deep & Clear</span>
                </button>
              </div>
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="d-flex align-items-center justify-content-between pt-3 border-top mb-3">
            <div>
              <h6 className="fw-bold text-dark dark:text-white mb-0">Appearance Theme</h6>
              <p className="small text-muted mb-0">Switch between light mode and dark mode aesthetic.</p>
            </div>
            <button
              onClick={toggleTheme}
              className="btn btn-light border rounded-3 px-3 py-2 fw-bold text-dark d-flex align-items-center gap-2"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-warning" /> : <Moon className="w-4 h-4 text-dark" />}
              <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
          </div>

          {/* Reminder Time */}
          <div className="pt-3 border-top mb-4">
            <label className="form-label small fw-bold text-dark dark:text-white mb-1">
              Daily Reminder Notification Time
            </label>
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="form-control rounded-3 p-2.5 max-w-md"
            />
          </div>

          <div className="pt-3 border-top">
            <button
              onClick={handleSave}
              className="btn btn-indigo rounded-3 px-4 py-2.5 fw-bold shadow-sm"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
