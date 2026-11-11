---
'@nexub/react': minor
---

8.8: docs accuracy. No new components, props or variants.

- Docs: 21 shipped components that had no page now have one: AppShell, AspectRatio, Container, Section, PageHeader, TopNav, Sidebar, NavigationMenu, Menubar, CommandPalette, DropdownMenu, ContextMenu, CountryBadge, Flag, FormError, FileUpload, Toolbar, CheckList, KeyboardShortcut, Logo and VisuallyHidden.
- Docs: a link check over the built site runs in CI (every same-site link and `#anchor` resolves); it found and fixed 9 broken links.
- Docs: an accessibility suite for the site itself: axe (WCAG 2.2 AA, contrast included) on each kind of page in light and dark, plus keyboard checks for the skip link, "On this page" and search. Fixed what it found: the header Search button and home link now have names that match their visible text.
- Fix: Alert no longer dims its body text to 90% opacity, which pushed links inside an Alert below AA contrast.
