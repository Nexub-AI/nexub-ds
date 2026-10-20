import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';
import { useControllableState } from '../../hooks/useControllableState.js';

export const ratingVariants = cva('inline-flex items-center gap-0.5', {
  variants: {
    size: {
      sm: '[&_svg]:h-4 [&_svg]:w-4',
      md: '[&_svg]:h-5 [&_svg]:w-5',
      lg: '[&_svg]:h-7 [&_svg]:w-7',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export interface RatingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof ratingVariants> {
  value?: number;
  max?: number;
  readOnly?: boolean;
  onValueChange?: (value: number) => void;
}

export const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      className,
      size,
      value: controlledValue,
      max = 5,
      readOnly = false,
      onValueChange,
      ...props
    },
    ref,
  ) => {
    const [value, setValue] = useControllableState({
      value: controlledValue,
      defaultValue: 0,
      onChange: onValueChange,
    });
    const [hovered, setHovered] = React.useState<number | null>(null);

    const displayValue = hovered ?? value ?? 0;
    const starRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
    // Radio-group pattern: one tab stop (the checked star, else the first).
    const tabStop = value && value > 0 ? value : 1;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, starValue: number) => {
      const next =
        e.key === 'ArrowRight' || e.key === 'ArrowUp' ? Math.min(max, starValue + 1) :
        e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? Math.max(1, starValue - 1) :
        e.key === 'Home' ? 1 :
        e.key === 'End' ? max : null;
      if (next === null) return;
      e.preventDefault();
      setValue(next);
      starRefs.current[next - 1]?.focus();
    };

    return (
      <div
        ref={ref}
        className={cn(ratingVariants({ size }), className)}
        role="radiogroup"
        aria-label="Rating"
        aria-readonly={readOnly || undefined}
        {...props}
      >
        {Array.from({ length: max }, (_, i) => {
          const starValue = i + 1;
          const filled = starValue <= displayValue;

          return (
            <button
              key={starValue}
              ref={(el) => { starRefs.current[i] = el; }}
              type="button"
              role="radio"
              tabIndex={starValue === tabStop ? 0 : -1}
              aria-checked={starValue === (value ?? 0)}
              aria-label={`${starValue} star${starValue !== 1 ? 's' : ''}`}
              disabled={readOnly}
              onClick={() => !readOnly && setValue(starValue)}
              onKeyDown={(e) => !readOnly && handleKeyDown(e, starValue)}
              onMouseEnter={() => !readOnly && setHovered(starValue)}
              onMouseLeave={() => !readOnly && setHovered(null)}
              className={cn(
                'bg-transparent border-0 p-0 m-0 inline-flex items-center justify-center transition-transform',
                !readOnly && 'cursor-pointer hover:scale-110',
                readOnly && 'cursor-default',
                'rounded-shape-min',
                'disabled:pointer-events-none',
              )}
            >
              <StarIcon
                filled={filled}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>
    );
  },
);

Rating.displayName = 'Rating';

function StarIcon({ filled, ...props }: { filled: boolean } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill={filled ? 'var(--color-palette-warning-72)' : 'none'}
      stroke={filled ? 'var(--color-warning)' : 'var(--color-outline-variant)'}
      strokeWidth="1.5"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        strokeLinejoin="round"
        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
      />
    </svg>
  );
}
