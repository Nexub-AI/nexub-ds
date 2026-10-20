import * as React from 'react';
import { Combobox } from '../Combobox/Combobox.js';

export interface AutocompleteOption {
  value: string;
  label: string;
}

export interface AutocompleteProps {
  options: AutocompleteOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  loading?: boolean;
  className?: string;
}

export function Autocomplete({
  options,
  value,
  onValueChange,
  placeholder = 'Search\u2026',
  emptyText = 'No results found.',
  loading = false,
  className,
}: AutocompleteProps) {
  const selectedLabel = options.find((o) => o.value === value)?.label ?? '';
  // Input text. Follows the selected option's label when `value` changes from
  // outside (adjusted during render, not in an effect).
  const [search, setSearch] = React.useState(selectedLabel);
  const [prevValue, setPrevValue] = React.useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    setSearch(selectedLabel);
  }

  return (
    <Combobox.Root className={className}>
      <Combobox.Input placeholder={placeholder} value={search} onValueChange={setSearch} />
      <Combobox.List>
        {loading ? (
          <div className="py-6 text-center text-sm text-[var(--color-on-surface-muted)]">Loading…</div>
        ) : (
          <>
            <Combobox.Empty>{emptyText}</Combobox.Empty>
            {options.map((opt) => (
              <Combobox.Item
                key={opt.value}
                // cmdk filters on `value`, so match the visible label (id as keyword).
                value={opt.label}
                keywords={[opt.value]}
                onSelect={() => {
                  onValueChange?.(opt.value);
                  setSearch(opt.label);
                }}
              >
                {opt.label}
              </Combobox.Item>
            ))}
          </>
        )}
      </Combobox.List>
    </Combobox.Root>
  );
}

Autocomplete.displayName = 'Autocomplete';
