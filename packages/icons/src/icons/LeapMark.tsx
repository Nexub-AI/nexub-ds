import { forwardRef, type SVGProps } from 'react';
import { createIcon } from '../createIcon.js';

const LeapMarkSvg = /* @__PURE__ */ forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  function LeapMarkSvg({ width = 24, height = 24, strokeWidth = 1.75, ...props }, ref) {
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
        {/* Incorporation glyph — building with upward arrow */}
        <rect x="3" y="11" width="18" height="10" rx="1" />
        <path d="M9 11V7a3 3 0 0 1 6 0v4" />
        <path d="M12 7V3" />
        <path d="M9 5l3-2 3 2" />
      </svg>
    );
  },
);

export const LeapMark = /* @__PURE__ */ createIcon(LeapMarkSvg , 'LeapMark');
