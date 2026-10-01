import { FontSettings, FontFamilyOption, FontSizeOption } from '../types';

export const DEFAULT_FONT_SETTINGS: FontSettings = {
  family: 'default',
  size: 'standard',
  increasedSpacing: false,
};

const STORAGE_KEY = 'cozy_pocket_font_settings';

export function loadFontSettings(): FontSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_FONT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      family: parsed.family || 'default',
      size: parsed.size || 'standard',
      increasedSpacing: Boolean(parsed.increasedSpacing),
    };
  } catch {
    return DEFAULT_FONT_SETTINGS;
  }
}

export function saveFontSettings(settings: FontSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save font settings:', err);
  }
}

export function applyFontSettingsToDOM(settings: FontSettings): void {
  if (typeof document === 'undefined') return;

  const body = document.body;

  // Remove previous family classes
  body.classList.remove(
    'font-family-default',
    'font-family-mono',
    'font-family-lexend',
    'font-family-dyslexic',
    'font-family-arcade'
  );
  body.classList.add(`font-family-${settings.family}`);

  // Remove previous size classes
  body.classList.remove(
    'font-size-compact',
    'font-size-standard',
    'font-size-large',
    'font-size-extralarge'
  );
  body.classList.add(`font-size-${settings.size}`);

  // Spacing
  if (settings.increasedSpacing) {
    body.classList.add('font-spacing-roomy');
  } else {
    body.classList.remove('font-spacing-roomy');
  }
}
