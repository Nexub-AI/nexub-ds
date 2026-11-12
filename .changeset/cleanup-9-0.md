---
'@nexub/react': minor
---

9.0: the clean-up major. It removes what 8.x deprecated and adds nothing. See "Migrating to 9.0"; `npx nexub-migrate src --rules changes-in-9,button-aliases --write` does most of it.

- **Classic style removed.** Signature is the only style. `data-style="classic"` does nothing now, and the roles CSS no longer ships the classic or `[data-style]` subtree blocks. React Native: the `style` prop on `NexubNativeProvider` and the `DesignStyle` type are gone.
- **Button legacy variants removed:** `primary`, `secondary`, `outline` and `ghost` (use `filled`, `tonal`, `outlined`, `text`), along with the `ButtonLegacyVariant` type and the vivid `[data-variant='primary']` selector.
- **8.5 parity aliases removed:** `onChange` on `DatePicker`, `DateTimePicker` and `NumberInput` (use `onValueChange`). React Native: `dismissable` on `Dialog` and `BottomSheet` (use `dismissible`), `minimumDate`/`maximumDate` on `DateTimeField` (use `minDate`/`maxDate`), and `direction` on `ButtonGroup` (use `orientation`).
- **`hidePassword` message removed** (deprecated in 7.2).
- `nexub-migrate changes-in-9` now also reports `style="signature"` on `NexubNativeProvider`, since the whole prop is gone.
- The raw-px, RN numeric-style, coverage and parity gates keep blocking any new entry. Their existing allowlists can still only shrink, and 9.x clears them.
