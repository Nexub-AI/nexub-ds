import { forwardRef, type SVGProps } from 'react';
import { createIcon, type IconComponent } from '../createIcon.js';

const FounderubMarkSvg = /* @__PURE__ */ forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  function FounderubMarkSvg({ width = 24, height = 24, strokeWidth = 1.75, ...props }, ref) {
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
        {/* Founder dashboard glyph — rocket / compass */}
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3" />
        <path d="M12 19v3" />
        <path d="M2 12h3" />
        <path d="M19 12h3" />
        <path d="m4.93 4.93 2.12 2.12" />
        <path d="m16.95 16.95 2.12 2.12" />
        <path d="m16.95 7.05 2.12-2.12" />
        <path d="m4.93 19.07 2.12-2.12" />
      </svg>
    );
  },
);

export const FounderubMark = /* @__PURE__ */ createIcon(FounderubMarkSvg , 'FounderubMark');
