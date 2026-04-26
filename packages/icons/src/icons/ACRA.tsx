import { forwardRef, type SVGProps } from 'react';
import { createIcon, type IconComponent } from '../createIcon.js';

const ACRASvg = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  function ACRASvg({ width = 24, height = 24, strokeWidth = 1.75, ...props }, ref) {
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
        {/* Singapore regulator — shield with SG lion motif placeholder */}
        <path d="M12 2L4 6v6c0 5.25 3.5 9.74 8 11 4.5-1.26 8-5.75 8-11V6l-8-4z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    );
  },
);

export const ACRA = createIcon(ACRASvg , 'ACRA');
