import { forwardRef, type SVGProps } from 'react';
import { createIcon, type IconComponent } from '../createIcon.js';

const PayubMarkSvg = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  function PayubMarkSvg({ width = 24, height = 24, strokeWidth = 1.75, ...props }, ref) {
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
        {/* Payroll glyph — payslip with currency symbol */}
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18" />
        <path d="M9 15h1.5a1.5 1.5 0 0 0 0-3H9v6" />
        <path d="M9 12v6" />
      </svg>
    );
  },
);

export const PayubMark = createIcon(PayubMarkSvg , 'PayubMark');
