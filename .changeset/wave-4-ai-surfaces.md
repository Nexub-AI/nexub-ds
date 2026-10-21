---
'@nexub/themes': minor
'@nexub/react': minor
'@nexub/patterns': minor
---

Wave 4 — AI surface kit (ENHANCEMENTS_PLAN.md).

- `PromptInput`: an auto-growing composer with attachment and action slots; Enter sends, Shift+Enter adds a line, IME-safe; Send becomes Stop while streaming (Escape stops too); solid or glass.
- `ThinkingIndicator`: a softly morphing shape with a shimmering label; `role="status"`; static under reduced motion.
- `StreamingText`: new text fades in as it arrives with a caret while streaming; `aria-busy` instead of a chatty live region.
- `MessageBubble` + `MessageActions`: user / assistant / system messages as labelled articles; copy (with a drawn check), thumbs up/down, regenerate; actions appear on hover or focus on pointer devices and stay visible on touch.
- `Citation`, `SourceChip`, `SourceList`: numbered source markers with a hover-card preview, and a source row; only http/https links are rendered (`safeUrl`).
- Patterns `Conversation`: a stick-to-bottom message list with a "Jump to latest" button and a composer slot.
- 18 new translatable messages in `NexubProvider` for the AI surfaces.
