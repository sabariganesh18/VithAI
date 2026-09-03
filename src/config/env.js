/**
 * LingoLoop Centralized Environment Configuration
 * Safe parsing and developer-friendly validation for Vite environment variables.
 */

const getEnv = (key, defaultValue = '') => {
  return import.meta.env[key] !== undefined ? import.meta.env[key] : defaultValue;
};

export const env = {
  // Application Information
  appName: getEnv('VITE_APP_NAME', 'LingoLoop'),
  apiUrl: getEnv('VITE_API_URL', 'http://localhost:5000/api'),
  nodeEnv: getEnv('VITE_NODE_ENV', import.meta.env.MODE || 'development'),

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
    console.log(`%c[LingoLoop Config] Initializing ${env.appName} (${env.nodeEnv})...`, 'color: #6366f1; font-weight: bold;');

    if (env.supabaseUrl && env.supabaseAnonKey) {
      console.log('%c[LingoLoop Config] ✓ Supabase Database & Auth configured.', 'color: #10b981;');
    } else {
      console.info('%c[LingoLoop Config] ℹ Supabase credentials omitted. Running in local mock authentication & database mode.', 'color: #f59e0b;');
    }

    if (env.geminiApiKey || env.groqApiKey) {
      const activeProviders = [
        env.geminiApiKey ? 'Gemini AI' : null,
        env.groqApiKey ? 'Groq AI' : null
      ].filter(Boolean).join(', ');
      console.log(`%c[LingoLoop Config] ✓ External AI Provider active (${activeProviders}).`, 'color: #10b981;');
    } else {
      console.info('%c[LingoLoop Config] ℹ AI API key omitted. AI Tutor using native language local fallback generator.', 'color: #f59e0b;');
    }
  }
}

// Automatically validate on module import
validateAndLogEnv();

export default env;
