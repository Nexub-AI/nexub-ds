# @nexub/elements: accessibility review (11.9)

The screen-reader pass that [ROADMAP_12.x.md](../../ROADMAP_12.x.md) § 11.9, [RFC_elements.md](../../RFC_elements.md) ("a screen-reader pass (VoiceOver, NVDA) before `beta`") and the `alpha → beta` criteria in [GOVERNANCE.md](../../GOVERNANCE.md) ask for, in two halves:

1. **Automated pass** (done, 2026-11-24): what a browser can check by itself, in Chromium, WebKit and Firefox. Everything it found is fixed and has a regression test.
2. **Human pass** (to do): VoiceOver and NVDA, with the checklist at the end. The maintainer promotes the package to `beta` after it, not before. This review does not change the package status.

Scope: `<nx-number-input>` and `<nx-date-picker>` (day, month and year grids; popover and bottom sheet), through the Storybook stories in `stories/`: NumberInputElement (Default, Sizes, Disabled, Invalid/required), DatePickerElement (Default, Month granularity, Year granularity, MinMax, Open) and Elements (Form).

## What the automated pass covered

| Check | How | Engines |
|---|---|---|
| axe (WCAG 2.2 A/AA, plus best-practice in the audit run) | every story, light and dark; the day, month and year calendars open | Chromium, WebKit, Firefox |
| Accessibility tree | `ariaSnapshot()` of every story and of the open calendar: every control has a role and a name; spinbutton values; grid, rows, column headers, cells | all three |
| Keyboard walk | 40 Tabs forward and 12 back from the top of every story; the grid keys (arrows, Page Up/Down, Shift+Page Up/Down, Home/End, Enter, Escape); Tab inside the open calendar; where focus is after Escape and after a pick | all three |
| Live region | a `MutationObserver` on the calendar title (`aria-live="polite"`) while moving through the grid and changing month | all three |
| Forced colours | `forced-colors: active` screenshots and computed system colours (selected day, field border) | Chromium (the only engine that emulates it) |
| Reflow | 320 × 640 viewport: no sideways page scroll, the open calendar as a bottom sheet | all three |
| Reduced motion | the calendar opens without an animation under `prefers-reduced-motion: reduce`, with one without it | all three |

The audit scripts were throwaway; what they found is kept as regression tests in `src/date-picker.test.ts` (jsdom) and `packages/react/visual/elements.spec.ts`, describe block *screen-reader pass (11.9)* (all three engines, in the pinned Playwright Docker image).

## What it found, and the fixes

