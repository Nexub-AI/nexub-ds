---
"@nexub/react": minor
"@nexub/core": minor
---

Forms 2.0.

- **`Form`** (new, beta): validates on submit with the browser's constraint validation (`required`, `type`, `pattern`, `min`…) plus an optional `validate(data)` for your own rules (zod plugs in here). Messages show on the matching `FormField` by `name`, the first invalid field takes focus, a field's error clears as you edit it, and `onInvalidSubmit` hands the list to `ErrorSummary`. An async `onSubmit` marks the form `aria-busy`; `useForm()` reads `{ errors, submitting }`.
- **`FormField`**: `Root` with a `name` inside a `Form` picks up that field's error (`invalid`, and `FormField.Error` shows the message when it has no children).
- **`Fieldset`** (new, beta): native `<fieldset>` and `<legend>` with an optional description; `disabled` disables every control inside.
- **`InlineEdit`** (new, beta): text that becomes an input on click. Enter or blur saves, Escape reverts, focus returns to the text; a rejected `onSave` promise keeps it open and invalid.
- **`useUnsavedChanges(dirty)`** (new): asks the browser to confirm before the page unloads while there are unsaved changes.
- New message: `editField`.
