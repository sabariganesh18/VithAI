/**
 * VithAI Centralized Environment Configuration
 * Safe parsing, dynamic origin fallback, and developer-friendly validation.
 */

const getEnv = (key, defaultValue = '') => {
  const val = import.meta.env[key];
  return (val && typeof val === 'string' && val.trim() !== '') ? val.trim() : defaultValue;
};

// Dynamically determine frontend origin
const getFrontendUrl = () => {
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return window.location.origin;
  }
  return getEnv('VITE_FRONTEND_URL', 'http://localhost:5173');
};

const frontendOrigin = getFrontendUrl();

export const env = {
  // Application Information
  appName: getEnv('VITE_APP_NAME', 'VithAI'),
  nodeEnv: getEnv('VITE_NODE_ENV', import.meta.env.MODE || 'development'),

  // Host & API URLs
  frontendUrl: getEnv('VITE_FRONTEND_URL', frontendOrigin),
  backendUrl: getEnv('VITE_BACKEND_URL', 'http://localhost:5000'),
  apiUrl: getEnv('VITE_API_URL', 'http://localhost:5000/api'),
  authCallbackUrl: getEnv('VITE_AUTH_CALLBACK_URL', `${frontendOrigin}/auth/callback`),

  // Google OAuth Client ID
  googleClientId: getEnv('VITE_GOOGLE_CLIENT_ID', ''),

  // Supabase Database & Auth Configuration
  supabaseUrl: getEnv('VITE_SUPABASE_URL', 'https://lcckowpksyaiwepyuiqu.supabase.co'),
  supabaseAnonKey: getEnv('VITE_SUPABASE_ANON_KEY', 'sb_publishable_c_LANmo20c1IpAbl0EJLcA_LfcUJmbo'),

  // AI API Configuration (Secret keys used for AI Tutor services)
  geminiApiKey: getEnv('VITE_GEMINI_API_KEY', ''),
  groqApiKey: getEnv('VITE_GROQ_API_KEY', '')
};

// Developer Startup Validation & Status Logging
export function validateAndLogEnv() {
  if (import.meta.env.DEV) {
    console.log(`%c[VithAI Config] Initializing ${env.appName} (${env.nodeEnv})...`, 'color: #6366f1; font-weight: bold;');
    console.log(`%c[VithAI Config] OAuth Callback URL: ${env.authCallbackUrl}`, 'color: #0284c7;');

    if (env.supabaseUrl && env.supabaseAnonKey) {
      console.log('%c[VithAI Config] ✓ Supabase Database & Auth configured.', 'color: #10b981;');
    } else {
      console.info('%c[VithAI Config] ℹ Supabase credentials omitted. Running in local mock authentication & database mode.', 'color: #f59e0b;');
    }

    if (env.geminiApiKey || env.groqApiKey) {
      const activeProviders = [
        env.geminiApiKey ? 'Gemini AI' : null,
        env.groqApiKey ? 'Groq AI' : null
      ].filter(Boolean).join(', ');
      console.log(`%c[VithAI Config] ✓ External AI Provider active (${activeProviders}).`, 'color: #10b981;');
    } else {
      console.info('%c[VithAI Config] ℹ AI API key omitted. AI Tutor using native language local fallback generator.', 'color: #f59e0b;');
    }
  }
}

// Automatically validate on module import
validateAndLogEnv();

export default env;
