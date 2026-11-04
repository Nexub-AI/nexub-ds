import { Heading } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-col gap-2 items-start">
      <Heading tone="info">Info tone</Heading>
      <Heading tone="success">Success tone</Heading>
      <Heading tone="warning">Warning tone</Heading>
      <Heading tone="danger">Danger tone</Heading>
    </div>
  );
}
