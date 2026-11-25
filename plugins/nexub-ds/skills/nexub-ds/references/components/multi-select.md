# Multi Select

Pick several options as chips, with search, "+N more" and an optional create option.

- Package: `@nexub/react` · Category: Form Controls · Status: stable
- Import: `import { MultiSelect } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/multi-select

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `options` (required) | `{ value: string; label: string }[]` |  | The options to pick from. |
| `value / defaultValue` | `string[]` |  | Selected values, controlled or not. |
| `onValueChange` | `(value: string[]) => void` |  | Called with the new selection. |
| `maxVisibleChips` | `number` | `3` | Chips shown before the rest collapse into "+N more". |
| `onInputChange` | `(text: string) => void` |  | Called as the user types. When set, options are shown as given, so you can fetch them. |
| `onCreate` | `(text: string) => void` |  | Adds a "Create “text”" option when the text matches no option. |
| `loading` | `boolean` |  | Skeleton rows instead of options; "Loading" is announced. |
| `aria-label / aria-labelledby` | `string` |  | Name the field: there is no visible label inside it. |
| `onSearch` | `(text: string) => void` |  | 11.2: async search (same as `onInputChange`); picked values keep their labels and avatars. |
| `options[].description / disabled / avatar` | `string / boolean / ReactNode` |  | 11.2: a second line (also searched), options that can't be picked, and an avatar in the list and on the chip. |

## Example: Labels with create

```tsx
'use client';

import * as React from 'react';
import { MultiSelect } from '@nexub/react';

const labels = [
  { value: 'bug', label: 'Bug' },
  { value: 'design', label: 'Design' },
  { value: 'docs', label: 'Docs' },
  { value: 'perf', label: 'Performance' },
  { value: 'a11y', label: 'Accessibility' },
  { value: 'security', label: 'Security' },
];

export default function Example() {
  const [options, setOptions] = React.useState(labels);
  const [value, setValue] = React.useState(['bug', 'a11y']);
  return (
    <div className="w-80">
      <MultiSelect
        aria-label="Labels"
        placeholder="Add labels…"
        options={options}
        value={value}
        onValueChange={setValue}
        onCreate={(text) => {
          const v = text.toLowerCase();
          setOptions((o) => [...o, { value: v, label: text }]);
          setValue((s) => [...s, v]);
        }}
      />
    </div>
  );
}
```

## Example: People with server search

```tsx
import * as React from 'react';
import { Avatar, MultiSelect, type MultiSelectOption } from '@nexub/react';

const all: MultiSelectOption[] = [
  { value: 'u1', label: 'Aisha Rahman', description: 'Finance' },
  { value: 'u2', label: 'Ben Ong', description: 'Sales' },
  { value: 'u3', label: 'Chen Wei', description: 'On leave', disabled: true },
  { value: 'u4', label: 'Dana Lee', description: 'Product' },
  { value: 'u5', label: 'Eli Tan', description: 'Support' },
].map((p) => ({ ...p, avatar: <Avatar size="xs" name={p.label} /> }));

export default function Example() {
  const [value, setValue] = React.useState<string[]>(['u1']);
  const [options, setOptions] = React.useState(all);
  const [loading, setLoading] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  return (
    <div className="w-full max-w-md">
      <MultiSelect
        aria-label="Reviewers"
        options={options}
        value={value}
        onValueChange={setValue}
        loading={loading}
        onSearch={(text) => {
          clearTimeout(timer.current);
          setLoading(true);
          timer.current = setTimeout(() => {
            const q = text.toLowerCase();
            setOptions(all.filter((p) => p.label.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)));
            setLoading(false);
          }, 300);
        }}
      />
    </div>
  );
}
```

## Accessibility

- `Type`: Filters the options and opens the list.
- `ArrowDown / ArrowUp`: Moves through the options.
- `Enter`: Toggles the highlighted option.
- `Backspace`: In an empty field, removes the last chip.
- `Escape`: Closes the list.
- Options carry `aria-checked`; each chip has a "Remove <label>" button.

Related: [autocomplete](autocomplete.md), [chip](chip.md), [select](select.md)
