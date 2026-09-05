import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Sparkles, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const [status, setStatus] = useState('processing'); // 'processing' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    let isMounted = true;
    let isHandled = false;

    const error = searchParams.get('error') || new URLSearchParams(window.location.hash.substring(1)).get('error');
    const errCode = searchParams.get('error_code') || new URLSearchParams(window.location.hash.substring(1)).get('error_code');
    const errorDesc = searchParams.get('error_description') || new URLSearchParams(window.location.hash.substring(1)).get('error_description');

    if (error || errCode) {
      if (isMounted) {
        setStatus('error');
        setErrorMessage(errorDesc || error || 'Google Authentication error occurred.');
      }
      return;
    }

    const handleAuthenticatedUser = async (user) => {
      if (isHandled || !isMounted || !user) return;
      isHandled = true;

      const email = user.email || 'learner@vithai.edu';
      const fullName = user.user_metadata?.full_name || user.user_metadata?.name || email.split('@')[0];
      const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || '🎓';

      await login(email, 'google_oauth_pass', fullName, avatarUrl);

      if (isMounted) {
        setUserInfo({ name: fullName, email });
        setStatus('success');
        try {
          window.history.replaceState(null, document.title, window.location.pathname);
        } catch (e) {}
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 500);
      }
    };

    if (isSupabaseConfigured && supabase) {
      // 1. Check existing session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user && !isHandled) {
          handleAuthenticatedUser(session.user);
        }
      });

      // 2. Listen to auth state change (fires automatically after code exchange)
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user && !isHandled) {
          handleAuthenticatedUser(session.user);
        }
      });

      const timer = setTimeout(() => {
        if (isMounted && !isHandled) {
          const activeEmail = localStorage.getItem('vithai_active_email');
          if (activeEmail) {
            navigate('/dashboard', { replace: true });
          } else {
            setStatus('error');
            setErrorMessage('Authentication session timed out. Please try signing in again.');
          }
        }
      }, 4000);

      return () => {
        isMounted = false;
        clearTimeout(timer);
        subscription?.unsubscribe();
      };
    } else {
      const activeEmail = localStorage.getItem('vithai_active_email');
      if (activeEmail) {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [navigate, searchParams, login]);

  return (
    <div className="min-vh-100 bg-light dark:bg-dark d-flex align-items-center justify-content-center p-3">
      <div className="card border-0 shadow-xl rounded-5 overflow-hidden w-100" style={{ maxWidth: '460px' }}>
        <div className="card-body p-4 p-md-5 text-center">
          
          {/* Brand Header */}
          <div className="d-flex align-items-center justify-content-center gap-2 mb-4">
            <img 
              src="/vithai-logo.png" 
              alt="VithAI Logo" 
              className="rounded-4 shadow-sm" 
              style={{ width: '44px', height: '44px', objectFit: 'cover' }} 
            />
            <span className="fw-black fs-3 text-dark dark:text-white">VithAI</span>
          </div>

          {/* Processing State */}
          {status === 'processing' && (
            <div className="py-4">
              <div className="position-relative d-inline-block mb-4">
                <div 
                  className="spinner-border text-indigo" 
                  role="status" 
                  style={{ width: '3.5rem', height: '3.5rem', borderWidth: '3.5px' }}
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
                <div className="position-absolute top-50 start-50 translate-middle">
                  <Sparkles className="w-5 h-5 text-indigo animate-pulse" />
                </div>
              </div>
              <h4 className="fw-black text-dark dark:text-white mb-2">
                Signing in with Google...
              </h4>
              <p className="text-muted small mb-0 px-3">
                Connecting your Google account and preparing your dashboard.
              </p>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="py-4">
              <div className="rounded-circle bg-emerald-100 text-emerald-600 d-inline-flex align-items-center justify-content-center p-3 mb-3 shadow-xs">
                <CheckCircle2 className="w-10 h-10 text-success" />
              </div>
              <h4 className="fw-black text-dark dark:text-white mb-1">
                Welcome back{userInfo?.name ? `, ${userInfo.name}` : ''}!
              </h4>
              <p className="text-muted small mb-3">
                Signed in with <strong>{userInfo?.email}</strong>
              </p>
              <div className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill fw-bold">
                Opening Dashboard...
              </div>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="py-3">
              <div className="rounded-circle bg-danger bg-opacity-10 text-danger d-inline-flex align-items-center justify-content-center p-3 mb-3">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h4 className="fw-black text-dark dark:text-white mb-2">
                Sign In Notice
              </h4>
              <div className="alert alert-danger border-0 rounded-4 text-start small mb-4 p-3">
                <strong>Details:</strong> {errorMessage}
              </div>

              <div className="d-flex flex-column gap-2">
                <Link
                  to="/login"
                  className="btn btn-indigo rounded-4 py-2.5 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                >
                  <RefreshCw className="w-4 h-4" /> Return to Login
                </Link>
                <Link
                  to="/"
                  className="btn btn-light rounded-4 py-2.5 fw-bold text-muted"
                >
                  Home
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
