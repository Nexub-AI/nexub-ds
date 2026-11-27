---
'@nexub/react': minor
'@nexub/core': minor
---

MessageBubble: `avatar` now works on your own messages (`from="user"`) and sits at the inline end, mirroring the assistant's. The accessible name stays "You said".
MessageBubble: `collapse={lines}` clamps a long message with a fade and a built-in "Read more" / "Show less" toggle (`aria-expanded`), shown only when the content is taller than the clamp.
New `MessageCard` (beta): a bordered block inside a bubble with `title`, `status`, `fields` (label/value pairs, two columns on wide cards), `body`, `actions` (one filled button at most, extras in a "More actions" menu past two), `maxHeight` with "Show all", and a `done` line with a `SuccessCheck`.
New `Highlight` (beta): an inline span for amounts, dates and statuses in running text, in six tones (`neutral`, `primary`, `success`, `warning`, `error`, `info`), AA in both themes.
New messages `readMore`, `showLess` and `showAll` (English defaults) in `NexubMessages`.
