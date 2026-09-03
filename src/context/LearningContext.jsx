import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const LearningContext = createContext();

export const getRealDayOfWeek = () => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date().getDay()];
};

// Fresh Zero Data Initialization by Default
const INITIAL_PROGRESS = {
  xp: 0,
  coins: 0,
  streak: 0,
  streakCalendar: { Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false },
  learnedWordIds: [],
  masteredWordIds: [],
  favoriteWordIds: [],
  completedLessonIds: [],
  completedStageIds: [],
  completedCodingLevelIds: [],
  testAttempts: [],
  unlockedBadgeIds: [],
  ownedRewardIds: [],
  activeFrame: null,
  activeBooster: null,
  simulatedDay: getRealDayOfWeek()
};

const PRESET_USER_PROGRESS = {
  'sabari@vithai.edu': {
    ...INITIAL_PROGRESS,
    xp: 1450,
    coins: 720,
    streak: 14,
    streakCalendar: { Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: true, Sun: false },
    completedLessonIds: ['w1_d1', 'w1_d2', 'w1_d3', 'w1_d4', 'w1_d5', 'w1_d6'],
    completedStageIds: ['python_Beginner', 'cpp_Beginner'],
    completedCodingLevelIds: ['python_L1', 'python_L2', 'python_L3', 'python_L4', 'python_L5', 'python_L6', 'python_L7', 'python_L8', 'python_L9', 'python_L10', 'python_L11', 'python_L12'],
    unlockedBadgeIds: ['first_lesson', 'streak_7']
  },
  'priya.sharma@gmail.com': {
    ...INITIAL_PROGRESS,
    xp: 2280,
    coins: 1140,
    streak: 15,
    streakCalendar: { Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: true, Sun: true },
    completedLessonIds: ['w1_d1', 'w1_d2', 'w1_d3', 'w1_d4', 'w1_d5', 'w1_d6', 'w1_d7'],
    unlockedBadgeIds: ['first_lesson', 'streak_7', 'streak_30', 'perfect_score']
  },
  'alex.chen@gmail.com': {
    ...INITIAL_PROGRESS,
    xp: 3400,
    coins: 1700,
    streak: 21,
    streakCalendar: { Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: true, Sun: true },
    completedLessonIds: ['w1_d1', 'w1_d2', 'w1_d3', 'w1_d4', 'w1_d5', 'w1_d6', 'w1_d7'],
    unlockedBadgeIds: ['first_lesson', 'streak_7', 'streak_30', 'code_master']
  }
};

export const calculateLevel = (xp = 0) => {
  if (xp < 300) return { level: 1, name: 'Beginner Explorer', nextXp: 300, minXp: 0 };
  if (xp < 800) return { level: 2, name: 'Language Learner', nextXp: 800, minXp: 300 };
  if (xp < 1800) return { level: 3, name: 'Fast Learner', nextXp: 1800, minXp: 800 };
  if (xp < 3200) return { level: 4, name: 'Word Master', nextXp: 3200, minXp: 1800 };
  if (xp < 5000) return { level: 5, name: 'Language Pro', nextXp: 5000, minXp: 3200 };
  if (xp < 8000) return { level: 6, name: 'Language Champion', nextXp: 8000, minXp: 5000 };
  return { level: 7, name: 'Polyglot Master', nextXp: 15000, minXp: 8000 };
};

