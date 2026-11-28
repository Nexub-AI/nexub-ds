---
'@nexub/genui': minor
'@nexub/mcp': minor
'@nexub/core': minor
---

12.8 Generative UI alpha (RFC #823, accepted with changes on 2026-11-28).

- **`@nexub/genui`** (new, `alpha`): render the UI an agent returns as JSON with Nexub components, without trusting it. `<GenUI document={…} actions={['choosePlan']} onAction={…} />` validates every document before it renders: only catalog components and props, every string as text (no HTML, no Markdown, no `className`, `style`, `on*`, `ref`, `id` or `as`), and buttons that send a named action the host accepts. The v1 catalog is display-only: `Card`, `DescriptionList`, `Table`, `Badge`, `Alert`, `StreamingText` and `Button`; forms and fields come in v1.1. It takes JSON text while `streaming` (skeletons for nodes still arriving, buttons disabled, one "Answer ready" announcement), `onInvalid="drop" | "reject"`, `onIssues`, a narrowed `catalog`, lower `limits` (depth 16, 500 nodes, 256 kB by default) and `headingLevel`. `@nexub/react` is a peer dependency.
- **`@nexub/genui/schema`** (no React, no DOM, for servers): the versioned JSON Schema (2020-12, also published as `@nexub/genui/schema/v1.json`), `catalog` with `only()` and `without()`, a pure `validate()` that returns the cleaned document and issues with JSON Pointer paths, a streaming-tolerant `parsePartial()`, and `toolSchema()` for an LLM's structured-output or tool-input parameter.
- **`@nexub/mcp`**: three tools for agents that answer with UI: `get_genui_schema` (the schema and its rules, optionally narrowed to some components), `get_genui_component` (one catalog entry with an example) and `validate_genui` (the issues `<GenUI>` would find).
- **`@nexub/core`**: optional `genuiRegion`, `genuiReady` and `genuiFallback` messages, to translate GenUI with the rest of the app.
- **Native parity:** gap. The schema is platform-neutral, but only the web renderer ships in 12.8; native apps show the message's text answer.
