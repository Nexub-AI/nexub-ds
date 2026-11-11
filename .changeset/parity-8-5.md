---
'@nexub/react': minor
---

8.5: web ↔ native parity. No new components or variants.

- Docs: a generated prop parity matrix on the React Native page lists, for every web component with a native twin, the props that share a name and the ones that exist on one platform only. CI fails when it is stale, so a prop added to one platform shows up in review.
- Same idea, same name. Where the platforms named one thing differently for no reason, the matching name is added and the old one is deprecated (it still works and is removed in 9.0):
  - Web: `onValueChange` on DatePicker, DateTimePicker and NumberInput (`onChange` deprecated), like every other Nexub input and React Native.
  - React Native: `dismissible` on Dialog and BottomSheet (`dismissable` deprecated), `minDate`/`maxDate` on DateTimeField (`minimumDate`/`maximumDate` deprecated), and `orientation="horizontal" | "vertical"` on ButtonGroup (`direction="row" | "stack"` deprecated).
- Docs: native prop tables now show `@default` values from JSDoc and mark deprecated props.
