import { forwardRef, type SVGProps } from 'react';
import { createIcon, type IconComponent } from '../createIcon.js';

const IRASSvg = /* @__PURE__ */ forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  function IRASSvg({ width = 24, height = 24, strokeWidth = 1.75, ...props }, ref) {
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
        {/* Singapore tax authority glyph — tax receipt */}
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M9 7h6" />
        <path d="M9 11h6" />
        <path d="M9 15h4" />
        <circle cx="16" cy="17" r="2" />
      </svg>
    );
  },
);

export const IRAS = /* @__PURE__ */ createIcon(IRASSvg , 'IRAS');
