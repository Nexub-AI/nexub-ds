---
'@nexub/react': major
'@nexub/patterns': major
'@nexub/themes': major
'@nexub/tokens': major
---

11.0 Better defaults and one source for the product accent. The first major by RFC (`RFC_11.0.md`): two breaking changes, both announced in 10.x. Run `npx nexub-migrate --rules changes-in-11` (add `--write` to apply the import rewrites, `--check` in CI), then read "Migrating to 11.0" in the docs.

- **Breaking:** the four hand-written product theme files are removed: `@nexub/themes/leap`, `/bookub`, `/payub` and `/founderub` (deprecated in 10.3). Import `@nexub/themes/products` instead: the generated map sets the same `[data-product]` accent for these four and for every other app. `@nexub/react/styles.css` now imports the map, so apps that only import that stylesheet change nothing. `data-product`, `ThemeProvider product` and the accent tokens are unchanged. The codemod rewrites the imports (JS and CSS).
- **Breaking:** the default of `sheet` changes from `false` to `'auto'`: a bottom sheet below 48rem (768px), the usual popover above. On `Select.Content`, `MultiSelect`, `Autocomplete`, `DatePicker`, `DateRangePicker`, `DateTimePicker`, `DropdownMenu.Content`, `ContextMenu.Content`, `Menubar.Content`, `Popover.Content`, `SplitButton`, `SavedViews`, `Breadcrumb.Trail`, `AlertDialog.Content` and `CommandPalette` (@nexub/react), and `NotificationCenter`, `AppLauncher` and `AppHeader` (@nexub/patterns). Components built on them follow (the country list of `PhoneInput`, the filters of `DataTable` and `FilterBuilder`). Pass `sheet={false}` to keep a popover on small screens. `Dialog.Content` is unchanged (`sheet` stays off by default). The codemod reports every overlay without a `sheet` prop and rewrites none.
- **Postponed to the major after 11:** removing sizes outside the shared scale and aligning the web and native variant names. Neither was deprecated in 10.x; they will be deprecated in an 11.x minor with a codemod first. No native API changes: `@nexub/react-native` stays alpha.
- **Docs:** a generated playground on 126 component pages and a States section on 80, a searchable token explorer at /foundations/tokens, breadcrumbs, previous and next links, an "On this page" sheet on phones, search that remembers recent items, and a landing page that shows the 23 page templates. Native components stay alpha.
