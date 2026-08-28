import React, { useState } from 'react';
import { HardDrive, Calendar, Zap, CheckCircle2, FileText, Trash2, Volume2, Sparkles } from 'lucide-react';
import { DayActivity, PetState } from '../types';
import { playMechanicalClick, playChiptuneBeep } from '../utils/audio';

interface CartridgeMemoryScreenProps {
  activityLog: DayActivity[];
  pet: PetState;
  scratchpad: string;
  onUpdateScratchpad: (text: string) => void;
  soundEnabled: boolean;
  onResetData: () => void;
}

export const CartridgeMemoryScreen: React.FC<CartridgeMemoryScreenProps> = ({
  activityLog,
  pet,
  scratchpad,
  onUpdateScratchpad,
  soundEnabled,
  onResetData,
}) => {
  const [saveStatus, setSaveStatus] = useState<'IDLE' | 'SAVING' | 'SAVED'>('IDLE');

  const totalMinutes = activityLog.reduce((acc, d) => acc + d.minutesFocused, 0);
  const totalQuests = activityLog.reduce((acc, d) => acc + d.questsCompleted, 0);

  const handleScratchpadChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdateScratchpad(e.target.value);
    setSaveStatus('SAVING');
    setTimeout(() => setSaveStatus('SAVED'), 600);
  };

  const handleClearScratchpad = () => {
    playMechanicalClick(soundEnabled);
    onUpdateScratchpad('');
    setSaveStatus('SAVED');
  };

  const soundTestNotes = [440, 523.25, 659.25, 783.99, 880];
  const testSoundNote = (idx: number) => {
    playChiptuneBeep(soundTestNotes[idx % soundTestNotes.length], soundEnabled);
  };

  return (
    <div className="w-full space-y-4">
      {/* Cartridge Status Bar */}
      <div className="bg-[#CADBFB] border-2 border-[#2D3142] p-4 pixel-shadow flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-[#2D3142]" />
          <div>
            <div className="font-mono text-xs font-bold text-[#2D3142]">
              CARTRIDGE SAVE SLOT 01: [COZY_FOCUS.SAV]
            </div>
            <div className="font-sans text-[11px] text-[#2D3142]/80">
              Auto-persisting to local console memory
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-[#FAF8F5] border border-[#2D3142] text-[#2D3142]">
            STATUS: {saveStatus === 'SAVING' ? 'WRITING...' : 'SYNCHRONIZED'}
          </span>
        </div>
      </div>

      {/* Handheld Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-[#FAF8F5] border-2 border-[#2D3142] p-3 pixel-shadow-sm">
          <div className="font-mono text-[10px] text-[#2D3142]/70 uppercase">FOCUS TIME</div>
          <div className="font-mono text-2xl font-bold text-[#2D3142] mt-0.5">
            {totalMinutes} <span className="text-xs">MINS</span>
          </div>
          <div className="font-sans text-[10px] text-[#2D3142]/70 mt-1">This cycle</div>
        </div>

        <div className="bg-[#FAF8F5] border-2 border-[#2D3142] p-3 pixel-shadow-sm">
          <div className="font-mono text-[10px] text-[#2D3142]/70 uppercase">QUESTS DONE</div>
          <div className="font-mono text-2xl font-bold text-[#7FB685] mt-0.5">
            {totalQuests}
          </div>
          <div className="font-sans text-[10px] text-[#2D3142]/70 mt-1">Micro-tasks cleared</div>
        </div>

        <div className="bg-[#FAF8F5] border-2 border-[#2D3142] p-3 pixel-shadow-sm">
          <div className="font-mono text-[10px] text-[#2D3142]/70 uppercase">PET BOND</div>
          <div className="font-mono text-2xl font-bold text-[#F4A261] mt-0.5">
            LVL {pet.level}
          </div>
          <div className="font-sans text-[10px] text-[#2D3142]/70 mt-1">{pet.exp} Total XP</div>
        </div>

        <div className="bg-[#FAF8F5] border-2 border-[#2D3142] p-3 pixel-shadow-sm">
          <div className="font-mono text-[10px] text-[#2D3142]/70 uppercase">STAMINA GAIN</div>
          <div className="font-mono text-2xl font-bold text-[#2D3142] mt-0.5">
            +{totalQuests * 2} <span className="text-xs">SP</span>
          </div>
          <div className="font-sans text-[10px] text-[#2D3142]/70 mt-1">Energy restored</div>
        </div>
      </div>

      {/* 7-Day Pixel Heatmap Activity Log */}
      <div className="bg-[#FAF8F5] border-2 border-[#2D3142] p-4 pixel-shadow">
        <div className="flex items-center justify-between border-b-2 border-[#2D3142] pb-2 mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#2D3142]" />
            <span className="font-mono text-xs font-bold uppercase text-[#2D3142]">
              7-DAY FOCUS ACTIVITY LOG
            </span>
          </div>
          <div className="flex items-center gap-1 font-mono text-[10px] text-[#2D3142]/70">
            <span>LESS</span>
            <span className="w-2.5 h-2.5 bg-[#E4DFD5] border border-[#2D3142]" />
            <span className="w-2.5 h-2.5 bg-[#CADBFB] border border-[#2D3142]" />
            <span className="w-2.5 h-2.5 bg-[#7FB685] border border-[#2D3142]" />
            <span className="w-2.5 h-2.5 bg-[#35693F] border border-[#2D3142]" />
            <span>MORE</span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {activityLog.map((day, i) => {
            const intensityClass =
              day.level === 3
                ? 'bg-[#35693F] text-[#FAF8F5]'
                : day.level === 2
                ? 'bg-[#7FB685] text-[#2D3142]'
                : day.level === 1
                ? 'bg-[#CADBFB] text-[#2D3142]'
                : 'bg-[#E4DFD5] text-[#2D3142]/60';

            return (
              <div
                key={i}
                className="bg-[#F2EFE9] border-2 border-[#2D3142] p-2 flex flex-col items-center justify-between text-center min-h-[70px]"
              >
                <span className="font-mono text-[10px] font-bold text-[#2D3142]">
                  {day.date}
                </span>

                {/* Pixel intensity block */}
                <div
                  className={`w-6 h-6 border border-[#2D3142] flex items-center justify-center font-mono text-[10px] font-bold ${intensityClass}`}
                >
                  {day.minutesFocused}m
                </div>

                <span className="font-mono text-[9px] text-[#2D3142]/70">
                  {day.questsCompleted}Q
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Brain Dump & Scratchpad (Combat ADHD Working Memory Overload) */}
      <div className="bg-[#F2EFE9] border-2 border-[#2D3142] p-4 pixel-shadow">
        <div className="flex items-center justify-between border-b-2 border-[#2D3142] pb-2 mb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#2D3142]" />
            <div>
              <span className="font-mono text-xs font-bold uppercase text-[#2D3142]">
                BRAIN DUMP SCRATCHPAD
              </span>
              <span className="font-sans text-xs text-[#2D3142]/70 ml-2 hidden sm:inline">
                Offload intrusive thoughts or random ideas here to keep your mind free.
              </span>
            </div>
          </div>

          <button
            id="clear-scratchpad-btn"
            onClick={handleClearScratchpad}
            className="pixel-btn flex items-center gap-1 px-2 py-0.5 bg-[#FAF8F5] hover:bg-[#ffdad6] border border-[#2D3142] font-mono text-[10px] font-bold text-[#2D3142]"
          >
            <Trash2 className="w-3 h-3" />
            <span>CLEAR</span>
          </button>
        </div>

        {/* Scratchpad Recessed Inset Well */}
        <div className="relative">
          <textarea
            id="brain-dump-textarea"
            value={scratchpad}
            onChange={handleScratchpadChange}
            placeholder="Jot down anything distracting you right now... (it will stay saved here)"
            rows={4}
            className="w-full bg-[#FAF8F5] border-2 border-[#2D3142] p-3 font-sans text-sm text-[#2D3142] pixel-inset focus:outline-none resize-y placeholder:text-[#2D3142]/40 leading-relaxed"
          />
          {/* Subtle 8-bit blinking caret icon in bottom right */}
          <div className="absolute bottom-3 right-3 font-mono text-xs text-[#7FB685] blink-cursor pointer-events-none">
            ▌
          </div>
        </div>
      </div>

      {/* Diagnostics & 8-Bit Chiptune Sound Test */}
      <div className="bg-[#FAF8F5] border-2 border-[#2D3142] p-4 pixel-shadow">
        <div className="flex items-center justify-between border-b-2 border-[#2D3142] pb-2 mb-3">
          <div className="flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-[#2D3142]" />
            <span className="font-mono text-xs font-bold uppercase text-[#2D3142]">
              SOUND TEST SYNTHESIZER
            </span>
          </div>
          <span className="font-mono text-[10px] text-[#2D3142]/70">
            TEST HARDWARE AUDIO
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {['NOTE A4', 'NOTE C5', 'NOTE E5', 'NOTE G5', 'NOTE A5'].map((name, idx) => (
            <button
              key={idx}
              id={`sound-test-${idx}`}
              onClick={() => testSoundNote(idx)}
              className="pixel-btn px-3 py-1.5 bg-[#CADBFB] hover:bg-[#B4C5E4] border-2 border-[#2D3142] font-mono text-xs font-bold text-[#2D3142] pixel-shadow-sm"
            >
              ♪ {name}
            </button>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-[#2D3142]/20 flex items-center justify-between">
          <span className="font-sans text-xs text-[#2D3142]/70">
            Need a clean slate? Resetting will restore default quests and stats.
          </span>
          <button
            id="reset-all-data-btn"
            onClick={() => {
              if (window.confirm('Reset all quests and stats to fresh state?')) {
                onResetData();
              }
            }}
            className="pixel-btn px-3 py-1 bg-[#ffdad6] hover:bg-[#ffb4ab] border-2 border-[#2D3142] font-mono text-xs font-bold text-[#93000a]"
          >
            RESET SAVE DATA
          </button>
        </div>
      </div>
    </div>
  );
};
