-- SQL Schema for LingoLoop Platform in Supabase Database

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  native_language TEXT DEFAULT 'ta',
  learning_category TEXT DEFAULT 'both',
  learning_language TEXT DEFAULT 'en',
  coding_language TEXT DEFAULT 'python',
  level TEXT DEFAULT 'beginner',
  daily_goal_mins INT DEFAULT 20,
  goal_objective TEXT DEFAULT 'vocabulary',
  avatar TEXT DEFAULT '🦉',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. User Progress Table
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  xp INT DEFAULT 2450,
  coins INT DEFAULT 480,
  streak INT DEFAULT 12,
  learned_words JSONB DEFAULT '[]'::jsonb,
  mastered_words JSONB DEFAULT '[]'::jsonb,
  favorite_words JSONB DEFAULT '[]'::jsonb,
  completed_lessons JSONB DEFAULT '[]'::jsonb,
  unlocked_badges JSONB DEFAULT '[]'::jsonb,
  owned_rewards JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Test Attempts Table
CREATE TABLE IF NOT EXISTS public.test_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  score INT NOT NULL,
  total INT DEFAULT 60,
  percentage INT NOT NULL,
  xp_earned INT DEFAULT 50,
  category_scores JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert/update own progress" ON public.user_progress FOR ALL USING (auth.uid() = user_id);
