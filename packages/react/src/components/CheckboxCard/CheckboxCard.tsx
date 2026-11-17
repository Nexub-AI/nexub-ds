'use client';

import * as React from 'react';
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import { cn } from '../../utils/cn.js';
import {
  SelectableCardContent,
  selectableCardClass,
  useCardIds,
  type SelectableCardContentProps,
  type SelectableCardStateProps,
} from '../RadioCard/selectableCard.js';

export interface CheckboxCardProps
  extends Omit<RadixCheckbox.CheckboxProps, 'title' | 'children' | 'checked' | 'defaultChecked' | 'onCheckedChange'>,
    SelectableCardContentProps,
    SelectableCardStateProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const CheckboxCard = React.forwardRef<HTMLButtonElement, CheckboxCardProps>(
  ({ className, icon, title, description, children, onCheckedChange, invalid, readOnly, onClick, ...props }, ref) => {
    const ids = useCardIds(description != null);
    return (
      <RadixCheckbox.Root
        ref={ref}
        aria-labelledby={ids.titleId}
        aria-describedby={ids.describedBy}
        data-selectable-card=""
        className={cn(selectableCardClass, readOnly && 'cursor-default', className)}
        onCheckedChange={onCheckedChange ? (c) => onCheckedChange(c === true) : undefined}
        onClick={(e) => {
          onClick?.(e);
          // Radix skips its toggle when the click is default-prevented.
          if (readOnly) e.preventDefault();
        }}
        {...props}
        aria-invalid={invalid || props['aria-invalid']}
        aria-readonly={readOnly || undefined}
      >
        <SelectableCardContent
          icon={icon}
          title={title}
          description={description}
          titleId={ids.titleId}
          descriptionId={ids.descriptionId}
          shape="square"
        >
          {children}
        </SelectableCardContent>
      </RadixCheckbox.Root>
    );
  },
);
CheckboxCard.displayName = 'CheckboxCard';
