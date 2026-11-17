---
'@nexub/react': minor
'@nexub/patterns': minor
'@nexub/core': minor
---

10.8 Templates: twelve new page templates and the three controls they needed.

- **Getting in**: `SignUpPage` (password strength said in words, optional phone, terms), `ForgotPasswordPage` (request and "check your email" with a resend cooldown), `VerifyCodePage` (OTP and 2FA with resend countdown, other methods, code lifetime), `OnboardingPage` (a generic step wizard with validation, skip and a completion view) and `KycPage` (personal details, document upload, review, status).
- **Daily work**: `TablePage` (search, filters, tabs, bulk and row actions, pagination), `DetailPage` (view and edit modes with an unsaved-changes guard), `BookingPage` (date, time slot, confirm, with an optional hold timer), `InvoicePage` (invoice and receipt), `TeamPage` (members, roles, invites, seats), `NotificationsPage` (grouped by day, tabs, load more) and `SearchResultsPage` (highlighted matches, kinds, pagination).
- **`PhoneInput`** (#303): country picker, formatting as you type, E.164 out, paste of full international numbers. Country calling codes and helpers (`parsePhone`, `formatNational`, `toE164`, `isValidPhone`) are in `@nexub/core`.
- **`Countdown`** and `useCountdown` (#304): time left to a deadline that stays right after the tab was in the background, tone changes near the end, and announcements at sensible intervals only.
- **`TimeSlotPicker`**: a radio group of time slots, optionally grouped into morning, afternoon and evening.

Every template uses the 10.3 look, the 10.5 loading, empty and error states and the 10.6 phone behaviour, and responds to its container.
