# Tokens

Nexub DS v2.3.0. Every token is a CSS custom property from `@nexub/tokens/css` (loaded by `@nexub/themes/base`).
The Tailwind preset (`@nexub/tokens/tailwind`) maps them to utilities. Never hardcode a hex, px spacing or shadow that a token covers.

## Color roles

Roles are `light-dark()` values: they follow `data-theme` and `data-contrast` automatically. Pair every background role with its `on-` role.

| Role | Tailwind | CSS var | Use for |
| --- | --- | --- | --- |
| `primary` | `bg-primary` / `text-primary` / `border-primary` | `--color-primary` | The one emphasised action; links |
| `on-primary` | `bg-on-primary` / `text-on-primary` / `border-on-primary` | `--color-on-primary` |  |
| `primary-container` | `bg-primary-container` / `text-primary-container` / `border-primary-container` | `--color-primary-container` |  |
| `on-primary-container` | `bg-on-primary-container` / `text-on-primary-container` / `border-on-primary-container` | `--color-on-primary-container` |  |
| `secondary` | `bg-secondary` / `text-secondary` / `border-secondary` | `--color-secondary` |  |
| `on-secondary` | `bg-on-secondary` / `text-on-secondary` / `border-on-secondary` | `--color-on-secondary` |  |
| `secondary-container` | `bg-secondary-container` / `text-secondary-container` / `border-secondary-container` | `--color-secondary-container` |  |
| `on-secondary-container` | `bg-on-secondary-container` / `text-on-secondary-container` / `border-on-secondary-container` | `--color-on-secondary-container` |  |
| `error` | `bg-error` / `text-error` / `border-error` | `--color-error` | Destructive / error |
| `on-error` | `bg-on-error` / `text-on-error` / `border-on-error` | `--color-on-error` |  |
| `error-container` | `bg-error-container` / `text-error-container` / `border-error-container` | `--color-error-container` |  |
| `on-error-container` | `bg-on-error-container` / `text-on-error-container` / `border-on-error-container` | `--color-on-error-container` |  |
| `success` | `bg-success` / `text-success` / `border-success` | `--color-success` |  |
| `on-success` | `bg-on-success` / `text-on-success` / `border-on-success` | `--color-on-success` |  |
| `success-container` | `bg-success-container` / `text-success-container` / `border-success-container` | `--color-success-container` |  |
| `on-success-container` | `bg-on-success-container` / `text-on-success-container` / `border-on-success-container` | `--color-on-success-container` |  |
| `warning` | `bg-warning` / `text-warning` / `border-warning` | `--color-warning` |  |
| `on-warning` | `bg-on-warning` / `text-on-warning` / `border-on-warning` | `--color-on-warning` |  |
| `warning-container` | `bg-warning-container` / `text-warning-container` / `border-warning-container` | `--color-warning-container` |  |
| `on-warning-container` | `bg-on-warning-container` / `text-on-warning-container` / `border-on-warning-container` | `--color-on-warning-container` |  |
| `info` | `bg-info` / `text-info` / `border-info` | `--color-info` |  |
| `on-info` | `bg-on-info` / `text-on-info` / `border-on-info` | `--color-on-info` |  |
| `info-container` | `bg-info-container` / `text-info-container` / `border-info-container` | `--color-info-container` |  |
| `on-info-container` | `bg-on-info-container` / `text-on-info-container` / `border-on-info-container` | `--color-on-info-container` |  |
| `leap` | `bg-leap` / `text-leap` / `border-leap` | `--color-leap` |  |
| `on-leap` | `bg-on-leap` / `text-on-leap` / `border-on-leap` | `--color-on-leap` |  |
| `leap-container` | `bg-leap-container` / `text-leap-container` / `border-leap-container` | `--color-leap-container` |  |
| `on-leap-container` | `bg-on-leap-container` / `text-on-leap-container` / `border-on-leap-container` | `--color-on-leap-container` |  |
| `bookub` | `bg-bookub` / `text-bookub` / `border-bookub` | `--color-bookub` |  |
| `on-bookub` | `bg-on-bookub` / `text-on-bookub` / `border-on-bookub` | `--color-on-bookub` |  |
| `bookub-container` | `bg-bookub-container` / `text-bookub-container` / `border-bookub-container` | `--color-bookub-container` |  |
| `on-bookub-container` | `bg-on-bookub-container` / `text-on-bookub-container` / `border-on-bookub-container` | `--color-on-bookub-container` |  |
| `payub` | `bg-payub` / `text-payub` / `border-payub` | `--color-payub` |  |
| `on-payub` | `bg-on-payub` / `text-on-payub` / `border-on-payub` | `--color-on-payub` |  |
| `payub-container` | `bg-payub-container` / `text-payub-container` / `border-payub-container` | `--color-payub-container` |  |
| `on-payub-container` | `bg-on-payub-container` / `text-on-payub-container` / `border-on-payub-container` | `--color-on-payub-container` |  |
| `founderub` | `bg-founderub` / `text-founderub` / `border-founderub` | `--color-founderub` |  |
| `on-founderub` | `bg-on-founderub` / `text-on-founderub` / `border-on-founderub` | `--color-on-founderub` |  |
| `founderub-container` | `bg-founderub-container` / `text-founderub-container` / `border-founderub-container` | `--color-founderub-container` |  |
| `on-founderub-container` | `bg-on-founderub-container` / `text-on-founderub-container` / `border-on-founderub-container` | `--color-on-founderub-container` |  |
| `surface` | `bg-surface` / `text-surface` / `border-surface` | `--color-surface` | Page background |
| `surface-dim` | `bg-surface-dim` / `text-surface-dim` / `border-surface-dim` | `--color-surface-dim` |  |
| `surface-bright` | `bg-surface-bright` / `text-surface-bright` / `border-surface-bright` | `--color-surface-bright` |  |
| `surface-container-lowest` | `bg-surface-container-lowest` / `text-surface-container-lowest` / `border-surface-container-lowest` | `--color-surface-container-lowest` |  |
| `surface-container-low` | `bg-surface-container-low` / `text-surface-container-low` / `border-surface-container-low` | `--color-surface-container-low` | In-flow cards, sidebars |
| `surface-container` | `bg-surface-container` / `text-surface-container` / `border-surface-container` | `--color-surface-container` | Default container |
| `surface-container-high` | `bg-surface-container-high` / `text-surface-container-high` / `border-surface-container-high` | `--color-surface-container-high` | Pressed / neutral fills |
| `surface-container-highest` | `bg-surface-container-highest` / `text-surface-container-highest` / `border-surface-container-highest` | `--color-surface-container-highest` |  |
| `surface-elevated` | `bg-surface-elevated` / `text-surface-elevated` / `border-surface-elevated` | `--color-surface-elevated` | Floating layers: menus, popovers, dialogs |
| `on-surface` | `bg-on-surface` / `text-on-surface` / `border-on-surface` | `--color-on-surface` | Primary text |
| `on-surface-variant` | `bg-on-surface-variant` / `text-on-surface-variant` / `border-on-surface-variant` | `--color-on-surface-variant` | Secondary text |
| `on-surface-muted` | `bg-on-surface-muted` / `text-on-surface-muted` / `border-on-surface-muted` | `--color-on-surface-muted` | Tertiary text (still ≥ 4.5:1) |
| `outline` | `bg-outline` / `text-outline` / `border-outline` | `--color-outline` | Field borders, focus (≥ 3:1) |
| `outline-variant` | `bg-outline-variant` / `text-outline-variant` / `border-outline-variant` | `--color-outline-variant` | Hairlines, dividers |
| `inverse-surface` | `bg-inverse-surface` / `text-inverse-surface` / `border-inverse-surface` | `--color-inverse-surface` |  |
| `inverse-on-surface` | `bg-inverse-on-surface` / `text-inverse-on-surface` / `border-inverse-on-surface` | `--color-inverse-on-surface` |  |
| `inverse-primary` | `bg-inverse-primary` / `text-inverse-primary` / `border-inverse-primary` | `--color-inverse-primary` |  |
| `scrim` | `bg-scrim` / `text-scrim` / `border-scrim` | `--color-scrim` |  |
| `tertiary` | `bg-tertiary` / `text-tertiary` / `border-tertiary` | `--color-tertiary` | Product brand accent (remapped by data-product) |
| `on-tertiary` | `bg-on-tertiary` / `text-on-tertiary` / `border-on-tertiary` | `--color-on-tertiary` |  |
| `tertiary-container` | `bg-tertiary-container` / `text-tertiary-container` / `border-tertiary-container` | `--color-tertiary-container` |  |
| `on-tertiary-container` | `bg-on-tertiary-container` / `text-on-tertiary-container` / `border-on-tertiary-container` | `--color-on-tertiary-container` |  |

