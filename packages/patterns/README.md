# @nexub/patterns

Composite UI patterns for the Nexub Design System, built on `@nexub/react`.

```bash
pnpm add @nexub/patterns @nexub/react @nexub/icons @nexub/themes
```

Like `@nexub/react`, the patterns are styled with Tailwind classes your app compiles: add `node_modules/@nexub/patterns/dist/**/*.js` to your Tailwind `content`, use the `@nexub/tokens/tailwind` preset, and import `@nexub/themes/base` plus a palette (e.g. `@nexub/themes/light` and `@nexub/themes/dark`).

## AppHeader

The one top header every Nexub app shares. It is presentational: the app passes in its data and callbacks, and the header does no fetching.

Left to right: an optional menu slot (below `md` only), the logo, search, the organization, a theme switch, the app launcher and the account menu. It is fixed to the top at `--app-header-height` (64px, from `@nexub/themes/base`) and renders a spacer of that height after itself, so content flows below it with no padding of your own.

### Minimal

```tsx
import { ThemeProvider } from '@nexub/react';
import { AppHeader } from '@nexub/patterns';

<ThemeProvider>
  <AppHeader productName="Account" />
  <main>…</main>
</ThemeProvider>
```

The theme switch uses `useTheme`, so it needs a `ThemeProvider`. Pass `showThemeSwitch={false}` to leave it out.

### Full

Search provider, two orgs, launcher and account menu:

```tsx
import { useRouter } from 'next/navigation';
import { DropdownMenu } from '@nexub/react';
import { AppHeader, type AppHeaderSearchGroup } from '@nexub/patterns';

function Header({ session, currentOrgId, switchOrg, signOut, openPreferences }) {
  const router = useRouter();

  // Called (debounced) as the user types. Return groups of results.
  const onSearch = async (query: string): Promise<AppHeaderSearchGroup[]> => {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const { projects } = await res.json();
    return [
      {
        label: 'Projects',
        items: projects.map((p) => ({
          id: p.id,
          label: p.name,
          hint: 'Project',
          onSelect: () => router.push(`/projects/${p.id}`),
        })),
      },
    ];
  };

  return (
    <AppHeader
      productName="Command Hub"
      homeHref="/"
      onNavigate={(href) => router.push(href)}
      onSearch={onSearch}
      orgs={[
        { id: 'acme', name: 'Acme' },
        { id: 'globex', name: 'Globex' },
      ]}
      currentOrgId={currentOrgId}
      onOrgChange={switchOrg}
      apps={[
        { id: 'hub', name: 'Command Hub', href: '/', current: true },
        { id: 'account', name: 'Account', href: 'https://account.example.com' },
      ]}
      user={{ name: session.name, email: session.email, avatarUrl: session.picture }}
      accountHref="https://account.example.com"
      privacyHref="/privacy"
      termsHref="/terms"
      onSignOut={signOut} // may return a promise; Sign out is disabled until it settles
      accountMenuItems={<DropdownMenu.Item onSelect={openPreferences}>Preferences</DropdownMenu.Item>}
    />
  );
}
```

### Props

| Prop | Notes |
| --- | --- |
| `productName` | Shown after the wordmark (`<Logo size="sm" product={…} />`) and in the search field. |
| `homeHref`, `onNavigate(href)` | The logo links to `homeHref` (default `/`). `onNavigate` takes over plain clicks on the logo and the launcher's tiles, for client-side routers. |
| `menu` | Your navigation trigger, shown below `md` only. |
| `searchItems` / `onSearch(query)` | A static list (filtered as you type) or an async search (debounced 200ms, with loading, empty and error states). Groups are `{ label, items: [{ id, label, hint?, icon?, onSelect }] }`. With neither, there is no search. |
| `searchPlaceholder` | Default `Search <productName>`. |
| `orgs`, `currentOrgId`, `onOrgChange(id)` | No orgs: nothing. One: its name as plain, truncated text. Two or more: a menu with the current org checked; on phones the trigger is a building icon. |
| `showThemeSwitch` | Default `true`. |
| `apps` | Passed to `AppLauncher`. |
| `user`, `accountHref`, `privacyHref`, `termsHref`, `onSignOut`, `accountMenuItems` | The account menu (no `user`, no menu). Each link shows only when its href is set. `accountMenuItems` go above Sign out. |
| `surface` | `'solid'` (default) or `'glass'` (needs `@nexub/themes/glass`). |

Search opens with the button, **⌘K / Ctrl+K** anywhere, or **/** when focus isn't in a text field. Arrow keys move, Enter selects, Esc closes and returns focus.

### Layouts

- **Any page:** render it first; its spacer pushes content down. To offset something yourself (e.g. a sticky sidebar), use `top: var(--app-header-height)`.
- **AppShell:** put it in `AppShell.Header`. The spacer gives the header row its height, so `AppShell.Body` starts below it.

  ```tsx
  <AppShell.Root>
    <AppShell.Header>
      <AppHeader productName="Command Hub" menu={<MobileNavButton />} />
    </AppShell.Header>
    <AppShell.Body>…</AppShell.Body>
  </AppShell.Root>
  ```

- **SettingsLayout:** pass `header`. It replaces SettingsLayout's own top bar and hands you its phone section-menu button for the menu slot.

  ```tsx
  <SettingsLayout items={items} activeId={active} header={(menu) => <AppHeader menu={menu} productName="Account" />}>
    …
  </SettingsLayout>
  ```

### Strict CSP

The header injects no `<style>` tags and sets no inline styles of its own: the search palette locks page scroll with a class (`scrollLock="class"`), and the org and account menus are non-modal. One known gap: the colour Nexub mark inside `Logo` still sets `style` on its gradient stops, so under `style-src 'self'` a server-rendered mark loses its colours until that is fixed.

### Accessibility

`<header role="banner">` with a `<nav aria-label="Account and apps">` for the right-hand group. Every icon button has a label; the search buttons expose their shortcut through `aria-keyshortcuts` and a description. The org switcher and account menu are Radix menus, operable from the keyboard.
