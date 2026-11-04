import { Text } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-col gap-1.5 items-start">
      <Text size="body-lg">Body Large — spacious reading.</Text>
      <Text size="body">Body — default paragraph.</Text>
      <Text size="body-sm">Body Small — compact content.</Text>
      <Text size="caption">Caption — supporting info.</Text>
    </div>
  );
}
