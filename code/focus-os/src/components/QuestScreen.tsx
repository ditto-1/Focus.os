import React, { useState } from 'react';
import { Plus, Trash2, Check, Sparkles, Filter, AlertCircle, ArrowRight } from 'lucide-react';
import { Quest } from '../types';
import { playMechanicalClick, playQuestComplete, playChiptuneBeep } from '../utils/audio';

interface QuestScreenProps {
  quests: Quest[];
  onToggleQuest: (id: string) => void;
  onAddQuest: (title: string, staminaPoints: 1 | 2 | 3, category: 'core' | 'side' | 'wellness') => void;
  onDeleteQuest: (id: string) => void;
  soundEnabled: boolean;
}

export const QuestScreen: React.FC<QuestScreenProps> = ({
  quests,
  onToggleQuest,
  onAddQuest,
  onDeleteQuest,
  soundEnabled,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [selectedSP, setSelectedSP] = useState<1 | 2 | 3>(1);
  const [selectedCategory, setSelectedCategory] = useState<'core' | 'side' | 'wellness'>('side');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');

  const handleCreateQuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    playMechanicalClick(soundEnabled);
    onAddQuest(newTitle.trim(), selectedSP, selectedCategory);
    setNewTitle('');
    playChiptuneBeep(700, soundEnabled);
  };

  const handlePreset = (title: string, sp: 1 | 2 | 3, category: 'core' | 'side' | 'wellness') => {
    playMechanicalClick(soundEnabled);
    onAddQuest(title, sp, category);
    playChiptuneBeep(659, soundEnabled);
  };

  const handleToggle = (id: string, currentlyCompleted: boolean) => {
    if (!currentlyCompleted) {
      playQuestComplete(soundEnabled);
    } else {
      playMechanicalClick(soundEnabled);
    }
    onToggleQuest(id);
  };

  // Find priority core quest that is still active
  const activeCoreQuest = quests.find((q) => q.category === 'core' && !q.completed);

  // Filtered list
  const filteredQuests = quests.filter((q) => {
    if (filter === 'active') return !q.completed;
    if (filter === 'completed') return q.completed;
    return true;
  });

  const completedCount = quests.filter((q) => q.completed).length;
  const totalSPRestored = quests.filter((q) => q.completed).reduce((acc, q) => acc + q.staminaPoints, 0);

  return (
    <div className="w-full space-y-4">
      {/* Featured Core Focus Card (Combat ADHD Executive Dysfunction) */}
      {activeCoreQuest ? (
        <div className="bg-[#CADBFB] border-2 border-[#2D3142] p-4 pixel-shadow relative">
          <div className="flex items-center justify-between border-b-2 border-[#2D3142] pb-2 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs font-bold px-2 py-0.5 bg-[#7FB685] border border-[#2D3142] text-[#2D3142]">
                CORE QUEST
              </span>
              <span className="font-sans text-xs font-semibold text-[#2D3142]">
                Your Single Current Focus
              </span>
            </div>
            <span className="font-mono text-xs font-bold px-1.5 py-0.5 bg-[#FAF8F5] border border-[#2D3142]">
              +{activeCoreQuest.staminaPoints} SP
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 my-2">
            <div className="flex items-start gap-3">
              {/* Stepped Pixel Checkbox */}
              <button
                id={`core-quest-check-${activeCoreQuest.id}`}
                onClick={() => handleToggle(activeCoreQuest.id, activeCoreQuest.completed)}
                className="pixel-btn w-6 h-6 mt-0.5 border-2 border-[#2D3142] bg-[#FAF8F5] flex items-center justify-center pixel-shadow-sm"
              >
                {activeCoreQuest.completed && <Check className="w-4 h-4 text-[#35693F] stroke-[3]" />}
              </button>
              <div>
                <h3 className="font-mono text-base font-bold text-[#2D3142]">
                  {activeCoreQuest.title}
                </h3>
                <p className="font-sans text-xs text-[#2D3142]/80 mt-0.5">
                  Protect your working memory. Work on this task before picking others.
                </p>
              </div>
            </div>

            <button
              id={`complete-core-btn-${activeCoreQuest.id}`}
              onClick={() => handleToggle(activeCoreQuest.id, activeCoreQuest.completed)}
              className="pixel-btn px-3 py-1.5 bg-[#7FB685] hover:bg-[#A3CFAB] border-2 border-[#2D3142] font-mono text-xs font-bold text-[#2D3142] pixel-shadow-sm whitespace-nowrap"
            >
              COMPLETE
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#FAF8F5] border-2 border-dashed border-[#2D3142] p-4 text-center">
          <p className="font-mono text-xs font-bold text-[#2D3142]">
            ALL CORE QUESTS CLEARED! SELECT A SIDE QUEST OR RELAX.
          </p>
        </div>
      )}

      {/* Quick Add Form Container */}
      <div className="bg-[#F2EFE9] border-2 border-[#2D3142] p-4 pixel-shadow">
        <div className="flex items-center justify-between border-b-2 border-[#2D3142] pb-2 mb-3">
          <span className="font-mono text-xs font-bold uppercase text-[#2D3142]">
            LOG NEW MICRO-QUEST
          </span>
          <span className="font-mono text-[10px] text-[#2D3142]/70">
            KEEP IT TINY & DOABLE
          </span>
        </div>

        <form onSubmit={handleCreateQuest} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Input with recessed inset well */}
            <input
              id="new-quest-input"
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What is one tiny task you can do? (e.g. reply to 1 email)"
              className="flex-1 px-3 py-2 bg-[#FAF8F5] border-2 border-[#2D3142] font-sans text-sm text-[#2D3142] pixel-inset focus:outline-none placeholder:text-[#2D3142]/40"
            />

            <button
              type="submit"
              id="add-quest-submit-btn"
              className="pixel-btn flex items-center justify-center gap-1.5 px-4 py-2 bg-[#7FB685] hover:bg-[#A3CFAB] border-2 border-[#2D3142] font-mono text-xs font-bold text-[#2D3142] pixel-shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>ADD QUEST</span>
            </button>
          </div>

          {/* Energy Cost & Category selectors */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-bold text-[#2D3142]">ENERGY COST:</span>
              {([1, 2, 3] as const).map((sp) => (
                <button
                  type="button"
                  key={sp}
                  id={`sp-selector-${sp}`}
                  onClick={() => {
                    playMechanicalClick(soundEnabled);
                    setSelectedSP(sp);
                  }}
                  className={`pixel-btn px-2 py-0.5 border-2 border-[#2D3142] font-mono text-xs font-bold ${
                    selectedSP === sp
                      ? 'bg-[#F4A261] text-[#2D3142] pixel-shadow-sm'
                      : 'bg-[#FAF8F5] text-[#2D3142]/70'
                  }`}
                >
                  {sp} SP {sp === 1 ? '(LOW)' : sp === 2 ? '(MED)' : '(HIGH)'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-bold text-[#2D3142]">TIER:</span>
              {(['core', 'side', 'wellness'] as const).map((cat) => (
                <button
                  type="button"
                  key={cat}
                  id={`category-selector-${cat}`}
                  onClick={() => {
                    playMechanicalClick(soundEnabled);
                    setSelectedCategory(cat);
                  }}
                  className={`pixel-btn px-2 py-0.5 border-2 border-[#2D3142] font-mono text-[10px] font-bold uppercase ${
                    selectedCategory === cat
                      ? 'bg-[#CADBFB] text-[#2D3142] pixel-shadow-sm'
                      : 'bg-[#FAF8F5] text-[#2D3142]/70'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </form>

        {/* Low-friction Presets for ADHD executive momentum */}
        <div className="mt-3 pt-2.5 border-t border-[#2D3142]/20">
          <div className="font-mono text-[10px] text-[#2D3142]/70 uppercase mb-1.5">
            LOW-FRICTION STARTERS (1-TAP TO ADD):
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { title: 'Tidy 3 things from desk', sp: 1 as const, cat: 'wellness' as const },
              { title: 'Drink full glass of water', sp: 1 as const, cat: 'wellness' as const },
              { title: 'Open document & write title', sp: 1 as const, cat: 'side' as const },
              { title: 'Stretch back & neck for 1 min', sp: 1 as const, cat: 'wellness' as const },
            ].map((p, i) => (
              <button
                key={i}
                id={`preset-btn-${i}`}
                onClick={() => handlePreset(p.title, p.sp, p.cat)}
                className="pixel-btn text-[11px] font-sans px-2 py-1 bg-[#FAF8F5] hover:bg-[#CADBFB] border border-[#2D3142] text-[#2D3142] flex items-center gap-1"
              >
                <span>+</span>
                <span>{p.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quest List Container */}
      <div className="bg-[#FAF8F5] border-2 border-[#2D3142] p-4 pixel-shadow">
        {/* Header & Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#2D3142] pb-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#2D3142] uppercase">
              QUEST LOG
            </span>
            <span className="font-mono text-[11px] px-1.5 py-0.5 bg-[#7FB685] border border-[#2D3142] text-[#2D3142]">
              {completedCount}/{quests.length} DONE (+{totalSPRestored} SP)
            </span>
          </div>

          <div className="flex items-center gap-1.5 select-none">
            {(['active', 'completed', 'all'] as const).map((f) => (
              <button
                key={f}
                id={`filter-btn-${f}`}
                onClick={() => {
                  playMechanicalClick(soundEnabled);
                  setFilter(f);
                }}
                className={`pixel-btn px-2 py-0.5 border-2 border-[#2D3142] font-mono text-[11px] font-bold uppercase ${
                  filter === f
                    ? 'bg-[#7FB685] text-[#2D3142] pixel-shadow-sm'
                    : 'bg-[#F2EFE9] text-[#2D3142]/70'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Quests Stack */}
        {filteredQuests.length === 0 ? (
          <div className="p-8 text-center bg-[#F2EFE9] border-2 border-dashed border-[#2D3142]">
            <p className="font-mono text-xs font-bold text-[#2D3142]">
              NO QUESTS IN THIS VIEW.
            </p>
            <p className="font-sans text-xs text-[#2D3142]/70 mt-1">
              Add a micro-task above to get your momentum rolling!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredQuests.map((quest) => (
              <div
                key={quest.id}
                className={`flex items-center justify-between p-2.5 border-2 border-[#2D3142] transition-colors ${
                  quest.completed
                    ? 'bg-[#E4DFD5]/60 opacity-75'
                    : 'bg-[#F2EFE9] hover:bg-[#FAF8FF] pixel-shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
                  {/* Chunky 8-Bit Pixel Checkbox */}
                  <button
                    id={`quest-checkbox-${quest.id}`}
                    onClick={() => handleToggle(quest.id, quest.completed)}
                    className="pixel-btn w-5 h-5 border-2 border-[#2D3142] bg-[#FAF8F5] flex items-center justify-center shrink-0 pixel-shadow-sm"
                  >
                    {quest.completed && <Check className="w-3.5 h-3.5 text-[#35693F] stroke-[3]" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <span
                      className={`font-sans text-xs sm:text-sm text-[#2D3142] break-words ${
                        quest.completed ? 'line-through text-[#2D3142]/60' : 'font-medium'
                      }`}
                    >
                      {quest.title}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Category badge */}
                  <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 border border-[#2D3142] bg-[#FAF8F5] text-[#2D3142]">
                    {quest.category}
                  </span>

                  {/* Stamina Points tag */}
                  <span
                    className={`font-mono text-[10px] font-bold px-1.5 py-0.5 border border-[#2D3142] ${
                      quest.staminaPoints === 1
                        ? 'bg-[#CADBFB]'
                        : quest.staminaPoints === 2
                        ? 'bg-[#F8C390]'
                        : 'bg-[#F4A261]'
                    }`}
                  >
                    {quest.staminaPoints} SP
                  </span>

                  {/* Delete button */}
                  <button
                    id={`delete-quest-${quest.id}`}
                    onClick={() => {
                      playMechanicalClick(soundEnabled);
                      onDeleteQuest(quest.id);
                    }}
                    title="Delete quest"
                    className="pixel-btn p-1 text-[#2D3142]/60 hover:text-[#BA1A1A] hover:bg-[#FAF8F5] border border-transparent hover:border-[#2D3142]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
