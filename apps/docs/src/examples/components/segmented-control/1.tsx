import { SegmentedControl } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-col gap-3 items-start">
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <SegmentedControl.Root key={s} size={s} defaultValue="a">
          <SegmentedControl.Item value="a">A</SegmentedControl.Item>
          <SegmentedControl.Item value="b">B</SegmentedControl.Item>
          <SegmentedControl.Item value="c">C</SegmentedControl.Item>
        </SegmentedControl.Root>
      ))}
    </div>
  );
}
