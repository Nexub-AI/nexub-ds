# Top Nav

A sticky app header: logo, main navigation links and trailing actions.

- Package: `@nexub/react` · Category: Navigation · Status: stable
- Import: `import { TopNav } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/top-nav

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `surface` | `'solid' \| 'glass'` |  | Glass material on the bar — see Foundations → Materials. |
| `scrollEdge` | `'soft' \| 'hard'` |  | `soft` dissolves scrolling content under the bar (no divider); `hard` is an opaque band. Default: a divider. |
| `TopNav.Logo / Menu / Actions` | `compound` |  | The logo slot, the `<nav>` of links (scrolls sideways on narrow screens) and the end-aligned actions. |
| `TopNavItem active` | `boolean` |  | Marks the current page (`aria-current="page"`). |
| `TopNavItem asChild` | `boolean` |  | Use your router `<Link>` instead of an `<a>`. |

## Example: Default

```tsx
import { Avatar, IconButton, Logo, TopNav } from '@nexub/react';
import { Bell } from '@nexub/icons';

export default function Example() {
  return (
    <TopNav.Root className="static w-full">
      <TopNav.Logo><Logo size="sm" /></TopNav.Logo>
      <TopNav.Menu>
        <TopNav.Item href="#" active>Overview</TopNav.Item>
        <TopNav.Item href="#">Projects</TopNav.Item>
        <TopNav.Item href="#">Reports</TopNav.Item>
      </TopNav.Menu>
      <TopNav.Actions>
        <IconButton variant="ghost" label="Notifications"><Bell size="sm" /></IconButton>
        <Avatar size="sm" name="Jane Smith" />
      </TopNav.Actions>
    </TopNav.Root>
  );
}
```

## Accessibility

- Roles: banner, navigation
- `TopNav.Root` is a `<header>`; `TopNav.Menu` is a `<nav>` named with the localised "Main navigation".

Related: [app-shell](app-shell.md), [sidebar](sidebar.md), [navigation-menu](navigation-menu.md), [logo](logo.md)
