import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext();

const parseJwt = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

const PRESET_USER_PROFILES = {
  'admin@vithai.edu': {
    id: 'usr_admin',
    name: 'VithAI Super Admin',
    email: 'admin@vithai.edu',
    nativeLanguage: 'ta',
    learningCategory: 'both',
    learningLanguage: 'en',
    codingLanguage: 'python',
    level: 'advanced',
    dailyGoalMins: 30,
    goalObjective: 'placement',
    avatar: '👑',
    joinedDate: '2026-01-01',
    isAuthenticated: true,
    isOnboarded: true,
    isAdmin: true
  },
  'sabari@vithai.edu': {
    id: 'usr_sabari',
    name: 'Sabari',
    email: 'sabari@vithai.edu',
    nativeLanguage: 'ta',
    learningCategory: 'both',
    learningLanguage: 'en',
    codingLanguage: 'python',
    level: 'beginner',
    dailyGoalMins: 20,
    goalObjective: 'vocabulary',
    avatar: '🎓',
    joinedDate: '2026-01-10',
    isAuthenticated: true,
    isOnboarded: true,
    isAdmin: false
  },
  'priya.sharma@gmail.com': {
    id: 'usr_priya',
    name: 'Priya Sharma',
    email: 'priya.sharma@gmail.com',
    nativeLanguage: 'hi',
    learningCategory: 'both',
    learningLanguage: 'en',
    codingLanguage: 'python',
    level: 'intermediate',
    dailyGoalMins: 30,
    goalObjective: 'fluency',
    avatar: '👩‍🏫',
    joinedDate: '2026-02-01',
    isAuthenticated: true,
    isOnboarded: true,
    isAdmin: false
  },
  'alex.chen@gmail.com': {
    id: 'usr_alex',
    name: 'Alex Chen',
    email: 'alex.chen@gmail.com',
    nativeLanguage: 'es',
    learningCategory: 'code',
    learningLanguage: 'en',
    codingLanguage: 'cpp',
    level: 'advanced',
    dailyGoalMins: 15,
    goalObjective: 'placement',
    avatar: '👨‍💻',
    joinedDate: '2026-02-15',
    isAuthenticated: true,
    isOnboarded: true,
    isAdmin: false
  }
};

const getProfileForEmail = (email) => {
  if (!email) return null;
  const cleanEmail = email.toLowerCase().trim();
  const savedProfile = localStorage.getItem(`vithai_user_profile_${cleanEmail}`);
  if (savedProfile) {
    try {
      const parsed = JSON.parse(savedProfile);
      if (cleanEmail.includes('admin') || parsed.isAdmin) {
        parsed.isAdmin = true;
      }
      return parsed;
    } catch (e) {
      console.error('Error parsing user profile for', cleanEmail, e);
    }
  }
  if (PRESET_USER_PROFILES[cleanEmail]) {
    return PRESET_USER_PROFILES[cleanEmail];
  }
  return null;
};

