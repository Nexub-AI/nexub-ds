# App Shell

Full-height application frame: a header row over a body with a sidebar slot and a scrolling main region.

- Package: `@nexub/react` · Category: Layout · Status: stable
- Import: `import { AppShell } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/app-shell

## When to use

- The outer frame of a product or dashboard: header, side navigation, content

## When not to use

- Marketing or content pages: use `Section` and `Container`
- A single panel inside a page: use `Grid` or `Flex`

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `AppShell.Root` | `compound` |  | Viewport-height grid (`h-screen`): header row, then the body. Override the height with `className` when it is not the whole page. |
| `AppShell.Header` | `compound` |  | First row, e.g. a `TopNav.Root`. |
| `AppShell.Body` | `compound` |  | Second row: lays out the sidebar and main side by side. |
| `AppShell.Sidebar` | `compound` |  | Fixed-width column that scrolls on its own, e.g. a `Sidebar.Root`. |
| `AppShell.Main` | `compound` |  | The `<main>` landmark: takes the remaining width, scrolls on its own, padded by default. |
| `...props` | `React.HTMLAttributes<HTMLDivElement>` |  | Every part forwards its ref and HTML attributes. |

## Example: Header, sidebar and main

```tsx
import { AppShell, Logo, Sidebar, Text, TopNav } from '@nexub/react';
import { BarChart3, Home, Settings } from '@nexub/icons';

export default function Example() {
  return (
    <AppShell.Root className="h-[360px] w-full rounded-shape-container border border-[var(--color-outline-variant)]">
      <AppShell.Header>
        <TopNav.Root className="static">
          <TopNav.Logo><Logo size="sm" /></TopNav.Logo>
        </TopNav.Root>
      </AppShell.Header>
      <AppShell.Body>
        <AppShell.Sidebar>
          <Sidebar.Root aria-label="Workspace">
            <Sidebar.Group>
              <Sidebar.Item href="#" icon={<Home size="sm" />} active>Overview</Sidebar.Item>
              <Sidebar.Item href="#" icon={<BarChart3 size="sm" />}>Reports</Sidebar.Item>
              <Sidebar.Item href="#" icon={<Settings size="sm" />}>Settings</Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Root>
        </AppShell.Sidebar>
        <AppShell.Main>
          <Text size="body-sm" tone="muted">Page content scrolls here, under a fixed header and sidebar.</Text>
        </AppShell.Main>
      </AppShell.Body>
    </AppShell.Root>
  );
}
```

Related: [top-nav](top-nav.md), [sidebar](sidebar.md), [page-header](page-header.md)
