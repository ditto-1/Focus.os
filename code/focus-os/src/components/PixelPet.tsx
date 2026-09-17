import React, { useState } from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { PetState } from '../types';
import { playChiptuneBeep, playVictoryFanfare } from '../utils/audio';

interface PixelPetProps {
  pet: PetState;
  onFeedBerry: () => void;
  soundEnabled: boolean;
  isFocusActive: boolean;
}

export const PixelPet: React.FC<PixelPetProps> = ({
  pet,
  onFeedBerry,
  soundEnabled,
  isFocusActive,
}) => {
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [speechIndex, setSpeechIndex] = useState(0);

  const speeches = isFocusActive
    ? [
        '"You\'re doing great! Keep your focus gentle."',
        '"One step at a time, no rushing needed."',
        '"I\'m studying alongside you!"',
        '"Breathing softly with you..."',
      ]
    : pet.level === 0
    ? [
        '"Zzz... Sprout is a newborn seedling at Level 0! 🌱"',
        '"Start your first focus timer to wake me up!"',
        '"Feed me a berry or finish a task to gain your first XP!"',
        '"A fresh cartridge! We are beginning from Day 1 together ✨"',
      ]
    : [
        '"Hello friend! Ready for a cozy focus session?"',
        '"Don\'t forget to drink some water today."',
        '"Even 5 minutes of quiet attention counts!"',
        '"Every quest cleared gives me tasty berries!"',
      ];

  const handlePetFeed = () => {
    onFeedBerry();
    playChiptuneBeep(659.25, soundEnabled);
    setTimeout(() => playChiptuneBeep(880, soundEnabled), 100);
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 1400);
  };

  const cycleSpeech = () => {
    playChiptuneBeep(520, soundEnabled);
    setSpeechIndex((prev) => (prev + 1) % speeches.length);
  };

  const expPercentage = Math.min(100, Math.round((pet.exp / pet.maxExp) * 100));
  const expBlocks = 8;
  const filledExpBlocks = Math.round((expPercentage / 100) * expBlocks);

  return (
    <div className="w-full bg-[#F2EFE9] border-2 border-[#2D3142] pixel-shadow p-3 sm:p-4 select-none">
      {/* Top Header tab */}
      <div className="flex items-center justify-between border-b-2 border-[#2D3142] pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold px-1.5 py-0.5 bg-[#7FB685] text-[#2D3142] border border-[#2D3142]">
            PET COMPANION
          </span>
          <span className="font-mono text-xs font-bold text-[#2D3142]">
            {pet.name} (LVL {pet.level}{pet.level === 0 ? ' • SEEDLING' : ''})
          </span>
        </div>
        <div className="flex items-center gap-1 font-mono text-[10px] text-[#2D3142]">
          <span>BERRIES:</span>
          <span className="font-bold px-1 bg-[#F8C390] border border-[#2D3142]">
            {pet.berriesFed}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Left: Pixel Creature Stage */}
        <div className="sm:col-span-4 flex flex-col items-center justify-center p-3 bg-[#FAF8F5] border-2 border-[#2D3142] pixel-inset relative min-h-[140px]">
          {/* Heart animation overlay */}
          {showHeartAnim && (
            <div className="absolute top-2 animate-bounce flex items-center gap-1 bg-[#F8C390] border border-[#2D3142] px-2 py-0.5 z-10">
              <Heart className="w-3.5 h-3.5 fill-[#8E4E14] text-[#8E4E14]" />
              <span className="font-mono text-[10px] font-bold text-[#2D3142]">+10 EXP!</span>
            </div>
          )}

          {/* Authentic 8-Bit Pixel Character Canvas / SVG */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* 8-bit Sprout Graphic */}
            <svg
              viewBox="0 0 24 24"
              className={`w-20 h-20 filter drop-shadow-[2px_2px_0px_#2D3142] transition-transform ${
                isFocusActive ? 'scale-105' : 'hover:scale-105'
              }`}
              style={{ shapeRendering: 'crispEdges' }}
            >
              {/* Sprout Head / Body */}
              <rect x="7" y="9" width="10" height="10" fill="#7FB685" />
              <rect x="8" y="8" width="8" height="1" fill="#7FB685" />
              <rect x="8" y="19" width="8" height="1" fill="#7FB685" />
              
              {/* Cheeks */}
              <rect x="6" y="13" width="2" height="2" fill="#F8C390" />
              <rect x="16" y="13" width="2" height="2" fill="#F8C390" />

              {/* Eyes based on state */}
              {isFocusActive ? (
                // Focused glasses
                <>
                  <rect x="8" y="11" width="3" height="3" fill="#2D3142" />
                  <rect x="13" y="11" width="3" height="3" fill="#2D3142" />
                  <rect x="11" y="12" width="2" height="1" fill="#2D3142" />
                  {/* Glasses shine */}
                  <rect x="9" y="11" width="1" height="1" fill="#FFFFFF" />
                  <rect x="14" y="11" width="1" height="1" fill="#FFFFFF" />
                </>
              ) : pet.level === 0 || pet.mood === 'sleeping' ? (
                // Cute sleeping / seedling curved eyes with peaceful rest
                <>
                  <rect x="8" y="12" width="3" height="1" fill="#2D3142" />
                  <rect x="8" y="11" width="1" height="1" fill="#2D3142" />
                  <rect x="13" y="12" width="3" height="1" fill="#2D3142" />
                  <rect x="15" y="11" width="1" height="1" fill="#2D3142" />
                </>
              ) : (
                // Happy blinking eyes
                <>
                  <rect x="9" y="11" width="2" height="2" fill="#2D3142" />
                  <rect x="13" y="11" width="2" height="2" fill="#2D3142" />
                  <rect x="9" y="11" width="1" height="1" fill="#FFFFFF" />
                  <rect x="13" y="11" width="1" height="1" fill="#FFFFFF" />
                </>
              )}

              {/* Cute mouth */}
              <rect x="11" y="15" width="2" height="1" fill="#2D3142" />

              {/* Plant Sprout Leaf on top */}
              <rect x="11" y="5" width="2" height="3" fill="#35693F" />
              <rect x="8" y="4" width="4" height="2" fill="#7FB685" />
              <rect x="12" y="3" width="4" height="2" fill="#A3CFAB" />
              <rect x="10" y="3" width="2" height="1" fill="#7FB685" />

              {/* Little feet */}
              <rect x="8" y="19" width="2" height="2" fill="#35693F" />
              <rect x="14" y="19" width="2" height="2" fill="#35693F" />
            </svg>

            {/* Zzz floating indicator if level 0 */}
            {pet.level === 0 && !isFocusActive && (
              <span className="absolute -top-1 right-1 font-mono text-[10px] font-bold text-[#7FB685] animate-pulse">
                Zzz...
              </span>
            )}
          </div>

          {/* Status badge */}
          <div className="mt-1 font-mono text-[10px] uppercase font-bold text-[#2D3142] px-2 py-0.5 bg-[#FAF8F5] border border-[#2D3142]">
            {isFocusActive ? '⚡ IN THE ZONE' : pet.level === 0 ? '🌱 SEEDLING (LVL 0)' : '💤 RESTING'}
          </div>
        </div>

        {/* Right: Dialogue Box & Interactions */}
        <div className="sm:col-span-8 flex flex-col justify-between h-full space-y-3">
          {/* Retro RPG Dialogue Box */}
          <div
            onClick={cycleSpeech}
            className="cursor-pointer bg-[#FAF8F5] border-2 border-[#2D3142] p-3 pixel-shadow-sm relative group hover:bg-[#FAF8FF] transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[10px] font-bold text-[#7FB685] tracking-wider uppercase">
                SPROUT SPEAKS
              </span>
              <span className="font-mono text-[9px] text-[#2D3142]/60 group-hover:text-[#2D3142]">
                [TAP TO TALK]
              </span>
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#2D3142] leading-relaxed">
              {speeches[speechIndex % speeches.length]}
            </p>
            {/* Blinking dialogue triangle cursor */}
            <div className="absolute bottom-2 right-2 font-mono text-[10px] text-[#2D3142] blink-cursor">
              ▼
            </div>
          </div>

          {/* Growth & EXP Progress */}
          <div className="space-y-1.5 bg-[#FAF8F5] border border-[#2D3142] p-2.5">
            <div className="flex items-center justify-between font-mono text-[11px]">
              <span className="font-bold text-[#2D3142]">LEVEL EXP</span>
              <span className="text-[#2D3142]/80">
                {pet.exp} / {pet.maxExp} XP ({expPercentage}%)
              </span>
            </div>

            {/* Chunky Segmented Pixel Meter */}
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

          {/* Action Button: Feed Berry */}
          <div className="flex items-center gap-2">
            <button
              id="feed-berry-btn"
              onClick={handlePetFeed}
              className="pixel-btn flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#F8C390] hover:bg-[#F4A261] border-2 border-[#2D3142] font-mono text-xs font-bold text-[#2D3142] pixel-shadow-sm"
            >
              <Heart className="w-3.5 h-3.5 fill-[#8E4E14] text-[#8E4E14]" />
              <span>FEED MATCHA BERRY (+10 XP)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
