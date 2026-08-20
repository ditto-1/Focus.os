import { Quest, DayActivity } from '../types';

export const INITIAL_QUESTS: Quest[] = [
  {
    id: 'quest-1',
    title: '5-minute tidy & clear workspace',
    staminaPoints: 1,
    completed: false,
    category: 'core',
    createdAt: Date.now() - 3600000,
  },
  {
    id: 'quest-2',
    title: 'Write down 1 single priority for today',
    staminaPoints: 1,
    completed: true,
    category: 'core',
    createdAt: Date.now() - 7200000,
  },
  {
    id: 'quest-3',
    title: 'Hydrate with a tall glass of cool water',
    staminaPoints: 1,
    completed: false,
    category: 'wellness',
    createdAt: Date.now() - 1800000,
  },
  {
    id: 'quest-4',
    title: 'Complete 25-minute deep focus sprint',
    staminaPoints: 3,
    completed: false,
    category: 'side',
    createdAt: Date.now() - 5400000,
  },
  {
    id: 'quest-5',
    title: 'Step outside or look at the sky for 2 mins',
    staminaPoints: 1,
    completed: false,
    category: 'wellness',
    createdAt: Date.now() - 900000,
  },
];

export const INITIAL_WEEK_ACTIVITY: DayActivity[] = [
  { date: 'Mon', minutesFocused: 45, questsCompleted: 3, level: 2 },
  { date: 'Tue', minutesFocused: 60, questsCompleted: 5, level: 3 },
  { date: 'Wed', minutesFocused: 25, questsCompleted: 2, level: 1 },
  { date: 'Thu', minutesFocused: 50, questsCompleted: 4, level: 2 },
  { date: 'Fri', minutesFocused: 75, questsCompleted: 6, level: 3 },
  { date: 'Sat', minutesFocused: 20, questsCompleted: 2, level: 1 },
  { date: 'Sun (Today)', minutesFocused: 35, questsCompleted: 3, level: 2 },
];

export const SENSORY_GROUNDING_STEPS = [
  {
    count: 5,
    sense: 'SEE',
    icon: 'eye',
    color: '#7FB685',
    prompt: 'Look around your room. Name 5 things you can see right now.',
    examples: ['Wooden desk grain', 'Dust motes in light', 'Green leaf on plant', 'Ceramic coffee cup', 'Pattern on curtain'],
  },
  {
    count: 4,
    sense: 'TOUCH',
    icon: 'hand',
    color: '#B4C5E4',
    prompt: 'Feel your surroundings. Notice 4 things you can physically touch.',
    examples: ['Fabric of your sleeve', 'Cool desk surface', 'Feet flat against the floor', 'Keycaps under fingertips'],
  },
  {
    count: 3,
    sense: 'HEAR',
    icon: 'volume',
    color: '#F4A261',
    prompt: 'Close your eyes for 5 seconds. Name 3 quiet sounds around you.',
    examples: ['Hum of computer fan', 'Distant traffic or birds', 'Your steady breathing'],
  },
  {
    count: 2,
    sense: 'SMELL',
    icon: 'wind',
    color: '#CADBFB',
    prompt: 'Take a slow, deep breath. Name 2 scents in the air.',
    examples: ['Fresh air from window', 'Warm herbal tea or coffee'],
  },
  {
    count: 1,
    sense: 'TASTE or AFFIRMATION',
    icon: 'heart',
    color: '#F8C390',
    prompt: 'Notice 1 taste, or tell yourself: "I am safe in this present moment."',
    examples: ['Minty freshness of water', '"I take things one gentle breath at a time"'],
  },
];
