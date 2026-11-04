import { Collapse, Text } from '@nexub/react';

export default function Example() {
  return (
    <Collapse in>
      <div className="p-4 bg-[var(--color-surface-container-low)] rounded-shape-field">
        <Text size="body-sm">Collapsed content goes here.</Text>
      </div>
    </Collapse>
  );
}