Legacy aliases (`--color-bg-*`, `--color-text-*`, `--color-border-*`, `--color-semantic-*`, raw `--color-brand-*` / `--color-accent-*` scales, `--gradient-*`) still work but must not be used in new code.

## Chart colors

| CSS var | Value |
| --- | --- |
| `--color-chart-1` | #4099f1 |
| `--color-chart-2` | #10b981 |
| `--color-chart-3` | #8b5cf6 |
| `--color-chart-4` | #f59e0b |
| `--color-chart-5` | #ef4444 |
| `--color-chart-6` | #06b6d4 |
| `--color-chart-7` | #ec4899 |
| `--color-chart-8` | #84cc16 |

## Typography roles

Fonts: `font-sans` (Inter, UI), `font-display` (Plus Jakarta Sans, headlines), `font-mono` (Geist Mono, code and figures).

| Tailwind | Size / line height | Weight |
| --- | --- | --- |
| `text-display-lg` | 56px / 60px | 700 |
| `text-display-md` | 44px / 48px | 700 |
| `text-display-sm` | 36px / 40px | 700 |
| `text-headline-lg` | 32px / 38px | 600 |
| `text-headline-md` | 28px / 34px | 600 |
| `text-headline-sm` | 24px / 30px | 600 |
| `text-title-lg` | 20px / 28px | 600 |
| `text-title-md` | 16px / 24px | 600 |
| `text-title-sm` | 14px / 20px | 600 |
| `text-body-lg` | 18px / 28px | 400 |
| `text-body-md` | 16px / 24px | 400 |
| `text-body-sm` | 14px / 20px | 400 |
| `text-label-lg` | 14px / 20px | 500 |
| `text-label-md` | 13px / 18px | 500 |
| `text-label-sm` | 12px / 16px | 500 |

