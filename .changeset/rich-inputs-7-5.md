---
'@nexub/react': minor
'@nexub/core': minor
---

7.5: rich inputs.

- `Input`: `clearable`, `showCount` (with `maxLength`; announced only near the limit) and `loading`.
- `Select`: `Root clearable`, `Item description` (the option's accessible description), and `Content searchable` (a filter field at the top; typeahead is unchanged when it's off).
- `Switch`: `loading` (spinner in the thumb, can't toggle) and `checkedIcon` / `uncheckedIcon`.
- `Combobox.List loading`; the list height animates as results change (also Autocomplete and MultiSelect).
- `DatePicker`: `typeable` (type a date in the locale's short format; invalid text is marked, the value is kept), `presets`, `disabledDates`, and a month crossfade.
- `Slider`: `marks` (ticks and labels, RTL-aware), `showValue` (`true` or `'hover'`) and `formatValue` (also sets `aria-valuetext`).
- `FileUpload`: image previews, paste to upload (through the same `accept` / `maxSize` / `validate` checks), and items that grow in and collapse out. A removed file now leaves after its exit animation, so tests that assert right after clicking Remove need `waitFor`.
- New messages: `clear`, `characterCount`.
