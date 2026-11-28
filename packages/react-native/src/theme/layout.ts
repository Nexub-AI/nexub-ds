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

/** Width at or above this is the expanded window size class (Material 3: 840dp). */
export const EXPANDED_MIN = 840;

/**
 * Material 3 window size classes by width: compact (< 600, phones in portrait),
 * medium (600–839, small tablets, unfolded foldables in portrait) and expanded (≥ 840).
 */
export type WindowSizeClass = 'compact' | 'medium' | 'expanded';

/** The window size class for a width in dp. */
export function windowSizeClass(width: number): WindowSizeClass {
  return width < TABLET_MIN ? 'compact' : width < EXPANDED_MIN ? 'medium' : 'expanded';
}

/**
 * 12.5: the window size class, live across rotation, split view, Stage Manager
 * and folding or unfolding a foldable. React Native reports the new window size;
 * it exposes no hinge or posture without a native module, so foldables are
 * handled by width alone.
 */
export function useWindowSizeClass(): WindowSizeClass {
  return windowSizeClass(useWindowDimensions().width);
}
