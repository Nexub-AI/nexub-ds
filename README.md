# Nexub Design System

The shared UI foundation for all Nexub surfaces — marketing site, product app, and all four products: Leap, Bookub, Payub, Founderub.

## Packages

| Package | Description |
| --- | --- |
| [`@nexub/tokens`](./packages/tokens) | Design tokens — CSS vars, TS types, Tailwind preset |
| [`@nexub/themes`](./packages/themes) | Base resets, light/dark themes, per-product accent overrides |
| [`@nexub/icons`](./packages/icons) | Lucide re-export + custom Nexub icons |
| [`@nexub/react`](./packages/react) | ~85 React components |
| [`@nexub/patterns`](./packages/patterns) | Opinionated brand composites |

## Getting started

```bash
node --version   # must be >= 20
pnpm --version   # must be >= 9

pnpm install
pnpm build
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).
