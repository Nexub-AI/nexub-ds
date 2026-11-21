# Autocomplete

Type-to-search input with matching options dropdown.

- Package: `@nexub/react` · Category: Form Controls · Status: stable
- Import: `import { Autocomplete } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/autocomplete

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `options` (required) | `{ value: string; label: string }[]` |  | Array of options available for selection. |
| `value` | `string` |  | The controlled selected value. |
| `onValueChange` | `(value: string) => void` |  | Callback fired when the selected value changes. |
| `placeholder` | `string` |  | Placeholder text shown in the input when empty. |
| `emptyText` | `string` |  | Text shown when no options match the current search query. |
| `loading` | `boolean` |  | Skeleton rows while options are being fetched (5.2); "Loading" is announced. |
| `inputValue` | `string` |  | Controlled input text (5.1). |
| `onInputChange` | `(text: string) => void` |  | Called as the user types, so you can fetch options (5.1). When set, options are shown as given, without built-in filtering. |
| `onCreate` | `(text: string) => void` |  | Adds a "Create “text”" option when the text matches no option (5.2). |
| `aria-label` | `string` |  | Accessible name of the field when it has no visible label. |
| `label` | `ReactNode` |  | 11.2: a visible label above the field. |
| `clearOnSelect` | `boolean` |  | 11.2: "add" mode: the text empties after a pick. |
| `onClear` | `() => void` |  | 11.2: called from the clear button or when the text is deleted; shows the clear button. |
| `options[].description / disabled` | `string / boolean` |  | 11.2: a second line (also searched), and options that can't be picked. |

## Example: Default

```tsx
import { Autocomplete } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-65">
      <Autocomplete
        options={[
          { value: 'react', label: 'React' },
          { value: 'vue', label: 'Vue' },
          { value: 'angular', label: 'Angular' },
          { value: 'svelte', label: 'Svelte' },
        ]}
        placeholder="Search framework…"
      />
    </div>
  );
}
```

## Example: With loading state

```tsx
import { Autocomplete } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-65">
      <Autocomplete options={[]} loading placeholder="Type to see the loading state" />
    </div>
  );
}
```

## Example: Custom empty text

```tsx
import { Autocomplete } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-65">
      <Autocomplete
        options={[
          { value: 'nexub', label: 'Nexub' },
          { value: 'acme', label: 'Acme Corp' },
        ]}
        placeholder="Search company…"
        emptyText="No companies found. Try a different search."
      />
    </div>
  );
}
```

## Example: Fetch as you type

`onInputChange`: the app filters, the list shows skeleton rows while loading.

```tsx
'use client';

import * as React from 'react';
import { Autocomplete } from '@nexub/react';

const all = ['Amsterdam', 'Berlin', 'Lisbon', 'London', 'Madrid', 'Paris', 'Singapore', 'Tokyo'];

// Fetch-as-you-type: onInputChange turns built-in filtering off.
export default function Example() {
  const [query, setQuery] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [options, setOptions] = React.useState(all.map((c) => ({ value: c, label: c })));
  React.useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      const q = query.toLowerCase();
      setOptions(all.filter((c) => c.toLowerCase().includes(q)).map((c) => ({ value: c, label: c })));
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [query]);
  return (
    <div className="w-70">
      <Autocomplete
        aria-label="City"
        placeholder="Search cities…"
        options={options}
        loading={loading}
        onInputChange={setQuery}
      />
    </div>
  );
}
```

## Example: Add mode with a label

```tsx
import * as React from 'react';
import { Autocomplete } from '@nexub/react';

const people = [
  { value: 'u1', label: 'Aisha Rahman', description: 'aisha@nexub.test' },
  { value: 'u2', label: 'Ben Ong', description: 'ben@nexub.test' },
  { value: 'u3', label: 'Chen Wei', description: 'On leave', disabled: true },
  { value: 'u4', label: 'Dana Lee', description: 'dana@nexub.test' },
];

export default function Example() {
  const [added, setAdded] = React.useState<string[]>([]);
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Autocomplete
        label="Add a reviewer"
        clearOnSelect
        options={people.filter((p) => !added.includes(p.value))}
        onValueChange={(v) => setAdded((a) => [...a, v])}
      />
      <p className="text-body-sm text-on-surface-muted">
        Reviewers: {added.map((v) => people.find((p) => p.value === v)?.label).join(', ') || '—'}
      </p>
    </div>
  );
}
```
