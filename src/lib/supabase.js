import { createClient } from '@supabase/supabase-js';
import env from '../config/env';

const supabaseUrl = env.supabaseUrl;
const supabaseAnonKey = env.supabaseAnonKey;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Singleton Supabase Client with Implicit Flow to eliminate bad_oauth_state & state expiration across origins
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'implicit',
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      }
    })
  : null;
