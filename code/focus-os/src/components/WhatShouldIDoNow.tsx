import React, { useState } from 'react';
import { Sparkles, Clock, Zap, ArrowRight, CheckCircle2, AlertTriangle, Lightbulb, ListPlus } from 'lucide-react';
import { TaskItem, Subtask } from '../types';
import { playMechanicalClick, playChiptuneBeep } from '../utils/audio';

interface WhatShouldIDoNowProps {
  tasks: TaskItem[];
  onStartFocusOnTask: (task: TaskItem) => void;
  onBreakdownTask: (taskId: string) => void;
  soundEnabled: boolean;
}

export const WhatShouldIDoNow: React.FC<WhatShouldIDoNowProps> = ({
  tasks,
  onStartFocusOnTask,
  onBreakdownTask,
  soundEnabled,
}) => {
  const [availableMinutes, setAvailableMinutes] = useState<number>(30);
  const [energyLevel, setEnergyLevel] = useState<'low' | 'med' | 'high'>('med');

  // Algorithm from Proposal Section 5.1 (Smart Planning):
  // Evaluates deadline urgency, priority, estimated duration vs available time, and user energy
  const activeTasks = tasks.filter((t) => !t.completed);

  // Scoring function
  const scoredTasks = activeTasks.map((task) => {
    let score = 0;
    const reasons: string[] = [];

    // Priority score
    if (task.priority === 'urgent') {
      score += 50;
      reasons.push('Marked as urgent priority');
    } else if (task.priority === 'high') {
      score += 35;
      reasons.push('High priority responsibility');
    } else if (task.priority === 'normal') {
      score += 20;
    } else {
      score += 10;
    }

    // Deadline urgency
    const lowerDeadline = task.deadline.toLowerCase();
    if (lowerDeadline.includes('today') || lowerDeadline.includes('tomorrow') || lowerDeadline.includes('5 pm')) {
      score += 40;
      reasons.push(`Deadline is pressing (${task.deadline})`);
    }

    // Available time fit
    const timeDiff = Math.abs(task.estimatedMinutes - availableMinutes);
    if (task.estimatedMinutes <= availableMinutes) {
      score += 30 - timeDiff * 0.5;
      reasons.push(`Fits within your available ${availableMinutes}-minute block (estimated ${task.estimatedMinutes}m)`);
    } else {
      score -= 20;
      reasons.push(`Longer than your available time (${task.estimatedMinutes}m vs ${availableMinutes}m) — consider breaking down`);
    }

    // Energy match
    const energyMap = { low: 1, med: 2, high: 3 };
    if (task.staminaPoints === energyMap[energyLevel]) {
      score += 25;
      reasons.push(`Matches your current ${energyLevel.toUpperCase()} energy level`);
    } else if (energyLevel === 'low' && task.staminaPoints > 1) {
      score -= 15;
    }

    return {
      task,
      score,
      reasons,
    };
  });

  scoredTasks.sort((a, b) => b.score - a.score);

  const bestMatch = scoredTasks[0];
  const alternativeMatches = scoredTasks.slice(1, 3);

  return (
    <div className="w-full space-y-4">
      {/* Context Assessment Form (Available Time & Energy) */}
      <div className="bg-[#FAF8F5] border-2 border-[#2D3142] p-4 sm:p-5 pixel-shadow">
        <div className="flex items-center justify-between border-b-2 border-[#2D3142] pb-2 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#7FB685]" />
            <span className="font-mono text-xs sm:text-sm font-bold text-[#2D3142] uppercase">
              "WHAT SHOULD I DO NOW?" ENGINE
            </span>
          </div>
          <span className="font-mono text-[10px] px-2 py-0.5 bg-[#CADBFB] border border-[#2D3142] text-[#2D3142]">
            ADAPTIVE PLANNING
          </span>
        </div>

        <p className="font-sans text-xs text-[#2D3142]/80 mb-3">
          Combats task paralysis and decision fatigue. Tell us how much time and energy you have right now, and the system recommends the single highest-impact action.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Time Budget */}
          <div>
            <div className="flex items-center justify-between font-mono text-[11px] font-bold text-[#2D3142] mb-1.5">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>AVAILABLE TIME RIGHT NOW:</span>
              </span>
              <span className="px-1.5 bg-[#F4A261] border border-[#2D3142] text-[#2D3142]">
                {availableMinutes} MINS
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[15, 25, 40, 60].map((mins) => (
                <button
                  key={mins}
                  id={`avail-time-btn-${mins}`}
                  onClick={() => {
                    playMechanicalClick(soundEnabled);
                    setAvailableMinutes(mins);
                  }}
                  className={`pixel-btn py-1.5 border-2 border-[#2D3142] font-mono text-xs font-bold ${
                    availableMinutes === mins
                      ? 'bg-[#7FB685] text-[#2D3142] pixel-shadow-sm'
                      : 'bg-[#F2EFE9] text-[#2D3142]/70'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>

          {/* Energy Level */}
          <div>
            <div className="flex items-center justify-between font-mono text-[11px] font-bold text-[#2D3142] mb-1.5">
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                <span>CURRENT ENERGY LEVEL:</span>
              </span>
              <span className="uppercase px-1.5 bg-[#CADBFB] border border-[#2D3142] text-[#2D3142]">
                {energyLevel}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'low' as const, label: 'LOW (1 SP)' },
                { id: 'med' as const, label: 'MED (2 SP)' },
                { id: 'high' as const, label: 'HIGH (3 SP)' },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  id={`energy-lvl-btn-${lvl.id}`}
                  onClick={() => {
                    playMechanicalClick(soundEnabled);
                    setEnergyLevel(lvl.id);
                  }}
                  className={`pixel-btn py-1.5 border-2 border-[#2D3142] font-mono text-[11px] font-bold ${
                    energyLevel === lvl.id
                      ? 'bg-[#F8C390] text-[#2D3142] pixel-shadow-sm'
                      : 'bg-[#F2EFE9] text-[#2D3142]/70'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Task Showcase Card */}
      {bestMatch ? (
        <div className="bg-[#CADBFB] border-2 border-[#2D3142] p-5 pixel-shadow relative overflow-hidden">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#2D3142] pb-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 bg-[#7FB685] border border-[#2D3142] text-[#2D3142]">
                TOP RECOMMENDED ACTION
              </span>
              <span className="font-mono text-xs text-[#2D3142] font-bold">
                EST. {bestMatch.task.estimatedMinutes} MINS • {bestMatch.task.staminaPoints} SP
              </span>
            </div>
            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 bg-[#FAF8F5] border border-[#2D3142] text-[#2D3142]">
              MATCH SCORE: {Math.round(bestMatch.score)}
            </span>
          </div>

          {/* Task Title & Details */}
          <div className="space-y-1 mb-4">
            <h2 className="font-mono text-lg sm:text-xl font-bold text-[#2D3142]">
              {bestMatch.task.title}
            </h2>
            {bestMatch.task.notes && (
              <p className="font-sans text-xs sm:text-sm text-[#2D3142]/80">
                {bestMatch.task.notes}
              </p>
            )}
          </div>

          {/* Transparent Reasoning Section (Per Proposal Section 5.1) */}
          <div className="bg-[#FAF8F5] border-2 border-[#2D3142] p-3 mb-4 pixel-inset-soft">
            <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-[#2D3142] uppercase mb-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-[#F4A261]" />
              <span>WHY THIS RECOMMENDATION? (TRANSPARENT RATIONALE)</span>
            </div>
            <ul className="space-y-1">
              {bestMatch.reasons.map((r, i) => (
                <li key={i} className="font-sans text-xs text-[#2D3142] flex items-center gap-2">
                  <span className="text-[#35693F] font-bold">✓</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Subtasks if any */}
          {bestMatch.task.subtasks.length > 0 && (
            <div className="bg-[#FAF8F5] border-2 border-[#2D3142] p-3 mb-4">
              <div className="font-mono text-[10px] font-bold text-[#2D3142] uppercase mb-1.5">
                SUBTASK CHECKLIST ({bestMatch.task.subtasks.filter(s => s.completed).length}/{bestMatch.task.subtasks.length} DONE):
              </div>
              <div className="space-y-1">
                {bestMatch.task.subtasks.map((sub) => (
                  <div key={sub.id} className="flex items-center gap-2 font-sans text-xs text-[#2D3142]">
                    <span className="font-mono text-[10px] text-[#7FB685] font-bold">
                      {sub.completed ? '☑' : '☐'}
                    </span>
                    <span className={sub.completed ? 'line-through opacity-60' : ''}>
                      {sub.title} ({sub.estimatedMinutes}m)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              id="start-recommended-focus-btn"
              onClick={() => {
                playMechanicalClick(soundEnabled);
                playChiptuneBeep(659, soundEnabled);
                onStartFocusOnTask(bestMatch.task);
              }}
              className="pixel-btn flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-[#7FB685] hover:bg-[#A3CFAB] border-2 border-[#2D3142] font-mono text-sm font-bold text-[#2D3142] pixel-shadow"
            >
              <span>START FOCUS ON THIS TASK</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {bestMatch.task.subtasks.length === 0 && (
              <button
                id="breakdown-recommended-task-btn"
                onClick={() => {
                  playMechanicalClick(soundEnabled);
                  onBreakdownTask(bestMatch.task.id);
                }}
                className="pixel-btn flex items-center justify-center gap-1.5 px-3 py-3 bg-[#FAF8F5] hover:bg-[#F2EFE9] border-2 border-[#2D3142] font-mono text-xs font-bold text-[#2D3142] pixel-shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#F4A261]" />
                <span>BREAK DOWN (AI)</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-[#FAF8F5] border-2 border-dashed border-[#2D3142] p-8 text-center">
          <p className="font-mono text-xs font-bold text-[#2D3142]">
            ALL ACTIVE TASKS ARE COMPLETE!
          </p>
          <p className="font-sans text-xs text-[#2D3142]/70 mt-1">
            Enjoy your well-earned break or add a new task in the Planner.
          </p>
        </div>
      )}

      {/* Alternative Recommendations (User Override Option per Section 10) */}
      {alternativeMatches.length > 0 && (
        <div className="bg-[#F2EFE9] border-2 border-[#2D3142] p-4 pixel-shadow">
          <div className="flex items-center justify-between border-b-2 border-[#2D3142] pb-2 mb-2">
            <span className="font-mono text-xs font-bold uppercase text-[#2D3142]">
              OVERRIDE: OTHER SUITABLE CANDIDATES
            </span>
            <span className="font-mono text-[10px] text-[#2D3142]/70">
              NOT FEELING THE TOP CHOICE? PICK ONE:
            </span>
          </div>

          <div className="space-y-2">
            {alternativeMatches.map(({ task, reasons }) => (
              <div
                key={task.id}
                className="bg-[#FAF8F5] border-2 border-[#2D3142] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pixel-shadow-sm"
              >
                <div>
                  <div className="font-mono text-xs font-bold text-[#2D3142]">
                    {task.title}
                  </div>
                  <div className="font-sans text-[11px] text-[#2D3142]/70">
                    Est. {task.estimatedMinutes}m • {task.priority.toUpperCase()} priority • {reasons[0]}
                  </div>
                </div>

                <button
                  id={`select-alt-task-${task.id}`}
                  onClick={() => {
                    playMechanicalClick(soundEnabled);
                    onStartFocusOnTask(task);
                  }}
                  className="pixel-btn px-3 py-1.5 bg-[#CADBFB] hover:bg-[#B4C5E4] border-2 border-[#2D3142] font-mono text-xs font-bold text-[#2D3142] whitespace-nowrap self-start sm:self-center"
                >
                  FOCUS THIS INSTEAD →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
