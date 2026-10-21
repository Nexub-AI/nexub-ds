# nexub-migrate

Moves app code onto current Nexub DS conventions. Ships with `@nexub/tokens`; no dependencies, Node >= 20.

```sh
npx nexub-migrate                 # dry run over ./src: diff + manual-review items
npx nexub-migrate src app --write # apply fixes
npx nexub-migrate --check         # CI: exit 1 if anything is found
npx nexub-migrate --json          # machine-readable
npx nexub-migrate --rules logical-classes --ignore 'src/legacy/**'
```

| Rule | Does |
| --- | --- |
| `legacy-tokens` | `var(--color-text-primary)` → `var(--color-on-surface)`, `--color-{leap,bookub,payub,founderub}-500` → `--color-{brand}`, `--color-brand-primary-500` → `--color-primary`. Map is built from the installed `@nexub/themes` (`base.css` + `light.css`), else an embedded snapshot. Color-mix aliases (`--color-*-border`) are reported, not rewritten. `--color-text-disabled` is a role and is never touched; declarations (`--color-x: …`) are left alone. |
| `logical-classes` | `ml/mr` `pl/pr` `border-l/r` `rounded-l/r/tl/tr/bl/br` `text-left/right` → `ms/me` `ps/pe` `border-s/e` `rounded-s/e/ss/se/es/ee` `text-start/end`, keeping variants, `!` and `-`. `left-*`/`right-*` positions are reported only. |
| `tw-animate` | Reports tailwindcss-animate classes (`animate-in`, `fade-in-0`, `zoom-in-95`, `slide-in-from-*` …). Use `nx-motion` / `nx-pop` / `nx-dialog` from `@nexub/themes/base`. |
| `opacity-modifier` | Reports `bg-[var(--x)]/10` (Tailwind 3 emits nothing). `--fix` rewrites to `bg-[color-mix(in_srgb,var(--x)_10%,transparent)]`. |

**Where classes are looked for.** `.html`/`.mdx`: `class=`/`className=` attributes. `.css`/`.scss`: `@apply`.
JS/TS: string and template literals (static parts only) that are either in an explicit class context —
`className=`, `class=`, the args of `cn/clsx/cva/cx/twMerge/twJoin(…)`, `tw\`…\`` — or where every
whitespace-separated token looks like a Tailwind class (lowercase start, no quotes/braces). So `"ml-2 pe-4"`
is rewritten, `"Align text-left please"` and identifiers like `ml` are not. Margin/padding values must be
spacing-like (`2`, `0.5`, `px`, `auto`, `[…]`), so `"pr-review"` stays.

Limits: no regex-literal or JSX-text awareness (a stray `'` can hide the rest of that line from the class
pass); a single-token string such as a TS union member `'text-left'` is treated as a class. Docs that
mention legacy token names in prose get rewritten too — `--ignore` them.

Skips `node_modules`, `dist`, `build`, `.next`, `out`, `coverage` and files over 1 MB.
