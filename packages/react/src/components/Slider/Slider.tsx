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
        className={cn('group relative flex h-control-sm w-full touch-none select-none items-center', className)}
        {...props}
      >
        <RadixSlider.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-[var(--color-surface-container-highest)]">
          <RadixSlider.Range className="absolute h-full bg-[var(--color-primary)] group-data-[disabled]:bg-[var(--color-text-disabled)]" />
        </RadixSlider.Track>
        {Array.from({ length: count }, (_, i) => (
          <RadixSlider.Thumb
            key={i}
            aria-label={thumbLabels?.[i] ?? ariaLabel}
            // Solid primary knob with a surface ring; the state-layer halo is wider than the knob.
            className={cn(
              'nx-state-layer block h-5 w-5 rounded-full border-2 border-[var(--color-surface-container-lowest)] bg-[var(--color-primary)] text-[var(--color-primary)] shadow-elevation-1',
              'before:-inset-2.5 cursor-grab active:cursor-grabbing',
              // Opaque disabled knob (text-disabled is translucent and would show the range through it).
              'group-data-[disabled]:pointer-events-none group-data-[disabled]:bg-[color-mix(in_srgb,var(--color-on-surface)_38%,var(--color-surface))]',
            )}
          />
        ))}
      </RadixSlider.Root>
    );
  },
);
Slider.displayName = 'Slider';
