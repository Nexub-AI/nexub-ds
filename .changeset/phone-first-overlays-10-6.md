---
'@nexub/react': minor
'@nexub/patterns': minor
'@nexub/themes': minor
---

10.6 Phone-first overlays: pickers and menus can open as a bottom sheet on a phone, and layouts follow their container.

- **`sheet`** (`true` or `"auto"`, off by default until 11.0) on Select, MultiSelect, Autocomplete, DatePicker, DateRangePicker, DateTimePicker, DropdownMenu, ContextMenu, Menubar, Popover, SplitButton, SavedViews, the Breadcrumb overflow menu, AlertDialog and CommandPalette, and on NotificationCenter, AppLauncher and the AppHeader menus. `"auto"` is a bottom sheet below 768px and the usual popover above; it is done in CSS, so there is no flash after hydration.
- **Poppers stay on screen**: every popper keeps 8px from the viewport edge and scrolls inside the space it has instead of running off it.
- **AlertDialog** keeps a 1rem gutter on narrow screens and scrolls when it is taller than the screen. Dialog sheets use `dvh` and respect the bottom safe area.
- **Sidebar** `collapseBelow="sm" | "md" | "lg"` collapses to the icon rail on its own, and collapsed items show a real tooltip. **AppShell** gains an opt-in mobile drawer: `AppShell.Sidebar drawerBelow` plus `AppShell.NavTrigger`.
- **Container queries**: PageHeader, RadioCard groups, PageFrame, DashboardPage, TransactionDetailPage, SettingsSection, WelcomeBanner and FilterBar now respond to the width of their container, not the viewport.
- NavigationMenu wraps at 320px. The reflow exception list is empty.
