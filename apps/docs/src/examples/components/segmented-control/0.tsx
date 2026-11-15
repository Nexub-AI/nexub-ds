'use client'; // docs preview: server pages import every example

import { SegmentedControl } from '@nexub/react';

export default function Example() {
  return (
    <SegmentedControl.Root defaultValue="month">
      <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
      <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
      <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
    </SegmentedControl.Root>
  );
}
