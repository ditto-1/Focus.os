import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, Wind, Coffee, Zap, Brain, Check, Radio, Disc, ExternalLink } from 'lucide-react';
import { FocusMode, TaskItem } from '../types';
import { playMechanicalClick, playChiptuneBeep, playVictoryFanfare, playQuestComplete } from '../utils/audio';

interface FocusScreenProps {
  soundEnabled: boolean;
  onSessionComplete: (minutes: number) => void;
  isTimerRunning: boolean;
  setIsTimerRunning: (running: boolean) => void;
  activeTask: TaskItem | null;
  onClearActiveTask: () => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onCompleteTask: (taskId: string) => void;
  isRetroLofiActive: boolean;
  onToggleRetroLofi: (active: boolean) => void;
  onOpenMusicTab: () => void;
}

const MODE_PRESETS: Record<FocusMode, { label: string; minutes: number; desc: string; icon: React.ReactNode }> = {
  deep: {
    label: 'DEEP WORK',
    minutes: 25,
    desc: 'Classic 25-minute Pomodoro sprint for structured flow.',
    icon: <Brain className="w-4 h-4" />,
  },
  sprint: {
    label: 'MICRO BURST',
    minutes: 10,
    desc: 'ADHD low-friction starter. Overcome task paralysis.',
    icon: <Zap className="w-4 h-4" />,
  },
  breathe: {
    label: 'BOX BREATHING',
    minutes: 5,
    desc: '4-4-4-4 sensory calm pace to lower cortisol.',
    icon: <Wind className="w-4 h-4" />,
  },
  rest: {
    label: 'COZY BREAK',
    minutes: 5,
    desc: 'Step away from the screen, stretch, and sip water.',
    icon: <Coffee className="w-4 h-4" />,
  },
};

