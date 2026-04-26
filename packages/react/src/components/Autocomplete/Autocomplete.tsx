import * as React from 'react';
import { Combobox } from '../Combobox/Combobox.js';
import { cn } from '../../utils/cn.js';

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
  // Sync controlled `value` into internal search state so callers can
  // drive the input display from outside (controlled mode).
  const [search, setSearch] = React.useState(value ?? '');

  React.useEffect(() => {
    if (value !== undefined) setSearch(value);
  }, [value]);

  return (
    <Combobox.Root value={search} onValueChange={setSearch} className={className}>
      <Combobox.Input placeholder={placeholder} />
      <Combobox.List>
        {loading ? (
          <div className="py-6 text-center text-sm text-[var(--color-text-muted)]">Loading\u2026</div>
        ) : (
          <>
            <Combobox.Empty>{emptyText}</Combobox.Empty>
            {options.map((opt) => (
              <Combobox.Item
                key={opt.value}
                value={opt.value}
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
