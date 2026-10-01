import React from 'react';
import { PetSpecies } from '../types';

export interface PetEvolutionStage {
  stage: number; // 1, 2, 3, 4
  minLevel: number;
  title: string;
  name: string;
  description: string;
  badge: string;
  renderSprite: (props: {
    isFocusActive: boolean;
    mood: string;
    level: number;
  }) => React.ReactNode;
}

export interface PetSpeciesConfig {
  id: PetSpecies;
  defaultName: string;
  element: string;
  themeColor: string;
  accentColor: string;
  badgeColor: string;
  foodName: string;
  foodEmoji: string;
  lore: string;
  stages: PetEvolutionStage[];
  speeches: {
    focusing: string[];
    idle: string[];
    sleeping: string[];
    celebrating: string[];
  };
}

export const PET_SPECIES_CONFIGS: Record<PetSpecies, PetSpeciesConfig> = {
  sprout: {
    id: 'sprout',
    defaultName: 'Sprout',
    element: 'Flora & Forest',
    themeColor: '#7FB685',
    accentColor: '#35693F',
    badgeColor: '#EBF3EC',
    foodName: 'Matcha Berries',
    foodEmoji: '🍓',
    lore: 'A gentle nature spirit that absorbs focus energy to grow from a quiet acorn into a mighty ancient guardian.',
    speeches: {
      focusing: [
        '"Breathe gently, friend. You are growing with every minute."',
        '"Leaves unfurl quietly in the sunlight. No rushing needed."',
        '"Deep roots make strong branches. Keep going!"',
        '"I am absorbing your peaceful concentration 🌱"',
      ],
      idle: [
        '"Hello friend! Ready for a cozy focus sprint?"',
        '"Don\'t forget to sip some water today."',
        '"Even five minutes of quiet progress counts."',
        '"Finish a task to harvest juicy matcha berries for me!"',
      ],
      sleeping: [
        '"Zzz... Resting peacefully in the moss..."',
        '"Seedling sleeping... wake me with a focus timer!"',
        '"Daydreaming of sweet morning dewdrops..."',
      ],
      celebrating: [
        '"HOORAY! We completed our objective! 🌸"',
        '"Look at my leaves glowing! You did amazing!"',
        '"Delicious focus! That felt so refreshing!"',
      ],
    },
    stages: [
      {
        stage: 1,
        minLevel: 0,
        title: 'Baby Seedling',
        name: 'Little Sprout',
        badge: 'STAGE 1 • SEED',
        description: 'A cozy little acorn sprout resting in the warm soil, eagerly awaiting your first focus session.',
        renderSprite: ({ isFocusActive, mood, level }) => (
          <svg viewBox="0 0 24 24" className="w-16 h-16 sm:w-20 sm:h-20 filter drop-shadow-[2px_2px_0px_#2D3142]" style={{ shapeRendering: 'crispEdges' }}>
            <rect x="7" y="10" width="10" height="9" fill="#7FB685" />
            <rect x="8" y="9" width="8" height="1" fill="#7FB685" />
            <rect x="8" y="19" width="8" height="1" fill="#7FB685" />
            <rect x="6" y="13" width="2" height="2" fill="#F8C390" />
            <rect x="16" y="13" width="2" height="2" fill="#F8C390" />
            {isFocusActive ? (
              <>
                <rect x="8" y="12" width="3" height="3" fill="#2D3142" />
                <rect x="13" y="12" width="3" height="3" fill="#2D3142" />
                <rect x="9" y="12" width="1" height="1" fill="#FFFFFF" />
                <rect x="14" y="12" width="1" height="1" fill="#FFFFFF" />
              </>
            ) : level === 0 || mood === 'sleeping' ? (
              <>
                <rect x="8" y="13" width="3" height="1" fill="#2D3142" />
                <rect x="8" y="12" width="1" height="1" fill="#2D3142" />
                <rect x="13" y="13" width="3" height="1" fill="#2D3142" />
                <rect x="15" y="12" width="1" height="1" fill="#2D3142" />
              </>
            ) : (
              <>
                <rect x="9" y="12" width="2" height="2" fill="#2D3142" />
                <rect x="13" y="12" width="2" height="2" fill="#2D3142" />
                <rect x="9" y="12" width="1" height="1" fill="#FFFFFF" />
                <rect x="13" y="12" width="1" height="1" fill="#FFFFFF" />
              </>
            )}
            <rect x="11" y="16" width="2" height="1" fill="#2D3142" />
            <rect x="11" y="6" width="2" height="3" fill="#35693F" />
            <rect x="8" y="5" width="4" height="2" fill="#7FB685" />
            <rect x="12" y="4" width="4" height="2" fill="#A3CFAB" />
            <rect x="8" y="19" width="2" height="2" fill="#35693F" />
            <rect x="14" y="19" width="2" height="2" fill="#35693F" />
          </svg>
        ),
      },
      {
        stage: 2,
        minLevel: 2,
        title: 'Sproutling Bun',
        name: 'Leaf Bun',
        badge: 'STAGE 2 • JUVENILE',
        description: 'Sprout has grown long, alert leafy rabbit ears and small paws, hopping with lively curiosity!',
        renderSprite: ({ isFocusActive, mood }) => (
          <svg viewBox="0 0 24 24" className="w-16 h-16 sm:w-20 sm:h-20 filter drop-shadow-[2px_2px_0px_#2D3142]" style={{ shapeRendering: 'crispEdges' }}>
            {/* Long Leaf Ears */}
            <rect x="6" y="2" width="3" height="6" fill="#7FB685" />
            <rect x="7" y="3" width="1" height="4" fill="#A3CFAB" />
            <rect x="15" y="2" width="3" height="6" fill="#7FB685" />
            <rect x="16" y="3" width="1" height="4" fill="#A3CFAB" />
            {/* Round Body */}
            <rect x="6" y="8" width="12" height="11" fill="#7FB685" />
            <rect x="7" y="7" width="10" height="1" fill="#7FB685" />
            <rect x="8" y="11" width="8" height="7" fill="#A3CFAB" />
            {/* Cheeks */}
            <rect x="5" y="12" width="2" height="2" fill="#F8C390" />
            <rect x="17" y="12" width="2" height="2" fill="#F8C390" />
            {/* Eyes */}
            {isFocusActive ? (
              <>
                <rect x="8" y="10" width="3" height="3" fill="#2D3142" />
                <rect x="13" y="10" width="3" height="3" fill="#2D3142" />
                <rect x="9" y="10" width="1" height="1" fill="#FFFFFF" />
                <rect x="14" y="10" width="1" height="1" fill="#FFFFFF" />
              </>
            ) : mood === 'sleeping' ? (
              <>
                <rect x="8" y="11" width="3" height="1" fill="#2D3142" />
                <rect x="13" y="11" width="3" height="1" fill="#2D3142" />
              </>
            ) : (
              <>
                <rect x="8" y="10" width="2" height="2" fill="#2D3142" />
                <rect x="14" y="10" width="2" height="2" fill="#2D3142" />
                <rect x="8" y="10" width="1" height="1" fill="#FFFFFF" />
                <rect x="14" y="10" width="1" height="1" fill="#FFFFFF" />
              </>
            )}
            {/* Little bunny nose & mouth */}
            <rect x="11" y="13" width="2" height="1" fill="#35693F" />
            <rect x="11" y="14" width="2" height="1" fill="#2D3142" />
            {/* Flower Blossom in hair */}
            <rect x="12" y="6" width="3" height="3" fill="#F4A261" />
            <rect x="13" y="7" width="1" height="1" fill="#FFFFFF" />
            {/* Feet */}
            <rect x="7" y="19" width="3" height="2" fill="#35693F" />
            <rect x="14" y="19" width="3" height="2" fill="#35693F" />
          </svg>
        ),
      },
      {
        stage: 3,
        minLevel: 4,
        title: 'Flora Drake',
        name: 'Bloom Spirit',
        badge: 'STAGE 3 • EVOLVED',
        description: 'Magnificent leafy wings, cherry-blossom antlers, and a tail crowned with fragrant wild flowers.',
        renderSprite: ({ isFocusActive }) => (
          <svg viewBox="0 0 24 24" className="w-16 h-16 sm:w-20 sm:h-20 filter drop-shadow-[2px_2px_0px_#2D3142]" style={{ shapeRendering: 'crispEdges' }}>
            {/* Leaf Wings */}
            <rect x="2" y="7" width="4" height="7" fill="#A3CFAB" />
            <rect x="1" y="8" width="2" height="5" fill="#7FB685" />
            <rect x="18" y="7" width="4" height="7" fill="#A3CFAB" />
            <rect x="21" y="8" width="2" height="5" fill="#7FB685" />
            {/* Antler branches */}
            <rect x="7" y="1" width="2" height="6" fill="#8E4E14" />
            <rect x="5" y="2" width="2" height="2" fill="#F8C390" />
            <rect x="15" y="1" width="2" height="6" fill="#8E4E14" />
            <rect x="17" y="2" width="2" height="2" fill="#F8C390" />
            {/* Body */}
            <rect x="6" y="7" width="12" height="12" fill="#7FB685" />
            <rect x="8" y="10" width="8" height="8" fill="#F2EFE9" />
            {/* Face */}
            <rect x="8" y="9" width="2" height="3" fill="#2D3142" />
            <rect x="14" y="9" width="2" height="3" fill="#2D3142" />
            <rect x="8" y="9" width="1" height="1" fill="#FFFFFF" />
            <rect x="14" y="9" width="1" height="1" fill="#FFFFFF" />
            {isFocusActive && (
              <rect x="11" y="6" width="2" height="2" fill="#F4A261" />
            )}
            <rect x="11" y="13" width="2" height="1" fill="#35693F" />
            {/* Chest gem */}
            <rect x="11" y="11" width="2" height="2" fill="#7FB685" />
            {/* Tail */}
            <rect x="17" y="16" width="4" height="2" fill="#35693F" />
            <rect x="20" y="15" width="3" height="3" fill="#F4A261" />
            {/* Feet */}
            <rect x="7" y="19" width="3" height="2" fill="#35693F" />
            <rect x="14" y="19" width="3" height="2" fill="#35693F" />
          </svg>
        ),
      },
      {
        stage: 4,
        minLevel: 6,
        title: 'Forest Guardian',
        name: 'Elder Treant',
        badge: 'STAGE 4 • ASCENDED',
        description: 'An ancient guardian of tranquility with an emerald-crested crown, radiant aura, and wise gentle presence.',
        renderSprite: () => (
          <svg viewBox="0 0 24 24" className="w-16 h-16 sm:w-20 sm:h-20 filter drop-shadow-[2px_2px_0px_#2D3142]" style={{ shapeRendering: 'crispEdges' }}>
            {/* Emerald Halo */}
            <rect x="7" y="0" width="10" height="2" fill="#7FB685" />
            <rect x="5" y="1" width="2" height="3" fill="#7FB685" />
            <rect x="17" y="1" width="2" height="3" fill="#7FB685" />
            {/* Majestic Wooden Antlers */}
            <rect x="4" y="2" width="3" height="7" fill="#8E4E14" />
            <rect x="2" y="3" width="2" height="2" fill="#7FB685" />
            <rect x="17" y="2" width="3" height="7" fill="#8E4E14" />
            <rect x="20" y="3" width="2" height="2" fill="#7FB685" />
            {/* Guardian Mantle & Body */}
            <rect x="5" y="7" width="14" height="13" fill="#35693F" />
            <rect x="7" y="9" width="10" height="10" fill="#7FB685" />
            <rect x="9" y="12" width="6" height="7" fill="#F2EFE9" />
            {/* Glowing Wise Eyes */}
            <rect x="8" y="10" width="2" height="2" fill="#F4A261" />
            <rect x="14" y="10" width="2" height="2" fill="#F4A261" />
            <rect x="8" y="10" width="1" height="1" fill="#FFFFFF" />
            <rect x="14" y="10" width="1" height="1" fill="#FFFFFF" />
            {/* Crown Jewel */}
            <rect x="11" y="8" width="2" height="2" fill="#CADBFB" />
            {/* Sacred Rune */}
            <rect x="11" y="13" width="2" height="3" fill="#35693F" />
            {/* Sturdy Root Pedestal */}
            <rect x="4" y="20" width="16" height="2" fill="#8E4E14" />
            <rect x="8" y="21" width="8" height="2" fill="#35693F" />
          </svg>
        ),
      },
    ],
  },

  ember: {
    id: 'ember',
    defaultName: 'Ember',
    element: 'Flame & Warmth',
    themeColor: '#F4A261',
    accentColor: '#C85A17',
    badgeColor: '#FFF3E8',
    foodName: 'Cinder Berries',
    foodEmoji: '🌶️',
    lore: 'A lively fire pup born in a hearth stone. It fuels its spark through vigorous focus bursts and determined work.',
    speeches: {
      focusing: [
        '"Let our inner drive burn bright! Keep that momentum!"',
        '"Feel the fire of focus! Sprints are my favorite!"',
        '"One burning task at a time, we will torch through this!"',
        '"Igniting our concentration right now 🔥"',
      ],
      idle: [
        '"Ready for action! What are we tackling next?"',
        '"My embers are crackling! Let\'s knock out a quest!"',
        '"Finish that task and treat me to some spicy cinder berries!"',
        '"A brisk 10-minute sprint? Count me in!"',
      ],
      sleeping: [
        '"Zzz... glowing gently like warm coals..."',
        '"Curled up in a tiny flame ball... wake me to sprint!"',
      ],
      celebrating: [
        '"YES! WE DID IT! Sparks everywhere! 🎇"',
        '"Look at that flame roar! Maximum achievement!"',
      ],
    },
    stages: [
      {
        stage: 1,
        minLevel: 0,
        title: 'Cinder Spark',
        name: 'Little Ember',
        badge: 'STAGE 1 • SPARK',
        description: 'A cozy little flame puff that hops around happily, crackling when you start a sprint.',
        renderSprite: ({ isFocusActive, mood }) => (
          <svg viewBox="0 0 24 24" className="w-16 h-16 sm:w-20 sm:h-20 filter drop-shadow-[2px_2px_0px_#2D3142]" style={{ shapeRendering: 'crispEdges' }}>
            <rect x="8" y="4" width="8" height="3" fill="#F4A261" />
            <rect x="7" y="7" width="10" height="11" fill="#F4A261" />
            <rect x="9" y="10" width="6" height="7" fill="#FFF3E8" />
            <rect x="11" y="2" width="2" height="2" fill="#E76F51" />
            <rect x="6" y="12" width="2" height="2" fill="#E76F51" />
            <rect x="16" y="12" width="2" height="2" fill="#E76F51" />
            {isFocusActive ? (
              <>
                <rect x="9" y="10" width="2" height="2" fill="#2D3142" />
                <rect x="13" y="10" width="2" height="2" fill="#2D3142" />
                <rect x="9" y="10" width="1" height="1" fill="#FFFFFF" />
                <rect x="13" y="10" width="1" height="1" fill="#FFFFFF" />
              </>
            ) : mood === 'sleeping' ? (
              <>
                <rect x="9" y="11" width="2" height="1" fill="#2D3142" />
                <rect x="13" y="11" width="2" height="1" fill="#2D3142" />
              </>
            ) : (
              <>
                <rect x="9" y="10" width="2" height="2" fill="#2D3142" />
                <rect x="13" y="10" width="2" height="2" fill="#2D3142" />
                <rect x="9" y="10" width="1" height="1" fill="#FFFFFF" />
                <rect x="13" y="10" width="1" height="1" fill="#FFFFFF" />
              </>
            )}
            <rect x="11" y="13" width="2" height="1" fill="#C85A17" />
            <rect x="8" y="18" width="2" height="2" fill="#C85A17" />
            <rect x="14" y="18" width="2" height="2" fill="#C85A17" />
          </svg>
        ),
      },
      {
        stage: 2,
        minLevel: 2,
        title: 'Flame Pup',
        name: 'Pyropup',
        badge: 'STAGE 2 • JUVENILE',
        description: 'Ember has grown flame-tipped ears, paws, and a wagging fire tail that flares up when you complete tasks!',
        renderSprite: () => (
          <svg viewBox="0 0 24 24" className="w-16 h-16 sm:w-20 sm:h-20 filter drop-shadow-[2px_2px_0px_#2D3142]" style={{ shapeRendering: 'crispEdges' }}>
            <rect x="6" y="2" width="3" height="5" fill="#E76F51" />
            <rect x="15" y="2" width="3" height="5" fill="#E76F51" />
            <rect x="6" y="6" width="12" height="12" fill="#F4A261" />
            <rect x="8" y="9" width="8" height="8" fill="#FFF3E8" />
            <rect x="8" y="9" width="2" height="2" fill="#2D3142" />
            <rect x="14" y="9" width="2" height="2" fill="#2D3142" />
            <rect x="8" y="9" width="1" height="1" fill="#FFFFFF" />
            <rect x="14" y="9" width="1" height="1" fill="#FFFFFF" />
            <rect x="11" y="12" width="2" height="1" fill="#C85A17" />
            <rect x="18" y="12" width="4" height="4" fill="#E76F51" />
            <rect x="20" y="10" width="3" height="3" fill="#F4A261" />
            <rect x="7" y="18" width="3" height="2" fill="#C85A17" />
            <rect x="14" y="18" width="3" height="2" fill="#C85A17" />
          </svg>
        ),
      },
      {
        stage: 3,
        minLevel: 4,
        title: 'Flare Drake',
        name: 'Blaze Fox',
        badge: 'STAGE 3 • EVOLVED',
        description: 'Fiery draconic wings and blazing horns, moving with swift elegance and incandescent resolve.',
        renderSprite: () => (
          <svg viewBox="0 0 24 24" className="w-16 h-16 sm:w-20 sm:h-20 filter drop-shadow-[2px_2px_0px_#2D3142]" style={{ shapeRendering: 'crispEdges' }}>
            <rect x="2" y="6" width="4" height="7" fill="#E76F51" />
            <rect x="18" y="6" width="4" height="7" fill="#E76F51" />
            <rect x="7" y="2" width="2" height="5" fill="#C85A17" />
            <rect x="15" y="2" width="2" height="5" fill="#C85A17" />
            <rect x="6" y="6" width="12" height="12" fill="#F4A261" />
            <rect x="8" y="9" width="8" height="8" fill="#FFF3E8" />
            <rect x="8" y="8" width="2" height="3" fill="#2D3142" />
            <rect x="14" y="8" width="2" height="3" fill="#2D3142" />
            <rect x="11" y="12" width="2" height="2" fill="#E76F51" />
            <rect x="17" y="15" width="5" height="3" fill="#E76F51" />
            <rect x="20" y="13" width="3" height="3" fill="#F4A261" />
            <rect x="7" y="18" width="3" height="2" fill="#C85A17" />
            <rect x="14" y="18" width="3" height="2" fill="#C85A17" />
          </svg>
        ),
      },
      {
        stage: 4,
        minLevel: 6,
        title: 'Solar Phoenix Dragon',
        name: 'Solar Sovereign',
        badge: 'STAGE 4 • ASCENDED',
        description: 'A radiant mythical solar dragon whose wings radiate infinite warmth, inspiring unstoppable willpower.',
        renderSprite: () => (
          <svg viewBox="0 0 24 24" className="w-16 h-16 sm:w-20 sm:h-20 filter drop-shadow-[2px_2px_0px_#2D3142]" style={{ shapeRendering: 'crispEdges' }}>
            <rect x="7" y="0" width="10" height="2" fill="#F4A261" />
            <rect x="1" y="4" width="5" height="10" fill="#E76F51" />
            <rect x="18" y="4" width="5" height="10" fill="#E76F51" />
            <rect x="5" y="6" width="14" height="13" fill="#C85A17" />
            <rect x="7" y="8" width="10" height="10" fill="#F4A261" />
            <rect x="9" y="11" width="6" height="6" fill="#FFF3E8" />
            <rect x="8" y="9" width="2" height="2" fill="#2D3142" />
            <rect x="14" y="9" width="2" height="2" fill="#2D3142" />
            <rect x="11" y="7" width="2" height="2" fill="#CADBFB" />
            <rect x="5" y="19" width="14" height="3" fill="#C85A17" />
          </svg>
        ),
      },
    ],
  },

  bubbles: {
    id: 'bubbles',
    defaultName: 'Bubbles',
    element: 'Water & Serenity',
    themeColor: '#70A9A1',
    accentColor: '#407B75',
    badgeColor: '#E6F4F1',
    foodName: 'Coral Drops',
    foodEmoji: '🫐',
    lore: 'A peaceful axolotl born from cool mountain springs. Its gentle swaying brings immediate calm and somatic soothing.',
    speeches: {
      focusing: [
        '"Breathe in calmness, breathe out tension..."',
        '"Flow like water around any obstacles."',
        '"Smooth, serene, steady progress..."',
        '"I am gliding gently with your thoughts 🌊"',
      ],
      idle: [
        '"Hello! Let us take a deep, soothing breath together."',
        '"Do your shoulders feel tense? Let them drop softly."',
        '"Finishing a task gives me yummy coral dewberries!"',
        '"Serene attention creates peaceful results."',
      ],
      sleeping: [
        '"Zzz... floating serenely in a soft bubble..."',
        '"Gently bobbing in cool water..."',
      ],
      celebrating: [
        '"Splish splash! Wonderfully done! 💦"',
        '"That felt as refreshing as a mountain cascade!"',
      ],
    },
    stages: [
      {
        stage: 1,
        minLevel: 0,
        title: 'Dewdrop Fry',
        name: 'Little Bubbles',
        badge: 'STAGE 1 • DEWDROP',
        description: 'A tiny blue water droplet creature with cute pink blush and a gentle swaying fin.',
        renderSprite: ({ isFocusActive, mood }) => (
          <svg viewBox="0 0 24 24" className="w-16 h-16 sm:w-20 sm:h-20 filter drop-shadow-[2px_2px_0px_#2D3142]" style={{ shapeRendering: 'crispEdges' }}>
            <rect x="8" y="7" width="8" height="11" fill="#70A9A1" />
            <rect x="9" y="5" width="6" height="2" fill="#70A9A1" />
            <rect x="11" y="3" width="2" height="2" fill="#CADBFB" />
            <rect x="6" y="11" width="2" height="3" fill="#F8C390" />
            <rect x="16" y="11" width="2" height="3" fill="#F8C390" />
            {isFocusActive ? (
              <>
                <rect x="9" y="10" width="2" height="2" fill="#2D3142" />
                <rect x="13" y="10" width="2" height="2" fill="#2D3142" />
                <rect x="9" y="10" width="1" height="1" fill="#FFFFFF" />
                <rect x="13" y="10" width="1" height="1" fill="#FFFFFF" />
              </>
            ) : mood === 'sleeping' ? (
              <>
                <rect x="9" y="11" width="2" height="1" fill="#2D3142" />
                <rect x="13" y="11" width="2" height="1" fill="#2D3142" />
              </>
            ) : (
              <>
                <rect x="9" y="10" width="2" height="2" fill="#2D3142" />
                <rect x="13" y="10" width="2" height="2" fill="#2D3142" />
                <rect x="9" y="10" width="1" height="1" fill="#FFFFFF" />
                <rect x="13" y="10" width="1" height="1" fill="#FFFFFF" />
              </>
            )}
            <rect x="11" y="13" width="2" height="1" fill="#407B75" />
            <rect x="10" y="18" width="4" height="2" fill="#407B75" />
          </svg>
        ),
      },
      {
        stage: 2,
        minLevel: 2,
        title: 'Axo Baby',
        name: 'Coral Axolotl',
        badge: 'STAGE 2 • JUVENILE',
        description: 'Feathery pink gill frills and cute webbed paws, smiling delightfully with every focus session.',
        renderSprite: () => (
          <svg viewBox="0 0 24 24" className="w-16 h-16 sm:w-20 sm:h-20 filter drop-shadow-[2px_2px_0px_#2D3142]" style={{ shapeRendering: 'crispEdges' }}>
            <rect x="3" y="5" width="4" height="4" fill="#F4A261" />
            <rect x="17" y="5" width="4" height="4" fill="#F4A261" />
            <rect x="6" y="6" width="12" height="11" fill="#70A9A1" />
            <rect x="8" y="9" width="8" height="7" fill="#E6F4F1" />
            <rect x="8" y="9" width="2" height="2" fill="#2D3142" />
            <rect x="14" y="9" width="2" height="2" fill="#2D3142" />
            <rect x="8" y="9" width="1" height="1" fill="#FFFFFF" />
            <rect x="14" y="9" width="1" height="1" fill="#FFFFFF" />
            <rect x="11" y="12" width="2" height="1" fill="#407B75" />
            <rect x="5" y="10" width="2" height="2" fill="#F8C390" />
            <rect x="17" y="10" width="2" height="2" fill="#F8C390" />
            <rect x="7" y="17" width="3" height="2" fill="#407B75" />
            <rect x="14" y="17" width="3" height="2" fill="#407B75" />
          </svg>
        ),
      },
      {
        stage: 3,
        minLevel: 4,
        title: 'River Spirit Axolotl',
        name: 'Tide Weaver',
        badge: 'STAGE 3 • EVOLVED',
        description: 'Luminous translucent fins and an aquatic crown of pure sapphire crystals.',
        renderSprite: () => (
          <svg viewBox="0 0 24 24" className="w-16 h-16 sm:w-20 sm:h-20 filter drop-shadow-[2px_2px_0px_#2D3142]" style={{ shapeRendering: 'crispEdges' }}>
            <rect x="9" y="1" width="6" height="3" fill="#CADBFB" />
            <rect x="2" y="4" width="5" height="6" fill="#F4A261" />
            <rect x="17" y="4" width="5" height="6" fill="#F4A261" />
            <rect x="6" y="5" width="12" height="13" fill="#70A9A1" />
            <rect x="8" y="8" width="8" height="8" fill="#E6F4F1" />
            <rect x="8" y="8" width="2" height="2" fill="#2D3142" />
            <rect x="14" y="8" width="2" height="2" fill="#2D3142" />
            <rect x="11" y="11" width="2" height="1" fill="#407B75" />
            <rect x="18" y="14" width="4" height="4" fill="#CADBFB" />
            <rect x="7" y="18" width="3" height="2" fill="#407B75" />
            <rect x="14" y="18" width="3" height="2" fill="#407B75" />
          </svg>
        ),
      },
      {
        stage: 4,
        minLevel: 6,
        title: 'Cosmic Tide Whale',
        name: 'Celestial Leviathan',
        badge: 'STAGE 4 • ASCENDED',
        description: 'An immense, starry cosmic whale swimming in auroras of peace, dissolving all anxiety and stress.',
        renderSprite: () => (
          <svg viewBox="0 0 24 24" className="w-16 h-16 sm:w-20 sm:h-20 filter drop-shadow-[2px_2px_0px_#2D3142]" style={{ shapeRendering: 'crispEdges' }}>
            <rect x="6" y="1" width="12" height="2" fill="#CADBFB" />
            <rect x="1" y="7" width="5" height="8" fill="#CADBFB" />
            <rect x="18" y="7" width="5" height="8" fill="#CADBFB" />
            <rect x="5" y="5" width="14" height="14" fill="#407B75" />
            <rect x="7" y="7" width="10" height="10" fill="#70A9A1" />
            <rect x="9" y="10" width="6" height="6" fill="#E6F4F1" />
            <rect x="8" y="8" width="2" height="2" fill="#F4A261" />
            <rect x="14" y="8" width="2" height="2" fill="#F4A261" />
            <rect x="11" y="6" width="2" height="2" fill="#FFFFFF" />
            <rect x="6" y="19" width="12" height="3" fill="#407B75" />
          </svg>
        ),
      },
    ],
  },

  pip: {
    id: 'pip',
    defaultName: 'Pip',
    element: 'Cyber & Logic',
    themeColor: '#B4C5E4',
    accentColor: '#3D5A80',
    badgeColor: '#F0F4FA',
    foodName: 'Memory Chips',
    foodEmoji: '⚡',
    lore: 'A friendly retro micro-droid running on 8-bit chiptune logic. Loves clean lists and structured Pomodoros.',
    speeches: {
      focusing: [
        '"PROCESSING FOCUS PROTOCOL... Efficiency: 100%!"',
        '"BEEP BOOP: Eliminating cognitive interruptions."',
        '"Timer synchronized with core clock. Executing!"',
        '"Great computation, friend! Keep the logic flow ⚡"',
      ],
      idle: [
        '"STATUS: Ready for new instruction set!"',
        '"Have you broken down your large tasks yet?"',
        '"Complete tasks to recharge my battery cells!"',
        '"Structured routines yield optimal memory performance."',
      ],
      sleeping: [
        '"SLEEP MODE ENGAGED... Zzz... Standby voltage 1.2V..."',
        '"Memory defragmenting... ready to reboot on command."',
      ],
      celebrating: [
        '"TASK STATUS: 200 OK! CELEBRATION PROTOCOL ACTIVE! 🤖"',
        '"BEEP BEEP! Optimal accomplishment recorded in RAM!"',
      ],
    },
    stages: [
      {
        stage: 1,
        minLevel: 0,
        title: 'Micro Nano Chip',
        name: 'Little Pip',
        badge: 'STAGE 1 • MICROCHIP',
        description: 'A tiny silicon chip with blinking LED eyes and brass pins, eager to compute your tasks.',
        renderSprite: ({ isFocusActive, mood }) => (
          <svg viewBox="0 0 24 24" className="w-16 h-16 sm:w-20 sm:h-20 filter drop-shadow-[2px_2px_0px_#2D3142]" style={{ shapeRendering: 'crispEdges' }}>
            <rect x="11" y="2" width="2" height="4" fill="#3D5A80" />
            <rect x="10" y="1" width="4" height="2" fill="#F4A261" />
            <rect x="6" y="6" width="12" height="12" fill="#B4C5E4" />
            <rect x="8" y="8" width="8" height="8" fill="#2D3142" />
            {isFocusActive ? (
              <>
                <rect x="9" y="10" width="2" height="2" fill="#7FB685" />
                <rect x="13" y="10" width="2" height="2" fill="#7FB685" />
                <rect x="9" y="10" width="1" height="1" fill="#FFFFFF" />
                <rect x="13" y="10" width="1" height="1" fill="#FFFFFF" />
              </>
            ) : mood === 'sleeping' ? (
              <>
                <rect x="9" y="11" width="2" height="1" fill="#B4C5E4" />
                <rect x="13" y="11" width="2" height="1" fill="#B4C5E4" />
              </>
            ) : (
              <>
                <rect x="9" y="10" width="2" height="2" fill="#CADBFB" />
                <rect x="13" y="10" width="2" height="2" fill="#CADBFB" />
              </>
            )}
            <rect x="10" y="13" width="4" height="1" fill="#7FB685" />
            <rect x="4" y="9" width="2" height="2" fill="#3D5A80" />
            <rect x="4" y="13" width="2" height="2" fill="#3D5A80" />
            <rect x="18" y="9" width="2" height="2" fill="#3D5A80" />
            <rect x="18" y="13" width="2" height="2" fill="#3D5A80" />
            <rect x="8" y="18" width="2" height="3" fill="#3D5A80" />
            <rect x="14" y="18" width="2" height="3" fill="#3D5A80" />
          </svg>
        ),
      },
      {
        stage: 2,
        minLevel: 2,
        title: 'Bit Droid',
        name: 'Robo Pup',
        badge: 'STAGE 2 • JUVENILE',
        description: 'Pip has upgraded into a rolling desktop companion bot with twin antennae and cathode smile!',
        renderSprite: () => (
          <svg viewBox="0 0 24 24" className="w-16 h-16 sm:w-20 sm:h-20 filter drop-shadow-[2px_2px_0px_#2D3142]" style={{ shapeRendering: 'crispEdges' }}>
            <rect x="7" y="1" width="2" height="4" fill="#3D5A80" />
            <rect x="15" y="1" width="2" height="4" fill="#3D5A80" />
            <rect x="5" y="5" width="14" height="12" fill="#B4C5E4" />
            <rect x="7" y="7" width="10" height="8" fill="#2D3142" />
            <rect x="8" y="9" width="2" height="2" fill="#7FB685" />
            <rect x="14" y="9" width="2" height="2" fill="#7FB685" />
            <rect x="10" y="12" width="4" height="1" fill="#CADBFB" />
            <rect x="4" y="17" width="16" height="3" fill="#3D5A80" />
            <rect x="6" y="20" width="3" height="2" fill="#2D3142" />
            <rect x="15" y="20" width="3" height="2" fill="#2D3142" />
          </svg>
        ),
      },
      {
        stage: 3,
        minLevel: 4,
        title: 'Mech Knight',
        name: 'Cyber Automaton',
        badge: 'STAGE 3 • EVOLVED',
        description: 'Sleek armored chassis, holographic wings, and precision focus boosters.',
        renderSprite: () => (
          <svg viewBox="0 0 24 24" className="w-16 h-16 sm:w-20 sm:h-20 filter drop-shadow-[2px_2px_0px_#2D3142]" style={{ shapeRendering: 'crispEdges' }}>
            <rect x="2" y="5" width="4" height="8" fill="#CADBFB" />
            <rect x="18" y="5" width="4" height="8" fill="#CADBFB" />
            <rect x="9" y="1" width="6" height="3" fill="#F4A261" />
            <rect x="5" y="4" width="14" height="14" fill="#3D5A80" />
            <rect x="7" y="6" width="10" height="9" fill="#B4C5E4" />
            <rect x="8" y="8" width="8" height="2" fill="#7FB685" />
            <rect x="11" y="12" width="2" height="2" fill="#F4A261" />
            <rect x="7" y="18" width="3" height="3" fill="#2D3142" />
            <rect x="14" y="18" width="3" height="3" fill="#2D3142" />
          </svg>
        ),
      },
      {
        stage: 4,
        minLevel: 6,
        title: 'Quantum Sovereign',
        name: 'Quantum Core',
        badge: 'STAGE 4 • ASCENDED',
        description: 'A floating cyber intelligence wreathed in orbital rings and crystalline computational energy.',
        renderSprite: () => (
          <svg viewBox="0 0 24 24" className="w-16 h-16 sm:w-20 sm:h-20 filter drop-shadow-[2px_2px_0px_#2D3142]" style={{ shapeRendering: 'crispEdges' }}>
            <rect x="7" y="0" width="10" height="2" fill="#7FB685" />
            <rect x="1" y="7" width="5" height="10" fill="#CADBFB" />
            <rect x="18" y="7" width="5" height="10" fill="#CADBFB" />
            <rect x="5" y="4" width="14" height="14" fill="#3D5A80" />
            <rect x="7" y="6" width="10" height="10" fill="#2D3142" />
            <rect x="9" y="8" width="6" height="6" fill="#7FB685" />
            <rect x="11" y="10" width="2" height="2" fill="#FFFFFF" />
            <rect x="6" y="19" width="12" height="3" fill="#3D5A80" />
          </svg>
        ),
      },
    ],
  },

  mochi: {
    id: 'mochi',
    defaultName: 'Mochi',
    element: 'Spirit & Dreams',
    themeColor: '#D8B4E2',
    accentColor: '#7B2CBF',
    badgeColor: '#FAF0FC',
    foodName: 'Star Candies',
    foodEmoji: '⭐',
    lore: 'A gentle marshmallow star spirit that floats softly beside you, absorbing worries and illuminating your study journey.',
    speeches: {
      focusing: [
        '"Like a gentle star shining in the quiet night..."',
        '"Every thought finds its peaceful orbit..."',
        '"Floating smoothly through this session with you ✨"',
        '"Soft, peaceful, unstoppable progress."',
      ],
      idle: [
        '"Hello! Look at the twinkling stars today!"',
        '"Take it gently. Your pace is already perfect."',
        '"Feed me sweet star candies when you finish a task!"',
        '"Even small achievements shine like constellations."',
      ],
      sleeping: [
        '"Zzz... curled up in a crescent moon hammock..."',
        '"Drifting softly through nebula clouds..."',
      ],
      celebrating: [
        '"STARDUST SHOWER! That was magnificent! 🌟"',
        '"A whole new constellation unlocked for you!"',
      ],
    },
    stages: [
      {
        stage: 1,
        minLevel: 0,
        title: 'Marshmallow Wisp',
        name: 'Little Mochi',
        badge: 'STAGE 1 • WISP',
        description: 'A soft floating ghost puff with pink blush cheeks that sways gently as you work.',
        renderSprite: ({ isFocusActive, mood }) => (
          <svg viewBox="0 0 24 24" className="w-16 h-16 sm:w-20 sm:h-20 filter drop-shadow-[2px_2px_0px_#2D3142]" style={{ shapeRendering: 'crispEdges' }}>
            <rect x="8" y="5" width="8" height="12" fill="#D8B4E2" />
            <rect x="9" y="4" width="6" height="2" fill="#D8B4E2" />
            <rect x="6" y="12" width="2" height="2" fill="#F8C390" />
            <rect x="16" y="12" width="2" height="2" fill="#F8C390" />
            <rect x="11" y="2" width="2" height="2" fill="#F4A261" />
            {isFocusActive ? (
              <>
                <rect x="9" y="9" width="2" height="2" fill="#2D3142" />
                <rect x="13" y="9" width="2" height="2" fill="#2D3142" />
                <rect x="9" y="9" width="1" height="1" fill="#FFFFFF" />
                <rect x="13" y="9" width="1" height="1" fill="#FFFFFF" />
              </>
            ) : mood === 'sleeping' ? (
              <>
                <rect x="9" y="10" width="2" height="1" fill="#2D3142" />
                <rect x="13" y="10" width="2" height="1" fill="#2D3142" />
              </>
            ) : (
              <>
                <rect x="9" y="9" width="2" height="2" fill="#2D3142" />
                <rect x="13" y="9" width="2" height="2" fill="#2D3142" />
                <rect x="9" y="9" width="1" height="1" fill="#FFFFFF" />
                <rect x="13" y="9" width="1" height="1" fill="#FFFFFF" />
              </>
            )}
            <rect x="11" y="12" width="2" height="1" fill="#7B2CBF" />
            <rect x="7" y="17" width="2" height="2" fill="#D8B4E2" />
            <rect x="11" y="17" width="2" height="2" fill="#D8B4E2" />
            <rect x="15" y="17" width="2" height="2" fill="#D8B4E2" />
          </svg>
        ),
      },
      {
        stage: 2,
        minLevel: 2,
        title: 'Polter-Cat',
        name: 'Spectral Kitten',
        badge: 'STAGE 2 • JUVENILE',
        description: 'Mochi has sprouted spectral cat ears, a starry floating tail, and playful mischievous eyes!',
        renderSprite: () => (
          <svg viewBox="0 0 24 24" className="w-16 h-16 sm:w-20 sm:h-20 filter drop-shadow-[2px_2px_0px_#2D3142]" style={{ shapeRendering: 'crispEdges' }}>
            <rect x="6" y="2" width="3" height="4" fill="#D8B4E2" />
            <rect x="15" y="2" width="3" height="4" fill="#D8B4E2" />
            <rect x="6" y="5" width="12" height="12" fill="#D8B4E2" />
            <rect x="8" y="8" width="8" height="7" fill="#FAF0FC" />
            <rect x="8" y="8" width="2" height="2" fill="#7B2CBF" />
            <rect x="14" y="8" width="2" height="2" fill="#7B2CBF" />
            <rect x="11" y="11" width="2" height="1" fill="#F4A261" />
            <rect x="18" y="11" width="4" height="4" fill="#D8B4E2" />
            <rect x="20" y="9" width="3" height="3" fill="#F4A261" />
            <rect x="7" y="17" width="2" height="2" fill="#D8B4E2" />
            <rect x="11" y="17" width="2" height="2" fill="#D8B4E2" />
            <rect x="15" y="17" width="2" height="2" fill="#D8B4E2" />
          </svg>
        ),
      },
      {
        stage: 3,
        minLevel: 4,
        title: 'Astral Specter',
        name: 'Cosmic Familiar',
        badge: 'STAGE 3 • EVOLVED',
        description: 'Floating stardust mantle, orbiting crescent moons, and ethereal twilight luminescence.',
        renderSprite: () => (
          <svg viewBox="0 0 24 24" className="w-16 h-16 sm:w-20 sm:h-20 filter drop-shadow-[2px_2px_0px_#2D3142]" style={{ shapeRendering: 'crispEdges' }}>
            <rect x="9" y="1" width="6" height="2" fill="#F4A261" />
            <rect x="2" y="6" width="4" height="7" fill="#D8B4E2" />
            <rect x="18" y="6" width="4" height="7" fill="#D8B4E2" />
            <rect x="5" y="4" width="14" height="13" fill="#7B2CBF" />
            <rect x="7" y="6" width="10" height="9" fill="#D8B4E2" />
            <rect x="8" y="8" width="2" height="2" fill="#FAF0FC" />
            <rect x="14" y="8" width="2" height="2" fill="#FAF0FC" />
            <rect x="11" y="11" width="2" height="2" fill="#F4A261" />
            <rect x="6" y="18" width="12" height="3" fill="#7B2CBF" />
          </svg>
        ),
      },
      {
        stage: 4,
        minLevel: 6,
        title: 'Star Sovereign Deity',
        name: 'Celestial Sovereign',
        badge: 'STAGE 4 • ASCENDED',
        description: 'A majestic radiant cosmic spirit crowned with supernova stars, watching over your accomplishments.',
        renderSprite: () => (
          <svg viewBox="0 0 24 24" className="w-16 h-16 sm:w-20 sm:h-20 filter drop-shadow-[2px_2px_0px_#2D3142]" style={{ shapeRendering: 'crispEdges' }}>
            <rect x="7" y="0" width="10" height="2" fill="#F4A261" />
            <rect x="1" y="6" width="5" height="10" fill="#D8B4E2" />
            <rect x="18" y="6" width="5" height="10" fill="#D8B4E2" />
            <rect x="5" y="4" width="14" height="14" fill="#7B2CBF" />
            <rect x="7" y="6" width="10" height="10" fill="#D8B4E2" />
            <rect x="9" y="9" width="6" height="6" fill="#FAF0FC" />
            <rect x="8" y="8" width="2" height="2" fill="#F4A261" />
            <rect x="14" y="8" width="2" height="2" fill="#F4A261" />
            <rect x="11" y="7" width="2" height="2" fill="#FFFFFF" />
            <rect x="6" y="19" width="12" height="3" fill="#7B2CBF" />
          </svg>
        ),
      },
    ],
  },
};

/**
 * Returns the current evolution stage for a given pet species and level
 */
export function getCurrentPetStage(species: PetSpecies, level: number): PetEvolutionStage {
  const config = PET_SPECIES_CONFIGS[species] || PET_SPECIES_CONFIGS.sprout;
  // Pick the highest stage whose minLevel <= current level
  for (let i = config.stages.length - 1; i >= 0; i--) {
    if (level >= config.stages[i].minLevel) {
      return config.stages[i];
    }
  }
  return config.stages[0];
}

/**
 * Returns the next evolution stage for a given pet species and level, if any
 */
export function getNextPetStage(species: PetSpecies, level: number): PetEvolutionStage | null {
  const config = PET_SPECIES_CONFIGS[species] || PET_SPECIES_CONFIGS.sprout;
  for (let i = 0; i < config.stages.length; i++) {
    if (config.stages[i].minLevel > level) {
      return config.stages[i];
    }
  }
  return null;
}
