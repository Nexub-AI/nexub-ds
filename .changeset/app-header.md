---
"@nexub/patterns": minor
"@nexub/themes": minor
---

**New pattern `AppHeader`**: the one top header every Nexub app shares. It is presentational; the app passes data and callbacks in.

- Left to right: a `menu` slot (below `md`), the logo (`homeHref`, `onNavigate`), a centred search field (an icon below `md`) that opens a `CommandPalette`, the organization (`orgs`, `currentOrgId`, `onOrgChange`), a theme switch (`useTheme`, `showThemeSwitch`), the `AppLauncher` (`apps`) and an account menu (`user`, `accountHref`, `privacyHref`, `termsHref`, `onSignOut`, `accountMenuItems`).
- Search takes static `searchItems` or an async `onSearch(query)` (debounced, with loading, empty and error states). Opens with ⌘K / Ctrl+K anywhere and "/" outside text fields.
- Fixed to the top at the new `--app-header-height` variable (64px, in `@nexub/themes/base`) and followed by a spacer of that height, so pages, `AppShell.Body` and `SettingsLayout` start below it with no padding of their own.
- `surface="glass"`; strict-CSP safe (class scroll lock, non-modal menus); fits at 375px, where the org switcher collapses to an icon.

**`SettingsLayout`**: new `header` prop, `header={(menu) => <AppHeader menu={menu} … />}`, which replaces its top bar and hands the phone section-menu button to the AppHeader's menu slot. Its top bar and sticky sidebar now use `--app-header-height`.
