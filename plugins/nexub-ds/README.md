# Nexub Design System for Claude

Build SaaS UI with the [Nexub Design System](https://nexub-ds-docs.pages.dev). With this plugin installed, Claude uses Nexub's React components, patterns and design tokens and follows its Calm Depth rules, instead of writing generic Tailwind.

## What it does

The plugin adds one skill, `nexub-ds`. Claude loads it when you build or restyle a React screen in a project that uses Nexub DS, or when you ask for Nexub UI. The skill covers:

- **Setup:** installing the packages, theme CSS, the Tailwind preset and `ThemeProvider`.
- **Building screens:** pattern-first (dashboard, settings, auth, pricing, list/detail, onboarding), then components, then tokens.
- **Design rules:** the six Calm Depth principles, Liquid Glass rules and UI copy rules.
- **Reference:** every component and pattern (props, examples, when to use, accessibility) and every token (color roles, type, spacing, shape, elevation, motion).
- **Review checklist:** no hardcoded colors or spacing, one filled button per view, light/dark/high-contrast support, labelled controls.

The reference is generated from the design system's docs on every release, so it always matches the published `@nexub/*` packages.

## Install

```bash
claude plugin marketplace add Nexub-AI/nexub-ds
claude plugin install nexub-ds@nexub
```

Then ask Claude something like "build a SaaS settings page with Nexub DS".

Using Cursor, Windsurf or another MCP client? The same content is available as an MCP server: `npx -y @nexub/mcp` ([setup](https://github.com/Nexub-AI/nexub-ds/tree/development/packages/mcp)).

## Data and permissions

The skill is plain Markdown. It runs no code, makes no network requests, and collects or sends no data. The only commands it suggests are `npm install` for the public `@nexub/*` packages.

## License

MIT. Source: [github.com/Nexub-AI/nexub-ds](https://github.com/Nexub-AI/nexub-ds).
