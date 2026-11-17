---
'@nexub/react': minor
'@nexub/patterns': minor
'@nexub/themes': minor
'@nexub/tokens': minor
---

10.4 Consistent controls: one size scale, and invalid, read-only and disabled look the same everywhere.

- **Sizes**: `size="sm" | "md" | "lg"` on `Select.Trigger`, `Combobox.Input`, `MultiSelect`, `Autocomplete`, `DatePicker`, `DateRangePicker`, `DateTimePicker`, `Tabs.List`, `Slider`, `Checkbox`, `RadioGroup`, `OTPInput` and `FilterChip`. `md` is what each rendered before.
- **Invalid**: `invalid` on `Checkbox`, `RadioGroup`, `Switch`, `Slider`, `RadioCard`, `CheckboxCard`, `FileUpload`, `DatePicker` and `DateTimePicker`, so `FormField` marks them like a text field.
- **Read-only**: `readOnly` on every input. Text inputs get a quiet fill with readable text; selects, pickers, checkboxes, radios, switches, sliders and file upload stay focusable and cannot change. `NumberInput` steppers switch off.
- **Disabled**: `Label` uses the disabled colour instead of 50% opacity.
- **Density**: Pagination, OTPInput, FloatingInput, Chip, Badge, Table and calendar day cells step down under `data-density="compact"`.
- **Component tokens** for Dialog, Popover, menus, Tooltip, Toast, Tabs, Table, Switch, Checkbox, Avatar, Alert and the active navigation item (unset by default).
- **Type and px**: every component reads its type size from the type roles, and no arbitrary px is left. 12px text gains the label role's 0.01em tracking.
- Scrollbars are styled in Firefox; numbers in NumberInput, time and date pickers, Slider, FilterChip and AvatarGroup are tabular.
