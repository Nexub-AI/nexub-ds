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
| [`@nexub/brand`](./packages/brand) | Official brand files: Nexub mark (colour + mono SVG), app icon tiles, PNG icons, favicon |
| [`@nexub/mcp`](./packages/mcp) | MCP server: components, tokens and design rules for any AI coding tool |

## Build with AI

Claude Code plugin (a skill that builds UI with Nexub components, tokens and Calm Depth rules):

```bash
claude plugin marketplace add Nexub-AI/nexub-ds
claude plugin install nexub-ds@nexub
```

Any MCP client (Cursor, Windsurf, VS Code): `npx -y @nexub/mcp`, see [packages/mcp](./packages/mcp). Other LLMs: [`llms.txt`](https://nexub-ds-docs.pages.dev/llms.txt) and [`llms-full.txt`](https://nexub-ds-docs.pages.dev/llms-full.txt).

All three are generated from the docs registry (`apps/docs/src/registry`) and tokens by `pnpm ai-docs`, so update the registry entry when you change a component's props. CI fails if the output is stale. The plugin installs from the `production` branch and its version follows the package version, so users get updates when a release ships.

## Getting started

```bash
node --version   # must be >= 20
pnpm --version   # must be >= 9

pnpm install
pnpm build
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).
