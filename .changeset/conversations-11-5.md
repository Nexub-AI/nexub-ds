---
'@nexub/react': minor
'@nexub/core': minor
'@nexub/patterns': minor
'@nexub/tokens': minor
---

11.5 Conversations, lists, chrome and the last P4s. Closes the platform gaps #18, #19, #20, #21, #28, #29, #35, #37 and #38 (ROADMAP_11.x.md). Additive and opt-in; no default changes. The web components (#36, `@nexub/elements`) wait for their RFC (#712).

- **PromptInput and chat parts** (#18): PromptInput `sendLabel` (a visible label), `submitOn="mod-enter"` (Enter adds a line, Cmd/Ctrl+Enter sends, with a hint), `hint` and `error`. MessageBubble `from="other"` with a `name` and `meta` header for group threads; MessageActions `actions` for custom actions. Conversation `maxHeight`: it sizes itself in normal flow without a fixed-height parent.
- **SavedViews** (#19): `onSave`, `onUpdate`, `onDelete` and the new `onRename` may return a promise (busy, and its error shown); `confirmDelete`; `defaultView`; `maxLength`.
- **TreeView** (#20): `renderActions` (row actions that never shift the row), `trailing` meta, link nodes (`href`, Cmd/Ctrl-click opens a tab), `onActivate` separate from selection (Enter, double-click), and `ref.scrollToNode(id)`.
- **ActivityFeed** (#21): `timestamp` as a `Date` in `<time dateTime>` with a relative text and a full-date tooltip; `actions`; `tone`; `ActivityFeed.Group` headers; title and description no longer force `<p>`.
- **NavigationRail** (#28): `orientation="bottom"`, a phone tab bar; `badge` (a count or a dot) with an accessible label.
- **InlineEdit** (#29): `size` up to `headline`, `as` (a heading, `Sheet.Title`), `maxLength` with a counter.
- **OrgChart** (#35, new): cards with photo, name and role on the TreeView data shape, expand and collapse, keyboard navigation as a tree, and a TreeView on narrow screens.
- **Layout polish** (#37): Alert `title` and AuthCard `description` take any content; AuthCard `logoAlign`; `Breadcrumb.Section` (a plain section; in `Breadcrumb.Trail` an item before the last with no `href` renders as one instead of a link with no target); PageHeader `eyebrow`; Dialog.Content `maxHeight`; `Collapsible.Trigger variant="default"` (a styled row with a chevron); DashboardPage's headline figure can be a count, not only money.
- **Tokens** (#38): spacing `88` (22rem) and `104` (26rem); Tailwind `perspective-near` / `-normal` / `-far`, `shadow-glow-brand` (follows the product accent), and `w-zoom-105` / `110` / `125`.
- **Native parity:** none of these props are on the native twins yet (native NavigationRail is already a bottom bar; native Alert and lists keep their current API).
- **The platform can delete** these stopgaps and hand-built screens: the Go phone bar, the org chart SVG, admin-ui's chat header and tree row actions, the `max-h-[26rem]`, `w-[22rem]` and 3D one-offs, and the hand-made Collapsible triggers.
