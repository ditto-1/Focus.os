export type ScreenTab =
  | 'focus'
  | 'whatnow'
  | 'planner'
  | 'routines'
  | 'music'
  | 'sensory'
  | 'cartridge';

export type FocusMode = 'deep' | 'sprint' | 'breathe' | 'rest';

export interface Subtask {
  id: string;
  title: string;
  estimatedMinutes: number;
  staminaPoints: 1 | 2 | 3;
  completed: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  deadline: string;
  estimatedMinutes: number;
  staminaPoints: 1 | 2 | 3;
  completed: boolean;
  category: 'academic' | 'project' | 'life' | 'wellness';
  subtasks: Subtask[];
  notes?: string;
  createdAt: number;
}

export interface RoutineItem {
  id: string;
  title: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  iconName: string;
  streak: number;
  completedToday: boolean;
  staminaReward: number;
}

export interface DayActivity {
  date: string;
  minutesFocused: number;
  questsCompleted: number;
  level: 0 | 1 | 2 | 3;
}

export interface PetState {
  name: string;
  level: number;
  exp: number;
  maxExp: number;
  mood: 'happy' | 'focusing' | 'sleeping' | 'celebrating';
  berriesFed: number;
}

export interface MusicStation {
  id: string;
  name: string;
  service: 'spotify' | 'applemusic' | 'retro_lofi';
  type: 'embed' | 'stream';
  embedSrc: string;
  curator: string;
  tag: string;
}

export interface MusicPlayerState {
  service: 'spotify' | 'applemusic' | 'retro_lofi';
  activeStationId: string;
  customUrl: string;
  isPlaying: boolean;
  volume: number;
  retroTrackIndex: number;
}

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  email: string;
  studyMajor?: string;
  dailyGoalMinutes?: number;
  createdAt: number;
}

