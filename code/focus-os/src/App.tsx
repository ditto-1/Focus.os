import React, { useState, useEffect } from 'react';
import { ConsoleHeader } from './components/ConsoleHeader';
import { NavigationTabs } from './components/NavigationTabs';
import { PixelPet } from './components/PixelPet';
import { FocusScreen } from './components/FocusScreen';
import { WhatShouldIDoNow } from './components/WhatShouldIDoNow';
import { TaskPlanner } from './components/TaskPlanner';
import { RoutinesScreen } from './components/RoutinesScreen';
import { MusicController } from './components/MusicController';
import { SensoryScreen } from './components/SensoryScreen';
import { CartridgeMemoryScreen } from './components/CartridgeMemoryScreen';
import { AuthScreen } from './components/AuthScreen';
import { ScreenTab, TaskItem, RoutineItem, DayActivity, PetState, Subtask, AuthUser } from './types';
import { INITIAL_TASKS, INITIAL_ROUTINES, INITIAL_WEEK_ACTIVITY, NEW_USER_INITIAL_TASKS } from './data/initialData';
import {
  setAmbientWhiteNoise,
  toggleRetroLofi,
  playVictoryFanfare,
  playMechanicalClick,
  playQuestComplete,
} from './utils/audio';

export default function App() {
  // Active Screen Tab
  const [currentTab, setCurrentTab] = useState<ScreenTab>('whatnow');

  // Authenticated User & Portal state
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('cozy_pixel_current_user');
    return saved
      ? JSON.parse(saved)
      : {
          id: 'usr-demo-1',
          username: 'alex',
          name: 'Alex Chen',
          email: 'alex@example.com',
          studyMajor: 'Computer Science (B.Tech)',
          dailyGoalMinutes: 60,
          createdAt: Date.now() - 86400000 * 7,
        };
  });

  const [isAuthScreenVisible, setIsAuthScreenVisible] = useState<boolean>(false);
  const [logoutNotice, setLogoutNotice] = useState<string | null>(null);

  // Audio settings
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('cozy_pixel_sound');
    return saved !== null ? JSON.parse(saved) : true;
  });


  const [ambientNoise, setAmbientNoise] = useState<boolean>(false);
  const [isRetroLofiActive, setIsRetroLofiActive] = useState<boolean>(false);

  // Tasks & Responsibilities (Adaptive Task Matrix)
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem('cozy_pixel_tasks_v2');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  // Recurring Daily Routines
  const [routines, setRoutines] = useState<RoutineItem[]>(() => {
    const saved = localStorage.getItem('cozy_pixel_routines_v2');
    return saved ? JSON.parse(saved) : INITIAL_ROUTINES;
  });

  // Currently focused task
  const [activeFocusTask, setActiveFocusTask] = useState<TaskItem | null>(() => {
    const saved = localStorage.getItem('cozy_pixel_active_task');
    return saved ? JSON.parse(saved) : INITIAL_TASKS[0];
  });

  // AI Breakdown loading state
  const [isBreakingDownId, setIsBreakingDownId] = useState<string | null>(null);

  // Focus timer running state
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // 7-day activity log
  const [activityLog, setActivityLog] = useState<DayActivity[]>(() => {
    const saved = localStorage.getItem('cozy_pixel_activity_v2');
    return saved ? JSON.parse(saved) : INITIAL_WEEK_ACTIVITY;
  });

  // Pet state
  const [pet, setPet] = useState<PetState>(() => {
    const saved = localStorage.getItem('cozy_pixel_pet_v2');
    return saved
      ? JSON.parse(saved)
      : {
          name: 'Sprout',
          level: 4,
          exp: 65,
          maxExp: 100,
          mood: 'happy',
          berriesFed: 15,
        };
  });

  // Scratchpad
  const [scratchpad, setScratchpad] = useState<string>(() => {
    return (
      localStorage.getItem('cozy_pixel_scratchpad_v2') ||
      '• Remember to take gentle breaths.\n• You do not have to finish everything right now.\n• One small micro-step creates momentum.'
    );
  });

  // Persistence to localStorage
  useEffect(() => {
    localStorage.setItem('cozy_pixel_sound', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('cozy_pixel_tasks_v2', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('cozy_pixel_routines_v2', JSON.stringify(routines));
  }, [routines]);

  useEffect(() => {
    localStorage.setItem('cozy_pixel_active_task', JSON.stringify(activeFocusTask));
  }, [activeFocusTask]);

  useEffect(() => {
    localStorage.setItem('cozy_pixel_activity_v2', JSON.stringify(activityLog));
  }, [activityLog]);

  useEffect(() => {
    localStorage.setItem('cozy_pixel_pet_v2', JSON.stringify(pet));
  }, [pet]);

  useEffect(() => {
    localStorage.setItem('cozy_pixel_scratchpad_v2', scratchpad);
  }, [scratchpad]);

  // Ambient rain noise handler
  const handleToggleAmbient = () => {
    const next = !ambientNoise;
    setAmbientNoise(next);
    setAmbientWhiteNoise(next);
  };

  // 8-bit lofi audio handler
  const handleToggleRetroLofi = (active: boolean) => {
    setIsRetroLofiActive(active);
    toggleRetroLofi(active);
  };

  // Complete a focus session (timer finished)
  const handleSessionComplete = (minutes: number) => {
    // Reward pet
    setPet((prev) => {
      const expGain = minutes * 2;
      const newExp = prev.exp + expGain;
      if (newExp >= prev.maxExp) {
        return {
          ...prev,
          level: prev.level + 1,
          exp: newExp - prev.maxExp,
          maxExp: Math.round(prev.maxExp * 1.3),
          mood: 'celebrating',
          berriesFed: prev.berriesFed + 2,
        };
      }
      return {
        ...prev,
        exp: newExp,
        mood: 'celebrating',
        berriesFed: prev.berriesFed + 1,
      };
    });

    // Update today's activity log
    setActivityLog((prev) => {
      const copy = [...prev];
      const todayIdx = copy.length - 1;
      if (todayIdx >= 0) {
        const today = copy[todayIdx];
        const newMins = today.minutesFocused + minutes;
        copy[todayIdx] = {
          ...today,
          minutesFocused: newMins,
          level: newMins >= 60 ? 3 : newMins >= 30 ? 2 : 1,
        };
      }
      return copy;
    });
  };

  // Start focus on a selected task
  const handleStartFocusOnTask = (task: TaskItem) => {
    setActiveFocusTask(task);
    setCurrentTab('focus');
  };

  // Toggle task complete
  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          if (nextCompleted) {
            // Reward pet with EXP & Berry
            setPet((p) => {
              const expGain = t.staminaPoints * 15;
              const newExp = p.exp + expGain;
              return {
                ...p,
                exp: newExp >= p.maxExp ? newExp - p.maxExp : newExp,
                level: newExp >= p.maxExp ? p.level + 1 : p.level,
                berriesFed: p.berriesFed + 1,
              };
            });

            // Increment activity log
            setActivityLog((act) => {
              const copy = [...act];
              const todayIdx = copy.length - 1;
              if (todayIdx >= 0) {
                copy[todayIdx] = {
                  ...copy[todayIdx],
                  questsCompleted: copy[todayIdx].questsCompleted + 1,
                };
              }
              return copy;
            });
          }
          return { ...t, completed: nextCompleted };
        }
        return t;
      })
    );
  };

  // Toggle subtask complete
  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updatedSubtasks = t.subtasks.map((st) => {
            if (st.id === subtaskId) {
              const nextDone = !st.completed;
              if (nextDone) {
                setPet((p) => ({ ...p, exp: p.exp + 5 }));
              }
              return { ...st, completed: nextDone };
            }
            return st;
          });

          // Check if all subtasks are now completed
          const allDone = updatedSubtasks.length > 0 && updatedSubtasks.every((st) => st.completed);

          return {
            ...t,
            subtasks: updatedSubtasks,
            completed: allDone ? true : t.completed,
          };
        }
        return t;
      })
    );
  };

  // Add new task
  const handleAddTask = (
    title: string,
    priority: 'urgent' | 'high' | 'normal' | 'low',
    deadline: string,
    estimatedMinutes: number,
    staminaPoints: 1 | 2 | 3,
    category: 'academic' | 'project' | 'life' | 'wellness'
  ) => {
    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title,
      priority,
      deadline,
      estimatedMinutes,
      staminaPoints,
      completed: false,
      category,
      subtasks: [],
      createdAt: Date.now(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  // Delete task
  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (activeFocusTask?.id === id) {
      setActiveFocusTask(null);
    }
  };

  // AI Task Decomposition (/api/breakdown)
  const handleBreakdownTask = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    setIsBreakingDownId(taskId);
    try {
      const res = await fetch('/api/breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskTitle: task.title,
          totalMinutes: task.estimatedMinutes,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.subtasks) && data.subtasks.length > 0) {
          const generated: Subtask[] = data.subtasks.map((s: any, idx: number) => ({
            id: `sub-${Date.now()}-${idx}`,
            title: s.title,
            estimatedMinutes: s.estimatedMinutes || 10,
            staminaPoints: s.staminaPoints || 1,
            completed: false,
          }));

          setTasks((prev) =>
            prev.map((t) => (t.id === taskId ? { ...t, subtasks: generated } : t))
          );
          if (activeFocusTask?.id === taskId) {
            setActiveFocusTask((prev) => (prev ? { ...prev, subtasks: generated } : null));
          }
          playVictoryFanfare(soundEnabled);
        }
      }
    } catch (err) {
      console.error('Task breakdown error:', err);
    } finally {
      setIsBreakingDownId(null);
    }
  };

  // Toggle routine
  const handleToggleRoutine = (id: string) => {
    setRoutines((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextDone = !r.completedToday;
          if (nextDone) {
            setPet((p) => ({
              ...p,
              exp: p.exp + r.staminaReward * 10,
              berriesFed: p.berriesFed + 1,
            }));
          }
          return {
            ...r,
            completedToday: nextDone,
            streak: nextDone ? r.streak + 1 : Math.max(0, r.streak - 1),
          };
        }
        return r;
      })
    );
  };

  // Add routine
  const handleAddRoutine = (title: string, timeOfDay: 'morning' | 'afternoon' | 'evening') => {
    const newR: RoutineItem = {
      id: `rt-${Date.now()}`,
      title,
      timeOfDay,
      iconName: 'sparkles',
      streak: 1,
      completedToday: false,
      staminaReward: 1,
    };
    setRoutines((prev) => [...prev, newR]);
  };

  // Feed berry to pet
  const handleFeedBerry = () => {
    setPet((prev) => {
      const newExp = prev.exp + 10;
      if (newExp >= prev.maxExp) {
        playVictoryFanfare(soundEnabled);
        return {
          ...prev,
          level: prev.level + 1,
          exp: newExp - prev.maxExp,
          maxExp: Math.round(prev.maxExp * 1.3),
          berriesFed: prev.berriesFed + 1,
        };
      }
      return {
        ...prev,
        exp: newExp,
        berriesFed: prev.berriesFed + 1,
      };
    });
  };

  // Reset data to defaults
  const handleResetData = () => {
    localStorage.clear();
    setTasks(INITIAL_TASKS);
    setRoutines(INITIAL_ROUTINES);
    setActiveFocusTask(INITIAL_TASKS[0]);
    setActivityLog(INITIAL_WEEK_ACTIVITY);
    setPet({
      name: 'Sprout',
      level: 1,
      exp: 0,
      maxExp: 100,
      mood: 'happy',
      berriesFed: 3,
    });
    setScratchpad('• Take gentle breaths.\n• You do not have to do everything at once.');
  };

  // User Authentication Handlers
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Offline fallback
    }
    localStorage.removeItem('cozy_pixel_current_user');
    setCurrentUser(null);
    setIsAuthScreenVisible(true);
    setLogoutNotice('You have been logged out. Your memory cartridge has been safely preserved.');
    playMechanicalClick(soundEnabled);
  };

  const handleLoginSuccess = (user: AuthUser, isNewUser: boolean) => {
    setCurrentUser(user);
    localStorage.setItem('cozy_pixel_current_user', JSON.stringify(user));
    setIsAuthScreenVisible(false);
    setLogoutNotice(null);

    if (isNewUser) {
      // Initialize welcoming starter cartridge for new user
      setTasks(NEW_USER_INITIAL_TASKS);
      setActiveFocusTask(NEW_USER_INITIAL_TASKS[0]);
      setPet({
        name: 'Sprout',
        level: 1,
        exp: 0,
        maxExp: 50,
        mood: 'happy',
        berriesFed: 2,
      });
      setScratchpad(
        `• Welcome to Cozy Pocket, ${user.name}!\n• Academic focus: ${user.studyMajor || 'Your studies'}\n• Daily Target: ${user.dailyGoalMinutes || 45} minutes\n• Try your first gentle 10-minute sprint to level up Sprout.`
      );
      setCurrentTab('whatnow');
    }
  };

  const handleContinueAsGuest = () => {
    const guestUser: AuthUser = {
      id: 'usr-guest',
      username: 'guest',
      name: 'Guest Explorer',
      email: 'guest@study.local',
      studyMajor: 'Self-Paced Exploration',
      dailyGoalMinutes: 30,
      createdAt: Date.now(),
    };
    setCurrentUser(guestUser);
    localStorage.setItem('cozy_pixel_current_user', JSON.stringify(guestUser));
    setIsAuthScreenVisible(false);
    setLogoutNotice(null);
  };

  const activeTasksCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2D3142] flex flex-col font-sans selection:bg-[#B4C5E4]">
      {/* Handheld Console Chassis Bezel Outer Shell */}
      <div className="flex-1 flex flex-col">
        {/* Top Hardware Bezel Header */}
        <ConsoleHeader
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(!soundEnabled)}
          ambientNoise={ambientNoise}
          onToggleAmbient={handleToggleAmbient}
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthScreenVisible(true)}
          onLogout={handleLogout}
        />

        {/* Console Main Body Area */}
        <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 py-4 flex flex-col space-y-4">
          {/* Navigation Cartridge Slot Tabs */}
          <NavigationTabs
            currentTab={currentTab}
            onSelectTab={(tab) => {
              // If user is navigating tabs, dismiss auth overlay if logged in
              if (currentUser && isAuthScreenVisible) {
                setIsAuthScreenVisible(false);
              }
              setCurrentTab(tab);
            }}
            soundEnabled={soundEnabled}
            activeTasksCount={activeTasksCount}
          />

          {/* Virtual Companion Pet - Always accessible at top */}
          <PixelPet
            pet={pet}
            onFeedBerry={handleFeedBerry}
            soundEnabled={soundEnabled}
            isFocusActive={isTimerRunning}
          />

          {/* Active Screen Display Area */}
          <div className="w-full transition-all">
            {/* When not logged in or when auth screen is opened explicitly */}
            {(!currentUser || isAuthScreenVisible) ? (
              <div className="space-y-3">
                {currentUser && (
                  <div className="flex items-center justify-between bg-[#F2EFE9] border-2 border-[#2D3142] px-3 py-2 pixel-shadow-sm">
                    <span className="font-mono text-xs text-[#2D3142]">
                      Currently signed in as: <strong>{currentUser.name}</strong> (@{currentUser.username})
                    </span>
                    <button
                      onClick={() => {
                        playMechanicalClick(soundEnabled);
                        setIsAuthScreenVisible(false);
                      }}
                      className="pixel-btn px-2.5 py-1 bg-[#FAF8F5] hover:bg-[#CADBFB] border border-[#2D3142] font-mono text-[11px] font-bold text-[#2D3142]"
                    >
                      RETURN TO CARTRIDGE ✕
                    </button>
                  </div>
                )}
                <AuthScreen
                  onLoginSuccess={handleLoginSuccess}
                  onContinueAsGuest={handleContinueAsGuest}
                  soundEnabled={soundEnabled}
                  logoutNotice={logoutNotice}
                />
              </div>
            ) : (
              <>
                {/* Screen 1: Focus Engine & Objective */}
                {currentTab === 'focus' && (
                  <FocusScreen
                    soundEnabled={soundEnabled}
                    onSessionComplete={handleSessionComplete}
                    isTimerRunning={isTimerRunning}
                    setIsTimerRunning={setIsTimerRunning}
                    activeTask={activeFocusTask}
                    onClearActiveTask={() => setActiveFocusTask(null)}
                    onToggleSubtask={handleToggleSubtask}
                    onCompleteTask={handleToggleTask}
                    isRetroLofiActive={isRetroLofiActive}
                    onToggleRetroLofi={handleToggleRetroLofi}
                    onOpenMusicTab={() => setCurrentTab('music')}
                  />
                )}

                {/* Screen 2: "What Should I Do Now?" Adaptive Prioritization Recommender */}
                {currentTab === 'whatnow' && (
                  <WhatShouldIDoNow
                    tasks={tasks}
                    onStartFocusOnTask={handleStartFocusOnTask}
                    onBreakdownTask={handleBreakdownTask}
                    soundEnabled={soundEnabled}
                  />
                )}

                {/* Screen 3: Adaptive Task Planner & AI Breakdown */}
                {currentTab === 'planner' && (
                  <TaskPlanner
                    tasks={tasks}
                    onToggleTask={handleToggleTask}
                    onToggleSubtask={handleToggleSubtask}
                    onAddTask={handleAddTask}
                    onDeleteTask={handleDeleteTask}
                    onBreakdownTask={handleBreakdownTask}
                    onStartFocusOnTask={handleStartFocusOnTask}
                    soundEnabled={soundEnabled}
                    isBreakingDownId={isBreakingDownId}
                  />
                )}

                {/* Screen 4: Recurring Routines & Habit Tracker */}
                {currentTab === 'routines' && (
                  <RoutinesScreen
                    routines={routines}
                    onToggleRoutine={handleToggleRoutine}
                    onAddRoutine={handleAddRoutine}
                    soundEnabled={soundEnabled}
                  />
                )}

                {/* Screen 5: Spotify & Apple Music Controller */}
                {currentTab === 'music' && (
                  <MusicController
                    soundEnabled={soundEnabled}
                    isRetroLofiActive={isRetroLofiActive}
                    onToggleRetroLofi={handleToggleRetroLofi}
                  />
                )}

                {/* Screen 6: Sensory Grounding & Tactile Fidgets */}
                {currentTab === 'sensory' && (
                  <SensoryScreen soundEnabled={soundEnabled} />
                )}

                {/* Screen 7: Memory Cartridge, Activity Heatmap & Brain Dump */}
                {currentTab === 'cartridge' && (
                  <CartridgeMemoryScreen
                    activityLog={activityLog}
                    pet={pet}
                    scratchpad={scratchpad}
                    onUpdateScratchpad={setScratchpad}
                    soundEnabled={soundEnabled}
                    onResetData={handleResetData}
                    currentUser={currentUser}
                    onLogout={handleLogout}
                    onSwitchAccount={() => setIsAuthScreenVisible(true)}
                  />
                )}
              </>
            )}
          </div>
        </main>


        {/* Handheld Console Hardware Bottom Footer */}
        <footer className="w-full bg-[#FAF8F5] border-t-2 border-[#2D3142] py-4 px-4 sm:px-6 mt-6 select-none">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* D-Pad / Handheld Hardware Emulation buttons */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-[#F2EFE9] border border-[#2D3142] px-2 py-1">
                <span className="font-mono text-[10px] text-[#2D3142]/70">D-PAD:</span>
                <span className="font-mono text-xs text-[#2D3142] font-bold">▲ ▼ ◄ ►</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  id="hardware-b-btn"
                  onClick={() => {
                    playMechanicalClick(soundEnabled);
                    const tabs: ScreenTab[] = [
                      'focus',
                      'whatnow',
                      'planner',
                      'routines',
                      'music',
                      'sensory',
                      'cartridge',
                    ];
                    const prevIdx = (tabs.indexOf(currentTab) - 1 + tabs.length) % tabs.length;
                    setCurrentTab(tabs[prevIdx]);
                  }}
                  title="Previous Screen (B Button)"
                  className="pixel-btn w-6 h-6 rounded-none bg-[#F4A261] border border-[#2D3142] font-mono text-[10px] font-bold text-[#2D3142] flex items-center justify-center pixel-shadow-sm"
                >
                  B
                </button>
                <button
                  id="hardware-a-btn"
                  onClick={() => {
                    playMechanicalClick(soundEnabled);
                    const tabs: ScreenTab[] = [
                      'focus',
                      'whatnow',
                      'planner',
                      'routines',
                      'music',
                      'sensory',
                      'cartridge',
                    ];
                    const nextIdx = (tabs.indexOf(currentTab) + 1) % tabs.length;
                    setCurrentTab(tabs[nextIdx]);
                  }}
                  title="Next Screen (A Button)"
                  className="pixel-btn w-6 h-6 rounded-none bg-[#7FB685] border border-[#2D3142] font-mono text-[10px] font-bold text-[#2D3142] flex items-center justify-center pixel-shadow-sm"
                >
                  A
                </button>
              </div>
            </div>

            {/* Middle Barcode / Serial */}
            <div className="flex items-center gap-2 font-mono text-[10px] text-[#2D3142]/60">
              <span>MODEL NO. DMG-CPP-2026</span>
              <span>•</span>
              <span>THAPAR UCS503 PROPOSAL ENGINE</span>
            </div>

            {/* Right Headphone Jack & Certifications */}
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#2D3142] border border-[#F2EFE9]" title="Headphone Jack" />
              <span className="font-mono text-[10px] font-bold text-[#2D3142] px-1.5 py-0.5 bg-[#CADBFB] border border-[#2D3142]">
                PHONES
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
