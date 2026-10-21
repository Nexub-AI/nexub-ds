---
'@nexub/tokens': minor
'@nexub/themes': minor
'@nexub/react': minor
'@nexub/patterns': minor
---

1.8.0 — adoption (ENHANCEMENTS_PLAN.md release tracker).

- **`npx nexub-migrate`** (ships in `@nexub/tokens`): moves app code onto current conventions — legacy colour names → roles, physical → logical (RTL) classes; reports tailwindcss-animate classes and dead `[var(--x)]/NN` opacity modifiers. Dry run by default, `--write` to apply, `--check` for CI.
- **Upgrading guide** and an **example dashboard** in the docs, built only from public APIs.
- **DataTable**: `DataTableColumn<T>` type export, column alignment (`meta.align`), `caption`/`captionHidden`, `aria-label` on the table itself, translatable pager; sort buttons no longer submit forms; translatable empty state (default text is now "No results found."). Note: the `ColumnMeta` augmentation adds an `align` field to TanStack's column meta.
- **Table.Root** is keyboard-scrollable (named region) when it overflows. **Kbd** keeps shortcut order in RTL. **NumberTicker** no longer reverses digits in RTL.
- **StatCard** `sentiment` (colour independent of the arrow); **PageHeader** `level`; **SplitButton** `status="loading"` disables the menu toggle.
- **AppHeader** `position` (`fixed` default, `sticky`, `static`) and translatable strings via NexubProvider.
