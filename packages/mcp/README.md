# @nexub/mcp

MCP server for the [Nexub Design System](https://nexub-ds-docs.pages.dev). It gives your AI coding tool the components, patterns, tokens and design rules of the release you install, so it builds UI with Nexub instead of generic Tailwind.

## Setup

Claude Code:

```bash
claude mcp add nexub-ds -- npx -y @nexub/mcp
```

Cursor, Windsurf, VS Code or any client that takes an `mcpServers` config:

```json
{
  "mcpServers": {
    "nexub-ds": { "command": "npx", "args": ["-y", "@nexub/mcp"] }
  }
}
```

Using Claude Code? The `nexub-ds` plugin ships the same content as a skill:

```bash
claude plugin marketplace add Nexub-AI/nexub-ds
claude plugin install nexub-ds@nexub
```

## Tools

| Tool | Returns |
| --- | --- |
| `get_guidelines` | Setup, how to build a screen, Calm Depth principles, Liquid Glass and copy rules, review checklist |
| `list_components` | Every component and pattern, optionally filtered (`query: "table"`) |
| `get_component` | Props, import, examples, when to use and accessibility for one component (`name: "DatePicker"`) |
| `get_tokens` | Color roles, typography, spacing, shape, elevation, motion, with Tailwind utilities (`section: "Motion"`) |

## Staying current

The server reports the reference of the version it was published with, and it is versioned with `@nexub/react`. `npx -y @nexub/mcp` always fetches the latest release. Pin `@nexub/mcp@<version>` to match an older install.
