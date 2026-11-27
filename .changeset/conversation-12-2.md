---
'@nexub/patterns': minor
'@nexub/core': minor
---

Conversation: new `DateSeparator` shows "Today", "Yesterday" or a medium date ("25 Nov 2026") between messages, in the provider's locale.
Conversation: when messages arrive while you're scrolled up, "Jump to latest" becomes "Jump to newest" and "New messages" is announced once per batch.
Conversation: new `thinking` slot at the end of the list for a `ThinkingIndicator`, announced politely and never moving the scroll.
Conversation: the scroller itself is now `relative`, so MessageBubble's screen-reader labels stay inside it (no more `[&>div>div:first-child]:relative` workaround).
Core messages: new `jumpToNewest`, `newMessages` and `yesterday` strings (DateSeparator also uses the existing `today`).