export const FocusScreen: React.FC<FocusScreenProps> = ({
  soundEnabled,
  onSessionComplete,
  isTimerRunning,
  setIsTimerRunning,
  activeTask,
  onClearActiveTask,
  onToggleSubtask,
  onCompleteTask,
  isRetroLofiActive,
  onToggleRetroLofi,
  onOpenMusicTab,
}) => {
  const [currentMode, setCurrentMode] = useState<FocusMode>('deep');
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [timeLeft, setTimeLeft] = useState(25 * 60);

  // Box Breathing cycle: Inhale (4s) -> Hold (4s) -> Exhale (4s) -> Hold (4s)
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [breathSeconds, setBreathSeconds] = useState(4);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Switch modes
  const handleSelectMode = (mode: FocusMode) => {
    playMechanicalClick(soundEnabled);
    setCurrentMode(mode);
    setIsTimerRunning(false);
    const mins = MODE_PRESETS[mode].minutes;
    setTotalSeconds(mins * 60);
    setTimeLeft(mins * 60);
  };

  // Start / Pause
  const handleToggleTimer = () => {
    playMechanicalClick(soundEnabled);
    if (!isTimerRunning) {
      playChiptuneBeep(659.25, soundEnabled);
    }
    setIsTimerRunning(!isTimerRunning);
  };

  // Reset
  const handleReset = () => {
    playMechanicalClick(soundEnabled);
    setIsTimerRunning(false);
    const mins = MODE_PRESETS[currentMode].minutes;
    setTotalSeconds(mins * 60);
    setTimeLeft(mins * 60);
  };

  // Add 5 min
  const handleAddFiveMin = () => {
    playMechanicalClick(soundEnabled);
    setTimeLeft((prev) => prev + 300);
    setTotalSeconds((prev) => prev + 300);
    playChiptuneBeep(784, soundEnabled);
  };

  // Main countdown effect
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsTimerRunning(false);
            playVictoryFanfare(soundEnabled);
            const sessionMins = MODE_PRESETS[currentMode].minutes;
            onSessionComplete(sessionMins);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, currentMode, onSessionComplete, soundEnabled, setIsTimerRunning]);

  // Breathing pacer cycle
  useEffect(() => {
    if (currentMode !== 'breathe' || !isTimerRunning) return;

    const breathInterval = setInterval(() => {
      setBreathSeconds((prev) => {
        if (prev <= 1) {
          setBreathPhase((curr) => {
            if (curr === 'Inhale') return 'Hold';
            if (curr === 'Hold') return 'Exhale';
            if (curr === 'Exhale') return 'Rest';
            return 'Inhale';
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(breathInterval);
  }, [currentMode, isTimerRunning]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Segmented progress bar (16 discrete chunks)
  const totalBlocks = 16;
  const progressRatio = totalSeconds > 0 ? (totalSeconds - timeLeft) / totalSeconds : 0;
  const filledBlocks = Math.min(totalBlocks, Math.round(progressRatio * totalBlocks));

  return (
    <div className="w-full space-y-4">
      {/* Active Focus Task Banner (Linked directly to Task Recommendation) */}
      {activeTask && (
        <div className="bg-[#CADBFB] border-2 border-[#2D3142] p-4 pixel-shadow">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#2D3142] pb-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 bg-[#7FB685] border border-[#2D3142] text-[#2D3142]">
                ACTIVE FOCUS OBJECTIVE
              </span>
              <span className="font-mono text-xs text-[#2D3142]">
                {activeTask.priority.toUpperCase()} PRIORITY • {activeTask.deadline}
              </span>
            </div>

            <button
              id="clear-focus-task-btn"
              onClick={() => {
                playMechanicalClick(soundEnabled);
                onClearActiveTask();
              }}
              className="pixel-btn text-[10px] font-mono font-bold px-2 py-0.5 bg-[#FAF8F5] border border-[#2D3142] text-[#2D3142]"
            >
              CHANGE OBJECTIVE [×]
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 my-1">
            <div>
              <h3 className="font-mono text-base font-bold text-[#2D3142]">
                {activeTask.title}
              </h3>
              {activeTask.notes && (
                <p className="font-sans text-xs text-[#2D3142]/80 mt-0.5">
                  {activeTask.notes}
                </p>
              )}
            </div>

            <button
              id="complete-active-focus-task-btn"
              onClick={() => {
                playQuestComplete(soundEnabled);
                onCompleteTask(activeTask.id);
              }}
              className="pixel-btn px-3 py-1.5 bg-[#7FB685] hover:bg-[#A3CFAB] border-2 border-[#2D3142] font-mono text-xs font-bold text-[#2D3142] pixel-shadow-sm whitespace-nowrap self-start sm:self-center"
            >
              ✓ MARK COMPLETE
            </button>
          </div>

          {/* Subtasks Checklist if present */}
          {activeTask.subtasks.length > 0 && (
            <div className="mt-3 pt-2 border-t border-[#2D3142]/20 space-y-1.5">
              <span className="font-mono text-[10px] font-bold text-[#2D3142] uppercase">
                MICRO-STEPS CHECKLIST:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {activeTask.subtasks.map((sub) => (
                  <div
                    key={sub.id}
                    onClick={() => {
                      if (!sub.completed) playQuestComplete(soundEnabled);
                      else playMechanicalClick(soundEnabled);
                      onToggleSubtask(activeTask.id, sub.id);
                    }}
                    className={`cursor-pointer flex items-center gap-2 p-1.5 border border-[#2D3142] text-xs font-sans ${
                      sub.completed ? 'bg-[#E4DFD5]/50 line-through text-[#2D3142]/60' : 'bg-[#FAF8F5]'
                    }`}
                  >
                    <span className="font-mono text-[10px] font-bold text-[#7FB685]">
                      {sub.completed ? '☑' : '☐'}
                    </span>
                    <span className="truncate">{sub.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode Selector Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 select-none">
        {(Object.keys(MODE_PRESETS) as FocusMode[]).map((mode) => {
          const preset = MODE_PRESETS[mode];
          const isSelected = currentMode === mode;
          return (
            <button
              key={mode}
              id={`focus-mode-${mode}`}
              onClick={() => handleSelectMode(mode)}
              className={`pixel-btn flex items-center justify-between p-2.5 border-2 border-[#2D3142] text-left transition-all ${
                isSelected
                  ? 'bg-[#CADBFB] text-[#2D3142] pixel-shadow font-bold'
                  : 'bg-[#F2EFE9] text-[#2D3142]/70 hover:bg-[#FAF8F5] pixel-shadow-sm'
              }`}
            >
              <div>
                <div className="font-mono text-xs uppercase flex items-center gap-1">
                  <span>{isSelected ? '◆' : '◇'}</span>
                  <span>{preset.label}</span>
                </div>
                <div className="font-mono text-[11px] text-[#2D3142]/80 mt-0.5">
                  {preset.minutes} MINS
                </div>
              </div>
              <div className="text-[#2D3142]">{preset.icon}</div>
            </button>
          );
        })}
      </div>

      {/* Main Chunky Hardware LCD Display Unit */}
      <div className="bg-[#FAF8F5] border-2 border-[#2D3142] p-5 sm:p-8 pixel-shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 lcd-subtle pointer-events-none" />

        {/* LCD Header */}
        <div className="flex items-center justify-between border-b-2 border-[#2D3142]/20 pb-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 bg-[#7FB685] border border-[#2D3142] text-[#2D3142]">
              {MODE_PRESETS[currentMode].label}
            </span>
            <span className="font-sans text-xs text-[#2D3142]/70 hidden sm:inline">
              {MODE_PRESETS[currentMode].desc}
            </span>
          </div>

          <div className="font-mono text-xs font-bold text-[#2D3142] flex items-center gap-1.5">
            <span className={`w-2 h-2 border border-[#2D3142] ${isTimerRunning ? 'bg-[#7FB685] animate-pulse' : 'bg-[#F4A261]'}`} />
            <span>{isTimerRunning ? 'RUNNING' : 'STANDBY'}</span>
          </div>
        </div>

        {/* Center LCD Big Numbers */}
        <div className="flex flex-col items-center justify-center my-4 select-none">
          <div className="font-mono text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight text-[#2D3142] filter drop-shadow-[3px_3px_0px_#CADBFB]">
            {timeFormatted}
          </div>

          {/* Box Breathing Visualizer if in Breathing Mode */}
          {currentMode === 'breathe' && isTimerRunning && (
            <div className="mt-4 flex flex-col items-center p-3 bg-[#F2EFE9] border-2 border-[#2D3142] pixel-shadow-sm w-full max-w-xs">
              <div className="font-mono text-xs font-bold text-[#2D3142] uppercase tracking-wider mb-1">
                {breathPhase} ({breathSeconds}s)
              </div>
              <div className="w-16 h-16 border-2 border-[#2D3142] bg-[#CADBFB] flex items-center justify-center transition-all duration-700 ease-in-out">
                <span className="font-mono text-lg font-bold text-[#2D3142]">
                  {breathPhase === 'Inhale' ? '▲' : breathPhase === 'Exhale' ? '▼' : '◆'}
                </span>
              </div>
              <p className="font-sans text-[11px] text-[#2D3142]/70 text-center mt-2">
                Follow the 4-second rhythm. Inhale calm, release tension.
              </p>
            </div>
          )}
        </div>

        {/* Segmented Pixel Stamina / Progress Meter */}
        <div className="mt-6 space-y-1.5">
          <div className="flex items-center justify-between font-mono text-[11px]">
            <span className="font-bold text-[#2D3142]">STAMINA DRAIN / FOCUS CHARGE</span>
            <span className="font-bold text-[#2D3142]">{Math.round(progressRatio * 100)}%</span>
          </div>

          <div className="w-full bg-[#E4DFD5] border-2 border-[#2D3142] p-1 h-6 flex gap-1 pixel-inset">
            {Array.from({ length: totalBlocks }).map((_, idx) => (
              <div
                key={idx}
                className={`flex-1 h-full transition-colors ${
                  idx < filledBlocks
                    ? 'bg-[#7FB685] border-r border-[#35693F]'
                    : 'bg-transparent'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Mechanical Controls Bar */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 select-none">
          {/* Main Play / Pause Button */}
          <button
            id="timer-toggle-btn"
            onClick={handleToggleTimer}
            className={`pixel-btn pixel-btn-lg flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#2D3142] font-mono text-sm sm:text-base font-bold transition-all ${
              isTimerRunning
                ? 'bg-[#F8C390] hover:bg-[#F4A261] text-[#2D3142] pixel-shadow'
                : 'bg-[#7FB685] hover:bg-[#A3CFAB] text-[#2D3142] pixel-shadow'
            }`}
          >
            {isTimerRunning ? (
              <>
                <Pause className="w-5 h-5 fill-[#2D3142]" />
                <span>PAUSE SPRINT</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-[#2D3142]" />
                <span>START SPRINT</span>
              </>
            )}
          </button>

          {/* +5 Minutes Extension */}
          <button
            id="timer-add-time-btn"
            onClick={handleAddFiveMin}
            className="pixel-btn flex items-center justify-center gap-1.5 px-4 py-3 bg-[#FAF8F5] hover:bg-[#F2EFE9] border-2 border-[#2D3142] font-mono text-sm font-bold text-[#2D3142] pixel-shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>+5 MIN</span>
          </button>

          {/* Reset Button */}
          <button
            id="timer-reset-btn"
            onClick={handleReset}
            className="pixel-btn flex items-center justify-center gap-1.5 px-4 py-3 bg-[#F2EFE9] hover:bg-[#FAF8F5] border-2 border-[#2D3142] font-mono text-sm font-bold text-[#2D3142] pixel-shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESET</span>
          </button>
        </div>
      </div>

      {/* Mini Music Control Dock Bar */}
      <div className="bg-[#F2EFE9] border-2 border-[#2D3142] p-3 pixel-shadow flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Disc className="w-4 h-4 text-[#7FB685] animate-spin" style={{ animationDuration: '6s' }} />
          <span className="font-mono text-xs font-bold text-[#2D3142]">
            FOCUS AUDIO:
          </span>
          <span className="font-mono text-xs text-[#2D3142]/80">
            {isRetroLofiActive ? '8-BIT LO-FI (PLAYING)' : 'SPOTIFY / APPLE MUSIC'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick toggle 8-bit lofi */}
          <button
            id="quick-toggle-lofi-btn"
            onClick={() => {
              playMechanicalClick(soundEnabled);
              onToggleRetroLofi(!isRetroLofiActive);
            }}
            className={`pixel-btn px-2.5 py-1 border-2 border-[#2D3142] font-mono text-[11px] font-bold ${
              isRetroLofiActive
                ? 'bg-[#F4A261] text-[#2D3142]'
                : 'bg-[#FAF8F5] text-[#2D3142]'
            }`}
          >
            {isRetroLofiActive ? '❚❚ PAUSE 8-BIT' : '▶ 8-BIT LO-FI'}
          </button>

          {/* Jump to full Music hub */}
          <button
            id="jump-to-music-hub-btn"
            onClick={() => {
              playMechanicalClick(soundEnabled);
              onOpenMusicTab();
            }}
            className="pixel-btn px-2.5 py-1 bg-[#CADBFB] hover:bg-[#B4C5E4] border-2 border-[#2D3142] font-mono text-[11px] font-bold text-[#2D3142]"
          >
            OPEN SPOTIFY / APPLE HUB →
          </button>
        </div>
      </div>
    </div>
  );
};
