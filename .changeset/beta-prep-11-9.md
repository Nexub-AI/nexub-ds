---
'@nexub/elements': minor
'@nexub/diagram': minor
'@nexub/core': minor
'@nexub/react': minor
'@nexub/tokens': minor
'@nexub/patterns': patch
---

11.9 Alpha → beta prep, and RFC 12.0 (ROADMAP_12.x.md).

- **`@nexub/elements`, new:** `<nx-select>`, `<nx-combobox>` (async `onsearch`, stale answers dropped, `allow-custom`) and `<nx-phone-input>` (E.164 form value, the same phone rules as React). All form-associated, with `invalid` on every field. One element at a time: `@nexub/elements/define/<name>`.
- **Screen-reader pass, automated half** (`A11Y_REVIEW.md` in each package; the human VoiceOver / NVDA pass follows before beta):
  - **Diagram:** connections are named by their node titles and share one Tab stop. Node order follows the layout. A focused connection can be deleted. Repeated announcements are read again, and a delete names what went.
  - **`<nx-date-picker>`:** no sideways scroll at 320px. Focus goes back to the field at once. The month is announced only when it changes, and the calendar button carries the field's name.
- **`@nexub/react`:** opt-in `@nexub/react/styles.nexub-layer.css`, every style in one `nexub` layer, as RFC 12.0 proposes for `styles.css`. Load it first, or declare `@layer nexub;`, and app CSS always wins. Fix: the deprecated `Stepper current={-1}` marks the last step complete too.
- **`@nexub/core`:** `choiceFieldMessages`, `invalidPhone`, `phoneCountryOf(locale)` (React PhoneInput uses it), and the diagram edge messages.
- **`@nexub/tokens`:** `nexub-migrate --rules changes-in-12` (opt-in until 12.0).
- **`@nexub/patterns`:** the README no longer points Tailwind 3 apps at the preset removed in 4.0.
- **RFC 12.0** (`RFC_12.0.md`) is open for comment. Nothing breaking ships until it is accepted.
