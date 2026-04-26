import * as React from 'react';
import * as RadixSlider from '@radix-ui/react-slider';
import { cn } from '../../utils/cn.js';

export interface SliderProps extends RadixSlider.SliderProps {}

export const Slider = React.forwardRef<HTMLSpanElement, SliderProps>(
  ({ className, ...props }, ref) => (
    <RadixSlider.Root
      ref={ref}
      className={cn('relative flex w-full touch-none select-none items-center', className)}
      {...props}
    >
      <RadixSlider.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-[var(--color-bg-muted)]">
        <RadixSlider.Range className="absolute h-full bg-[var(--color-brand-primary-500)]" />
      </RadixSlider.Track>
      {(props.defaultValue ?? props.value ?? [0]).map((val, i) => (
        <RadixSlider.Thumb
          key={`thumb-${i}-${val}`}
          className="block h-5 w-5 rounded-full border-2 border-[var(--color-brand-primary-500)] bg-[var(--color-bg-default)] ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring-default)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </RadixSlider.Root>
  ),
);
Slider.displayName = 'Slider';
