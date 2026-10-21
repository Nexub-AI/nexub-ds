import * as React from 'react';
import * as RadixRadioGroup from '@radix-ui/react-radio-group';
import { cn } from '../../utils/cn.js';
import {
  SelectableCardContent,
  selectableCardClass,
  useCardIds,
  type SelectableCardContentProps,
} from './selectableCard.js';

const columnsClass = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
} as const;

export interface RadioCardGroupProps extends RadixRadioGroup.RadioGroupProps {
  /** Grid columns (collapses to one column on narrow screens). */
  columns?: 1 | 2 | 3 | 4;
}

export const RadioCardGroup = React.forwardRef<HTMLDivElement, RadioCardGroupProps>(
  ({ className, columns = 1, ...props }, ref) => (
    <RadixRadioGroup.Root
      ref={ref}
      className={cn('grid gap-3', columnsClass[columns], className)}
      {...props}
    />
  ),
);
RadioCardGroup.displayName = 'RadioCardGroup';

export interface RadioCardProps
  extends Omit<RadixRadioGroup.RadioGroupItemProps, 'title' | 'children'>,
    SelectableCardContentProps {}

export const RadioCard = React.forwardRef<HTMLButtonElement, RadioCardProps>(
  ({ className, icon, title, description, children, ...props }, ref) => {
    const ids = useCardIds(description != null);
    return (
      <RadixRadioGroup.Item
        ref={ref}
        aria-labelledby={ids.titleId}
        aria-describedby={ids.describedBy}
        className={cn(selectableCardClass, className)}
        {...props}
      >
        <SelectableCardContent
          icon={icon}
          title={title}
          description={description}
          titleId={ids.titleId}
          descriptionId={ids.descriptionId}
          shape="circle"
        >
          {children}
        </SelectableCardContent>
      </RadixRadioGroup.Item>
    );
  },
);
RadioCard.displayName = 'RadioCard';
