import React from 'react';
import { Timer, CheckSquare, Sparkles, HardDrive } from 'lucide-react';
import { ScreenTab } from '../types';
import { playMechanicalClick } from '../utils/audio';

interface NavigationTabsProps {
  currentTab: ScreenTab;
  onSelectTab: (tab: ScreenTab) => void;
  soundEnabled: boolean;
  activeQuestsCount: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  currentTab,
  onSelectTab,
  soundEnabled,
  activeQuestsCount,
}) => {
  const tabs: { id: ScreenTab; label: string; icon: React.ReactNode; sub: string }[] = [
    {
      id: 'focus',
      label: 'FOCUS',
      icon: <Timer className="w-4 h-4" />,
      sub: 'TIMER & PET',
    },
    {
      id: 'quests',
      label: 'QUESTS',
      icon: <CheckSquare className="w-4 h-4" />,
      sub: `${activeQuestsCount} ACTIVE`,
    },
    {
      id: 'sensory',
      label: 'SENSORY',
      icon: <Sparkles className="w-4 h-4" />,
      sub: 'CALM & FIDGET',
    },
    {
      id: 'cartridge',
      label: 'CARTRIDGE',
      icon: <HardDrive className="w-4 h-4" />,
      sub: 'MEMORY & LOG',
    },
  ];

  return (
    <nav className="w-full max-w-5xl mx-auto px-3 sm:px-6 my-4 select-none">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
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
              className={`pixel-btn relative flex flex-col items-start p-2.5 sm:p-3 border-2 border-[#2D3142] text-left transition-all ${
                isActive
                  ? 'bg-[#7FB685] text-[#2D3142] pixel-shadow font-bold'
                  : 'bg-[#F2EFE9] hover:bg-[#FAF8F5] text-[#2D3142]/80 pixel-shadow-sm'
              }`}
            >
              {/* Active retro diamond indicator */}
              <div className="flex items-center justify-between w-full mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs text-[#2D3142]">
                    {isActive ? '◆' : `0${idx + 1}`}
                  </span>
                  <div className="text-[#2D3142]">{tab.icon}</div>
                </div>
                {tab.id === 'quests' && activeQuestsCount > 0 && (
                  <span className="font-mono text-[10px] font-bold px-1.5 bg-[#F4A261] border border-[#2D3142] text-[#2D3142]">
                    {activeQuestsCount}
                  </span>
                )}
              </div>

              <div className="font-mono text-xs sm:text-sm tracking-wider uppercase">
                {tab.label}
              </div>
              <div className="font-sans text-[10px] text-[#2D3142]/70 tracking-tight font-medium">
                {tab.sub}
              </div>

              {/* Bottom active edge bar */}
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
