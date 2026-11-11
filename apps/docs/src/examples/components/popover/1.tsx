import { Popover, Button, Text } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex gap-3 flex-wrap items-center justify-center">
      {(['top', 'right', 'bottom', 'left'] as const).map((s) => (
        <Popover.Root key={s}>
          <Popover.Trigger asChild>
            <Button variant="text" size="sm">{s}</Button>
          </Popover.Trigger>
          <Popover.Content side={s}>
            <Text size="body-sm">Opens {s}</Text>
          </Popover.Content>
        </Popover.Root>
      ))}
    </div>
  );
}
