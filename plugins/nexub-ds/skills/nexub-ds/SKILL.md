---
name: nexub-ds
description: Build SaaS UI with the Nexub Design System (@nexub/react, @nexub/patterns, @nexub/tokens, @nexub/themes, @nexub/icons). Use when building or restyling any React screen, page, dashboard, form, settings page, auth flow, pricing page or component in a project that uses Nexub DS, or when the user asks for Nexub, Calm Depth or Liquid Glass UI.
license: MIT
---

# Nexub Design System

Nexub DS is a token-driven React design system for SaaS products. The visual language is **Calm Depth**: tonal surfaces, one accent per view, spring motion, honest numbers. **Liquid Glass** is an optional material for the floating control layer.

Reference files (read only what the task needs):

- [references/components.md](references/components.md): every component and pattern, grouped by category. Start here.
- `references/components/<slug>.md`: props, examples, when to use and accessibility for one component. Read it before using a component you have not used yet in this session.
- [references/tokens.md](references/tokens.md): color roles, type roles, spacing, shape, elevation, motion, z-index.
- [references/react-native.md](references/react-native.md): **mobile apps** (Expo / React Native). Use `@nexub/react-native` and `@nexub/react-native/patterns` there, never `@nexub/react`.

## 1. Check the setup first

Look for `@nexub/react` in `package.json`. If it is missing, set it up:

```bash
npm install @nexub/react @nexub/patterns @nexub/themes @nexub/tokens @nexub/icons
```

```ts
// app entry or global CSS, once
import '@nexub/themes/base';   // resets + token CSS variables
import '@nexub/themes/light';
import '@nexub/themes/glass';  // only if you use Liquid Glass
```

```ts
// tailwind.config.ts (Tailwind v3)
import nexub from '@nexub/tokens/tailwind';
export default {
  presets: [nexub],
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@nexub/react/dist/**/*.js',
    './node_modules/@nexub/patterns/dist/**/*.js',
  ],
};
```

Wrap the app in `<ThemeProvider defaultTheme="system" storageKey="app-theme">` from `@nexub/react`. In server-rendered apps (Next.js), put `<ThemeScript storageKey="app-theme" />` in `<head>` and add `suppressHydrationWarning` to `<html>`. Product brands: set `data-product="leap" | "bookub" | "payub" | "founderub"` on the root. This remaps the `tertiary` role.

## 2. How to build a screen

1. **Start from a pattern.** Check the Patterns sections of `references/components.md` before you compose anything by hand.
2. **Then use components.** Use `@nexub/react` for every control, overlay, layout primitive and piece of typography. Never hand-roll a button, input, dialog, menu or table that the library already has.
3. **Then use tokens, only for the glue.** Use Tailwind utilities from the preset (`bg-surface-container-low`, `text-on-surface-variant`, `p-4`, `gap-6`, `rounded-shape-container`, `text-title-md`) or `var(--…)`.
4. **Never hardcode design values.** That means no hex or rgb colors, no Tailwind palette colors (`bg-blue-500`, `text-gray-600`), no arbitrary px values (`p-[13px]`), no ad-hoc shadows or gradients.

Starting points for typical SaaS screens:

| Screen | Build with |
| --- | --- |
| App frame | `AppShell` (`AppShell.Root/Header/Body/Sidebar/Main`) + `Sidebar` or `NavigationRail` + `AppHeader` or `TopNav` |
| Dashboard | `PageHeader` + a `Grid` of `StatCard` + `DataTable` or `Table` + `ActivityFeed` |
| List / detail | `ListDetail` + `FilterBar` + `EmptyState` |
| Settings | `SettingsLayout` / `SettingsRow` + `SettingsSection` + `FormField` |
| Sign in / sign up | `AuthCard` + `FormField` + `PasswordInput` |
| Pricing / billing | `PlanCard` + `SegmentedControl` (monthly / yearly) + `Amount` |
| Onboarding | `StepIndicator` + `CheckList` |
| Search / commands | `CommandPalette` + `KeyboardShortcut` |
| Empty, loading, error | `EmptyState`, `Skeleton`, `ErrorState`, `Toast` |

Money: use `Amount` and `MoneyInput`. They use tabular figures, the currency's own minor unit and a true minus sign. Icons: import from `@nexub/icons`, not `lucide-react` directly.

## 3. Calm Depth principles

1. **Content leads, chrome recedes.** Navigation is quieter than content. Remove a divider before you add one; let spacing and tone separate regions. Do: a tonal sidebar with no border, where the active item is a soft pill. Don't: a saturated brand-blue sidebar item, or a hard line around every region.
2. **Hierarchy through tone and layout, not decoration.** Surfaces step `surface` → `surface-container-*` → `surface-elevated`. Shadows are only for things that float. Product UI has no gradients, no colored icon tiles and no gradient eyebrow chips.
3. **One accent, spent deliberately.** Each view gets one filled (primary) button. Everything else is `tonal`, `outlined` or `text`. Never put two filled buttons side by side.
4. **Physical, interruptible motion.** Use the spring tokens (`ease-spatial-default duration-spatial-default`), not raw durations. Exits are faster than entrances. Honor `prefers-reduced-motion`.
5. **Honest numbers and states.** Use tabular figures in data. Hover, pressed, selected and disabled are explicit component states. Never fake a state with opacity.
6. **Accessible by construction.** Every role pair meets WCAG 2.2 AA in light, dark and high contrast, as long as you pair a role with its `on-` role. Keep visible focus, labelled controls (`FormField` + `Label`) and keyboard support. Use `VisuallyHidden` for icon-only labels.

## 4. Liquid Glass rules

- Glass is for the floating control layer only: top bars, floating toolbars, popovers, menus, sheets, dialogs. Card glass is only for surfaces over imagery or media.
- Turn it on through props: `<TopNav.Root surface="glass" scrollEdge="soft">`, `<Dialog.Content surface="glass">`, `<Button variant="glass">`.
- Never put glass on glass. Show at most three glass layers at a time. Tint only the one primary action (`data-glass-tint="primary"`).
- Never put white text on glass over an unknown background.

## 5. UI copy

Copy is clear, direct, human and confident. Use sentence case, active voice, contractions and specific verbs ("Save changes", not "Submit"). Errors say what happened and what to do: "Your session expired. Sign in again." No "Oops", no emoji in errors, no "Please be advised".

## 6. Before you finish

- [ ] Every control comes from `@nexub/react` or `@nexub/patterns`. No deprecated component (see the index).
- [ ] There are no hex or rgb colors, Tailwind palette colors, arbitrary px values or custom shadows. Everything is a token utility or `var(--…)`.
- [ ] Every background role is paired with its `on-` role. Secondary text uses `on-surface-variant` or `on-surface-muted`.
- [ ] Each view has at most one filled button.
- [ ] The screen works in light and dark (`data-theme`) and at `data-contrast="high"`.
- [ ] Every input has a label. Icon-only buttons have an `aria-label`. Keyboard paths work.
