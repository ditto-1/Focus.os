import React, { useState } from 'react';
import { Sparkles, Heart, ChevronDown, ChevronUp, Lock, RefreshCw } from 'lucide-react';
import { PetState } from '../types';
import { PET_SPECIES_CONFIGS, getCurrentPetStage, getNextPetStage } from '../data/petEvolutions';
import { playChiptuneBeep } from '../utils/audio';

interface PixelPetProps {
  pet: PetState;
  onFeedBerry: () => void;
  onOpenPetSettings?: () => void;
  soundEnabled: boolean;
  isFocusActive: boolean;
}

export const PixelPet: React.FC<PixelPetProps> = ({
  pet,
  onFeedBerry,
  onOpenPetSettings,
  soundEnabled,
  isFocusActive,
}) => {
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [speechIndex, setSpeechIndex] = useState(0);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  const speciesConfig = PET_SPECIES_CONFIGS[pet.id] || PET_SPECIES_CONFIGS.sprout;
  const currentStage = getCurrentPetStage(pet.id, pet.level);
  const nextStage = getNextPetStage(pet.id, pet.level);

  // Speeches based on state & species
  const speeches = isFocusActive
    ? speciesConfig.speeches.focusing
    : pet.mood === 'sleeping' || pet.level === 0
    ? speciesConfig.speeches.sleeping
    : speciesConfig.speeches.idle;

  const handlePetFeed = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (pet.berriesAvailable <= 0) {
      playChiptuneBeep(260, soundEnabled);
      return;
    }
    onFeedBerry();
    playChiptuneBeep(659.25, soundEnabled);
    setTimeout(() => playChiptuneBeep(880, soundEnabled), 100);
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 1400);
  };

  const cycleSpeech = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playChiptuneBeep(520, soundEnabled);
    setSpeechIndex((prev) => (prev + 1) % speeches.length);
  };

  const expPercentage = Math.min(100, Math.round((pet.exp / pet.maxExp) * 100));
  const expBlocks = 8;
  const filledExpBlocks = Math.round((expPercentage / 100) * expBlocks);

  const hasFood = pet.berriesAvailable > 0;

  return (
    <div className="w-full bg-[#F2EFE9] border-2 border-[#2D3142] pixel-shadow select-none">
      {/* ========================================================================= */}
      {/* MOBILE COMPACT COMPANION STRIP (md:hidden) - Saves vertical scroll        */}
      {/* ========================================================================= */}
      <div className="md:hidden">
        <div className="p-2.5 flex items-center justify-between gap-2 bg-[#FAF8F5]">
          {/* Mini Avatar + Stage info */}
          <div
            onClick={() => setIsMobileExpanded((prev) => !prev)}
            className="flex items-center gap-2 cursor-pointer min-w-0"
          >
            <div className="w-8 h-8 bg-[#EBF3EC] border border-[#2D3142] rounded-md flex items-center justify-center shrink-0">
              {currentStage.renderSprite({
                isFocusActive,
                mood: pet.mood,
                level: pet.level,
              })}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#2D3142] truncate">
                <span>{pet.name}</span>
                <span className="text-[10px] px-1 bg-[#7FB685] border border-[#2D3142] rounded-xs">
                  LV.{pet.level}
                </span>
                {isFocusActive && (
                  <span className="text-[9px] px-1 bg-[#F4A261] border border-[#2D3142] rounded-xs animate-pulse">
                    FOCUSING
                  </span>
                )}
              </div>
              <div className="font-mono text-[10px] text-[#2D3142]/70 truncate">
                {currentStage.title} • {pet.exp}/{pet.maxExp} XP
              </div>
            </div>
          </div>

          {/* Quick Actions: Feed Treat & Expand stage */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              id="mobile-mini-feed-btn"
              onClick={handlePetFeed}
              disabled={!hasFood}
              title={
                hasFood
                  ? `Feed ${speciesConfig.foodName}`
                  : 'Complete a task or timer to harvest food!'
              }
              className={`pixel-btn flex items-center gap-1 px-2.5 py-1 border rounded-md font-mono text-[11px] font-bold ${
                hasFood
                  ? 'bg-[#F8C390] hover:bg-[#F4A261] border-[#2D3142] text-[#2D3142]'
                  : 'bg-[#E4DFD5] border-[#2D3142]/50 text-[#2D3142]/60 cursor-not-allowed'
              }`}
            >
              {hasFood ? (
                <>
                  <Heart className="w-3 h-3 fill-[#8E4E14] text-[#8E4E14]" />
                  <span>FEED {speciesConfig.foodEmoji} ({pet.berriesAvailable})</span>
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3 text-[#2D3142]/60" />
                  <span>0 {speciesConfig.foodEmoji} (WORK XP)</span>
                </>
              )}
            </button>

            <button
              id="mobile-expand-pet-btn"
              onClick={() => setIsMobileExpanded((prev) => !prev)}
              aria-label={isMobileExpanded ? 'Collapse pet stage' : 'Expand pet stage'}
              className="pixel-btn p-1 bg-[#F2EFE9] border border-[#2D3142] rounded-md text-[#2D3142]"
            >
              {isMobileExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FULL COMPANION STAGE (Always on desktop; toggleable on mobile)           */}
      {/* ========================================================================= */}
      <div className={`${isMobileExpanded ? 'block' : 'hidden md:block'} p-3 sm:p-4 border-t-2 md:border-t-0 border-[#2D3142]`}>
        {/* Top Header tab on desktop */}
        <div className="hidden md:flex items-center justify-between border-b-2 border-[#2D3142] pb-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-1.5 py-0.5 bg-[#7FB685] text-[#2D3142] border border-[#2D3142]">
              COMPANION CREATURE
            </span>
            <span className="font-mono text-xs font-bold text-[#2D3142]">
              {pet.name} • LVL {pet.level} ({currentStage.title.toUpperCase()})
            </span>
            <span className="font-mono text-[9px] px-1.5 py-0.2 bg-[#CADBFB] border border-[#2D3142] text-[#2D3142] rounded-xs">
              {currentStage.badge}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenPetSettings && (
              <button
                id="pet-card-change-btn"
                onClick={onOpenPetSettings}
                className="pixel-btn flex items-center gap-1 px-2 py-0.5 bg-[#FAF8F5] hover:bg-[#CADBFB] border border-[#2D3142] font-mono text-[10px] font-bold text-[#2D3142]"
              >
                <RefreshCw className="w-3 h-3" />
                <span>CHANGE PET</span>
              </button>
            )}

            <div className="flex items-center gap-1 font-mono text-[10px] text-[#2D3142]">
              <span>TREATS IN BAG:</span>
              <span className={`font-bold px-1.5 border border-[#2D3142] ${
                hasFood ? 'bg-[#F8C390] text-[#2D3142]' : 'bg-[#E4DFD5] text-[#2D3142]/60'
              }`}>
                {pet.berriesAvailable} {speciesConfig.foodEmoji}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Left: Pixel Creature Stage */}
          <div className="sm:col-span-4 flex flex-col items-center justify-center p-3 bg-[#FAF8F5] border-2 border-[#2D3142] pixel-inset relative min-h-[140px]">
            {/* Heart animation overlay */}
            {showHeartAnim && (
              <div className="absolute top-2 animate-bounce flex items-center gap-1 bg-[#F8C390] border border-[#2D3142] px-2 py-0.5 z-10">
                <Heart className="w-3.5 h-3.5 fill-[#8E4E14] text-[#8E4E14]" />
                <span className="font-mono text-[10px] font-bold text-[#2D3142]">+30 EXP!</span>
              </div>
            )}

            {/* Authentic 8-Bit Pixel Character Canvas / SVG based on Evolution Stage */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
              <div
                className={`transition-transform duration-200 ${
                  isFocusActive ? 'scale-105 animate-pulse' : 'hover:scale-105'
                }`}
              >
                {currentStage.renderSprite({
                  isFocusActive,
                  mood: pet.mood,
                  level: pet.level,
                })}
              </div>

              {pet.level === 0 && !isFocusActive && (
                <span className="absolute -top-1 right-1 font-mono text-[10px] font-bold text-[#7FB685] animate-pulse">
                  Zzz...
                </span>
              )}
            </div>

            <div className="mt-1 font-mono text-[10px] uppercase font-bold text-[#2D3142] px-2 py-0.5 bg-[#FAF8F5] border border-[#2D3142] flex items-center gap-1">
              <span>{isFocusActive ? '⚡ IN THE ZONE' : currentStage.title}</span>
            </div>

            {nextStage && (
              <span className="font-mono text-[9px] text-[#2D3142]/70 mt-0.5">
                Next evolution at Lvl {nextStage.minLevel}
              </span>
            )}
          </div>

          {/* Right: Dialogue Box & Interactions */}
          <div className="sm:col-span-8 flex flex-col justify-between h-full space-y-2.5">
            {/* Retro RPG Dialogue Box */}
            <div
              onClick={cycleSpeech}
              className="cursor-pointer bg-[#FAF8F5] border-2 border-[#2D3142] p-3 pixel-shadow-sm relative group hover:bg-[#FAF8FF] transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[10px] font-bold text-[#35693F] tracking-wider uppercase">
                  {pet.name.toUpperCase()} SPEAKS
                </span>
                <span className="font-mono text-[9px] text-[#2D3142]/60 group-hover:text-[#2D3142]">
                  [TAP TO TALK]
                </span>
              </div>
              <p className="font-sans text-xs sm:text-sm text-[#2D3142] leading-relaxed">
                {speeches[speechIndex % speeches.length]}
              </p>
              <div className="absolute bottom-2 right-2 font-mono text-[10px] text-[#2D3142] blink-cursor">
                ▼
              </div>
            </div>

            {/* Growth & EXP Progress */}
            <div className="space-y-1.5 bg-[#FAF8F5] border border-[#2D3142] p-2.5">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[#2D3142]">GROWTH EXP</span>
                  <span className="text-[10px] px-1 bg-[#EBF3EC] border border-[#2D3142] rounded-xs text-[#35693F]">
                    STAGE {currentStage.stage}/4
                  </span>
                </div>
                <span className="text-[#2D3142]/80">
                  {pet.exp} / {pet.maxExp} XP ({expPercentage}%)
                </span>
              </div>

              <div className="w-full bg-[#E4DFD5] border-2 border-[#2D3142] h-4 p-0.5 flex gap-1">
                {Array.from({ length: expBlocks }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-full transition-colors ${
                      i < filledExpBlocks ? 'bg-[#7FB685]' : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Action Button: Feed Treat - LOCKED UNTIL WORK IS DONE */}
            <div>
              {hasFood ? (
                <button
                  id="feed-berry-btn"
                  onClick={handlePetFeed}
                  className="pixel-btn w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#F8C390] hover:bg-[#F4A261] border-2 border-[#2D3142] font-mono text-xs font-bold text-[#2D3142] pixel-shadow-sm"
                >
                  <Heart className="w-3.5 h-3.5 fill-[#8E4E14] text-[#8E4E14]" />
                  <span>
                    FEED {speciesConfig.foodName.toUpperCase()} ({pet.berriesAvailable} IN BAG) • +30 XP
                  </span>
                </button>
              ) : (
                <div className="space-y-1">
                  <button
                    id="feed-berry-btn-disabled"
                    disabled
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#E4DFD5] border-2 border-[#2D3142]/60 font-mono text-xs font-bold text-[#2D3142]/60 cursor-not-allowed"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>OUT OF FOOD (0 {speciesConfig.foodEmoji} AVAILABLE)</span>
                  </button>
                  <div className="flex items-center justify-center gap-1 font-mono text-[10px] text-[#8E4E14] bg-[#FFF3E8] border border-[#F4A261] px-2 py-0.5 rounded-xs text-center">
                    <span>💡 Complete a task, routine, or timer to harvest treats!</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
