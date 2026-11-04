import { Flex, Badge } from '@nexub/react';

export default function Example() {
  return (
    <Flex gap="sm" wrap className="max-w-[260px]">
      {['React', 'TypeScript', 'Tailwind', 'Radix UI', 'Storybook'].map((t) => (
        <Badge key={t} tone="info">{t}</Badge>
      ))}
    </Flex>
  );
}
