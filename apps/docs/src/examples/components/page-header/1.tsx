import { Breadcrumb, Button, PageHeader } from '@nexub/react';

export default function Example() {
  return (
    <PageHeader
      className="w-full"
      level={2}
      breadcrumb={
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item><Breadcrumb.Link href="#">Projects</Breadcrumb.Link></Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item><Breadcrumb.Page>Billing service</Breadcrumb.Page></Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      }
      title="Billing service"
      description="Updated 2 hours ago"
      actions={<Button variant="outlined">Settings</Button>}
    />
  );
}
