import type { ControlSize, ToneValue } from '@nexub/core';
import type { NexubTheme, RoleName } from '../theme/ThemeProvider';

/** Container + on-colour role per tone (same mapping as web Button `tone`). */
export const TONE_ROLES: Record<ToneValue, [RoleName, RoleName]> = {
  neutral: ['surface-container-high', 'on-surface'],
  info: ['info', 'on-info'],
  success: ['success', 'on-success'],
  warning: ['warning', 'on-warning'],
  danger: ['error', 'on-error'],
  leap: ['leap', 'on-leap'],
  bookub: ['bookub', 'on-bookub'],
  payub: ['payub', 'on-payub'],
  founderub: ['founderub', 'on-founderub'],
};

/** Soft container variant per tone (banners, tags, badges). */
export const TONE_CONTAINERS: Record<ToneValue, [RoleName, RoleName]> = {
  neutral: ['surface-container-high', 'on-surface-variant'],
  info: ['info-container', 'on-info-container'],
  success: ['success-container', 'on-success-container'],
  warning: ['warning-container', 'on-warning-container'],
  danger: ['error-container', 'on-error-container'],
  leap: ['leap-container', 'on-leap-container'],
  bookub: ['bookub-container', 'on-bookub-container'],
  payub: ['payub-container', 'on-payub-container'],
  founderub: ['founderub-container', 'on-founderub-container'],
};

/** Accent (text/icon) role per tone. */
export const TONE_TEXT: Record<ToneValue, RoleName> = {
  neutral: 'on-surface-variant',
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'error',
  leap: 'leap',
  bookub: 'bookub',
  payub: 'payub',
  founderub: 'founderub',
};

/** Every touch target reaches 44pt (Apple; Android's 48dp is met by md+ controls). */
export const MIN_TARGET = 44;
export const hitSlopFor = (height: number) => {
  const pad = Math.max(0, Math.ceil((MIN_TARGET - height) / 2));
  return pad ? { top: pad, bottom: pad, left: pad, right: pad } : undefined;
};

export const controlHeight = (theme: NexubTheme, size: ControlSize) =>
  theme.tokens.size.control[size];

/** Disabled content opacity (same as the web state token). */
export const disabledOpacity = (theme: NexubTheme) => theme.tokens.state['disabled-content'];
