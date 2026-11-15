# Sidebar

Vertical app navigation: a header, grouped items with icons, and a pinned footer. Collapses to icons.

- Package: `@nexub/react` · Category: Navigation · Status: stable
- Import: `import { Sidebar } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/sidebar

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `collapsed` | `boolean` |  | Icon-only width. Labels stay for screen readers and show as a native tooltip. |
| `aria-label` | `string` |  | Name of the nav landmark. Defaults to the localised "Sidebar". |
| `SidebarHeader status` | `ReactNode` |  | Trailing element next to the logo (`Sidebar.Header` children), e.g. a `Badge`. Moves under the logo when they don’t fit. |
| `SidebarGroup label` | `string` |  | Heading above a group of items. |
| `SidebarItem icon` | `ReactNode` |  | Leading icon; the only thing shown when collapsed. |
| `SidebarItem active` | `boolean` |  | Marks the current page (`aria-current="page"`). |
| `SidebarItem asChild` | `boolean` |  | Use your router `<Link>` as the item; pass it as the only child. |
| `Sidebar.Separator / Footer` | `compound` |  | A divider, and a footer that stays pinned while the items scroll. |

## Example: Default

```tsx
import { Badge, Logo, Sidebar } from '@nexub/react';
import { BarChart3, Folder, Home, Settings, Users } from '@nexub/icons';

export default function Example() {
  return (
    <div className="h-[380px]">
      <Sidebar.Root aria-label="Workspace" className="rounded-shape-container">
        <Sidebar.Header status={<Badge variant="soft" size="sm">Beta</Badge>}>
          <Logo size="sm" />
        </Sidebar.Header>
        <Sidebar.Group>
          <Sidebar.Item href="#" icon={<Home size="sm" />} active>Overview</Sidebar.Item>
          <Sidebar.Item href="#" icon={<Folder size="sm" />}>Projects</Sidebar.Item>
          <Sidebar.Item href="#" icon={<BarChart3 size="sm" />}>Reports</Sidebar.Item>
        </Sidebar.Group>
        <Sidebar.Group label="Admin">
          <Sidebar.Item href="#" icon={<Users size="sm" />}>Members</Sidebar.Item>
          <Sidebar.Item href="#" icon={<Settings size="sm" />}>Settings</Sidebar.Item>
        </Sidebar.Group>
        <Sidebar.Footer className="text-body-sm text-[var(--color-on-surface-muted)]">v2.4.0</Sidebar.Footer>
      </Sidebar.Root>
    </div>
  );
}
```

## Example: Collapsed

```tsx
import * as React from 'react';
import { Button, Sidebar } from '@nexub/react';
import { BarChart3, Folder, Home, Settings } from '@nexub/icons';

export default function Example() {
  const [collapsed, setCollapsed] = React.useState(true);
  return (
    <div className="flex h-[280px] items-start gap-4">
      <Sidebar.Root aria-label="Workspace" collapsed={collapsed} className="rounded-shape-container">
        <Sidebar.Group>
          <Sidebar.Item href="#" icon={<Home size="sm" />} active>Overview</Sidebar.Item>
          <Sidebar.Item href="#" icon={<Folder size="sm" />}>Projects</Sidebar.Item>
          <Sidebar.Item href="#" icon={<BarChart3 size="sm" />}>Reports</Sidebar.Item>
          <Sidebar.Item href="#" icon={<Settings size="sm" />}>Settings</Sidebar.Item>
        </Sidebar.Group>
      </Sidebar.Root>
      <Button variant="outlined" onClick={() => setCollapsed((c) => !c)} aria-pressed={!collapsed}>
        {collapsed ? 'Expand' : 'Collapse'}
      </Button>
    </div>
  );
}
```

Related: [app-shell](app-shell.md), [navigation-rail](navigation-rail.md), [top-nav](top-nav.md)
