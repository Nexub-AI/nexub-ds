# RFC: 11.0 — better defaults and removing the product theme files

<!-- The text of the RFC issue (GOVERNANCE.md → RFC process). Open a GitHub issue with this title and the body below. -->

Open for comments for at least **3 working days** from the day this issue is opened. A maintainer then records the decision here (accepted, accepted with changes, or declined) and closes the issue. The 11.0 PR links it.

Release candidate: **10.9.x, on the npm tag `next`** (`npm i @nexub/react@next`). `latest` stays on 10.8.x until 11.0.0.

## Problem

Two things in 10.x can only be finished by a major.

1. **Two sources for the product accent.** `@nexub/themes` ships four hand-written files (`leap.css`, `bookub.css`, `payub.css`, `founderub.css`) next to the generated map (`products.css`, since 10.1), which covers the same four products and every other app. The four files have to be kept in step by hand, and an app that imports one of them gets no accent for the other products. They were deprecated in 10.3.
2. **Overlays on phones.** Since 10.6 pickers and menus can open as a bottom sheet (`sheet`). It is off by default, because a minor may not change a default. So on a 360px screen a Select or a date picker still opens as a small popover unless every call site opts in. Example: the date picker on the Payub transfer form.

## Proposal

11.0 makes exactly two breaking changes.

1. **Remove the four product theme files:** `packages/themes/src/{leap,bookub,payub,founderub}.css` and their exports `@nexub/themes/leap`, `/bookub`, `/payub`, `/founderub`. The replacement is `@nexub/themes/products` with `data-product` or `ThemeProvider product`. `@nexub/react/styles.css` imports the generated map instead.
2. **Change the default of `sheet` from `false` to `'auto'`** on every overlay that has the prop: a bottom sheet below 768px, the usual popover above.

**Not in 11.0.** The roadmap also listed "sizes outside the shared scale removed" and "web and native variant names aligned". Neither was deprecated in a 10.x release. The deprecation policy removes only what an earlier minor deprecated, with at least one release in between, so both move to the major after 11: deprecated in an 11.x minor with a codemod, removed after that. Translations and other scripts are also out (the design system is English only). Nothing else is removed, and no other default changes.

## API

No new export or prop.

```css
/* 10.x */
@import '@nexub/themes/leap';
/* 11.0 */
@import '@nexub/themes/products';
```

```tsx
// sheet?: boolean | 'auto'      10.x default: false      11.0 default: 'auto'
<Select.Content>…</Select.Content>                 // 11.0: a bottom sheet below 768px
<Select.Content sheet={false}>…</Select.Content>   // keeps the popover on small screens
```

Components whose default changes:

- `@nexub/react`: `Select.Content`, `MultiSelect`, `Autocomplete`, `DatePicker`, `DateRangePicker`, `DateTimePicker`, `DropdownMenu.Content`, `ContextMenu.Content`, `Menubar.Content`, `Popover.Content`, `SplitButton`, `SavedViews`, `Breadcrumb.Trail`, `AlertDialog.Content`, `CommandPalette`.
- `@nexub/patterns`: `NotificationCenter`, `AppLauncher`, `AppHeader`.

`data-product`, `ThemeProvider product` and the accent tokens do not change.

## Accessibility

- The sheet is the same element with the same role, name, keyboard map and focus management as the popover; `'auto'` is a CSS change at the breakpoint, so there is no second DOM and no flash after hydration.
- On small screens the sheet gives full-width rows, so touch targets grow. It respects the bottom safe area and reduced motion.
- Removing the four files changes no colour: the generated map sets the same accent values, already contrast-checked in every theme.

## Web + native parity

Both changes are web only. On native the product accent already comes from the generated map (`NexubNativeProvider`), and pickers already open as a `BottomSheet`. So 11.0 moves the web closer to what native does. No native API changes.

## Alternatives

- **Do nothing.** The four files stay forever and every new overlay call site has to remember `sheet="auto"`.
- **Keep the files as re-exports of the map.** Still two names for one thing, and the export list keeps growing with the product list.
- **A provider setting for the sheet default** instead of changing it. More API for a choice that should be the default; `sheet={false}` already covers the exceptions.
- **Also remove the off-scale sizes and align variant names now.** Declined: neither was deprecated, so it would break the deprecation policy.

## Migration

Affected: apps that import one of the four files themselves (apps that only import `@nexub/react/styles.css` are not), and apps with overlays that must stay a popover on small screens.

- **Deprecation path.** The files carry the deprecation notice since 10.3. The `sheet` default was announced with the prop in 10.6 ("off by default until 11.0") and is in the prop's JSDoc since 10.9.
- **One-line migration.** Replace the import with `@nexub/themes/products`. Pass `sheet={false}` where a popover must stay.
- **`nexub-migrate`.** `npx nexub-migrate --rules changes-in-11` rewrites the imports (JS and CSS) and reports every overlay that passes no `sheet` prop. It does not rewrite those, because either answer can be right. `--check` fails CI while anything is left.
- **Guide.** `/getting-started/migrating-to-11` in the docs.
- **Try it first.** 10.9.x on `next` contains everything except the two changes themselves, so an app that is clean under the rule on 10.9 upgrades to 11.0 with a version bump.
