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
