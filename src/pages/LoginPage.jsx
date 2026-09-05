import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import GoogleSignInModal from '../components/common/GoogleSignInModal';

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  useEffect(() => {
    if (user && user.isAuthenticated && user.email) {
      if (user.isAdmin || user.email.toLowerCase().includes('admin')) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, navigate]);

  const validateEmail = (val) => {
    setEmail(val);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val) {
      setEmailError('Email is required.');
    } else if (!emailRegex.test(val)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailError) return;
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await login(email, password);
      if (res.success) {
        if (res.isAdmin || email.toLowerCase().includes('admin')) {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(res.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleClick = async () => {
    if (supabase) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: `${window.location.origin}/auth/callback` }
        });
        if (!error) return;
        console.warn('Supabase OAuth notice:', error.message);
      } catch (err) {
        console.warn('Supabase OAuth error:', err);
      }
    }
    setIsGoogleModalOpen(true);
  };

  return (
    <>
      <div className="min-vh-100 bg-light dark:bg-dark d-flex flex-column justify-content-center py-5 px-3">
        <div className="mx-auto w-100 text-center mb-4" style={{ maxWidth: '440px' }}>
          <Link to="/" className="d-inline-flex align-items-center gap-2 text-decoration-none mb-3">
            <img 
              src="/vithai-logo.png" 
              alt="VithAI Logo" 
              className="rounded-4 shadow" 
              style={{ width: '48px', height: '48px', objectFit: 'cover' }} 
            />
            <span className="fw-black fs-2 text-dark dark:text-white">
              VithAI
            </span>
          </Link>

          <h3 className="fw-black text-dark dark:text-white mb-1">
            Welcome back to VithAI
          </h3>
          <p className="small text-muted mb-0">
            Sign in with Learner or Admin credentials
          </p>
        </div>

        <div className="mx-auto w-100" style={{ maxWidth: '440px' }}>
          <div className="card border-0 shadow-lg rounded-5 p-4 p-md-5">
            
            {/* Continue with Google Button */}
            <button
              type="button"
              onClick={handleGoogleClick}
              disabled={isLoading}
              className="btn btn-outline-secondary rounded-4 py-2.5 px-3 fw-bold d-flex align-items-center justify-content-center gap-2 mb-3 shadow-sm text-dark"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" style={{ width: '18px', height: '18px' }}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Continue with Google Account
            </button>

            <div className="d-flex align-items-center my-3">
              <hr className="flex-grow-1 m-0 text-muted" />
              <span className="px-3 text-muted text-uppercase fw-bold" style={{ fontSize: '0.65rem' }}>Or sign in with email</span>
              <hr className="flex-grow-1 m-0 text-muted" />
            </div>

            {error && (
              <div className="alert alert-danger border-0 rounded-3 p-2.5 small d-flex align-items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 shrink-0" /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
              {/* Email Field */}
              <div>
                <label className="form-label fw-bold text-dark small mb-1">
                  Email Address
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 rounded-start-3">
                    <Mail className="w-4 h-4 text-muted" />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => validateEmail(e.target.value)}
                    className={`form-control border-start-0 rounded-end-3 ${emailError ? 'is-invalid' : ''}`}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                {emailError && (
                  <div className="text-danger small mt-1 d-flex align-items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {emailError}
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <label className="form-label fw-bold text-dark small m-0">
                    Password
                  </label>
                  <Link to="/forgot-password" className="small text-indigo text-decoration-none fw-bold">
                    Forgot password?
                  </Link>
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 rounded-start-3">
                    <Lock className="w-4 h-4 text-muted" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control border-start-0 border-end-0"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="input-group-text bg-light border-start-0 rounded-end-3 text-muted"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !!emailError}
                className="btn btn-indigo rounded-4 py-2.5 fw-bold d-flex align-items-center justify-content-center gap-2 mt-2 shadow-sm"
              >
                {isLoading ? 'Signing in...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-3 mt-3 border-top text-center">
              <p className="small text-muted mb-0">
                Don't have an account?{' '}
                <Link to="/register" className="fw-bold text-indigo text-decoration-none">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Google Account Selector Modal */}
      <GoogleSignInModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSuccess={() => {
          setIsGoogleModalOpen(false);
          navigate('/dashboard');
        }}
      />
    </>
  );
}
