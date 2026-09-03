import React from 'react';
import { Timer, Sparkles, CheckSquare, Repeat, Music, HeartHandshake, HardDrive } from 'lucide-react';
import { ScreenTab } from '../types';
import { playMechanicalClick } from '../utils/audio';

interface NavigationTabsProps {
  currentTab: ScreenTab;
  onSelectTab: (tab: ScreenTab) => void;
  soundEnabled: boolean;
  activeTasksCount: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  currentTab,
  onSelectTab,
  soundEnabled,
  activeTasksCount,
}) => {
  const tabs: { id: ScreenTab; label: string; icon: React.ReactNode; sub: string; badge?: number }[] = [
    {
      id: 'focus',
      label: 'FOCUS',
      icon: <Timer className="w-4 h-4" />,
      sub: 'TIMER & OBJECTIVE',
    },
    {
      id: 'whatnow',
      label: 'WHAT NOW?',
      icon: <Sparkles className="w-4 h-4" />,
      sub: 'RECOMMENDER',
    },
    {
      id: 'planner',
      label: 'PLANNER',
      icon: <CheckSquare className="w-4 h-4" />,
      sub: 'TASKS & AI BREAKDOWN',
      badge: activeTasksCount,
    },
    {
      id: 'routines',
      label: 'ROUTINES',
      icon: <Repeat className="w-4 h-4" />,
      sub: 'HABITS & STREAKS',
    },
    {
      id: 'music',
      label: 'MUSIC',
      icon: <Music className="w-4 h-4" />,
      sub: 'SPOTIFY / APPLE',
    },
    {
      id: 'sensory',
      label: 'CALM',
      icon: <HeartHandshake className="w-4 h-4" />,
      sub: '5-4-3-2-1 & FIDGET',
    },
    {
      id: 'cartridge',
      label: 'MEMORY',
      icon: <HardDrive className="w-4 h-4" />,
      sub: 'LOG & SCRATCHPAD',
    },
  ];

  return (
    <nav className="w-full max-w-5xl mx-auto px-3 sm:px-6 my-2 select-none">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {tabs.map((tab, idx) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => {
                playMechanicalClick(soundEnabled);
                onSelectTab(tab.id);
              }}
              className={`pixel-btn relative flex flex-col items-start p-2 border-2 border-[#2D3142] text-left transition-all ${
                isActive
                  ? 'bg-[#7FB685] text-[#2D3142] pixel-shadow font-bold'
                  : 'bg-[#F2EFE9] hover:bg-[#FAF8F5] text-[#2D3142]/80 pixel-shadow-sm'
              }`}
            >
              {/* Active retro diamond indicator */}
              <div className="flex items-center justify-between w-full mb-0.5">
                <div className="flex items-center gap-1">
                  <span className="font-mono text-[10px] text-[#2D3142]">
                    {isActive ? '◆' : `0${idx + 1}`}
                  </span>
                  <div className="text-[#2D3142]">{tab.icon}</div>
                </div>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="font-mono text-[9px] font-bold px-1 bg-[#F4A261] border border-[#2D3142] text-[#2D3142]">
                    {tab.badge}
                  </span>
                )}
              </div>

              <div className="font-mono text-[11px] sm:text-xs tracking-wider uppercase truncate w-full">
                {tab.label}
              </div>
              <div className="font-sans text-[9px] text-[#2D3142]/70 tracking-tight truncate w-full">
                {tab.sub}
              </div>

              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#35693F]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
