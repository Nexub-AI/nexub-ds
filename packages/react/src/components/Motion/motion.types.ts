export type MotionDuration = 'instant' | 'fast' | 'normal' | 'slow' | 'slower';
export type MotionEasing = 'linear' | 'in' | 'out' | 'in-out' | 'out-expo' | 'spring';

export interface MotionBaseProps {
  /** Whether the component is visible / mounted. */
  in: boolean;
  /**
   * Token-based duration.  Maps to `--duration-{value}`.
   * @default 'normal'
   */
  duration?: MotionDuration;
  /**
   * Token-based easing.  Maps to `--ease-{value}`.
   * @default 'out'
   */
  easing?: MotionEasing;
  /**
   * Remove the element from the DOM when `in` becomes false
   * (after the exit transition completes).
   * @default false
   */
  unmountOnExit?: boolean;
  children?: React.ReactNode;
}

// Expose React here so files importing this don't need to re-import
import * as React from 'react';
