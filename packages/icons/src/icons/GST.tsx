import { forwardRef, type SVGProps } from 'react';
import { createIcon } from '../createIcon.js';

const GSTSvg = /* @__PURE__ */ forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  function GSTSvg({ width = 24, height = 24, strokeWidth = 1.75, ...props }, ref) {
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
        {/* GST / invoice glyph — receipt with % tax symbol */}
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M9 13h1" />
        <path d="M15 13h-1" />
        <path d="M9 17h6" />
        <circle cx="10" cy="11" r="1" />
        <circle cx="14" cy="15" r="1" />
        <path d="m10 15 4-4" />
      </svg>
    );
  },
);

export const GST = /* @__PURE__ */ createIcon(GSTSvg , 'GST');
