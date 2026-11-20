import { useWindowDimensions } from 'react-native';

/** Shortest side at or above this is a tablet (Material's 600dp compact → medium boundary). */
export const TABLET_MIN = 600;

export interface Breakpoint {
  width: number;
  height: number;
  /** Shortest side ≥ 600: stays true when a tablet rotates, false for a phone in landscape. */
  isTablet: boolean;
  isLandscape: boolean;
  /** Layout grid columns for the current width: 4 (< 600), 8 (< 840), 12. */
  columns: 4 | 8 | 12;
}

/** Window size class, live across rotation, split view and foldables. */
export function useBreakpoint(): Breakpoint {
  const { width, height } = useWindowDimensions();
  return {
    width,
    height,
    isTablet: Math.min(width, height) >= TABLET_MIN,
    isLandscape: width > height,
    columns: width < TABLET_MIN ? 4 : width < 840 ? 8 : 12,
  };
}

/**
 * Picks a value by device class; `tablet` falls back to `phone`.
 *
 * ```tsx
 * const select = useResponsive();
 * <Stack gap={select({ phone: 3, tablet: 6 })} />
 * ```
 */
export function useResponsive(): <T>(options: { phone: T; tablet?: T }) => T {
  const { isTablet } = useBreakpoint();
  return (o) => (isTablet && o.tablet !== undefined ? o.tablet : o.phone);
}
