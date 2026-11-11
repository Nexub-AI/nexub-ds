export type MotionDuration = 'instant' | 'fast' | 'normal' | 'slow' | 'slower';

export interface MotionBaseProps {
  /** Whether the component is visible / mounted. */
  in: boolean;
  /**
   * Speed on the spring tokens: `fast` → fast, `normal` → default,
   * `slow`/`slower` → slow springs. `instant` turns motion off.
   * @default 'normal'
   */
  duration?: MotionDuration;
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
