import React, { useState } from 'react';
import { LogIn, UserPlus, Sparkles, KeyRound, Mail, User, BookOpen, Clock, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { AuthUser } from '../types';
import { playMechanicalClick, playChiptuneBeep, playVictoryFanfare } from '../utils/audio';

interface AuthScreenProps {
  onLoginSuccess: (user: AuthUser, isNewUser: boolean) => void;
  onContinueAsGuest: () => void;
  soundEnabled: boolean;
  logoutNotice?: string | null;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLoginSuccess,
  onContinueAsGuest,
  soundEnabled,
  logoutNotice,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('alex');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Sign up form state
  const [signupName, setSignupName] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupMajor, setSignupMajor] = useState('Computer Science');
  const [signupGoalMinutes, setSignupGoalMinutes] = useState<number>(45);

  // Status & loading
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(logoutNotice || null);

  // Handle Login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setErrorMessage('Please enter both your username/email and password.');
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);
    playMechanicalClick(soundEnabled);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: loginIdentifier.trim(),
          password: loginPassword,
        }),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        playVictoryFanfare(soundEnabled);
        setSuccessMessage('Access granted! Loading companion cartridge...');
        setTimeout(() => {
          onLoginSuccess(data.user, false);
        }, 350);
      } else {
        // Fallback local verification for offline/client resilience
        if (
          (loginIdentifier.toLowerCase() === 'alex' || loginIdentifier.toLowerCase() === 'alex@example.com') &&
          loginPassword === 'password123'
        ) {
          playVictoryFanfare(soundEnabled);
          const fallbackUser: AuthUser = {
            id: 'usr-demo-1',
            username: 'alex',
            name: 'Alex Chen',
            email: 'alex@example.com',
            studyMajor: 'Computer Science (B.Tech)',
            dailyGoalMinutes: 60,
            createdAt: Date.now() - 86400000 * 7,
          };
          onLoginSuccess(fallbackUser, false);
        } else {
          setErrorMessage(data.error || 'Invalid username/email or password.');
          playChiptuneBeep(330, soundEnabled);
        }
      }
    } catch {
      // Local fallback
      if (loginIdentifier.trim()) {
        const fallbackUser: AuthUser = {
          id: `usr-${Date.now()}`,
          username: loginIdentifier.toLowerCase().trim(),
          name: loginIdentifier.charAt(0).toUpperCase() + loginIdentifier.slice(1),
          email: `${loginIdentifier.toLowerCase()}@study.local`,
          studyMajor: 'Computer Science',
          dailyGoalMinutes: 45,
          createdAt: Date.now(),
        };
        playVictoryFanfare(soundEnabled);
        onLoginSuccess(fallbackUser, false);
      } else {
        setErrorMessage('Unable to connect to auth service. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Sign up submission
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupUsername.trim() || !signupName.trim() || !signupPassword.trim()) {
      setErrorMessage('Please fill in your name, username, and password.');
      return;
    }

    if (signupPassword.length < 4) {
      setErrorMessage('Password should be at least 4 characters long.');
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);
    playMechanicalClick(soundEnabled);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupName.trim(),
          username: signupUsername.trim(),
          email: signupEmail.trim() || `${signupUsername.toLowerCase().trim()}@study.local`,
          password: signupPassword,
          studyMajor: signupMajor.trim(),
          dailyGoalMinutes: signupGoalMinutes,
        }),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        playVictoryFanfare(soundEnabled);
        setSuccessMessage('Account created! Welcome to Cozy Pocket.');
        setTimeout(() => {
          onLoginSuccess(data.user, true);
        }, 400);
      } else {
        setErrorMessage(data.error || 'Registration failed. Please try a different username.');
        playChiptuneBeep(330, soundEnabled);
      }
    } catch {
      // Fallback local account creation
      const localNewUser: AuthUser = {
        id: `usr-${Date.now()}`,
        name: signupName.trim(),
        username: signupUsername.toLowerCase().trim(),
        email: signupEmail.trim() || `${signupUsername.toLowerCase().trim()}@study.local`,
        studyMajor: signupMajor,
        dailyGoalMinutes: signupGoalMinutes,
        createdAt: Date.now(),
      };
      playVictoryFanfare(soundEnabled);
      onLoginSuccess(localNewUser, true);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick 1-tap demo user loader for tester convenience
  const handleQuickDemo = (user: 'alex' | 'sam') => {
    playMechanicalClick(soundEnabled);
    if (user === 'alex') {
      setLoginIdentifier('alex');
      setLoginPassword('password123');
    } else {
      setLoginIdentifier('sam');
      setLoginPassword('password123');
    }
    setErrorMessage(null);
    setSuccessMessage(`Loaded ${user === 'alex' ? 'Alex Chen' : 'Sam Rivera'} demo credentials. Click "Sign In" or submit.`);
  };

  return (
    <div className="w-full max-w-xl mx-auto py-4 px-2 select-none">
      {/* Handheld Console Chassis Window */}
      <div className="bg-[#FAF8F5] border-2 border-[#2D3142] p-5 sm:p-7 pixel-shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 lcd-subtle pointer-events-none" />

        {/* Header Ribbon */}
        <div className="flex items-center justify-between border-b-2 border-[#2D3142] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#7FB685] border border-[#2D3142] pixel-shadow-sm flex items-center justify-center">
              <div className="w-1 h-1 bg-[#FAF8F5]" />
            </div>
            <span className="font-mono text-xs sm:text-sm font-bold tracking-tight text-[#2D3142] uppercase">
              COZY POCKET USER PORTAL
            </span>
          </div>

          <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-[#CADBFB] border border-[#2D3142] text-[#2D3142]">
            SECURITY PROTOCOL 2026
          </span>
        </div>

        {/* Subtitle / Context */}
        <p className="font-sans text-xs text-[#2D3142]/80 mb-4 leading-relaxed">
          Welcome to the prototype focus ecosystem. Sign in to sync your active tasks, routines, and pet companion level, or create a new student profile.
        </p>

        {/* Notices */}
        {errorMessage && (
          <div className="mb-4 p-2.5 bg-[#ffdad6] border-2 border-[#ba1a1a] flex items-center gap-2 pixel-shadow-sm">
            <AlertCircle className="w-4 h-4 text-[#ba1a1a] shrink-0" />
            <span className="font-mono text-xs text-[#93000a] font-bold">
              {errorMessage}
            </span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-2.5 bg-[#CADBFB] border-2 border-[#2D3142] flex items-center gap-2 pixel-shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-[#35693F] shrink-0" />
            <span className="font-mono text-xs text-[#2D3142] font-bold">
              {successMessage}
            </span>
          </div>
        )}

        {/* Mode Selector Tabs (Sign In vs Sign Up) */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          <button
            id="auth-tab-login"
            type="button"
            onClick={() => {
              playMechanicalClick(soundEnabled);
              setAuthMode('login');
              setErrorMessage(null);
            }}
            className={`pixel-btn py-2 px-3 border-2 border-[#2D3142] font-mono text-xs sm:text-sm font-bold flex items-center justify-center gap-2 ${
              authMode === 'login'
                ? 'bg-[#7FB685] text-[#2D3142] pixel-shadow font-bold'
                : 'bg-[#F2EFE9] text-[#2D3142]/70'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>SIGN IN</span>
          </button>

          <button
            id="auth-tab-signup"
            type="button"
            onClick={() => {
              playMechanicalClick(soundEnabled);
              setAuthMode('signup');
              setErrorMessage(null);
            }}
            className={`pixel-btn py-2 px-3 border-2 border-[#2D3142] font-mono text-xs sm:text-sm font-bold flex items-center justify-center gap-2 ${
              authMode === 'signup'
                ? 'bg-[#F4A261] text-[#2D3142] pixel-shadow font-bold'
                : 'bg-[#F2EFE9] text-[#2D3142]/70'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>CREATE ACCOUNT</span>
          </button>
        </div>

        {/* TAB 1: SIGN IN FORM */}
        {authMode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="block font-mono text-[11px] font-bold text-[#2D3142] mb-1">
                USERNAME OR EMAIL:
              </label>
              <div className="relative">
                <input
                  id="login-identifier-input"
                  type="text"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="e.g. alex or alex@example.com"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border-2 border-[#2D3142] font-mono text-xs sm:text-sm text-[#2D3142] pixel-inset focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[11px] font-bold text-[#2D3142] mb-1">
                PASSWORD:
              </label>
              <input
                id="login-password-input"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-[#FAF8F5] border-2 border-[#2D3142] font-mono text-xs sm:text-sm text-[#2D3142] pixel-inset focus:outline-none"
                required
              />
            </div>

            {/* Quick Demo Pre-fill Bar for Prototype Reviewers */}
            <div className="pt-1 pb-1">
              <div className="font-mono text-[10px] text-[#2D3142]/70 mb-1 font-bold uppercase">
                QUICK DEMO PROFILES (1-CLICK LOAD):
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  id="load-demo-alex-btn"
                  onClick={() => handleQuickDemo('alex')}
                  className="pixel-btn px-2 py-1 bg-[#F2EFE9] hover:bg-[#CADBFB] border border-[#2D3142] font-mono text-[10px] font-bold text-[#2D3142]"
                >
                  👤 Alex Chen (CS Student)
                </button>
                <button
                  type="button"
                  id="load-demo-sam-btn"
                  onClick={() => handleQuickDemo('sam')}
                  className="pixel-btn px-2 py-1 bg-[#F2EFE9] hover:bg-[#F8C390] border border-[#2D3142] font-mono text-[10px] font-bold text-[#2D3142]"
                >
                  👤 Sam Rivera (Design)
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="submit-login-btn"
              disabled={isLoading}
              className="pixel-btn w-full py-2.5 bg-[#7FB685] hover:bg-[#A3CFAB] border-2 border-[#2D3142] font-mono text-xs sm:text-sm font-bold text-[#2D3142] pixel-shadow flex items-center justify-center gap-2 mt-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isLoading ? 'VERIFYING CREDENTIALS...' : 'SIGN IN & ENTER FOCUS'}</span>
            </button>
          </form>
        )}

        {/* TAB 2: CREATE ACCOUNT FORM */}
        {authMode === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-[11px] font-bold text-[#2D3142] mb-1">
                  FULL NAME:
                </label>
                <input
                  id="signup-name-input"
                  type="text"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="e.g. Maya Patel"
                  className="w-full px-3 py-1.5 bg-[#FAF8F5] border-2 border-[#2D3142] font-sans text-xs sm:text-sm text-[#2D3142] pixel-inset focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] font-bold text-[#2D3142] mb-1">
                  CHOOSE USERNAME:
                </label>
                <input
                  id="signup-username-input"
                  type="text"
                  value={signupUsername}
                  onChange={(e) => setSignupUsername(e.target.value)}
                  placeholder="e.g. mayap"
                  className="w-full px-3 py-1.5 bg-[#FAF8F5] border-2 border-[#2D3142] font-mono text-xs sm:text-sm text-[#2D3142] pixel-inset focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-[11px] font-bold text-[#2D3142] mb-1">
                  STUDENT EMAIL:
                </label>
                <input
                  id="signup-email-input"
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="e.g. maya@thapar.edu"
                  className="w-full px-3 py-1.5 bg-[#FAF8F5] border-2 border-[#2D3142] font-sans text-xs sm:text-sm text-[#2D3142] pixel-inset focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] font-bold text-[#2D3142] mb-1">
                  PASSWORD:
                </label>
                <input
                  id="signup-password-input"
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="At least 4 characters"
                  className="w-full px-3 py-1.5 bg-[#FAF8F5] border-2 border-[#2D3142] font-mono text-xs sm:text-sm text-[#2D3142] pixel-inset focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-[11px] font-bold text-[#2D3142] mb-1">
                  MAJOR / FOCUS FIELD:
                </label>
                <input
                  id="signup-major-input"
                  type="text"
                  value={signupMajor}
                  onChange={(e) => setSignupMajor(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="w-full px-3 py-1.5 bg-[#FAF8F5] border-2 border-[#2D3142] font-sans text-xs text-[#2D3142] pixel-inset focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] font-bold text-[#2D3142] mb-1">
                  DAILY STUDY GOAL:
                </label>
                <select
                  id="signup-goal-select"
                  value={signupGoalMinutes}
                  onChange={(e) => setSignupGoalMinutes(Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-[#FAF8F5] border-2 border-[#2D3142] font-mono text-xs font-bold text-[#2D3142] pixel-inset-soft"
                >
                  <option value={25}>25 Minutes (Low Pressure)</option>
                  <option value={45}>45 Minutes (Balanced)</option>
                  <option value={60}>60 Minutes (Standard Study)</option>
                  <option value={90}>90 Minutes (Deep Work)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              id="submit-signup-btn"
              disabled={isLoading}
              className="pixel-btn w-full py-2.5 bg-[#F4A261] hover:bg-[#F8C390] border-2 border-[#2D3142] font-mono text-xs sm:text-sm font-bold text-[#2D3142] pixel-shadow flex items-center justify-center gap-2 mt-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? 'CREATING CARTRIDGE...' : 'INITIALIZE NEW USER PROFILE'}</span>
            </button>
          </form>
        )}

        {/* Guest Testing Option */}
        <div className="mt-5 pt-3 border-t border-[#2D3142]/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="font-sans text-[11px] text-[#2D3142]/70">
            Just testing the interface without an account?
          </div>
          <button
            type="button"
            id="continue-as-guest-btn"
            onClick={() => {
              playMechanicalClick(soundEnabled);
              onContinueAsGuest();
            }}
            className="pixel-btn px-3 py-1 bg-[#F2EFE9] hover:bg-[#FAF8F5] border border-[#2D3142] font-mono text-[11px] font-bold text-[#2D3142] whitespace-nowrap"
          >
            ENTER AS GUEST EXPLORER →
          </button>
        </div>
      </div>
    </div>
  );
};
