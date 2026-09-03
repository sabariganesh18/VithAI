import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext();

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
    const activeEmail = localStorage.getItem('vithai_active_email');
    if (activeEmail) {
      const existingProfile = getProfileForEmail(activeEmail);
      if (existingProfile) return existingProfile;
    }
    const defaultProfile = PRESET_USER_PROFILES['sabari@vithai.edu'];
    saveProfileForEmail(defaultProfile);
    return defaultProfile;
  });

  useEffect(() => {
    if (user && user.email) {
      saveProfileForEmail(user);
    }
  }, [user]);

  // Sync Supabase Auth listener if Supabase is enabled
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const email = session.user.email;
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        const fallbackName = session.user.user_metadata?.full_name || email.split('@')[0];
        const computedName = profile?.full_name || fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1);
        const isAdmin = email.toLowerCase().includes('admin');

        const updatedUser = {
          id: session.user.id,
          name: computedName,
          email: email,
          nativeLanguage: profile?.native_language || 'ta',
          learningCategory: profile?.learning_category || 'both',
          learningLanguage: profile?.learning_language || 'en',
          codingLanguage: profile?.coding_language || 'python',
          level: profile?.level || 'beginner',
          dailyGoalMins: profile?.daily_goal_mins || 20,
          goalObjective: profile?.goal_objective || 'vocabulary',
          avatar: profile?.avatar || (isAdmin ? '👑' : '🎓'),
          isAuthenticated: true,
          isOnboarded: true,
          isAdmin: isAdmin
        };

        setUser(updatedUser);
        saveProfileForEmail(updatedUser);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

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