| # | Severity | Engines | Finding | Fix | Tests |
|---|---|---|---|---|---|
| E1 | Serious | Firefox, WebKit | At 320px the page scrolled sideways (9 to 14px): the inner `<input>` kept its intrinsic ~20-character width as the field's narrowest size, so a grid or flex parent could not shrink the field (WCAG 1.4.10 Reflow). Both elements; the date picker overflowed at 320px, the number input just under. | The inner input is `inline-size: 100%` (with `flex: 1; min-inline-size: 0`), so the field's narrowest size is its padding and button. A field in a shrink-to-fit box keeps its width. | visual: *reflows at 320px with no sideways scroll* (date picker, number input, form), *a field in a shrink-to-fit box keeps a usable width*; the existing screenshot baselines are unchanged |
| E2 | Moderate | all | After Escape or a pick, the dialog's own focus restore put focus on the calendar button, and the field only got it a task later (on the `close` event): enough time for a screen reader to say "Pick a date, button, collapsed" before the field. | `close()` moves focus to the field in the same task. Escape is handled on the dialog's `keydown` and goes through `close()`. Other close requests (Android back) still clean up through the `close` event, and a late `close` event can't collapse a calendar opened again. | unit: *Escape and a pick put focus on the field in the same task, not a task later*, *closes when the dialog closes itself (a close request) …*, *a late close event does not collapse a calendar opened again*; visual: *Escape and a pick put focus on the field at once: the calendar button is never left focused* |
| E3 | Moderate | all | The month title is the live region that announces a month change, and it was rewritten on every arrow key (the grid is redrawn), so each key could re-announce "March 2024". | The title is written only when it changes. | unit: *changes the live title only when the month changes*; visual: *the month title (a live region) changes only when the month does* |
| E4 | Minor | Firefox, WebKit | The `<dialog>` box (a scroll container) was a Tab stop of its own: Tab from the day grid went to the browser, then to an empty "Pick a date, dialog", then to the nav buttons. | `tabindex="-1"` on the dialog. Focus still starts on the active day. | unit: *is registered and form-associated, with a field, a button and a dialog*; visual: *Tab inside the calendar moves among its controls, never onto the dialog box itself* |
| E5 | Minor | all | Every calendar button had the same name, so a form with two date pickers listed two "Pick a date" buttons (a screen reader's buttons list; WCAG 2.4.6). | The button carries the field's name: "Pick a date, Start date", "Pick a month, Billing month". It follows the field's `<label>` or `aria-label`. | unit: *names the calendar button with the field*; visual: *each calendar button carries its field's name* |

Checked and found fine: both fields named from `<label for>` through `ElementInternals` (and `aria-label`); the number input is a spinbutton with `aria-valuenow` / `aria-valuemin` / `aria-valuemax` kept in step with Arrow, Page Up/Down, Home and End; `aria-required` and `aria-invalid` (after a failed submit) on the inner input; disabled from the element or a `<fieldset>`; the calendar button has `aria-haspopup="dialog"` and `aria-expanded`; the calendar is a modal `<dialog>` named "Pick a date / month / year"; the day grid is a `role="grid"` table named by its month, with full weekday names (`abbr`) on the column headers, every day named in full ("Thursday, March 14, 2024"), "Today, …" and "…, selected"; month and year cells are `aria-pressed` toggles whose names start with their visible text; disabled days outside `min` / `max`; the nav buttons are named; focus starts on the selected (or today's) date and returns to the field; no focus trap (the modal keeps focus inside the calendar until Escape or a pick, as a modal dialog does); the sheet layout below 768px has 44px day targets; selected and current day keep their look in forced colours; the open animation only plays without reduced motion.

### Public API

No change: no new attribute, property or event. The calendar button's accessible name now includes the field's name, and the dialog has `tabindex="-1"`.

### What the automated pass could not check or settle

- **What screen readers actually say**: roles, names and live-region changes are checked; speech, verbosity and timing are not. That is the human pass.
- **Validation messages.** An invalid field sets `aria-invalid="true"` and the browser's own message (from `setValidity`) shows in the native bubble on submit. The message is not tied to the field with `aria-describedby`, as on a native `<input>`. Whether it is read on submit, and on focus later, needs checking (steps H12, H13).
- **"Selected" said twice.** The selected day's cell has `aria-selected="true"` and its button's name ends in ", selected". Some screen readers may say "selected" twice.
- **The typed date format** is only a placeholder ("mm/dd/yyyy"). Placeholders are read on focus by most screen readers, but not all; check it is announced.
- **Focus leaving a modal dialog to the browser UI** (Tab from the last control) is the browser's own behaviour for `showModal()`, not a trap; the human pass checks it feels right with each screen reader.
- **Forced colours** in WebKit and Firefox, and real Windows High Contrast themes.
- **Touch**: the bottom sheet with VoiceOver on iOS (swipe order, the backdrop, closing it).

## Human pass: checklist

Run Storybook from the repo (`pnpm --filter @nexub/react storybook`) and open the stories on their own, without the Storybook frame: `http://localhost:6006/iframe.html?id=components-elements--form&viewMode=story` (other ids: `components-datepickerelement--default`, `--month-granularity`, `--year-granularity`, `--min-max`; `components-numberinputelement--default`, `--invalid-required`, `--disabled`). For iOS, open the same URL from the Mac's address on the local network; the calendar is a bottom sheet there.

Mark each box **P** (pass) or **F** (fail, with a note under the table). "Announces" is what should be said, not word for word: order and wording vary by screen reader.

Setups: **VO-mac** VoiceOver, macOS Safari · **VO-iOS** VoiceOver, iOS Safari · **NVDA-FF** NVDA, Windows Firefox · **NVDA-Ch** NVDA, Windows Chrome.

| # | Story | Do | Announces | VO-mac | VO-iOS | NVDA-FF | NVDA-Ch |
|---|---|---|---|---|---|---|---|
| H1 | Form | Tab to Age. | "Age", stepper/spin button, "required", empty; the placeholder "18–120". | [ ] | [ ] | [ ] | [ ] |
| H2 | NumberInput Default | Tab to Quantity; Up Arrow, Page Up, End, Home (on iOS: swipe up / down on the field). | "Quantity", spin button, 5; then 6, 16, 100, 0 as the value changes. | [ ] | [ ] | [ ] | [ ] |
| H3 | Form | Tab to Start date. | "Start date", edit text / text field, "required", the placeholder "mm/dd/yyyy". | [ ] | [ ] | [ ] | [ ] |
| H4 | Form | Tab once more. | "Pick a date, Start date", button, collapsed (popup / dialog). The next calendar button says "Pick a month, Billing month". | [ ] | [ ] | [ ] | [ ] |
| H5 | DatePicker Default | Open the calendar (Enter or Space; double-tap on iOS). | "Pick a date", dialog; "March 2024" grid/table; "Thursday, March 14, 2024, selected" (on the focused day). "Selected" once, not twice. | [ ] | [ ] | [ ] | [ ] |
| H6 | DatePicker Default | Right Arrow, Down Arrow, Home, End, then Page Down, then Shift+Page Down. | Each day's full name as focus moves, without "March 2024" repeated on every key; on Page Down "April 2024" once (polite) and the new day; on Shift+Page Down the next year's month. | [ ] | n/a | [ ] | [ ] |
| H7 | DatePicker Default | In the open calendar, Tab several times, then Escape. | Previous / next month buttons, the focused day; never an empty "dialog" stop. On Escape: straight to "Due date", edit text, with its value, **not** "Pick a date, button" first. | [ ] | n/a | [ ] | [ ] |
| H8 | DatePicker Default | Open it, pick a day with Enter (double-tap on iOS). | Calendar closes; "Due date", edit text, the new date; no "Pick a date, button" before it. | [ ] | [ ] | [ ] | [ ] |
| H9 | DatePicker Month granularity | Open the month calendar; arrows; Enter. | "Pick a month", dialog; "2024" group; "March 2024", toggle button, pressed / selected; then other months by full name. | [ ] | [ ] | [ ] | [ ] |
| H10 | DatePicker Year granularity | Open the year calendar; arrows to 2026. | "2016 – 2027"; year cells; 2026 and 2027 dimmed / unavailable (outside `max`). | [ ] | [ ] | [ ] | [ ] |
| H11 | DatePicker MinMax | Open it; Page Up, Page Down, browse the grid. | Days before the 5th and after the 25th read as dimmed / unavailable; "Go to previous month" and "Go to next month" unavailable. | [ ] | [ ] | [ ] | [ ] |
| H12 | Form | Leave everything empty and press Send. | Focus to Age; the browser's message ("Please fill out this field." or the system language) is read; "invalid" on Age. | [ ] | [ ] | [ ] | [ ] |
| H13 | NumberInput Invalid/required | Tab to "Guests (at most 8)". | "invalid entry" / "invalid data"; note whether the reason ("Value must be less than or equal to 8") is read anywhere. Expected: it is not (see above); record what is. | [ ] | [ ] | [ ] | [ ] |
| H14 | Form | Type 200 in Age and Tab away. | The field shows 120 (clamped on blur); the new value is read when you go back to it. | [ ] | [ ] | [ ] | [ ] |
| H15 | NumberInput Disabled | Browse to Seats. | "Seats", dimmed / unavailable, 2. Not reachable with Tab. | [ ] | [ ] | [ ] | [ ] |
| H16 | DatePicker Default | VO-iOS only: open the calendar (bottom sheet), swipe through it, then use the two-finger scrub (Z) gesture. | Grid read day by day with full names; the scrub gesture closes the sheet and VoiceOver lands on the date field. | n/a | [ ] | n/a | n/a |
| H17 | Form | With the system set to reduce motion, open a calendar. | It appears at once, with no zoom-in. | [ ] | [ ] | [ ] | [ ] |
| H18 | DatePicker Default | Windows High Contrast (Contrast themes) on, NVDA-FF and NVDA-Ch only; open the calendar. | Field border, focus ring, the selected day (highlight colours) and today's ring all visible. | n/a | n/a | [ ] | [ ] |
| H19 | Form | 200% browser zoom (or a 320px-wide window): Tab through and open a calendar. | No sideways scrolling; the calendar fits (bottom sheet below 768px). | [ ] | n/a | [ ] | [ ] |

Notes on failures:

-
