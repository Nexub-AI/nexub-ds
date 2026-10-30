---
"@nexub/react-native": minor
"@nexub/core": minor
---

**React Native core components** (MOBILE_PLAN.md, phase M2), alpha:

- **Actions:** `Button` (filled/tonal/outlined/text/glass, `tone`, xs–xl, `loading`, icons), `IconButton`, `ButtonGroup`, `Link`.
- **Data:** `Amount` (Intl, tabular, `tone="auto"`, hero `display`), `Badge` (solid/soft/outline, `dot`; covers web's deprecated Tag/StatusPill), `Avatar`, `AvatarGroup`, `Divider`.
- **Inputs:** `TextField` (label, helper, error in one), `PasswordInput`, `SearchField`, `MoneyInput` (locale parsing), `Stepper`, `Checkbox`, `RadioGroup`/`Radio`, `Switch` (the platform switch in Nexub colours), `SegmentedControl`, `Slider`, `Chip`/`FilterChip`.
- **Containers:** `Card`, `ListItem` (navigation/switch/checkbox/radio/button/value rows; one target, one screen-reader element), `ListSection` (inset-grouped), `Accordion`.
- **Feedback:** `Banner`, `ToastProvider`/`useToast` (one at a time, announced; 10 s when it has an action), `Dialog`, `Progress` (linear/circular), `LoadingIndicator`, `Skeleton`, `EmptyState`, `ErrorState`.
- Every control reaches a 44pt touch target and uses the shared state layer, press spring and semantic haptics.
- `@nexub/core` money helpers work on Hermes for iOS, which lacks `resolvedOptions`/`formatToParts`: the same values are derived from `format()`.