## Spacing

| CSS var | Tailwind (p-, m-, gap-, w-, h-) | Value |
| --- | --- | --- |
| `--spacing-0` | `0` | 0px |
| `--spacing-1` | `1` | 4px |
| `--spacing-2` | `2` | 8px |
| `--spacing-3` | `3` | 12px |
| `--spacing-4` | `4` | 16px |
| `--spacing-5` | `5` | 20px |
| `--spacing-6` | `6` | 24px |
| `--spacing-7` | `7` | 28px |
| `--spacing-8` | `8` | 32px |
| `--spacing-9` | `9` | 36px |
| `--spacing-10` | `10` | 40px |
| `--spacing-11` | `11` | 44px |
| `--spacing-12` | `12` | 48px |
| `--spacing-14` | `14` | 56px |
| `--spacing-16` | `16` | 64px |
| `--spacing-20` | `20` | 80px |
| `--spacing-24` | `24` | 96px |
| `--spacing-28` | `28` | 112px |
| `--spacing-32` | `32` | 128px |
| `--spacing-40` | `40` | 160px |
| `--spacing-48` | `48` | 192px |
| `--spacing-56` | `56` | 224px |
| `--spacing-64` | `64` | 256px |
| `--spacing-px` | `px` | 1px |
| `--spacing-0-5` | `0-5` | 2px |
| `--spacing-1-5` | `1-5` | 6px |
| `--spacing-2-5` | `2-5` | 10px |
| `--spacing-3-5` | `3-5` | 14px |

Containers: `max-w-container-sm` (640px), `max-w-container-md` (768px), `max-w-container-lg` (1024px), `max-w-container-xl` (1280px), `max-w-container-2xl` (1536px), `max-w-container-nexub` (1440px), `max-w-container-prose` (65ch).

## Control and component sizes

| CSS var | Tailwind | Value |
| --- | --- | --- |
| `--size-control-xs` | `h-control-xs` | 24px |
| `--size-control-sm` | `h-control-sm` | 32px |
| `--size-control-md` | `h-control-md` | 40px |
| `--size-control-lg` | `h-control-lg` | 48px |
| `--size-control-xl` | `h-control-xl` | 56px |
| `--size-icon-xs` |  | 12px |
| `--size-icon-sm` |  | 16px |
| `--size-icon-md` |  | 20px |
| `--size-icon-lg` |  | 24px |
| `--size-icon-xl` |  | 32px |
| `--size-avatar-xs` |  | 24px |
| `--size-avatar-sm` |  | 32px |
| `--size-avatar-md` |  | 40px |
| `--size-avatar-lg` |  | 48px |
| `--size-avatar-xl` |  | 64px |
| `--size-nav-header` |  | 64px |
| `--size-nav-sidebar` |  | 256px |
| `--size-nav-sidebar-collapsed` |  | 64px |

