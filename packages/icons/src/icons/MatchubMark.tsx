import { forwardRef, type SVGProps } from 'react';
import { createIcon } from '../createIcon.js';

const MatchubMarkSvg = /* @__PURE__ */ forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  function MatchubMarkSvg({ width = 24, height = 24, strokeWidth = 1.75, ...props }, ref) {
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
        {/* Sports glyph — the Hub ring: an M inside a ring, with a ball in the ring's gap */}
        <path d="M20.16 8.2A9 9 0 1 1 15.8 3.84" />
        <circle cx="18.36" cy="5.64" r="0.6" />
        <path d="M8.5 16V9l3.5 3.5L15.5 9v7" />
      </svg>
    );
  },
);

export const MatchubMark = /* @__PURE__ */ createIcon(MatchubMarkSvg , 'MatchubMark');
