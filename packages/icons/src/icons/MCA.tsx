import { forwardRef, type SVGProps } from 'react';
import { createIcon } from '../createIcon.js';

const MCASvg = /* @__PURE__ */ forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  function MCASvg({ width = 24, height = 24, strokeWidth = 1.75, ...props }, ref) {
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
        {/* India Ministry of Corporate Affairs glyph — Ashoka Chakra placeholder */}
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="2" />
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
        <path d="m5.64 5.64 2.12 2.12M16.24 16.24l2.12 2.12M16.24 7.76l2.12-2.12M5.64 18.36l2.12-2.12" />
      </svg>
    );
  },
);

export const MCA = /* @__PURE__ */ createIcon(MCASvg , 'MCA');
