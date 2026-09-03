import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function GoogleSignInModal({ isOpen, onClose, onSuccess }) {
  const { login } = useAuth();
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  if (!isOpen) return null;

  const defaultAccounts = [
    { name: 'Alex Chen', email: 'alex.chen@gmail.com', avatarEmoji: '👨‍💻' },
    { name: 'Priya Sharma', email: 'priya.sharma@gmail.com', avatarEmoji: '👩‍🏫' },
    { name: 'Sabari Arumugam', email: 'sabari.arumugam@gmail.com', avatarEmoji: '🦉' }
  ];

  const handleSelectAccount = (account) => {
    setIsSigningIn(true);
    setTimeout(() => {
      login(account.email, 'google_oauth_pass', account.name, account.avatarEmoji);
      setIsSigningIn(false);
      if (onSuccess) {
        onSuccess();
      }
    }, 400);
  };

  const handleCustomGoogleSubmit = (e) => {
    e.preventDefault();
    if (!customEmail) return;
    setIsSigningIn(true);
    setTimeout(() => {
      const derivedName = customName.trim() || customEmail.split('@')[0].replace('.', ' ');
      login(customEmail, 'google_oauth_pass', derivedName, '🎓');
      setIsSigningIn(false);
      if (onSuccess) {
        onSuccess();
      }
    }, 400);
  };

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 z-3 d-flex align-items-center justify-content-center bg-dark bg-opacity-75 p-3">
      <div className="card border-0 rounded-5 shadow-lg w-100 overflow-hidden" style={{ maxWidth: '440px' }}>
        <div className="card-body p-4 position-relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="btn btn-sm btn-light rounded-circle position-absolute top-0 end-0 m-3 p-1"
          >
            <X className="w-4 h-4 text-secondary" />
          </button>

          {/* Google Header */}
          <div className="text-center mb-4">
            <div className="rounded-4 bg-light d-flex align-items-center justify-content-center mx-auto mb-3 border" style={{ width: '48px', height: '48px' }}>
              <svg className="w-6 h-6" viewBox="0 0 24 24" style={{ width: '24px', height: '24px' }}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            </div>
            <h4 className="fw-black text-dark mb-1">
              Choose a Google Account
            </h4>
            <p className="small text-muted mb-0">
              to continue to <strong className="text-indigo">VithAI</strong>
            </p>
          </div>

          {/* Existing Accounts List */}
          <div className="d-flex flex-column gap-2 mb-4">
            {defaultAccounts.map((acc, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectAccount(acc)}
                disabled={isSigningIn}
                className="btn btn-outline-light text-dark border p-3 rounded-4 d-flex align-items-center justify-content-between text-start w-100"
              >
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-circle bg-indigo text-white fw-bold d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                    {acc.name[0]}
                  </div>
                  <div>
                    <div className="fw-bold small text-dark">
                      {acc.name}
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                      {acc.email}
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-indigo" />
              </button>
            ))}
          </div>

          {/* Or Enter Custom Google Email */}
          <div className="border-top pt-3">
            <form onSubmit={handleCustomGoogleSubmit} className="d-flex flex-column gap-2">
              <label className="form-label text-muted fw-bold text-uppercase" style={{ fontSize: '0.65rem' }}>
                Or sign in with another Google Email
              </label>
              <input
                type="email"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="user.google@gmail.com"
                className="form-control form-control-sm rounded-3"
              />
              <button
                type="submit"
                disabled={!customEmail || isSigningIn}
                className="btn btn-indigo btn-sm rounded-3 fw-bold py-2 mt-1"
              >
                {isSigningIn ? 'Signing in with Google...' : 'Sign In with This Google Email'}
              </button>
            </form>
          </div>

          <p className="text-muted text-center mt-3 mb-0" style={{ fontSize: '0.65rem' }}>
            By continuing, Google will share your name, email address, and language preferences with VithAI.
          </p>
        </div>
      </div>
    </div>
  );
}
