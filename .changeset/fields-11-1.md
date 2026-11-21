---
'@nexub/react': minor
'@nexub/core': minor
'@nexub/themes': minor
'@nexub/react-native': minor
---

11.1 Fields stop fighting the user. Closes the platform's open P1 gaps (ROADMAP_11.x.md: #1 check, #2, #3, #4, #5, #6, #27). Additive and opt-in; no default changes.

- **NumberInput** (#2): `nullable` lets the field be empty (`null`, not 0) and keeps a half-typed `2.` or `-` while focused. `min` and `max` apply on blur, steppers and arrow keys, never mid-typing (typing 30 with a minimum of 15 no longer snaps the 3 to 15). `step="any"`. A focused field keeps what was typed, so `precision` formats on blur. Existing callers that pass a number are unchanged.
- **DatePicker** (#4): `granularity="month" | "year"` with `'YYYY-MM'` / `'YYYY'` values: a grid of months or years in the same popover and phone sheet, arrow keys and Page Up/Down, `minDate` and `maxDate`. Replaces `<input type="month">`.
- **FileUpload** (#5): `FileUpload.Trigger` (an outlined button, an `iconOnly` paperclip, or your own Button with `asChild`) with no drop zone; controlled `files` / `defaultFiles`; `capture` for the phone camera; `transform(file)` before the size check (shrink a photo); `disabled`, `busy` and `progress`; `Dropzone size="sm"`.
- **ComboboxField** and **ComboboxPicker** (#6, new): a searchable single choice on the field tokens, with label, description and inline error. Grouped options, `keywords` and a second line per option, a `noneOption`, async search (`onSearch`, `loading`, `selectedOption`), and a hidden input with `name`.
- **SwitchField**, **CheckboxField**, **CheckboxGroupField** (#27, new): label, description and error; switch-before-label `layout="start"`; checkbox `aside` and `indeterminate`; a fieldset group with one error. **Text** `tone="danger" | "success" | "warning"`.
- **Phone** (#3): `formatPhone(e164, { style: 'national' | 'international' })` for read-only display, and `parsePhone()` now also returns `dialCode`. Both, with `isValidPhone`, are exported from `@nexub/react` (and `formatPhone` from `@nexub/react-native`). The E.164 string stays the one stored form.
- **Vivid** (#1): every vivid component rule stops at the nearest expression, so `data-expression="calm"` on a wrapper inside a vivid page opts that area back out (CheckboxCard and RadioCard included). Shadows inside the calm area keep vivid's faint accent tint.
- **Native parity:** the native Checkbox already carries its label and description; native has no NumberInput, DatePicker, FileUpload or Combobox twin yet, so those props have no native port in 11.1.
- **The platform can delete** these admin-ui stopgaps: NumberField's nullable path, FileField, ComboboxField, ComboboxPicker, PickField, SwitchField, CheckboxField, CheckboxGroupField, and `TextField type="month"` month pickers.
