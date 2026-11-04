import { Tag } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex gap-2 flex-wrap items-center justify-center">
      <Tag>Frontend</Tag>
      <Tag tone="info">Backend</Tag>
      <Tag tone="success">Deployed</Tag>
      <Tag tone="warning">Review</Tag>
      <Tag tone="danger">Blocked</Tag>
    </div>
  );
}
