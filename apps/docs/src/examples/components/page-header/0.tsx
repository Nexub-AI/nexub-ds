import { Button, PageHeader } from '@nexub/react';

export default function Example() {
  return (
    <PageHeader
      className="w-full"
      level={2}
      title="Projects"
      description="Everything your team is working on."
      actions={<><Button variant="outlined">Import</Button><Button>New project</Button></>}
    />
  );
}
