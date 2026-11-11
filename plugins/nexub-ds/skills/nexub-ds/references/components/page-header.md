# Page Header

The top of a page: title, description, breadcrumb and actions.

- Package: `@nexub/react` · Category: Layout · Status: stable
- Import: `import { PageHeader } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/page-header

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` |  | The page title. Truncates on one line. |
| `description` | `ReactNode` |  | A line under the title. |
| `actions` | `ReactNode` |  | Buttons on the end side; they wrap under the title on narrow screens. |
| `breadcrumb` | `ReactNode` |  | A `Breadcrumb` above the title. |
| `level` | `1 \| 2 \| 3` |  | Heading level of the title. Use 2 or 3 when the page already has an h1. |

## Example: Default

```tsx
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
```

## Example: With breadcrumb

```tsx
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
```

Related: [breadcrumb](breadcrumb.md), [app-shell](app-shell.md), [heading](heading.md)
