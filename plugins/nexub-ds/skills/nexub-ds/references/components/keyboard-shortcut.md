# Keyboard Shortcut

A key combination as `Kbd` keys joined by plus signs, read as one label.

- Package: `@nexub/react` · Category: Inline Primitives · Status: stable
- Import: `import { KeyboardShortcut } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/keyboard-shortcut

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `keys` | `string[]` |  | The keys in order, e.g. `['⌘', 'K']`. Read as "⌘+K" (`aria-label`); pass your own `aria-label` for a spoken form like "Command K". |

## Example: Default

```tsx
import { KeyboardShortcut } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <KeyboardShortcut keys={['⌘', 'K']} aria-label="Command K" />
      <KeyboardShortcut keys={['Ctrl', 'Shift', 'P']} />
    </div>
  );
}
```

## Example: In a menu

```tsx
import { KeyboardShortcut, Text } from '@nexub/react';

const rows = [
  { label: 'Search', keys: ['⌘', 'K'], spoken: 'Command K' },
  { label: 'New project', keys: ['⌘', 'N'], spoken: 'Command N' },
  { label: 'Save', keys: ['⌘', 'S'], spoken: 'Command S' },
];

export default function Example() {
  return (
    <ul className="flex w-[260px] flex-col gap-2">
      {rows.map((r) => (
        <li key={r.label} className="flex items-center justify-between">
          <Text size="body-sm">{r.label}</Text>
          <KeyboardShortcut keys={r.keys} aria-label={r.spoken} />
        </li>
      ))}
    </ul>
  );
}
```

Related: [kbd](kbd.md), [command-palette](command-palette.md)
