# Multi Select

Pick several options as chips, with search, "+N more" and an optional create option.

- Package: `@nexub/react` · Category: Form Controls · Status: beta
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
    <div className="w-[320px]">
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

## Accessibility

- `Type`: Filters the options and opens the list.
- `ArrowDown / ArrowUp`: Moves through the options.
- `Enter`: Toggles the highlighted option.
- `Backspace`: In an empty field, removes the last chip.
- `Escape`: Closes the list.
- Options carry `aria-checked`; each chip has a "Remove <label>" button.

Related: [autocomplete](autocomplete.md), [chip](chip.md), [select](select.md)
