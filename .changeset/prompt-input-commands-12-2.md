---
'@nexub/react': minor
'@nexub/core': minor
---

12.2 PromptInput: slash commands and quick replies.

- **`commands` and `onCommand(value, args)`:** typing `/` opens the commands (`CommandListItem[]`, with `shortcut` keys) in a list above the field, filtered as you type. ↑/↓ move, Enter or Tab picks, Esc closes and keeps the text. `/remind tomorrow 9am` + Enter calls `onCommand('remind', 'tomorrow 9am')`; uncontrolled input then clears. Text that matches no command submits as usual. The field is a combobox only while the list is open, and the list loads on the first `/`.
- **`chips`:** a quick-reply row above the field (e.g. `Button size="sm" variant="tonal"`), labelled "Suggestions". On a phone it scrolls sideways with snap and edge fades instead of wrapping.
- **Messages:** `promptSuggestions` ("Suggestions") and `promptCommands` ("Commands") in `NexubMessages`.
