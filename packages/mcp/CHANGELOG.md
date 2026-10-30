# @nexub/mcp

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
