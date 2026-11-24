---
'@nexub/react-native': minor
'@nexub/core': minor
---

11.8 Native catch-up I: fields (ROADMAP_12.x.md). The fields 11.1–11.5 fixed on web, on iOS and Android.

- **`@nexub/react-native`, new:** `ComboboxField` (a searchable sheet; `onSearch` may return a promise, debounced, stale answers ignored), `CurrencySelect`, `FileUpload` (bring your own `pickFiles` and `capture`; `accept`, `maxSize`, `maxFiles`, `transform`, `validate` in web's order), `usePrompt()` / `PromptDialog`, `SwitchField`, `CheckboxField`, `CheckboxGroupField`.
- **Fields:** TextField, PasswordInput, SearchField and MoneyInput take `invalid`, `readOnly`, `required`, `leadingIcon` / `trailingIcon`, `leadingAddon` / `trailingAddon`, `onClear` and `size="sm"`. PasswordInput: `visible`, `defaultVisible`, `onVisibleChange`. MoneyInput: `currencySlot`. Checkbox and Switch: `invalid`, `readOnly`, `size` (Switch also `checkedIcon` / `uncheckedIcon`). Stepper (web NumberInput): `nullable` (11.1 rules: empty state, clamp on blur), `precision`, `showSteppers`, `invalid`, `size`. SegmentedControl: `size`.
- **DateTimeField:** `granularity="month" | "year"` (a grid in a sheet; values `'2026-03'` / `'2026'`, typed by `DateTimeFieldPeriodProps`), `mode="datetime"`, `disabledDates`, `presets`, `minuteStep`, `clearable`, `defaultValue`, `defaultTime`, `timeZone`, `locale`, `disabled`, `readOnly`, `invalid`, `loading`, `size` and icon / addon slots. Time mode shows a clock icon. The OS day picker can't grey out days, so a pick on a disabled day keeps the old value and says the day is unavailable.
- **OTPInput:** `defaultValue`, `disabled`, `invalid`, `readOnly`, `size`, `name`; `mode="backup"` gets a capitals keyboard.
- **MultiSelect:** `onSearch` (async), `onCreate`, `inputValue` / `onInputChange`, `emptyText`, `loading`, `maxVisibleChips`, `readOnly`, `size`. The field now shows the picked values as chips.
- **Display:** TreeList (checkboxes with tri-state parents, `expanded`, `onLoadChildren`, `renderActions`, loading / empty / error states), StepProgress (`nonLinear`, `onStepChange`, `orientation`, `completed`), ActivityList states, Table `maxHeight` / `stickyHeader`, Button `status` with `successLabel` / `errorLabel`, IconButton `loading`, Link `external` / `variant` / `href`, Card `tone` / `variant` / `surface`, StatCard `change` / `note` / `tone`, Avatar `fallback` / `badgeColor`, AvatarGroup `spacing`, Skeleton `shape` / `animated`, Divider `tone`, ButtonGroup `attached`, InlineEdit `disabled` / `maxLength` / `size`, PhoneInput `size`.
- **`@nexub/core`:** `takePhoto` and `opensExternally` messages.
- **Parity:** web-only props on the 58 twins went from 283 to 140. 71 of them are web-only on purpose (`asChild`, browser drawer mechanics, DataTable column layout, …), each with its reason in the docs. The 69 real gaps left are listed on the React Native page, the largest DataTable → DataList (30) and Drawer → BottomSheet (13).
- **Docs:** the native essentials list (85 components) on the React Native page; native prop tables now include inherited props.
