import React from 'react';
import { Volume2, VolumeX, CloudRain, BatteryCharging, Sparkles } from 'lucide-react';
import { playMechanicalClick } from '../utils/audio';

interface ConsoleHeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  ambientNoise: boolean;
  onToggleAmbient: () => void;
}

export const ConsoleHeader: React.FC<ConsoleHeaderProps> = ({
  soundEnabled,
  onToggleSound,
  ambientNoise,
  onToggleAmbient,
}) => {
  return (
    <header className="w-full bg-[#FAF8F5] border-b-2 border-[#2D3142] pb-3 pt-2 px-3 sm:px-6 select-none">
      {/* Handheld top status bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 max-w-5xl mx-auto">
        {/* Console brand logo & model */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#7FB685] border border-[#2D3142] pixel-shadow-sm flex items-center justify-center">
            <div className="w-1 h-1 bg-[#FAF8F5]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-sm sm:text-base font-bold tracking-tight text-[#2D3142]">
              COZY POCKET
            </span>
            <span className="font-mono text-[10px] font-bold px-1 py-0.2 bg-[#CADBFB] border border-[#2D3142] text-[#2D3142]">
              DMG-09
            </span>
          </div>
        </div>

        {/* Center speaker grill slits */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-[#F2EFE9] border border-[#2D3142] pixel-inset-soft">
          <div className="w-4 h-1 bg-[#2D3142]/30" />
          <div className="w-4 h-1 bg-[#2D3142]/30" />
          <div className="w-4 h-1 bg-[#2D3142]/30" />
          <div className="w-4 h-1 bg-[#2D3142]/30" />
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#2D3142]/70 ml-1">
            STEREO SOUND
          </span>
        </div>

        {/* Right status & tactile toggles */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Battery Status LED */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#F2EFE9] border border-[#2D3142]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full bg-[#7FB685] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 bg-[#7FB685] border border-[#2D3142]"></span>
            </span>
            <span className="font-mono text-[10px] font-bold tracking-wider text-[#2D3142]">
              BATTERY 96%
            </span>
          </div>

          {/* Sound FX Toggle Button */}
          <button
            id="toggle-sound-btn"
            onClick={() => {
              playMechanicalClick(true);
              onToggleSound();
            }}
            title="Toggle 8-bit sound effects"
            className={`pixel-btn flex items-center gap-1 px-2 py-1 border-2 border-[#2D3142] font-mono text-[11px] font-bold ${
              soundEnabled
                ? 'bg-[#CADBFB] text-[#2D3142] pixel-shadow-sm'
                : 'bg-[#F2EFE9] text-[#2D3142]/60'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{soundEnabled ? 'FX ON' : 'MUTED'}</span>
          </button>

          {/* Ambient Rain / White Noise Toggle */}
          <button
            id="toggle-ambient-btn"
            onClick={() => {
              playMechanicalClick(soundEnabled);
              onToggleAmbient();
            }}
            title="Toggle cozy soothing brown noise hum"
            className={`pixel-btn flex items-center gap-1 px-2 py-1 border-2 border-[#2D3142] font-mono text-[11px] font-bold ${
              ambientNoise
                ? 'bg-[#F8C390] text-[#2D3142] pixel-shadow-sm'
                : 'bg-[#F2EFE9] text-[#2D3142]/60'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{ambientNoise ? 'RAIN ON' : 'RAIN OFF'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