Control heights shrink under `data-density="compact"`. Use the component `size` prop instead of setting heights.

## Shape (corner radius by role)

| CSS var | Tailwind | Value |
| --- | --- | --- |
| `--shape-control` | `rounded-shape-control` | 9999px |
| `--shape-field` | `rounded-shape-field` | 12px |
| `--shape-container` | `rounded-shape-container` | 16px |
| `--shape-overlay` | `rounded-shape-overlay` | 24px |
| `--shape-tooltip` | `rounded-shape-tooltip` | 8px |
| `--shape-min` | `rounded-shape-min` | 4px |

Raw radii (`rounded-sm` … `rounded-3xl`, `--radius-*`) exist; prefer the shape roles.

## Elevation

| CSS var | Tailwind | Value |
| --- | --- | --- |
| `--elevation-0` | `shadow-elevation-0` | none |
| `--elevation-1` | `shadow-elevation-1` | 0 0 0 1px light-dark(rgb(26 28 30 / 0.06), rgb(255 255 255 / 0.06)), 0 1px 2px light-dark(rgb(26 28 30 / 0.06), rgb(0 0 0 / 0.4)), 0 2px 6px light-dark(rgb(26 28 30 / 0.04), rgb(0 0 0 / 0.3)) |
| `--elevation-2` | `shadow-elevation-2` | 0 0 0 1px light-dark(rgb(26 28 30 / 0.06), rgb(255 255 255 / 0.08)), 0 2px 4px light-dark(rgb(26 28 30 / 0.06), rgb(0 0 0 / 0.4)), 0 8px 20px light-dark(rgb(26 28 30 / 0.08), rgb(0 0 0 / 0.45)) |
| `--elevation-3` | `shadow-elevation-3` | 0 0 0 1px light-dark(rgb(26 28 30 / 0.06), rgb(255 255 255 / 0.08)), 0 4px 8px light-dark(rgb(26 28 30 / 0.08), rgb(0 0 0 / 0.45)), 0 20px 48px light-dark(rgb(26 28 30 / 0.16), rgb(0 0 0 / 0.55)) |

Shadows are only for things that float. In-flow cards use tone (`surface-container-*`) and a hairline, not a shadow.

## Motion

Use springs, not durations. Each spring has a paired easing and duration:

| Spring | Tailwind |
| --- | --- |
| `--motion-spring-spatial-fast-{easing,duration}` | `ease-spatial-fast duration-spatial-fast` |
| `--motion-spring-spatial-default-{easing,duration}` | `ease-spatial-default duration-spatial-default` |
| `--motion-spring-spatial-slow-{easing,duration}` | `ease-spatial-slow duration-spatial-slow` |
| `--motion-spring-effects-fast-{easing,duration}` | `ease-effects-fast duration-effects-fast` |
| `--motion-spring-effects-default-{easing,duration}` | `ease-effects-default duration-effects-default` |
| `--motion-spring-effects-slow-{easing,duration}` | `ease-effects-slow duration-effects-slow` |
| `--motion-spring-expressive-fast-{easing,duration}` | `ease-expressive-fast duration-expressive-fast` |
| `--motion-spring-expressive-default-{easing,duration}` | `ease-expressive-default duration-expressive-default` |
| `--motion-spring-expressive-slow-{easing,duration}` | `ease-expressive-slow duration-expressive-slow` |

`spatial` = movement and size, `effects` = color and opacity (no bounce), `expressive` = key moments only. Exits use `fast`. Respect `prefers-reduced-motion`.

## Z-index

| CSS var | Tailwind | Value |
| --- | --- | --- |
| `--z-hide` | `z-hide` | -1 |
| `--z-base` | `z-base` | 0 |
| `--z-raised` | `z-raised` | 10 |
| `--z-dropdown` | `z-dropdown` | 1000 |
| `--z-sticky` | `z-sticky` | 1100 |
| `--z-banner` | `z-banner` | 1200 |
| `--z-overlay` | `z-overlay` | 1300 |
| `--z-modal` | `z-modal` | 1400 |
| `--z-popover` | `z-popover` | 1500 |
| `--z-skipLink` | `z-skipLink` | 1600 |
| `--z-toast` | `z-toast` | 1700 |
| `--z-tooltip` | `z-tooltip` | 1800 |
| `--z-commandK` | `z-commandK` | 1900 |

## Breakpoints

`sm` 640px · `md` 768px · `lg` 1024px · `xl` 1280px · `2xl` 1536px