export function LearningProvider({ children }) {
  const { user } = useAuth();
  const userEmail = user?.email ? user.email.toLowerCase().trim() : 'sabari@vithai.edu';

  const loadProgressForEmail = (email) => {
    const key = `vithai_progress_${email}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_PROGRESS,
          ...parsed,
          simulatedDay: parsed.simulatedDay || getRealDayOfWeek()
        };
      } catch (e) {
        console.error('Error loading progress for', email, e);
      }
    }
    if (PRESET_USER_PROGRESS[email]) {
      return PRESET_USER_PROGRESS[email];
    }
    return {
      ...INITIAL_PROGRESS,
      simulatedDay: getRealDayOfWeek()
    };
  };

  const [progress, setProgress] = useState(() => loadProgressForEmail(userEmail));

  // Re-hydrate progress whenever active user changes
  useEffect(() => {
    const loaded = loadProgressForEmail(userEmail);
    setProgress(loaded);
  }, [userEmail]);

  // Persist progress per isolated user key
  useEffect(() => {
    if (userEmail) {
      const key = `vithai_progress_${userEmail}`;
      localStorage.setItem(key, JSON.stringify(progress));

      // Also sync to master registered users list for Leaderboard
      try {
        const existingStr = localStorage.getItem('vithai_all_registered_users');
        if (existingStr && user?.name) {
          let users = JSON.parse(existingStr);
          const existingIdx = users.findIndex(u => u.email.toLowerCase() === userEmail);
          if (existingIdx >= 0) {
            users[existingIdx].xp = progress.xp || 0;
            users[existingIdx].streak = progress.streak || 0;
            users[existingIdx].avatar = user.avatar || '🎓';
            localStorage.setItem('vithai_all_registered_users', JSON.stringify(users));
          }
        }
      } catch (e) {
        console.error('Failed to sync progress to leaderboard registry', e);
      }
    }
  }, [progress, userEmail, user?.name, user?.avatar]);

  // Keep simulatedDay aligned with real-world date if not overridden
  useEffect(() => {
    const realDay = getRealDayOfWeek();
    if (!localStorage.getItem(`vithai_day_manually_overridden_${userEmail}`)) {
      setProgress(prev => ({ ...prev, simulatedDay: realDay }));
    }
  }, [userEmail]);

  const addXP = (amount) => {
    setProgress(prev => {
      const newXp = prev.xp + amount;
      const newLevel = calculateLevel(newXp).level;
      let newBadges = [...prev.unlockedBadgeIds];
      if (newLevel >= 2 && !newBadges.includes('first_lesson')) {
        newBadges.push('first_lesson');
      }
      return {
        ...prev,
        xp: newXp,
        coins: prev.coins + Math.floor(amount / 2),
        unlockedBadgeIds: newBadges
      };
    });
  };

  const markWordLearned = (wordId) => {
    setProgress(prev => {
      if (prev.learnedWordIds.includes(wordId)) return prev;
      return {
        ...prev,
        learnedWordIds: [...prev.learnedWordIds, wordId]
      };
    });
  };

  const markWordMastered = (wordId) => {
    setProgress(prev => {
      if (prev.masteredWordIds.includes(wordId)) return prev;
      return {
        ...prev,
        masteredWordIds: [...prev.masteredWordIds, wordId]
      };
    });
  };

  const toggleFavorite = (wordId) => {
    setProgress(prev => {
      const exists = prev.favoriteWordIds.includes(wordId);
      return {
        ...prev,
        favoriteWordIds: exists
          ? prev.favoriteWordIds.filter(id => id !== wordId)
          : [...prev.favoriteWordIds, wordId]
      };
    });
  };

  const completeLesson = (lessonId, xpEarned = 50) => {
    setProgress(prev => {
      const isNew = !prev.completedLessonIds.includes(lessonId);
      const updatedLessons = isNew ? [...prev.completedLessonIds, lessonId] : prev.completedLessonIds;
      const daysMap = { w1_d1: 'Mon', w1_d2: 'Tue', w1_d3: 'Wed', w1_d4: 'Thu', w1_d5: 'Fri', w1_d6: 'Sat' };
      const dayKey = daysMap[lessonId];
      const updatedCalendar = dayKey ? { ...prev.streakCalendar, [dayKey]: true } : prev.streakCalendar;

      return {
        ...prev,
        completedLessonIds: updatedLessons,
        streakCalendar: updatedCalendar,
        xp: isNew ? prev.xp + xpEarned : prev.xp,
        coins: isNew ? prev.coins + 25 : prev.coins,
        streak: isNew ? prev.streak + 1 : prev.streak
      };
    });
  };

  const completeCodingLevel = (langId, levelNumber) => {
    const levelKey = `${langId}_L${levelNumber}`;
    setProgress(prev => {
      const existing = prev.completedCodingLevelIds || [];
      if (existing.includes(levelKey)) return prev;
      return {
        ...prev,
        completedCodingLevelIds: [...existing, levelKey],
        xp: prev.xp + 25
      };
    });
  };

  const completeCodingStage = (langId, stageId) => {
    const stageKey = `${langId}_${stageId}`;
    setProgress(prev => {
      const existing = prev.completedStageIds || [];
      if (existing.includes(stageKey)) return prev;
      return {
        ...prev,
        completedStageIds: [...existing, stageKey],
        xp: prev.xp + 100,
        coins: prev.coins + 50
      };
    });
  };

  const submitSundayTest = (score, total = 60, categoryScores = {}) => {
    const percentage = Math.round((score / total) * 100);
    let xpAward = 30;
    if (percentage >= 90) xpAward += 20;
    if (percentage === 100) xpAward += 30;

    const newAttempt = {
      id: 'test_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      score,
      total,
      percentage,
      xpEarned: xpAward,
      categoryScores: categoryScores || { vocabulary: 88, grammar: 82, listening: 85, speaking: 80 }
    };

    setProgress(prev => {
      let newBadges = [...prev.unlockedBadgeIds];
      if (percentage >= 90 && !newBadges.includes('perfect_score')) {
        newBadges.push('perfect_score');
      }
      return {
        ...prev,
        xp: prev.xp + xpAward,
        coins: prev.coins + 50,
        streakCalendar: { ...prev.streakCalendar, Sun: true },
        testAttempts: [newAttempt, ...prev.testAttempts],
        unlockedBadgeIds: newBadges
      };
    });

    return newAttempt;
  };

  const buyRewardItem = (item) => {
    if (progress.coins < item.price) return { success: false, message: 'Not enough coins!' };
    setProgress(prev => ({
      ...prev,
      coins: prev.coins - item.price,
      ownedRewardIds: [...prev.ownedRewardIds, item.id],
      activeFrame: item.type === 'frame' ? item.id : prev.activeFrame
    }));
    return { success: true, message: `Successfully purchased ${item.name}!` };
  };

  const setSimulatedDay = (day) => {
    localStorage.setItem(`vithai_day_manually_overridden_${userEmail}`, 'true');
    setProgress(prev => ({ ...prev, simulatedDay: day }));
  };

  const resetAllDataToZero = () => {
    localStorage.removeItem(`vithai_day_manually_overridden_${userEmail}`);
    const zeroState = {
      ...INITIAL_PROGRESS,
      simulatedDay: getRealDayOfWeek()
    };
    setProgress(zeroState);
    localStorage.setItem(`vithai_progress_${userEmail}`, JSON.stringify(zeroState));
  };

  const currentLevelInfo = calculateLevel(progress.xp);

  return (
    <LearningContext.Provider value={{
      progress,
      levelInfo: currentLevelInfo,
      addXP,
      markWordLearned,
      markWordMastered,
      toggleFavorite,
      completeLesson,
      completeCodingLevel,
      completeCodingStage,
      submitSundayTest,
      buyRewardItem,
      setSimulatedDay,
      resetAllDataToZero
    }}>
      {children}
    </LearningContext.Provider>
  );
}

export function useLearning() {
  return useContext(LearningContext);
}
