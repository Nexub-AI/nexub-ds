---
'@nexub/react-native': minor
'@nexub/core': minor
---

`Kanban` for React Native: the web board's `columns`, `getId`, `getLabel`, `renderCard` and `onChange(columns, move)`, drawn as horizontally scrolling columns. Each card has a "Move to…" sheet listing the columns (and `dropTargets`), and VoiceOver and TalkBack get the same moves as actions ("Move to Done"), so no drag is needed. `readOnly`, `canMove`, `getTone`, `columnWidth`, `columnEmptyState`, `renderColumnHeader`, `renderColumnFooter` and `loading` / `emptyState` / `errorState` work as on the web.
`EventCalendar` for React Native, from its own entry point `@nexub/react-native/calendar`, with the `day` (one day by the hour, with the now line) and `agenda` (the month as a list, the default) views. Same event shape and prop names as the web, including the 12.2 `color` prop: any brand colour becomes a readable container in light and dark.
`LineChart` and `BarChart` (vertical, grouped or `stacked`) for React Native, from their own entry point `@nexub/react-native/charts`, drawn with react-native-svg. They take the same `data`, `index` and `series`, plus the 12.3 storytelling props `annotations`, `referenceLines` and `change`. Each chart is one image whose label reads the title, the change, every row and the notes. The product accent stays out of charts.
`@nexub/core` messages gain `moveCardTo` ("Move to…") and `moveToColumn` ("Move to Done") for the native Kanban's move sheet and actions.
Still web only, for a later release: Kanban `lanes` / `getLane` and drag; EventCalendar `onEventMove` (the month and week views stay web only on purpose); chart `interactive`, `onPointClick`, `hiddenSeries`, `tableView`, and BarChart `orientation="horizontal"` and `variant="waterfall"`. The three have no live preview in the mobile app yet.
