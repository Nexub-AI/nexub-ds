import { forwardRef, type SVGProps } from 'react';
import { createIcon } from '../createIcon.js';
import type { IconProps } from '../Icon.js';

const NexubMarkSvg = /* @__PURE__ */ forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  function NexubMarkSvg({ width = 24, height = 24, strokeWidth = 1.75, ...props }, ref) {
    return (
      <svg
        ref={ref}
        viewBox="0 0 24 24"
        width={width}
        height={height}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        {/* "B" letterform — left stem + two bumps */}
        <path d="M6 4h7a4 4 0 0 1 0 8H6V4z" />
        <path d="M6 12h8a4 4 0 0 1 0 8H6v-8z" />
      </svg>
    );
  },
);

export const NexubMark = /* @__PURE__ */ createIcon(NexubMarkSvg , 'NexubMark');
export type { IconProps as NexubMarkProps };
