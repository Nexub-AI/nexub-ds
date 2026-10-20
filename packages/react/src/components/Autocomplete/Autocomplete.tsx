import * as React from 'react';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';
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
  placeholder,
  emptyText,
  loading = false,
  className,
}: AutocompleteProps) {
  const messages = useNexubMessages();
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
      <Combobox.Input placeholder={placeholder ?? messages.searchPlaceholder} value={search} onValueChange={setSearch} />
      <Combobox.List>
        {loading ? (
          <div className="py-6 text-center text-sm text-[var(--color-on-surface-muted)]">{messages.loading}</div>
        ) : (
          <>
            <Combobox.Empty>{emptyText ?? messages.noResults}</Combobox.Empty>
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
