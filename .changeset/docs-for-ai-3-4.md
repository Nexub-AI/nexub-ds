---
"@nexub/mcp": minor
---

Docs for AI.

- **MCP prompts.** `@nexub/mcp` now offers two prompts next to its tools: `build_screen` (build a page or a React Native screen from a short description) and `review_screen` (check UI code against the Nexub checklist and fix it). Each carries the guidelines, so the model has the rules without a separate tool call. In Claude Code they appear as `/mcp__nexub-ds__build_screen` and `/mcp__nexub-ds__review_screen`.
- **A Markdown version of every docs page.** Each component and pattern page is also served as Markdown at the same URL plus `.md` (for example `/components/button.md`), and `llms.txt` links to those versions, following llmstxt.org. Pages get **Copy as Markdown** and **View as Markdown** buttons for pasting into any AI chat.
- **New docs page: AI tools and MCP.** How to connect the MCP server to Claude Code, Cursor, Windsurf or VS Code, the Claude Code plugin, `llms.txt` and `llms-full.txt`, and prompts that work.
- Pattern pages for the marketing sections now show the right import (`@nexub/marketing`, not `@nexub/patterns`).
