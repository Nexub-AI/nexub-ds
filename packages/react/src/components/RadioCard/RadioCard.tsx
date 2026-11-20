'use client';

import * as React from 'react';
import * as RadixRadioGroup from '@radix-ui/react-radio-group';
import { cn } from '../../utils/cn.js';
import {
  SelectableCardContent,
  selectableCardClass,
  useCardIds,
  type SelectableCardContentProps,
  type SelectableCardStateProps,
} from './selectableCard.js';
import { RadioGroupContext } from '../RadioGroup/RadioGroup.js';

const columnsClass = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 @xl:grid-cols-2',
  3: 'grid-cols-1 @xl:grid-cols-3',
  4: 'grid-cols-1 @xl:grid-cols-2 @[60rem]:grid-cols-4',
} as const;

export interface RadioCardGroupProps extends RadixRadioGroup.RadioGroupProps, SelectableCardStateProps {
  /** Grid columns (collapses to one column where the group itself is narrow). */
  columns?: 1 | 2 | 3 | 4;
}

export const RadioCardGroup = React.forwardRef<HTMLDivElement, RadioCardGroupProps>(
  ({ className, columns = 1, invalid, readOnly, ...props }, ref) => {
    const ctx = React.useMemo(() => ({ invalid, readOnly }), [invalid, readOnly]);
    const group = (
      <RadixRadioGroup.Root
        ref={ref}
        className={cn('grid gap-3', columnsClass[columns], className)}
        {...props}
        aria-invalid={invalid || props['aria-invalid']}
        aria-readonly={readOnly || undefined}
      />
    );
    return (
      <RadioGroupContext.Provider value={ctx}>
        {/* 10.6: multi-column groups follow their own width. A grid cannot query itself, so a
            full-width block around it is the query container. */}
        {columns === 1 ? group : <div className="@container w-full">{group}</div>}
      </RadioGroupContext.Provider>
    );
  },
);
RadioCardGroup.displayName = 'RadioCardGroup';

export interface RadioCardProps
  extends Omit<RadixRadioGroup.RadioGroupItemProps, 'title' | 'children'>,
    SelectableCardContentProps,
    SelectableCardStateProps {}

export const RadioCard = React.forwardRef<HTMLButtonElement, RadioCardProps>(
  ({ className, icon, title, description, children, invalid: invalidProp, readOnly: readOnlyProp, onClick, ...props }, ref) => {
    const ids = useCardIds(description != null);
    const group = React.useContext(RadioGroupContext);
    const invalid = invalidProp ?? group.invalid;
    const readOnly = readOnlyProp ?? group.readOnly;
    return (
      <RadixRadioGroup.Item
        ref={ref}
        aria-labelledby={ids.titleId}
        aria-describedby={ids.describedBy}
        // A card, not a small control: opt-in layers (vivid) must not paint it as one.
        data-selectable-card=""
        className={cn(selectableCardClass, readOnly && 'cursor-default', className)}
        onClick={(e) => {
          onClick?.(e);
          // Radix skips its select when the click is default-prevented.
          if (readOnly) e.preventDefault();
        }}
        {...props}
        aria-invalid={invalid || props['aria-invalid']}
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
