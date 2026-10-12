import * as React from 'react';
import * as RadixSlider from '@radix-ui/react-slider';
import { cn } from '../../utils/cn.js';

export interface SliderProps extends RadixSlider.SliderProps {
  /** Accessible name per thumb (e.g. ['Minimum', 'Maximum']). Falls back to `aria-label`. */
  thumbLabels?: string[];
}

export const Slider = React.forwardRef<HTMLSpanElement, SliderProps>(
  ({ className, thumbLabels, 'aria-label': ariaLabel, ...props }, ref) => {
    // Thumb count only — keyed by index so a thumb never remounts while dragging.
    const count = (props.value ?? props.defaultValue ?? [0]).length;
    return (
      <RadixSlider.Root
        ref={ref}
        className={cn('relative flex w-full touch-none select-none items-center', className)}
        {...props}
      >
        <RadixSlider.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-[var(--color-bg-muted)]">
          <RadixSlider.Range className="absolute h-full bg-[var(--color-fill-primary)]" />
        </RadixSlider.Track>
        {Array.from({ length: count }, (_, i) => (
          <RadixSlider.Thumb
            key={i}
            aria-label={thumbLabels?.[i] ?? ariaLabel}
            className="block h-5 w-5 rounded-full border-2 border-[var(--color-fill-primary)] bg-[var(--color-bg-default)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring-default)] focus-visible:ring-offset-2 ring-offset-[var(--color-ring-offset)] disabled:pointer-events-none disabled:opacity-50"
          />
        ))}
      </RadixSlider.Root>
    );
  },
);
Slider.displayName = 'Slider';
