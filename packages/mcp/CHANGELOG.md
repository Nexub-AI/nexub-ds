# @nexub/mcp

## 4.8.0

## 4.7.0

## 4.6.0

## 4.5.0

## 4.4.0

## 4.3.0

## 4.2.0

## 4.1.0

## 4.0.0

## 3.9.0

## 3.8.0

## 3.7.0

## 3.6.0

## 3.5.0

## 3.4.0

### Minor Changes

- a227275: Docs for AI.

  - **MCP prompts.** `@nexub/mcp` now offers two prompts next to its tools: `build_screen` (build a page or a React Native screen from a short description) and `review_screen` (check UI code against the Nexub checklist and fix it). Each carries the guidelines, so the model has the rules without a separate tool call. In Claude Code they appear as `/mcp__nexub-ds__build_screen` and `/mcp__nexub-ds__review_screen`.
  - **A Markdown version of every docs page.** Each component and pattern page is also served as Markdown at the same URL plus `.md` (for example `/components/button.md`), and `llms.txt` links to those versions, following llmstxt.org. Pages get **Copy as Markdown** and **View as Markdown** buttons for pasting into any AI chat.
  - **New docs page: AI tools and MCP.** How to connect the MCP server to Claude Code, Cursor, Windsurf or VS Code, the Claude Code plugin, `llms.txt` and `llms-full.txt`, and prompts that work.
  - Pattern pages for the marketing sections now show the right import (`@nexub/marketing`, not `@nexub/patterns`).

## 3.3.0

## 3.2.0

## 3.1.0

## 3.0.0

## 2.9.0

## 2.8.0

## 2.7.0

## 2.6.0

## 2.5.0

## 2.4.0

### Patch Changes

- da054ef: Governance and component status. New `GOVERNANCE.md`: RFCs (when they are required and a template), who decides, the `alpha → beta → stable → deprecated` lifecycle with promotion criteria, and the deprecation policy (deprecate in a minor, remove only in the next major). The `@deprecated` JSDoc on `Banner`, `Callout`, `Tag` and `StatusPill` now says their removal is planned in 3.0 (it said 1.0); no behaviour change. The docs show a status badge on every component page, including Alpha on the React Native pages, and a "Deprecated — removal planned in 3.0" notice with the replacement on deprecated ones; the AI references in `@nexub/mcp` carry the same removal note.

## 2.3.1

### Patch Changes

- c67c72a: Published with npm trusted publishing (OIDC) from the `Nexub-AI/nexub-ds` release workflow, so every version now carries npm provenance: you can check on npmjs.com that it was built from this repository's source. No code changes.

## 2.3.0

## 2.2.0

## 2.1.0

### Minor Changes

- 1983f67: **React Native: docs, AI tooling and app icons** (MOBILE_PLAN.md, phase M5):

  - `@nexub/react-native` README is the reference: install, provider, every component and screen pattern, and the rules they follow.
  - Claude skill and `llms.txt` / `llms-full.txt` include the React Native reference. `@nexub/mcp` adds a `get_react_native` tool.
  - Docs: a Getting started → React Native page, with a web-to-native component map.
  - `@nexub/brand`: mobile app icons for the hub and every product. `assets/mobile/<product>-ios.png` is a 1024 px full-bleed square; the Android adaptive icon ships as `-android-foreground/background/monochrome.png` layers, including a monochrome layer for Android 13+ themed icons.

## 2.0.0

## 1.9.0

## 1.8.0

## 1.7.0

### Minor Changes

- b341d66: New `@nexub/mcp` package: an MCP server (`npx -y @nexub/mcp`) that gives Claude, Cursor and any MCP client the components, patterns, tokens and design rules of the installed release. Ships alongside the `nexub-ds` Claude Code plugin and `llms.txt` on the docs site, all generated from the docs registry.
