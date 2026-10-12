import { forwardRef, type SVGProps } from 'react';
import { createIcon } from '../createIcon.js';

const BookubMarkSvg = /* @__PURE__ */ forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  function BookubMarkSvg({ width = 24, height = 24, strokeWidth = 1.75, ...props }, ref) {
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
        {/* Accounting glyph — open ledger book */}
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <path d="M8 10h8" />
        <path d="M8 14h6" />
      </svg>
    );
  },
);

export const BookubMark = /* @__PURE__ */ createIcon(BookubMarkSvg , 'BookubMark');
