import type { Family, Speed } from './springs';

export type MotionPresetName = 'enter' | 'exit' | 'emphasis' | 'success' | 'attention';

/**
 * 12.3 motion presets by intent and the spring each aliases: the same map as
 * MOTION_PRESETS in packages/tokens/scripts/generate.mjs (the built
 * --motion-preset-* variables).
 */
export const MOTION_PRESETS: { name: MotionPresetName; family: Family; speed: Speed; use: string }[] = [
  { name: 'enter', family: 'spatial', speed: 'default', use: 'Something arrives: overlays, rows, toasts, banners.' },
  { name: 'exit', family: 'effects', speed: 'fast', use: 'Something leaves. Quicker than enter, never overshoots.' },
  { name: 'emphasis', family: 'expressive', speed: 'fast', use: 'A state lands: a switch thumb, a selected radio dot.' },
  { name: 'success', family: 'expressive', speed: 'default', use: 'A task completed: the success check.' },
  { name: 'attention', family: 'spatial', speed: 'fast', use: 'Look here, or that didn’t work: a shake, a count tick.' },
];

/** The haptic @nexub/react-native pairs with each preset (presetHaptic). */
export const PRESET_HAPTIC: Record<MotionPresetName, string> = {
  enter: '—',
  exit: '—',
  emphasis: 'selection',
  success: 'success',
  attention: 'warning',
};
