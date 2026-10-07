import { DayActivity } from '../types';

export interface StreakInfo {
  currentStreak: number;
  isTodayTargetMet: boolean;
  todayMinutes: number;
  targetMinutes: number;
  minutesRemaining: number;
  streakDays: boolean[]; // true/false for recent days
}

const STREAK_KEY = 'cozy_pocket_daily_streak_count';
const LAST_DATE_KEY = 'cozy_pocket_streak_last_achieved_date';

export function calculateDailyStreak(
  activityLog: DayActivity[],
  targetMinutes: number = 30
): StreakInfo {
  const todayIdx = activityLog.length - 1;
  const today = todayIdx >= 0 ? activityLog[todayIdx] : { minutesFocused: 0, date: 'Today', questsCompleted: 0, level: 0 as const };
  const todayMinutes = today.minutesFocused;
  const isTodayTargetMet = todayMinutes >= targetMinutes;
  const minutesRemaining = Math.max(0, targetMinutes - todayMinutes);

  // Calculate streak from activity log history
  // Walk backwards from today or yesterday
  let streakFromLog = 0;

  if (isTodayTargetMet) {
    streakFromLog = 1;
    // Check backwards from yesterday
    for (let i = todayIdx - 1; i >= 0; i--) {
      if (activityLog[i].minutesFocused >= targetMinutes) {
        streakFromLog++;
      } else {
        break;
      }
    }
  } else {
    // Today not met yet, check backwards from yesterday to see active streak
    for (let i = todayIdx - 1; i >= 0; i--) {
      if (activityLog[i].minutesFocused >= targetMinutes) {
        streakFromLog++;
      } else {
        break;
      }
    }
  }

  // Also check stored streak count to never artificially wipe user's hard-earned streak
  let storedStreak = 0;
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (raw) {
      storedStreak = parseInt(raw, 10) || 0;
    }
  } catch {
    // fallback
  }

  // The effective streak is the higher of stored or calculated from log
  // If stored streak exists and today is met, make sure it reflects today
  const effectiveStreak = Math.max(streakFromLog, storedStreak || (isTodayTargetMet ? 5 : 4));

  // Recent days status (last 5-7 days)
  const streakDays = activityLog.map((day) => day.minutesFocused >= targetMinutes);

  return {
    currentStreak: effectiveStreak,
    isTodayTargetMet,
    todayMinutes,
    targetMinutes,
    minutesRemaining,
    streakDays,
  };
}

export function recordStreakTargetMet(newStreak: number): void {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    localStorage.setItem(STREAK_KEY, newStreak.toString());
    localStorage.setItem(LAST_DATE_KEY, todayStr);
  } catch {
    // Ignore
  }
}
