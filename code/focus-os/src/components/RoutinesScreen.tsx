import React, { useState } from 'react';
import { Plus, Check, Flame, Sparkles, Sun, Sunset, Moon, Droplets } from 'lucide-react';
import { RoutineItem } from '../types';
import { playMechanicalClick, playQuestComplete, playChiptuneBeep } from '../utils/audio';

interface RoutinesScreenProps {
  routines: RoutineItem[];
  onToggleRoutine: (id: string) => void;
  onAddRoutine: (title: string, timeOfDay: 'morning' | 'afternoon' | 'evening') => void;
  soundEnabled: boolean;
}

export const RoutinesScreen: React.FC<RoutinesScreenProps> = ({
  routines,
  onToggleRoutine,
  onAddRoutine,
  soundEnabled,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newTimeOfDay, setNewTimeOfDay] = useState<'morning' | 'afternoon' | 'evening'>('morning');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    playMechanicalClick(soundEnabled);
    onAddRoutine(newTitle.trim(), newTimeOfDay);
    setNewTitle('');
    playChiptuneBeep(659, soundEnabled);
  };

  const morningRoutines = routines.filter((r) => r.timeOfDay === 'morning');
  const afternoonRoutines = routines.filter((r) => r.timeOfDay === 'afternoon');
  const eveningRoutines = routines.filter((r) => r.timeOfDay === 'evening');

  const renderRoutineGroup = (title: string, icon: React.ReactNode, list: RoutineItem[]) => (
    <div className="bg-[#FAF8F5] border-2 border-[#2D3142] p-4 pixel-shadow">
      <div className="flex items-center gap-2 border-b-2 border-[#2D3142] pb-2 mb-3">
        {icon}
        <span className="font-mono text-xs sm:text-sm font-bold uppercase text-[#2D3142]">
          {title} ({list.filter((r) => r.completedToday).length}/{list.length} COMPLETED)
        </span>
      </div>

      <div className="space-y-2">
        {list.map((routine) => (
          <div
            key={routine.id}
            className={`flex items-center justify-between p-2.5 border-2 border-[#2D3142] transition-colors ${
              routine.completedToday
                ? 'bg-[#E4DFD5]/60 opacity-80'
                : 'bg-[#F2EFE9] hover:bg-[#FAF8FF] pixel-shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <button
                id={`routine-check-${routine.id}`}
                onClick={() => {
                  if (!routine.completedToday) {
                    playQuestComplete(soundEnabled);
                  } else {
                    playMechanicalClick(soundEnabled);
                  }
                  onToggleRoutine(routine.id);
                }}
                className="pixel-btn w-5 h-5 border-2 border-[#2D3142] bg-[#FAF8F5] flex items-center justify-center shrink-0 pixel-shadow-sm"
              >
                {routine.completedToday && <Check className="w-3.5 h-3.5 text-[#35693F] stroke-[3]" />}
              </button>

              <span
                className={`font-sans text-xs sm:text-sm text-[#2D3142] ${
                  routine.completedToday ? 'line-through text-[#2D3142]/60' : 'font-medium'
                }`}
              >
                {routine.title}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Streak Badge */}
              <div className="flex items-center gap-1 font-mono text-[10px] font-bold px-1.5 py-0.5 bg-[#F8C390] border border-[#2D3142] text-[#2D3142]">
                <Flame className="w-3 h-3 fill-[#8E4E14] text-[#8E4E14]" />
                <span>{routine.streak} DAY STREAK</span>
              </div>

              <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 bg-[#CADBFB] border border-[#2D3142] text-[#2D3142]">
                +{routine.staminaReward} SP
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-4">
      {/* Header Info */}
      <div className="bg-[#CADBFB] border-2 border-[#2D3142] p-4 pixel-shadow">
        <div className="flex items-center justify-between border-b-2 border-[#2D3142] pb-2 mb-2">
          <span className="font-mono text-xs sm:text-sm font-bold uppercase text-[#2D3142]">
            RECURRING ROUTINES & HABIT TRACKING
          </span>
          <span className="font-mono text-[10px] px-1.5 py-0.5 bg-[#FAF8F5] border border-[#2D3142]">
            NEURODIVERGENT CONSISTENCY
          </span>
        </div>
        <p className="font-sans text-xs text-[#2D3142]/80">
          Proposal Section 4.1: Automate repeated daily actions to preserve working memory for your highest-priority tasks.
        </p>
      </div>

      {/* Add Routine Form */}
      <div className="bg-[#F2EFE9] border-2 border-[#2D3142] p-4 pixel-shadow">
        <div className="font-mono text-xs font-bold uppercase text-[#2D3142] mb-2">
          ADD RECURRING DAILY HABIT
        </div>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2">
          <input
            id="routine-title-input"
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="e.g. 5-minute stretch or review daily priority"
            className="flex-1 px-3 py-2 bg-[#FAF8F5] border-2 border-[#2D3142] font-sans text-xs sm:text-sm text-[#2D3142] pixel-inset focus:outline-none"
          />

          <select
            id="routine-time-select"
            value={newTimeOfDay}
            onChange={(e) => setNewTimeOfDay(e.target.value as any)}
            className="px-3 py-2 bg-[#FAF8F5] border-2 border-[#2D3142] font-mono text-xs font-bold text-[#2D3142] uppercase"
          >
            <option value="morning">MORNING</option>
            <option value="afternoon">AFTERNOON</option>
            <option value="evening">EVENING</option>
          </select>

          <button
            type="submit"
            id="add-routine-btn"
            className="pixel-btn px-4 py-2 bg-[#7FB685] hover:bg-[#A3CFAB] border-2 border-[#2D3142] font-mono text-xs font-bold text-[#2D3142] pixel-shadow-sm whitespace-nowrap"
          >
            + ADD ROUTINE
          </button>
        </form>
      </div>

      {/* Routine Blocks */}
      {renderRoutineGroup('MORNING ROUTINE', <Sun className="w-4 h-4 text-[#F4A261]" />, morningRoutines)}
      {renderRoutineGroup('AFTERNOON RECHARGE', <Sunset className="w-4 h-4 text-[#7FB685]" />, afternoonRoutines)}
      {renderRoutineGroup('EVENING WIND-DOWN', <Moon className="w-4 h-4 text-[#CADBFB]" />, eveningRoutines)}
    </div>
  );
};
