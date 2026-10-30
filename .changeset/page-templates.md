---
"@nexub/patterns": minor
"@nexub/react-native": minor
---

**Page templates, paired web and mobile.** `@nexub/patterns` adds full-page web twins of the native screens in `@nexub/react-native/patterns`, with the same data shapes (`Transaction`, `Quote`, `ReviewRow`, `ChatMessage`, `Plan`, `QuickAction`, `Insight`) so one data layer feeds both:

- `DashboardPage` ↔ new native `HomeScreen`: balance with quick actions, key figures, recent activity and insights (Payub-style home; native adds pull-to-refresh).
- `ActivityPage` ↔ `ActivityList`: grouped by day; Refresh and Load more stand in for pull-to-refresh and paging, `rowActions` for swipe actions.
- `TransactionDetailPage` ↔ `TransactionDetail`, `SettingsPage` ↔ `SettingsScreen`, `SignInPage` ↔ `SignInScreen` (passkey autofill), `CheckoutPage` ↔ `AmountStep` + `ReviewStep` + `ResultScreen`, `ChatPage` ↔ `ChatScreen`, `PaywallPage` ↔ `PaywallScreen`.
- Each renders a `<main>` landmark by default (`as="div"` inside an app shell), takes `messages` overrides on top of `NexubProvider` messages, and works from 360 px to desktop. `PageFrame` is the shared frame.
