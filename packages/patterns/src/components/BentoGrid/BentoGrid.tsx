import * as React from 'react';
import { Card, cn, type CardProps } from '@nexub/react';

export interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * A bento grid that responds to its *own* width (container query): 1 column,
 * 2 at 480px, 4 at 768px. Dense packing back-fills gaps left by large tiles.
 */
export const BentoGrid = React.forwardRef<HTMLDivElement, BentoGridProps>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn('[container-type:inline-size]', className)} {...props}>
    <div className="grid grid-flow-row-dense auto-rows-[minmax(10rem,auto)] grid-cols-1 gap-4 [@container(min-width:480px)]:grid-cols-2 [@container(min-width:768px)]:grid-cols-4">
      {children}
    </div>
  </div>
));
BentoGrid.displayName = 'BentoGrid';

export type BentoTileSize = '1x1' | '2x1' | '1x2' | '2x2';

// Columns × rows. Two-wide spans only apply from 2 columns up.
const sizes: Record<BentoTileSize, string> = {
  '1x1': '',
  '2x1': '[@container(min-width:480px)]:col-span-2',
  '1x2': 'row-span-2',
  '2x2': '[@container(min-width:480px)]:col-span-2 row-span-2',
};

export interface BentoTileProps extends Omit<CardProps, 'variant'> {
  /** @default '1x1' */
  size?: BentoTileSize;
}

/** A Card-styled cell of a BentoGrid. */
export const BentoTile = React.forwardRef<HTMLDivElement, BentoTileProps>(
  ({ size = '1x1', className, ...props }, ref) => (
    <Card ref={ref} variant="surface" className={cn('min-w-0 p-4', sizes[size], className)} data-size={size} {...props} />
  ),
);
BentoTile.displayName = 'BentoTile';
