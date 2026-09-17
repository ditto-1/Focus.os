import React, { useState } from 'react';
import {
  Sparkles,
  KeyRound,
  User,
  BookOpen,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Volume2,
  VolumeX,
  Compass,
  Heart,
} from 'lucide-react';
import { AuthUser } from '../types';
import {
  playMechanicalClick,
  playChiptuneBeep,
  playVictoryFanfare,
} from '../utils/audio';

interface AuthScreenProps {
  onLoginSuccess: (user: AuthUser, isNewUser: boolean) => void;
  onContinueAsGuest: () => void;
  soundEnabled: boolean;
  onToggleSound?: () => void;
  logoutNotice?: string | null;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLoginSuccess,
  onContinueAsGuest,
  soundEnabled,
  onToggleSound,
  logoutNotice,
}) => {
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('student');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Sign up form state (Level 0 fresh start)
  const [signupName, setSignupName] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupMajor, setSignupMajor] = useState('Computer Science');
  const [signupGoalMinutes, setSignupGoalMinutes] = useState<number>(30);

  // Status & interactive animation states
  const [isLoading, setIsLoading] = useState(false);
  const [bootProgress, setBootProgress] = useState<number>(0);
  const [isBooting, setIsBooting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(logoutNotice || null);

  // Mascot interaction
  const [mascotPoked, setMascotPoked] = useState(false);
  const [mascotSpeech, setMascotSpeech] = useState<string>(
    logoutNotice
      ? 'Cartridge ejected safely! Zzz... tap me to start fresh!'
      : 'Hi! I am Sprout 🌱. Sign up below to start your Level 0 cartridge!'
  );

  const handlePokeMascot = () => {
    playChiptuneBeep(659.25, soundEnabled);
    setTimeout(() => playChiptuneBeep(880, soundEnabled), 120);
    setMascotPoked(true);
    const cuteReplies = [
      'Poyo! Ready to study at Level 0! 🌱',
      'I am warming up my leaves for focus time! ✨',
      'One gentle sprint at a time! (⁠◕⁠ᴗ⁠◕⁠✿)',
      'Tap sign up to hatch my seedling form! 🐣',
    ];
    const pick = cuteReplies[Math.floor(Math.random() * cuteReplies.length)];
    setMascotSpeech(pick);
    setTimeout(() => setMascotPoked(false), 800);
  };

  const triggerBootSequence = (user: AuthUser, isNewUser: boolean) => {
    setIsBooting(true);
    setIsLoading(true);
    playVictoryFanfare(soundEnabled);

    let progress = 10;
    const interval = setInterval(() => {
      progress += 25;
      setBootProgress(Math.min(100, progress));
      playChiptuneBeep(440 + progress * 4, soundEnabled);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onLoginSuccess(user, isNewUser);
        }, 300);
      }
    }, 150);
  };

  // Handle Login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setErrorMessage('Please enter both username and password.');
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
        const isFresh = data.user.id === 'usr-demo-0' || data.user.username === 'student';
        triggerBootSequence(data.user, isFresh);
      } else {
        // Fallback local matching
        const idLower = loginIdentifier.toLowerCase().trim();
        if (idLower === 'student' && loginPassword === 'password123') {
          const freshUser: AuthUser = {
            id: 'usr-demo-0',
            username: 'student',
            name: 'Taylor Reed (Newbie)',
            email: 'student@study.local',
            studyMajor: 'Cognitive Science & Psychology',
            dailyGoalMinutes: 30,
            createdAt: Date.now(),
          };
          triggerBootSequence(freshUser, true);
        } else if (idLower === 'alex' && loginPassword === 'password123') {
          const existingUser: AuthUser = {
            id: 'usr-demo-1',
            username: 'alex',
            name: 'Alex Chen',
            email: 'alex@example.com',
            studyMajor: 'Computer Science (B.Tech)',
            dailyGoalMinutes: 60,
            createdAt: Date.now() - 86400000 * 7,
          };
          triggerBootSequence(existingUser, false);
        } else {
          setErrorMessage(data.error || 'Invalid credentials. Check your username/password.');
          setIsLoading(false);
        }
      }
    } catch {
      // Offline fallback
      if (loginIdentifier.trim()) {
        const offlineUser: AuthUser = {
          id: `usr-${Date.now()}`,
          username: loginIdentifier.trim(),
          name: loginIdentifier.trim(),
          email: `${loginIdentifier.trim().toLowerCase()}@study.local`,
          studyMajor: 'Student Studies',
          dailyGoalMinutes: 30,
          createdAt: Date.now(),
        };
        triggerBootSequence(offlineUser, true);
      } else {
        setErrorMessage('Unable to connect to auth server. Try continuing as Guest!');
        setIsLoading(false);
      }
    }
  };

  // Handle Signup submission (Fresh Level 0 Cartridge)
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim() || !signupUsername.trim() || !signupPassword.trim()) {
      setErrorMessage('Please fill in your name, chosen username, and password.');
      return;
    }

    if (signupPassword.length < 4) {
      setErrorMessage('Password must be at least 4 characters for security.');
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
          username: signupUsername.trim().toLowerCase(),
          email: signupEmail.trim() || `${signupUsername.trim().toLowerCase()}@study.local`,
          password: signupPassword,
          studyMajor: signupMajor.trim() || 'General Academics',
          dailyGoalMinutes: signupGoalMinutes,
        }),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        triggerBootSequence(data.user, true);
      } else {
        setErrorMessage(data.error || 'Registration failed. Try a different username.');
        setIsLoading(false);
      }
    } catch {
      // Offline fallback: create valid client user at Level 0
      const localNewUser: AuthUser = {
        id: `usr-${Date.now()}`,
        name: signupName.trim(),
        username: signupUsername.trim().toLowerCase(),
        email: signupEmail.trim() || `${signupUsername.trim().toLowerCase()}@study.local`,
        studyMajor: signupMajor.trim() || 'General Academics',
        dailyGoalMinutes: signupGoalMinutes,
        createdAt: Date.now(),
      };
      triggerBootSequence(localNewUser, true);
    }
  };

  // 1-Click Demo Profiles
  const loadDemoUser = (type: 'fresh-level-0' | 'alex-level-1' | 'guest') => {
    playMechanicalClick(soundEnabled);
    if (type === 'fresh-level-0') {
      const freshUser: AuthUser = {
        id: 'usr-demo-0',
        username: 'student',
        name: 'Taylor Reed (Newbie)',
        email: 'student@study.local',
        studyMajor: 'Cognitive Science & Psychology',
        dailyGoalMinutes: 30,
        createdAt: Date.now(),
      };
      triggerBootSequence(freshUser, true);
    } else if (type === 'alex-level-1') {
      const alexUser: AuthUser = {
        id: 'usr-demo-1',
        username: 'alex',
        name: 'Alex Chen',
        email: 'alex@example.com',
        studyMajor: 'Computer Science (B.Tech)',
        dailyGoalMinutes: 60,
        createdAt: Date.now() - 86400000 * 7,
      };
      triggerBootSequence(alexUser, false);
    } else {
      onContinueAsGuest();
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F4ED] text-[#2D3142] relative overflow-hidden flex flex-col items-center justify-center p-3 sm:p-6 select-none font-sans">
      {/* Whimsical Background Decor: Floating pixel stars, clouds & sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60">
        <div className="absolute top-8 left-10 text-xl text-[#F4A261] animate-bounce">✦</div>
        <div className="absolute top-24 right-16 text-2xl text-[#7FB685] animate-pulse">★</div>
        <div className="absolute bottom-16 left-12 text-2xl text-[#B4C5E4] animate-pulse">✧</div>
        <div className="absolute bottom-20 right-14 text-xl text-[#E76F51] animate-bounce">✦</div>
        <div className="absolute top-1/3 left-6 text-sm font-mono text-[#2D3142]/30">｡･:*˚:✧｡</div>
        <div className="absolute top-2/3 right-8 text-sm font-mono text-[#2D3142]/30">｡･:*˚:✧｡</div>
        {/* Soft pastel decorative circles */}
        <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-[#CADBFB]/30 blur-2xl" />
        <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-[#E5D4C0]/40 blur-2xl" />
      </div>

      {/* Floating Top Mini Bar (Sound toggle & System info) */}
      <div className="w-full max-w-lg flex items-center justify-between px-2 mb-3 z-10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#7FB685] animate-ping" />
          <span className="font-mono text-[11px] font-bold text-[#2D3142] tracking-wider uppercase">
            COZY POCKET DMG-2026
          </span>
        </div>
        {onToggleSound && (
          <button
            onClick={() => {
              playMechanicalClick(soundEnabled);
              onToggleSound();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FAF8F5] hover:bg-[#CADBFB] border-2 border-[#2D3142] pixel-shadow-sm font-mono text-[10px] font-bold text-[#2D3142] transition-colors"
            title="Toggle Audio Feedback"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#7FB685]" />
                <span>CHIPTUNE ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[#2D3142]/50" />
                <span>MUTED</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Retro Handheld Chassis Bezel Container */}
      <div className="w-full max-w-lg bg-[#EAE5D9] border-4 border-[#2D3142] rounded-3xl p-3 sm:p-5 pixel-shadow-lg relative z-10 flex flex-col">
        {/* Top Cartridge Bay Slot */}
        <div className="w-full bg-[#D8D2C2] border-2 border-[#2D3142] py-1.5 px-3 mb-3 flex items-center justify-between rounded-lg">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#2D3142]" />
            <span className="font-mono text-[10px] font-bold text-[#2D3142] uppercase tracking-widest">
              MEMORY CARTRIDGE BAY
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-3 bg-[#2D3142]" />
            <span className="w-1.5 h-3 bg-[#2D3142]" />
            <span className="w-1.5 h-3 bg-[#2D3142]" />
          </div>
        </div>

        {/* LCD Screen Display Area */}
        <div className="w-full bg-[#F5F2E9] border-3 border-[#2D3142] rounded-xl p-3 sm:p-4 pixel-inset relative flex flex-col">
          {/* LCD Screen Header Status Bar */}
          <div className="flex items-center justify-between border-b-2 border-[#2D3142] pb-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E76F51] border border-[#2D3142] inline-block animate-pulse" />
              <span className="font-mono text-[11px] font-bold text-[#2D3142]">
                BOOT SEQUENCE // {authMode === 'signup' ? 'NEW CART' : 'LOGIN'}
              </span>
            </div>
            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 bg-[#CADBFB] border border-[#2D3142] text-[#2D3142]">
              LEVEL 0 READY
            </span>
          </div>

          {/* Cute Whimsical Animated Mascot Hero Section */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#FAF8F5] border-2 border-[#2D3142] p-3 mb-3 pixel-shadow-sm">
            {/* Interactive Pixel Sprout Creature */}
            <div
              onClick={handlePokeMascot}
              className={`cursor-pointer group relative flex flex-col items-center justify-center p-2 bg-[#F2EFE9] border-2 border-[#2D3142] rounded-lg transition-transform hover:scale-105 ${
                mascotPoked ? 'scale-110' : ''
              }`}
              title="Tap Sprout to play!"
            >
              {mascotPoked && (
                <div className="absolute -top-3 animate-bounce flex items-center gap-1 bg-[#F8C390] border border-[#2D3142] px-1.5 py-0.5 z-20">
                  <Heart className="w-3 h-3 fill-[#E76F51] text-[#E76F51]" />
                  <span className="font-mono text-[9px] font-bold text-[#2D3142]">♥</span>
                </div>
              )}

              {/* 8-bit Pixel Seedling SVG */}
              <svg
                viewBox="0 0 24 24"
                className="w-16 h-16 filter drop-shadow-[2px_2px_0px_#2D3142] transition-transform group-hover:rotate-6"
                style={{ shapeRendering: 'crispEdges' }}
              >
                {/* Body */}
                <rect x="7" y="9" width="10" height="10" fill="#7FB685" />
                <rect x="8" y="8" width="8" height="1" fill="#7FB685" />
                <rect x="8" y="19" width="8" height="1" fill="#7FB685" />
                {/* Cheeks */}
                <rect x="6" y="13" width="2" height="2" fill="#F8C390" />
                <rect x="16" y="13" width="2" height="2" fill="#F8C390" />
                {/* Cute Eyes */}
                <rect x="9" y="11" width="2" height="2" fill="#2D3142" />
                <rect x="13" y="11" width="2" height="2" fill="#2D3142" />
                <rect x="9" y="11" width="1" height="1" fill="#FFFFFF" />
                <rect x="13" y="11" width="1" height="1" fill="#FFFFFF" />
                {/* Mouth */}
                <rect x="11" y="15" width="2" height="1" fill="#2D3142" />
                {/* Sprout Leaf on top */}
                <rect x="11" y="5" width="2" height="3" fill="#35693F" />
                <rect x="8" y="4" width="4" height="2" fill="#7FB685" />
                <rect x="12" y="3" width="4" height="2" fill="#A3CFAB" />
                <rect x="10" y="3" width="2" height="1" fill="#7FB685" />
                {/* Feet */}
                <rect x="8" y="19" width="2" height="2" fill="#35693F" />
                <rect x="14" y="19" width="2" height="2" fill="#35693F" />
              </svg>

              <span className="font-mono text-[9px] font-bold text-[#2D3142] mt-1 bg-[#E4DFD5] px-1 border border-[#2D3142]">
                SPROUT (LVL 0)
              </span>
            </div>

            {/* Mascot Speech Dialogue Box */}
            <div className="flex-1 w-full bg-[#FAF8F5] border border-[#2D3142] p-2.5 relative">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[9px] font-bold text-[#7FB685] tracking-wider uppercase">
                  POCKET BUDDY SAYS:
                </span>
                <span className="font-mono text-[8px] text-[#2D3142]/60">[TAP ME TO PLAY]</span>
              </div>
              <p className="font-sans text-xs text-[#2D3142] leading-relaxed">
                {mascotSpeech}
              </p>
              <div className="absolute bottom-1 right-2 font-mono text-[9px] text-[#2D3142] blink-cursor">
                ▼
              </div>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => {
                playMechanicalClick(soundEnabled);
                setAuthMode('signup');
                setErrorMessage(null);
                setMascotSpeech('Starting fresh! Your companion begins at Level 0 🌱.');
              }}
              className={`py-2 px-3 border-2 border-[#2D3142] font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'signup'
                  ? 'bg-[#7FB685] text-[#2D3142] pixel-shadow-sm -translate-y-0.5'
                  : 'bg-[#FAF8F5] text-[#2D3142]/70 hover:bg-[#F2EFE9]'
              }`}
            >
              <span>🌱 NEW ADVENTURER</span>
            </button>

            <button
              onClick={() => {
                playMechanicalClick(soundEnabled);
                setAuthMode('login');
                setErrorMessage(null);
                setMascotSpeech('Welcome back! Load your saved cartridge progress 💾.');
              }}
              className={`py-2 px-3 border-2 border-[#2D3142] font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'login'
                  ? 'bg-[#CADBFB] text-[#2D3142] pixel-shadow-sm -translate-y-0.5'
                  : 'bg-[#FAF8F5] text-[#2D3142]/70 hover:bg-[#F2EFE9]'
              }`}
            >
              <span>🔑 RESUME QUEST</span>
            </button>
          </div>

          {/* Error / Status Notices */}
          {errorMessage && (
            <div className="mb-3 p-2 bg-[#FDE8E8] border-2 border-[#E76F51] flex items-center gap-2 text-xs font-mono text-[#E76F51]">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && !errorMessage && (
            <div className="mb-3 p-2 bg-[#EAF7ED] border-2 border-[#7FB685] flex items-center gap-2 text-xs font-mono text-[#2D3142]">
              <CheckCircle2 className="w-4 h-4 text-[#7FB685] flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form 1: SIGN UP (Fresh Start at Level 0) */}
          {authMode === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-3">
              <div className="bg-[#FAF8F5] border border-[#2D3142] p-2 flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#2D3142] font-bold">
                  ★ DAY 1 CARTRIDGE:
                </span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 bg-[#7FB685] text-[#2D3142] border border-[#2D3142] font-bold">
                  LVL 0 SEEDLING • 0 XP • FRESH SLATE
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-mono text-[10px] font-bold text-[#2D3142] uppercase mb-1">
                    Your Name:
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#2D3142]/50" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jordan Lee"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="w-full pl-8 pr-2 py-1.5 bg-[#FAF8F5] border-2 border-[#2D3142] font-sans text-xs text-[#2D3142] focus:outline-none focus:bg-white pixel-inset"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-bold text-[#2D3142] uppercase mb-1">
                    Handle / Username:
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-xs font-mono text-[#2D3142]/50">@</span>
                    <input
                      type="text"
                      required
                      placeholder="jordan"
                      value={signupUsername}
                      onChange={(e) => setSignupUsername(e.target.value)}
                      className="w-full pl-7 pr-2 py-1.5 bg-[#FAF8F5] border-2 border-[#2D3142] font-mono text-xs text-[#2D3142] focus:outline-none focus:bg-white pixel-inset"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-mono text-[10px] font-bold text-[#2D3142] uppercase mb-1">
                    Study Field / Focus:
                  </label>
                  <div className="relative">
                    <BookOpen className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#2D3142]/50" />
                    <input
                      type="text"
                      placeholder="e.g. Computer Science, Design"
                      value={signupMajor}
                      onChange={(e) => setSignupMajor(e.target.value)}
                      className="w-full pl-8 pr-2 py-1.5 bg-[#FAF8F5] border-2 border-[#2D3142] font-sans text-xs text-[#2D3142] focus:outline-none focus:bg-white pixel-inset"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-bold text-[#2D3142] uppercase mb-1">
                    Create Password:
                  </label>
                  <div className="relative">
                    <KeyRound className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#2D3142]/50" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="w-full pl-8 pr-2 py-1.5 bg-[#FAF8F5] border-2 border-[#2D3142] font-mono text-xs text-[#2D3142] focus:outline-none focus:bg-white pixel-inset"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] font-bold text-[#2D3142] uppercase mb-1">
                  Daily Focus Target: <span className="text-[#E76F51]">{signupGoalMinutes} MINS / DAY</span>
                </label>
                <div className="flex gap-2">
                  {[20, 30, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => {
                        playMechanicalClick(soundEnabled);
                        setSignupGoalMinutes(mins);
                      }}
                      className={`flex-1 py-1 font-mono text-[11px] font-bold border border-[#2D3142] ${
                        signupGoalMinutes === mins
                          ? 'bg-[#F4A261] text-[#2D3142] pixel-shadow-sm'
                          : 'bg-[#FAF8F5] hover:bg-[#F2EFE9] text-[#2D3142]/70'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-[#7FB685] hover:bg-[#6FA876] border-2 border-[#2D3142] font-mono text-xs font-bold text-[#2D3142] flex items-center justify-center gap-2 pixel-shadow transition-all disabled:opacity-50 mt-2"
              >
                <Sparkles className="w-4 h-4 text-[#2D3142]" />
                <span>{isLoading ? 'INITIALIZING LEVEL 0 CARTRIDGE...' : 'CREATE CARTRIDGE & ENTER WORLD ↵'}</span>
              </button>
            </form>
          )}

          {/* Form 2: SIGN IN (Returning Player) */}
          {authMode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="block font-mono text-[10px] font-bold text-[#2D3142] uppercase mb-1">
                  Player Username or Email:
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#2D3142]/50" />
                  <input
                    type="text"
                    required
                    placeholder="student or alex"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full pl-8 pr-2 py-1.5 bg-[#FAF8F5] border-2 border-[#2D3142] font-mono text-xs text-[#2D3142] focus:outline-none focus:bg-white pixel-inset"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] font-bold text-[#2D3142] uppercase mb-1">
                  Passkey / Password:
                </label>
                <div className="relative">
                  <KeyRound className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#2D3142]/50" />
                  <input
                    type="password"
                    required
                    placeholder="password123"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-8 pr-2 py-1.5 bg-[#FAF8F5] border-2 border-[#2D3142] font-mono text-xs text-[#2D3142] focus:outline-none focus:bg-white pixel-inset"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-[#CADBFB] hover:bg-[#B4C5E4] border-2 border-[#2D3142] font-mono text-xs font-bold text-[#2D3142] flex items-center justify-center gap-2 pixel-shadow transition-all disabled:opacity-50 mt-2"
              >
                <ArrowRight className="w-4 h-4 text-[#2D3142]" />
                <span>{isLoading ? 'LOADING CARTRIDGE...' : 'LOAD SAVE FILE & RESUME ↵'}</span>
              </button>
            </form>
          )}

          {/* Quick 1-Click Prototypes for Instant Evaluation */}
          <div className="mt-4 pt-3 border-t-2 border-[#2D3142] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-[#2D3142]/70 uppercase tracking-wider">
                QUICK-START PREVIEWS:
              </span>
              <span className="font-mono text-[9px] text-[#2D3142]/50">1-CLICK TEST</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => loadDemoUser('fresh-level-0')}
                className="pixel-btn p-1.5 bg-[#FAF8F5] hover:bg-[#7FB685] border border-[#2D3142] font-mono text-[10px] font-bold text-[#2D3142] text-left transition-colors flex flex-col"
                title="Start with Taylor Reed (Level 0 New Student)"
              >
                <span className="text-[#2D3142]">🌱 FRESH START</span>
                <span className="text-[9px] text-[#2D3142]/70 font-normal">Level 0 • 0 XP</span>
              </button>

              <button
                type="button"
                onClick={() => loadDemoUser('alex-level-1')}
                className="pixel-btn p-1.5 bg-[#FAF8F5] hover:bg-[#CADBFB] border border-[#2D3142] font-mono text-[10px] font-bold text-[#2D3142] text-left transition-colors flex flex-col"
                title="Load Alex Chen (Existing Level 1 Profile)"
              >
                <span className="text-[#2D3142]">🎮 RETURNING SAVE</span>
                <span className="text-[9px] text-[#2D3142]/70 font-normal">Alex • Level 1</span>
              </button>

              <button
                type="button"
                onClick={() => loadDemoUser('guest')}
                className="pixel-btn p-1.5 bg-[#FAF8F5] hover:bg-[#F8C390] border border-[#2D3142] font-mono text-[10px] font-bold text-[#2D3142] text-left transition-colors flex flex-col"
                title="Instant Sandbox Mode"
              >
                <span className="text-[#2D3142]">✨ GUEST PLAY</span>
                <span className="text-[9px] text-[#2D3142]/70 font-normal">Level 0 Sandbox</span>
              </button>
            </div>
          </div>

          {/* Booting Cartridge Overlay Animation */}
          {isBooting && (
            <div className="absolute inset-0 bg-[#FAF8F5] z-30 flex flex-col items-center justify-center p-6 border-2 border-[#2D3142]">
              <div className="w-12 h-12 mb-3 animate-bounce">
                <svg viewBox="0 0 24 24" className="w-full h-full" style={{ shapeRendering: 'crispEdges' }}>
                  <rect x="7" y="9" width="10" height="10" fill="#7FB685" />
                  <rect x="11" y="5" width="2" height="3" fill="#35693F" />
                  <rect x="8" y="4" width="4" height="2" fill="#7FB685" />
                  <rect x="9" y="11" width="2" height="2" fill="#2D3142" />
                  <rect x="13" y="11" width="2" height="2" fill="#2D3142" />
                </svg>
              </div>
              <span className="font-mono text-xs font-bold text-[#2D3142] tracking-wider mb-2">
                CARTRIDGE INSERTED: *CLICK!*
              </span>
              <span className="font-mono text-[10px] text-[#2D3142]/70 mb-3">
                BOOTING POCKET COZY SYSTEM...
              </span>
              {/* Segmented Loading Bar */}
              <div className="w-48 bg-[#E4DFD5] border-2 border-[#2D3142] h-4 p-0.5 flex gap-0.5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-full transition-colors ${
                      bootProgress >= (i + 1) * 10 ? 'bg-[#7FB685]' : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Handheld Console Bottom Controls Decor */}
        <div className="mt-3 flex items-center justify-between px-2 pt-1">
          <div className="flex items-center gap-2 font-mono text-[9px] text-[#2D3142]/70 font-bold">
            <span>● PHONES</span>
            <span>•</span>
            <span>BATTERY 98%</span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-[#E76F51] border border-[#2D3142] flex items-center justify-center font-mono text-[8px] text-[#FAF8F5] font-bold">
              B
            </div>
            <div className="w-4 h-4 rounded-full bg-[#7FB685] border border-[#2D3142] flex items-center justify-center font-mono text-[8px] text-[#FAF8F5] font-bold">
              A
            </div>
          </div>
        </div>
      </div>

      {/* Whimsical Bottom Subtext */}
      <div className="mt-4 font-mono text-[10px] text-[#2D3142]/60 flex items-center gap-2">
        <span>GENTLE ADHD FOCUS & HABIT ENGINE</span>
        <span>•</span>
        <span>ALL PROGRESS STORED LOCALLY IN CARTRIDGE</span>
      </div>
    </div>
  );
};
