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

    async function handleAuthCallback() {
      try {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const error = searchParams.get('error') || hashParams.get('error');
        const errCode = searchParams.get('error_code') || hashParams.get('error_code');
        const errorDescription = searchParams.get('error_description') || hashParams.get('error_description');

        // 1. Check for explicit OAuth errors
        if (error || errCode) {
          console.error('[OAuth Callback Error]:', error, errCode, errorDescription);
          if (isMounted) {
            setStatus('error');
            if (errCode === 'bad_oauth_state' || errorDescription?.includes('bad_oauth_state')) {
              setErrorMessage('OAuth State Mismatch: The login started on one port/domain but Supabase redirected to another. Please ensure your Supabase Dashboard Site URL matches your active domain.');
            } else {
              setErrorMessage(errorDescription || error || 'Google Authentication was cancelled or failed.');
            }
          }
          return;
        }

        // 2. PKCE Flow: Check for Authorization Code in URL search params (?code=...)
        const code = searchParams.get('code');
        if (code && isSupabaseConfigured && supabase) {
          try {
            const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
            if (exchangeError) {
              console.warn('PKCE exchange warning:', exchangeError);
            } else if (data?.session?.user) {
              const user = data.session.user;
              const email = user.email || 'learner@vithai.edu';
              const fullName = user.user_metadata?.full_name || user.user_metadata?.name || email.split('@')[0];
              const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;

              await login(email, 'google_oauth_pass', fullName, avatarUrl || '🎓');

              if (isMounted) {
                setUserInfo({ name: fullName, email });
                setStatus('success');
                // Clean URL params after successful session
                try {
                  window.history.replaceState(null, document.title, window.location.pathname);
                } catch (e) {}
                setTimeout(() => {
                  navigate('/dashboard', { replace: true });
                }, 800);
              }
              return;
            }
          } catch (e) {
            console.warn('PKCE exception:', e);
          }
        }

        // 3. Check for Direct Session in Supabase
        if (isSupabaseConfigured && supabase) {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();

          if (session?.user) {
            const user = session.user;
            const email = user.email || 'learner@vithai.edu';
            const fullName = user.user_metadata?.full_name || user.user_metadata?.name || email.split('@')[0];
            const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;

            await login(email, 'google_oauth_pass', fullName, avatarUrl || '🎓');

            if (isMounted) {
              setUserInfo({ name: fullName, email });
              setStatus('success');
              try {
                window.history.replaceState(null, document.title, window.location.pathname);
              } catch (e) {}
              setTimeout(() => {
                navigate('/dashboard', { replace: true });
              }, 800);
            }
            return;
          }
        }

        // 4. Implicit Flow: Check hash fragment for access_token
        const accessToken = hashParams.get('access_token');
        if (accessToken && isSupabaseConfigured && supabase) {
          const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);
          if (!userError && user) {
            const email = user.email;
            const fullName = user.user_metadata?.full_name || email.split('@')[0];
            await login(email, 'google_oauth_pass', fullName, '🎓');
            if (isMounted) {
              setUserInfo({ name: fullName, email });
              setStatus('success');
              try {
                window.history.replaceState(null, document.title, window.location.pathname);
              } catch (e) {}
              setTimeout(() => {
                navigate('/dashboard', { replace: true });
              }, 800);
            }
            return;
          }
        }

        // 5. Fallback check: if already active in localStorage
        const timer = setTimeout(() => {
          if (isMounted) {
            const activeEmail = localStorage.getItem('vithai_active_email');
            if (activeEmail) {
              navigate('/dashboard', { replace: true });
            } else {
              setStatus('error');
              setErrorMessage('No active Google authentication session found. Please sign in again.');
            }
          }
        }, 2500);

        return () => clearTimeout(timer);
      } catch (err) {
        console.error('Failed to process OAuth callback:', err);
        if (isMounted) {
          setStatus('error');
          setErrorMessage(err.message || 'An unexpected error occurred during Google sign in.');
        }
      }
    }

    handleAuthCallback();

    return () => {
      isMounted = false;
    };
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
                Verifying Google Account...
              </h4>
              <p className="text-muted small mb-0 px-3">
                Securely connecting and syncing your learning profile. You will be redirected shortly.
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
                Redirecting to your Learning Dashboard...
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
                Authentication Notice
              </h4>
              <div className="alert alert-danger border-0 rounded-4 text-start small mb-4 p-3">
                <strong>Error details:</strong> {errorMessage}
              </div>

              <div className="d-flex flex-column gap-2">
                <Link
                  to="/login"
                  className="btn btn-indigo rounded-4 py-2.5 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                >
                  <RefreshCw className="w-4 h-4" /> Try Sign In Again
                </Link>
                <Link
                  to="/"
                  className="btn btn-light rounded-4 py-2.5 fw-bold text-muted"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
