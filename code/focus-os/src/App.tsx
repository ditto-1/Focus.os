import React, { useState, useEffect } from 'react';
import { ConsoleHeader } from './components/ConsoleHeader';
import { NavigationTabs } from './components/NavigationTabs';
import { PixelPet } from './components/PixelPet';
import { FocusScreen } from './components/FocusScreen';
import { QuestScreen } from './components/QuestScreen';
import { SensoryScreen } from './components/SensoryScreen';
import { CartridgeMemoryScreen } from './components/CartridgeMemoryScreen';
import { ScreenTab, Quest, DayActivity, PetState } from './types';
import { INITIAL_QUESTS, INITIAL_WEEK_ACTIVITY } from './data/initialData';
import { setAmbientWhiteNoise, playVictoryFanfare, playMechanicalClick } from './utils/audio';

export default function App() {
  // Navigation tab
  const [currentTab, setCurrentTab] = useState<ScreenTab>('focus');

  // Audio settings
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('cozy_pixel_sound');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [ambientNoise, setAmbientNoise] = useState<boolean>(false);

  // Quests
  const [quests, setQuests] = useState<Quest[]>(() => {
    const saved = localStorage.getItem('cozy_pixel_quests');
    return saved ? JSON.parse(saved) : INITIAL_QUESTS;
  });

  // 7-day activity log
  const [activityLog, setActivityLog] = useState<DayActivity[]>(() => {
    const saved = localStorage.getItem('cozy_pixel_activity');
    return saved ? JSON.parse(saved) : INITIAL_WEEK_ACTIVITY;
  });

  // Pet state
  const [pet, setPet] = useState<PetState>(() => {
    const saved = localStorage.getItem('cozy_pixel_pet');
    return saved
      ? JSON.parse(saved)
      : {
          name: 'Sprout',
          level: 3,
          exp: 40,
          maxExp: 100,
          mood: 'happy',
          berriesFed: 12,
        };
  });

  // Scratchpad
  const [scratchpad, setScratchpad] = useState<string>(() => {
    return localStorage.getItem('cozy_pixel_scratchpad') || '• Remember to take gentle breaths.\n• You do not have to do everything at once.';
  });

  // Focus timer running state
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('cozy_pixel_sound', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('cozy_pixel_quests', JSON.stringify(quests));
  }, [quests]);

  useEffect(() => {
    localStorage.setItem('cozy_pixel_activity', JSON.stringify(activityLog));
  }, [activityLog]);

  useEffect(() => {
    localStorage.setItem('cozy_pixel_pet', JSON.stringify(pet));
  }, [pet]);

  useEffect(() => {
    localStorage.setItem('cozy_pixel_scratchpad', scratchpad);
  }, [scratchpad]);

  // Ambient rain noise toggle handler
  const handleToggleAmbient = () => {
    const next = !ambientNoise;
    setAmbientNoise(next);
    setAmbientWhiteNoise(next);
  };

  // Focus session complete
  const handleSessionComplete = (minutes: number) => {
    // Add EXP to pet
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

    // Update today's activity
    setActivityLog((prev) => {
      const copy = [...prev];
      const todayIdx = copy.length - 1;
      if (todayIdx >= 0) {
        const today = copy[todayIdx];
        const newMins = today.minutesFocused + minutes;
        const newLevel = newMins >= 60 ? 3 : newMins >= 30 ? 2 : 1;
        copy[todayIdx] = {
          ...today,
          minutesFocused: newMins,
          level: newLevel,
        };
      }
      return copy;
    });
  };

  // Toggle quest
  const handleToggleQuest = (id: string) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          const nextCompleted = !q.completed;
          if (nextCompleted) {
            // Reward pet with EXP & Berry
            setPet((p) => {
              const expGain = q.staminaPoints * 10;
              const newExp = p.exp + expGain;
              return {
                ...p,
                exp: newExp >= p.maxExp ? newExp - p.maxExp : newExp,
                level: newExp >= p.maxExp ? p.level + 1 : p.level,
                berriesFed: p.berriesFed + 1,
              };
            });

            // Increment completed count in activity log
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
          return { ...q, completed: nextCompleted };
        }
        return q;
      })
    );
  };

  // Add quest
  const handleAddQuest = (title: string, staminaPoints: 1 | 2 | 3, category: 'core' | 'side' | 'wellness') => {
    const newQ: Quest = {
      id: `quest-${Date.now()}`,
      title,
      staminaPoints,
      completed: false,
      category,
      createdAt: Date.now(),
    };
    setQuests((prev) => [newQ, ...prev]);
  };

  // Delete quest
  const handleDeleteQuest = (id: string) => {
    setQuests((prev) => prev.filter((q) => q.id !== id));
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

  // Reset all save data
  const handleResetData = () => {
    localStorage.clear();
    setQuests(INITIAL_QUESTS);
    setActivityLog(INITIAL_WEEK_ACTIVITY);
    setPet({
      name: 'Sprout',
      level: 1,
      exp: 0,
      maxExp: 100,
      mood: 'happy',
      berriesFed: 3,
    });
    setScratchpad('• Take gentle breaths.\n• Everything is fine.');
  };

  const activeQuestsCount = quests.filter((q) => !q.completed).length;

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
        />

        {/* Console Main Body Area */}
        <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 py-4 flex flex-col space-y-4">
          {/* Navigation Cartridge Slot Tabs */}
          <NavigationTabs
            currentTab={currentTab}
            onSelectTab={setCurrentTab}
            soundEnabled={soundEnabled}
            activeQuestsCount={activeQuestsCount}
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
            {currentTab === 'focus' && (
              <FocusScreen
                soundEnabled={soundEnabled}
                onSessionComplete={handleSessionComplete}
                isTimerRunning={isTimerRunning}
                setIsTimerRunning={setIsTimerRunning}
              />
            )}

            {currentTab === 'quests' && (
              <QuestScreen
                quests={quests}
                onToggleQuest={handleToggleQuest}
                onAddQuest={handleAddQuest}
                onDeleteQuest={handleDeleteQuest}
                soundEnabled={soundEnabled}
              />
            )}

            {currentTab === 'sensory' && (
              <SensoryScreen soundEnabled={soundEnabled} />
            )}

            {currentTab === 'cartridge' && (
              <CartridgeMemoryScreen
                activityLog={activityLog}
                pet={pet}
                scratchpad={scratchpad}
                onUpdateScratchpad={setScratchpad}
                soundEnabled={soundEnabled}
                onResetData={handleResetData}
              />
            )}
          </div>
        </main>

        {/* Handheld Console Hardware Bottom Footer */}
        <footer className="w-full bg-[#FAF8F5] border-t-2 border-[#2D3142] py-4 px-4 sm:px-6 mt-6 select-none">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* D-Pad / Handheld Hardware Emulation decorative buttons */}
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
                    const tabs: ScreenTab[] = ['focus', 'quests', 'sensory', 'cartridge'];
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
                    const tabs: ScreenTab[] = ['focus', 'quests', 'sensory', 'cartridge'];
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
              <span>MADE FOR CALM MINDS</span>
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
