import { Stack, Separator, Text } from '@nexub/react';

export default function Example() {
  return (
    <Stack gap="md" divider={<Separator />} className="w-[220px]">
      <Text size="body-sm">First item</Text>
      <Text size="body-sm">Second item</Text>
      <Text size="body-sm">Third item</Text>
    </Stack>
  );
}