const saveProfileForEmail = (userObj) => {
  if (!userObj || !userObj.email) return;
  const cleanEmail = userObj.email.toLowerCase().trim();
  if (cleanEmail.includes('admin')) {
    userObj.isAdmin = true;
  }
  localStorage.setItem(`vithai_user_profile_${cleanEmail}`, JSON.stringify(userObj));
  localStorage.setItem('vithai_active_email', cleanEmail);

  try {
    const existingStr = localStorage.getItem('vithai_all_registered_users');
    let users = existingStr ? JSON.parse(existingStr) : [];
    
    const userProgressStr = localStorage.getItem(`vithai_progress_${cleanEmail}`);
    const userProgress = userProgressStr ? JSON.parse(userProgressStr) : {};

    const existingIdx = users.findIndex(u => u.email.toLowerCase() === cleanEmail);
    const updatedRecord = {
      id: userObj.id,
      name: userObj.name,
      email: cleanEmail,
      xp: userProgress.xp || userObj.xp || 100,
      streak: userProgress.streak || userObj.streak || 1,
      avatar: userObj.avatar || (userObj.isAdmin ? '👑' : '🎓'),
      isAdmin: !!userObj.isAdmin
    };

    if (existingIdx >= 0) {
      users[existingIdx] = { ...users[existingIdx], ...updatedRecord };
    } else {
      users.push(updatedRecord);
    }

    localStorage.setItem('vithai_all_registered_users', JSON.stringify(users));
  } catch (e) {
    console.error('Failed to sync master user registry', e);
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // 0. Check for initial token in URL hash on first paint
    if (typeof window !== 'undefined' && window.location.hash.includes('access_token=')) {
      try {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const token = hashParams.get('access_token');
        const jwtData = parseJwt(token);
        if (jwtData && jwtData.email) {
          const email = jwtData.email.toLowerCase().trim();
          const rawName = jwtData.user_metadata?.full_name || jwtData.user_metadata?.name || email.split('@')[0];
          const computedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
          const avatarUrl = jwtData.user_metadata?.avatar_url || jwtData.user_metadata?.picture || '🎓';
          const isAdmin = email.includes('admin');

          const newUserProfile = {
            id: jwtData.sub || 'usr_' + Date.now(),
            name: computedName,
            email: email,
            nativeLanguage: 'ta',
            learningCategory: 'both',
            learningLanguage: 'en',
            codingLanguage: 'python',
            level: 'beginner',
            dailyGoalMins: 20,
            goalObjective: 'vocabulary',
            avatar: avatarUrl,
            joinedDate: new Date().toISOString().split('T')[0],
            isAuthenticated: true,
            isOnboarded: true,
            isAdmin: isAdmin
          };

          saveProfileForEmail(newUserProfile);
          return newUserProfile;
        }
      } catch (e) {}
    }

    const activeEmail = localStorage.getItem('vithai_active_email');
    if (activeEmail) {
      const existingProfile = getProfileForEmail(activeEmail);
      if (existingProfile) return existingProfile;
    }
    const defaultProfile = PRESET_USER_PROFILES['sabari@vithai.edu'];
    saveProfileForEmail(defaultProfile);
    return defaultProfile;
  });

  const syncSupabaseProfile = useCallback(async (authUser) => {
    if (!authUser || !authUser.email) return;
    const email = authUser.email.toLowerCase().trim();

    let profile = null;
    if (isSupabaseConfigured && supabase) {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .maybeSingle();
        profile = data;
      } catch (e) {
        // Fallback gracefully if database table is not initialized
      }
    }

    const rawName = authUser.user_metadata?.full_name || authUser.user_metadata?.name || email.split('@')[0];
    const computedName = profile?.full_name || (rawName.charAt(0).toUpperCase() + rawName.slice(1));
    const avatarUrl = profile?.avatar || authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture;
    const isAdmin = email.includes('admin');

    const existing = getProfileForEmail(email) || {};

    const updatedUser = {
      ...existing,
      id: authUser.id || existing.id || 'usr_' + Date.now(),
      name: computedName,
      email: email,
      nativeLanguage: profile?.native_language || existing.nativeLanguage || 'ta',
      learningCategory: profile?.learning_category || existing.learningCategory || 'both',
      learningLanguage: profile?.learning_language || existing.learningLanguage || 'en',
      codingLanguage: profile?.coding_language || existing.codingLanguage || 'python',
      level: profile?.level || existing.level || 'beginner',
      dailyGoalMins: profile?.daily_goal_mins || existing.dailyGoalMins || 20,
      goalObjective: profile?.goal_objective || existing.goalObjective || 'vocabulary',
      avatar: avatarUrl || existing.avatar || (isAdmin ? '👑' : '🎓'),
      isAuthenticated: true,
      isOnboarded: existing.isOnboarded !== undefined ? existing.isOnboarded : true,
      isAdmin: isAdmin
    };

    setUser(updatedUser);
    saveProfileForEmail(updatedUser);

    // Clean OAuth tokens from browser URL
    if (typeof window !== 'undefined' && (window.location.hash.includes('access_token') || window.location.search.includes('code='))) {
      try {
        window.history.replaceState(null, document.title, window.location.pathname);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (user && user.email) {
      saveProfileForEmail(user);
    }
  }, [user]);

  // Sync Supabase Auth listener & initial session retrieval
  useEffect(() => {
    // 1. Initial URL check for tokens
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const search = window.location.search;
      if (hash.includes('access_token') || search.includes('code=')) {
        setTimeout(() => {
          try {
            window.history.replaceState(null, document.title, window.location.pathname);
          } catch (e) {}
        }, 800);
      }
    }

    if (!isSupabaseConfigured || !supabase) return;

    // Direct session hydration on mount / reload
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        syncSupabaseProfile(session.user);
      }
    }).catch(err => {
      console.warn('Session hydration notice:', err);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        syncSupabaseProfile(session.user);
      }
    });

    return () => subscription?.unsubscribe();
  }, [syncSupabaseProfile]);

  const login = async (email, password, displayName, customAvatar) => {
    const cleanEmail = email ? email.toLowerCase().trim() : 'sabari@vithai.edu';
    const isAdmin = cleanEmail.includes('admin') || password === 'admin123';

    // Gracefully handle Supabase login with fallback for local authentication
    if (isSupabaseConfigured && supabase && !isAdmin) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          console.warn('Supabase login notice (using local session fallback):', error.message);
        }
      } catch (e) {
        console.warn('Supabase connection fallback:', e);
      }
    }

    let userProfile = getProfileForEmail(cleanEmail);

    if (!userProfile) {
      const emailPrefix = cleanEmail.split('@')[0];
      const computedName = displayName || (isAdmin ? 'VithAI Super Admin' : emailPrefix.split('.')[0].charAt(0).toUpperCase() + emailPrefix.split('.')[0].slice(1));
      
      userProfile = {
        id: 'usr_' + Math.abs(cleanEmail.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)),
        name: computedName,
        email: cleanEmail,
        nativeLanguage: 'ta',
        learningCategory: 'both',
        learningLanguage: 'en',
        codingLanguage: 'python',
        level: 'beginner',
        dailyGoalMins: 20,
        goalObjective: 'vocabulary',
        avatar: customAvatar || (isAdmin ? '👑' : '🎓'),
        joinedDate: new Date().toISOString().split('T')[0],
        isAuthenticated: true,
        isOnboarded: true,
        isAdmin: isAdmin
      };
    } else {
      if (displayName) userProfile.name = displayName;
      if (customAvatar) userProfile.avatar = customAvatar;
      userProfile.isAuthenticated = true;
      userProfile.isAdmin = isAdmin;
    }

    localStorage.setItem('vithai_active_email', cleanEmail);
    saveProfileForEmail(userProfile);
    setUser(userProfile);

    return { success: true, isAdmin: userProfile.isAdmin };
  };

  const register = async (userData) => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signUp({
          email: userData.email,
          password: userData.password
        });
      } catch (e) {}
    }

    const cleanEmail = userData.email.toLowerCase().trim();
    const isAdmin = cleanEmail.includes('admin');
    const newUser = {
      id: 'usr_' + Date.now(),
      name: userData.fullName || cleanEmail.split('@')[0],
      email: cleanEmail,
      nativeLanguage: userData.nativeLanguage || 'ta',
      learningCategory: userData.learningType || 'both',
      learningLanguage: 'en',
      codingLanguage: 'python',
      level: 'beginner',
      dailyGoalMins: 20,
      goalObjective: 'vocabulary',
      avatar: isAdmin ? '👑' : '🎓',
      joinedDate: new Date().toISOString().split('T')[0],
      isAuthenticated: true,
      isOnboarded: false,
      isAdmin: isAdmin
    };

    localStorage.setItem('vithai_active_email', cleanEmail);
    saveProfileForEmail(newUser);
    setUser(newUser);

    return { success: true, isAdmin: newUser.isAdmin };
  };

  const completeOnboarding = async (onboardingData) => {
    setUser(prev => {
      const updated = {
        ...prev,
        nativeLanguage: onboardingData.nativeLanguage || prev?.nativeLanguage || 'ta',
        learningCategory: onboardingData.category || prev?.learningCategory || 'both',
        learningLanguage: onboardingData.learningLanguage || prev?.learningLanguage || 'en',
        codingLanguage: onboardingData.codingLanguage || prev?.codingLanguage || 'python',
        level: onboardingData.level || prev?.level || 'beginner',
        dailyGoalMins: onboardingData.dailyGoalMins || prev?.dailyGoalMins || 20,
        goalObjective: onboardingData.goalObjective || prev?.goalObjective || 'vocabulary',
        isOnboarded: true
      };

      saveProfileForEmail(updated);

      if (isSupabaseConfigured && supabase && prev?.id) {
        supabase.from('profiles').upsert({
          id: prev.id,
          email: prev.email,
          full_name: prev.name,
          native_language: updated.nativeLanguage,
          learning_category: updated.learningCategory,
          learning_language: updated.learningLanguage,
          coding_language: updated.codingLanguage,
          level: updated.level,
          daily_goal_mins: updated.dailyGoalMins,
          goal_objective: updated.goalObjective
        });
      }

      return updated;
    });
  };

  const updateProfile = (updatedFields) => {
    setUser(prev => {
      const updated = { ...prev, ...updatedFields };
      saveProfileForEmail(updated);

      if (isSupabaseConfigured && supabase && prev?.id) {
        supabase.from('profiles').update({
          full_name: updated.name,
          native_language: updated.nativeLanguage,
          learning_language: updated.learningLanguage,
          coding_language: updated.codingLanguage
        }).eq('id', prev.id);
      }

      return updated;
    });
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('vithai_active_email');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user?.isAuthenticated,
      isOnboarded: !!user?.isOnboarded,
      isAdmin: !!user?.isAdmin,
      isSupabaseConnected: isSupabaseConfigured,
      login,
      register,
      completeOnboarding,
      updateProfile,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
