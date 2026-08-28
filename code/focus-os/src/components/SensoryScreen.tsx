import React, { useState } from 'react';
import { Sparkles, Eye, Hand, Volume2, Wind, Heart, RotateCcw, Droplets } from 'lucide-react';
import { SENSORY_GROUNDING_STEPS } from '../data/initialData';
import { playMechanicalClick, playChiptuneBeep } from '../utils/audio';

interface SensoryScreenProps {
  soundEnabled: boolean;
}

export const SensoryScreen: React.FC<SensoryScreenProps> = ({ soundEnabled }) => {
  // Grounding Step state
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [groundingCompleted, setGroundingCompleted] = useState<number[]>([]);

  // Fidget Pad states
  const [bubbles, setBubbles] = useState<boolean[]>([false, false, false, false, false, false, false, false]);
  const [rockerOn, setRockerOn] = useState(false);
  const [dialCount, setDialCount] = useState(0);
  const [metronomeRunning, setMetronomeRunning] = useState(false);

  // Terrarium water state
  const [waterDrops, setWaterDrops] = useState(3);
  const [gardenBlooms, setGardenBlooms] = useState(2);

  // Step grounding
  const handleCompleteStep = (idx: number) => {
    playChiptuneBeep(587.33, soundEnabled);
    if (!groundingCompleted.includes(idx)) {
      setGroundingCompleted([...groundingCompleted, idx]);
    }
    if (idx < SENSORY_GROUNDING_STEPS.length - 1) {
      setCurrentStepIdx(idx + 1);
    }
  };

  const resetGrounding = () => {
    playMechanicalClick(soundEnabled);
    setGroundingCompleted([]);
    setCurrentStepIdx(0);
  };

  // Pop bubble fidget
  const popBubble = (index: number) => {
    playChiptuneBeep(800 + index * 40, soundEnabled);
    setBubbles((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  // Rocker switch
  const toggleRocker = () => {
    playMechanicalClick(soundEnabled);
    setRockerOn((prev) => !prev);
  };

  // Dial clicker
  const clickDial = () => {
    playMechanicalClick(soundEnabled);
    setDialCount((prev) => (prev + 1) % 100);
  };

  // Water garden
  const waterGarden = () => {
    playChiptuneBeep(987.77, soundEnabled);
    setWaterDrops((prev) => prev + 1);
    setGardenBlooms((prev) => Math.min(8, prev + 1));
  };

  const step = SENSORY_GROUNDING_STEPS[currentStepIdx];

  return (
    <div className="w-full space-y-4">
      {/* 5-4-3-2-1 Sensory Grounding Module */}
      <div className="bg-[#FAF8F5] border-2 border-[#2D3142] p-4 sm:p-6 pixel-shadow">
        <div className="flex items-center justify-between border-b-2 border-[#2D3142] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 bg-[#7FB685] border border-[#2D3142] text-[#2D3142]">
              5-4-3-2-1 TECHNIQUE
            </span>
            <span className="font-mono text-xs font-bold text-[#2D3142]">
              NEURODIVERGENT GROUNDING
            </span>
          </div>

          <button
            id="reset-grounding-btn"
            onClick={resetGrounding}
            className="pixel-btn flex items-center gap-1 px-2.5 py-1 bg-[#F2EFE9] border border-[#2D3142] font-mono text-[11px] font-bold text-[#2D3142]"
          >
            <RotateCcw className="w-3 h-3" />
            <span>RESET DECK</span>
          </button>
        </div>

        {/* Step Navigation Cards */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mb-4">
          {SENSORY_GROUNDING_STEPS.map((s, idx) => {
            const isDone = groundingCompleted.includes(idx);
            const isCurrent = currentStepIdx === idx;
            return (
              <button
                key={idx}
                id={`grounding-step-tab-${idx}`}
                onClick={() => {
                  playMechanicalClick(soundEnabled);
                  setCurrentStepIdx(idx);
                }}
                className={`pixel-btn p-2 border-2 border-[#2D3142] text-center transition-all ${
                  isCurrent
                    ? 'bg-[#CADBFB] pixel-shadow font-bold'
                    : isDone
                    ? 'bg-[#7FB685] text-[#2D3142]'
                    : 'bg-[#F2EFE9] text-[#2D3142]/60'
                }`}
              >
                <div className="font-mono text-sm sm:text-base font-bold">
                  {s.count}
                </div>
                <div className="font-mono text-[9px] uppercase tracking-tight truncate">
                  {s.sense.split(' ')[0]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Grounding Prompt Card */}
        <div className="bg-[#F2EFE9] border-2 border-[#2D3142] p-4 pixel-shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-lg font-bold px-2 py-0.5 bg-[#FAF8F5] border border-[#2D3142] text-[#2D3142]">
              {step.count}
            </span>
            <span className="font-mono text-sm font-bold text-[#2D3142] uppercase">
              {step.sense}
            </span>
          </div>

          <h3 className="font-sans text-base sm:text-lg font-semibold text-[#2D3142] mb-3 leading-snug">
            {step.prompt}
          </h3>

          <div className="bg-[#FAF8F5] border border-[#2D3142] p-3 mb-4 pixel-inset-soft">
            <div className="font-mono text-[10px] text-[#2D3142]/70 uppercase mb-1">
              INSPIRATION & EXAMPLES:
            </div>
            <ul className="space-y-1">
              {step.examples.map((ex, i) => (
                <li key={i} className="font-sans text-xs sm:text-sm text-[#2D3142] flex items-center gap-2">
                  <span className="text-[#7FB685] font-bold">◆</span>
                  <span>{ex}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-sans text-xs text-[#2D3142]/70">
              Notice with curiosity, without judgment.
            </span>

            <button
              id={`step-done-btn-${currentStepIdx}`}
              onClick={() => handleCompleteStep(currentStepIdx)}
              className="pixel-btn px-4 py-2 bg-[#7FB685] hover:bg-[#A3CFAB] border-2 border-[#2D3142] font-mono text-xs font-bold text-[#2D3142] pixel-shadow-sm"
            >
              {groundingCompleted.includes(currentStepIdx) ? '✓ COMPLETED' : 'I OBSERVED THIS →'}
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Row: Tactile Fidget Matrix & Pixel Terrarium */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tactile Fidget Matrix (ADHD tactile focus stimming) */}
        <div className="bg-[#F2EFE9] border-2 border-[#2D3142] p-4 pixel-shadow">
          <div className="flex items-center justify-between border-b-2 border-[#2D3142] pb-2 mb-3">
            <span className="font-mono text-xs font-bold uppercase text-[#2D3142]">
              TACTILE FIDGET MATRIX
            </span>
            <span className="font-mono text-[10px] text-[#2D3142]/70">
              MECHANICAL STIM PAD
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Control 1: Bubble Wrap Popper */}
            <div className="bg-[#FAF8F5] border-2 border-[#2D3142] p-2.5">
              <div className="font-mono text-[10px] font-bold text-[#2D3142] mb-1.5 uppercase">
                BUBBLE POP
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {bubbles.map((popped, idx) => (
                  <button
                    key={idx}
                    id={`bubble-pop-${idx}`}
                    onClick={() => popBubble(idx)}
                    className={`pixel-btn h-7 border-2 border-[#2D3142] transition-colors ${
                      popped ? 'bg-[#7FB685] pixel-inset' : 'bg-[#CADBFB] pixel-shadow-sm'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Control 2: Heavy Rocker Switch */}
            <div className="bg-[#FAF8F5] border-2 border-[#2D3142] p-2.5 flex flex-col justify-between">
              <div className="font-mono text-[10px] font-bold text-[#2D3142] uppercase">
                TOGGLE SWITCH
              </div>
              <button
                id="rocker-switch-btn"
                onClick={toggleRocker}
                className={`pixel-btn w-full py-2.5 border-2 border-[#2D3142] font-mono text-xs font-bold transition-all ${
                  rockerOn
                    ? 'bg-[#F4A261] text-[#2D3142] pixel-shadow-sm'
                    : 'bg-[#E4DFD5] text-[#2D3142]/60'
                }`}
              >
                {rockerOn ? '[ON]' : '[OFF]'}
              </button>
            </div>

            {/* Control 3: Dial Counter */}
            <div className="bg-[#FAF8F5] border-2 border-[#2D3142] p-2.5 flex flex-col justify-between">
              <div className="flex items-center justify-between font-mono text-[10px] font-bold text-[#2D3142] uppercase">
                <span>CLICK DIAL</span>
                <span className="px-1 bg-[#F8C390] border border-[#2D3142]">{dialCount}</span>
              </div>
              <button
                id="dial-counter-btn"
                onClick={clickDial}
                className="pixel-btn w-full py-2 bg-[#CADBFB] hover:bg-[#B4C5E4] border-2 border-[#2D3142] font-mono text-xs font-bold text-[#2D3142] pixel-shadow-sm"
              >
                + CLICK STEP
              </button>
            </div>

            {/* Control 4: Reset all Fidgets */}
            <div className="bg-[#FAF8F5] border-2 border-[#2D3142] p-2.5 flex flex-col justify-between">
              <div className="font-mono text-[10px] font-bold text-[#2D3142] uppercase">
                RESET ALL
              </div>
              <button
                id="reset-fidgets-btn"
                onClick={() => {
                  playMechanicalClick(soundEnabled);
                  setBubbles([false, false, false, false, false, false, false, false]);
                  setRockerOn(false);
                  setDialCount(0);
                }}
                className="pixel-btn w-full py-2 bg-[#F2EFE9] hover:bg-[#E4DFD5] border-2 border-[#2D3142] font-mono text-xs font-bold text-[#2D3142] pixel-shadow-sm"
              >
                FLIP TO DEFAULT
              </button>
            </div>
          </div>
        </div>

        {/* Pixel Terrarium / Pocket Garden */}
        <div className="bg-[#FAF8F5] border-2 border-[#2D3142] p-4 pixel-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b-2 border-[#2D3142] pb-2 mb-3">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs font-bold text-[#2D3142] uppercase">
                  POCKET TERRARIUM
                </span>
                <span className="font-mono text-[10px] px-1 bg-[#7FB685] border border-[#2D3142]">
                  BLOOMS: {gardenBlooms}/8
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#2D3142]/70">
                WATER: {waterDrops}
              </span>
            </div>

            {/* Pixel Flora Canvas Stage */}
            <div className="bg-[#F2EFE9] border-2 border-[#2D3142] p-4 min-h-[120px] flex items-end justify-center gap-3 pixel-inset">
              {/* Plant 1: Moss Sprout */}
              <div className="flex flex-col items-center">
                <div className="font-mono text-[18px] select-none">
                  {gardenBlooms >= 1 ? '🌱' : '🪨'}
                </div>
                <div className="w-8 h-3 bg-[#8E4E14] border border-[#2D3142] mt-1" />
              </div>

              {/* Plant 2: Matcha Fern */}
              <div className="flex flex-col items-center">
                <div className="font-mono text-[22px] select-none">
                  {gardenBlooms >= 3 ? '🌿' : '🌱'}
                </div>
                <div className="w-10 h-4 bg-[#F4A261] border border-[#2D3142] mt-1" />
              </div>

              {/* Plant 3: Star Lily */}
              <div className="flex flex-col items-center">
                <div className="font-mono text-[24px] select-none">
                  {gardenBlooms >= 5 ? '🌸' : gardenBlooms >= 3 ? '🌱' : '🪨'}
                </div>
                <div className="w-10 h-4 bg-[#CADBFB] border border-[#2D3142] mt-1" />
              </div>

              {/* Plant 4: Pine Bonsai */}
              <div className="flex flex-col items-center">
                <div className="font-mono text-[26px] select-none">
                  {gardenBlooms >= 7 ? '🪴' : '🌿'}
                </div>
                <div className="w-12 h-5 bg-[#35693F] border border-[#2D3142] mt-1" />
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              id="water-garden-btn"
              onClick={waterGarden}
              className="pixel-btn flex-1 flex items-center justify-center gap-2 py-2 bg-[#CADBFB] hover:bg-[#B4C5E4] border-2 border-[#2D3142] font-mono text-xs font-bold text-[#2D3142] pixel-shadow-sm"
            >
              <Droplets className="w-4 h-4 text-[#2D3142]" />
              <span>GIVE WATER (+1 BLOOM)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
