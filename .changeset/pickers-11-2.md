---
'@nexub/react': minor
'@nexub/core': minor
'@nexub/react-native': minor
---

11.2 Pickers and prompts. Closes the platform's input gaps #8, #9, #10, #15, #17, #30, #31 and #33 (ROADMAP_11.x.md). Additive and opt-in; no default changes.

- **CurrencySelect** and **CurrencyField** (#8, new): a searchable ISO 4217 list built from `Intl` (code, name and symbol), on ComboboxField, with `currencies`, `priority` and group headings. `currencyOptions(locale)` returns the same options. **MoneyInput** `currencySlot` puts a CurrencySelect (or anything) before the amount.
- **AlertDialog.Prompt** and **`usePrompt()`** (#9, new): ask for a reason or a name in place of `window.prompt`: `label`, `required`, `minLength`, `maxLength`, `validate`, `multiline`, `tone`, and a busy state while `onSubmit` runs (a rejection shows its message and keeps the dialog open). `await prompt(options)` resolves to the trimmed answer or `null`.
- **Autocomplete** (#10): visible `label`, `clearOnSelect` ("add" mode), `onClear` with a clear button, option `description` (a searched second line) and `disabled`. **MultiSelect**: `onSearch` (async, as on ComboboxField), option `description`, `disabled` and `avatar` (in the list and on the chip); picked values keep their label and avatar when they leave `options`.
- **Date pickers** (#17): DateTimePicker `clearable`. DateRangePicker `endExclusive` (a half-open `to`, in and out) and `onComplete` (once both ends are set).
- **ColorPicker** (#15, new): swatches (with optional names), a hex field, and `contrastAgainst` for a WCAG AA text hint. Popover, sheet on phones. `contrastRatio()` and `parseHex()` are exported.
- **CommandList** (#30, new): the searchable, grouped, keyboard list from CommandPalette as an inline part for dialogs, sheets and pages: `items`, `onSelect`, async `onSearch` and `loading`, shortcuts and icons.
- **OTPInput** (#31): `mode="backup"`, a 12-character recovery code in one field grouped in fours (the value has no dashes); `autoFocus`; an uncontrolled code posts with `name` and empties on form reset.
- **EmojiPicker** and **IconPicker** (#33, new): search, categories, recent picks (kept in localStorage) and skin tone for emoji; IconPicker lists `@nexub/icons` by name, with optional categories. The emoji data and the icon set load only when a picker opens. `EmojiPickerPanel` and `IconPickerPanel` fit inside your own popover.
- **Native parity:** OTPInput `mode="backup"` and MultiSelect option `disabled` and `avatar` (with search by description) are ported to `@nexub/react-native`. Native has no Autocomplete, DateRangePicker, ColorPicker, CommandList, Emoji or Icon picker, or AlertDialog prompt yet; DateTimeField has no clear button yet.
- **The platform can delete** these admin-ui stopgaps: `CurrencyField` and `CURRENCY_OPTIONS`, `askText()` and the `window.prompt` calls, `SearchField`, and the free-text emoji fields in Mind spaces and docs.
