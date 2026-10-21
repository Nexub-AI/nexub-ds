import * as React from 'react';
import { ChevronDown } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { Button, type ButtonProps } from '../Button/Button.js';
import { ButtonGroup } from '../ButtonGroup/ButtonGroup.js';
import { DropdownMenu } from '../DropdownMenu/DropdownMenu.js';

export interface SplitButtonProps extends Omit<ButtonProps, 'asChild' | 'trailingIcon' | 'fullWidth'> {
  /** Accessible name of the menu toggle, e.g. "More save options". */
  menuLabel: string;
  /** `DropdownMenu.Item`s for the secondary actions. */
  menu: React.ReactNode;
  /** Menu alignment against the toggle. @default 'end' */
  align?: 'start' | 'end';
}

/**
 * A primary action with related secondary actions behind a chevron, as one
 * connected control (M3 Expressive split button). The ref goes to the primary button.
 */
export const SplitButton = React.forwardRef<HTMLButtonElement, SplitButtonProps>(
  ({ menuLabel, menu, align = 'end', variant, size, tone, disabled, loading, className, ...props }, ref) => {
    const shared = { variant, size, tone };
    const busy = loading || props.status === 'loading';
    return (
      <ButtonGroup attached className={className}>
        {/* Loading uses aria-disabled (Button), so the focused primary keeps focus. */}
        <Button ref={ref} {...shared} disabled={disabled} {...(loading ? { loading: true } : {})} {...props} />
        {/* modal={false}: Radix's modal menu injects a <style> scroll lock (strict CSP). */}
        <DropdownMenu.Root modal={false}>
          <DropdownMenu.Trigger asChild>
            <Button
              {...shared}
              disabled={disabled || busy}
              aria-label={menuLabel}
              className={cn(
                'px-3',
                // The chevron flips while the menu is open.
                '[&[data-state=open]>svg]:rotate-180 [&>svg]:transition-transform [&>svg]:duration-spatial-fast [&>svg]:ease-spatial-fast',
              )}
            >
              <ChevronDown size="sm" aria-hidden="true" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align={align}>{menu}</DropdownMenu.Content>
        </DropdownMenu.Root>
      </ButtonGroup>
    );
  },
);
SplitButton.displayName = 'SplitButton';
