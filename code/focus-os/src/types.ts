export type ScreenTab = 'focus' | 'quests' | 'sensory' | 'cartridge';

export type FocusMode = 'deep' | 'sprint' | 'breathe' | 'rest';

export interface Quest {
  id: string;
  title: string;
  staminaPoints: 1 | 2 | 3;
  completed: boolean;
  category: 'core' | 'side' | 'wellness';
  createdAt: number;
}

export interface DayActivity {
  date: string; // YYYY-MM-DD
  minutesFocused: number;
  questsCompleted: number;
  level: 0 | 1 | 2 | 3; // For pixel heatmap intensity
}

export interface PetState {
  name: string;
  level: number;
  exp: number;
  maxExp: number;
  mood: 'happy' | 'focusing' | 'sleeping' | 'celebrating';
  berriesFed: number;
}
