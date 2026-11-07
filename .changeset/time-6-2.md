---
"@nexub/react": minor
"@nexub/core": minor
---

Time.

- **`TimePicker`** (new, beta): a time field on the native `<input type="time">`. Value is 24-hour `"HH:mm"`; the display is 12 or 24 hours from the reader's locale; `minuteStep` sets the arrow-key and picker step; phones open their own picker.
- **`DateTimePicker`** (new, beta): a `DatePicker` and a `TimePicker` that edit one `Date` (local time). `defaultTime` fills the time when the date is picked first; `timeZone` names the zone next to the fields.
- **`EventCalendar`** (new, beta): month and week grids of events (`{ id, title, start, end?, allDay?, tone? }`). Multi-day events show on each day, month view collapses extras into "N more", the week starts on the locale's first day, and Today / previous / next / Month–Week controls are built in. Display only: `onEventClick` and `onDayClick` hand the action to your app.
- New messages: `dateLabel`, `timeLabel`, `previousWeek`, `nextWeek`, `calendarView`, `monthView`, `weekView`.
