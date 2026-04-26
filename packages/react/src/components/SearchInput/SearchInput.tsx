import * as React from 'react';
import { Search, X } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { Input, type InputProps } from '../Input/Input.js';

export interface SearchInputProps extends Omit<InputProps, 'leadingIcon' | 'trailingIcon'> {
  onClear?: () => void;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, defaultValue: _defaultValue, onChange, onClear, className, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState<string>(
      ((_defaultValue as string | undefined) ?? ''),
    );

    const controlled = value !== undefined;
    const currentValue = controlled ? String(value) : internalValue;
    const hasValue = currentValue.length > 0;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!controlled) setInternalValue(e.target.value);
      onChange?.(e);
    };

    const handleClear = () => {
      if (!controlled) setInternalValue('');
      onClear?.();
    };

    const clearButton = hasValue ? (
      <button
        type="button"
        onClick={handleClear}
        aria-label="Clear search"
        className={cn(
          'shrink-0 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ring-default)] rounded',
        )}
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    ) : null;

    return (
      <Input
        ref={ref}
        type="search"
        value={controlled ? value : internalValue}
        onChange={handleChange}
        className={className}
        leadingIcon={<Search className="h-4 w-4" aria-hidden="true" />}
        trailingIcon={clearButton ?? undefined}
        {...props}
      />
    );
  },
);

SearchInput.displayName = 'SearchInput';
