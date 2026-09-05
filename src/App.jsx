import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { LearningProvider } from './context/LearningContext';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import DailyLessonPage from './pages/DailyLessonPage';
import SundayTestPage from './pages/SundayTestPage';
import TestResultPage from './pages/TestResultPage';
import LearnLanguagesPage from './pages/LearnLanguagesPage';
import CodeLoopPage from './pages/CodeLoopPage';
import CodingLessonPage from './pages/CodingLessonPage';
import MockTestsPage from './pages/MockTestsPage';
import MockTestRunnerPage from './pages/MockTestRunnerPage';
import WordBookPage from './pages/WordBookPage';
import ProgressPage from './pages/ProgressPage';
import RewardsPage from './pages/RewardsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AuthCallbackPage from './pages/AuthCallbackPage';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LearningProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/daily-lesson" element={<DailyLessonPage />} />
              <Route path="/sunday-test" element={<SundayTestPage />} />
              <Route path="/test-result" element={<TestResultPage />} />
              
              <Route path="/learn" element={<LearnLanguagesPage />} />
              <Route path="/code" element={<CodeLoopPage />} />
              <Route path="/code-lesson/:langId" element={<CodingLessonPage />} />
              
              <Route path="/mock-tests" element={<MockTestsPage />} />
              <Route path="/mock-test/:testId" element={<MockTestRunnerPage />} />
              
              <Route path="/words" element={<WordBookPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/rewards" element={<RewardsPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </LearningProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
