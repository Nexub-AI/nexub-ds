# Component index

Nexub DS v9.2.0. Open `components/<slug>.md` for props, examples and accessibility notes.
Never use a component marked deprecated.

## Components — Actions

- [Button](components/button.md) `@nexub/react`: Triggers an action or event. Supports multiple variants, sizes, and semantic tones.
- [Button Group](components/button-group.md) `@nexub/react`: Groups related buttons together with optional attachment and orientation.
- [Icon Button](components/icon-button.md) `@nexub/react`: A square button designed to hold a single icon, with an accessible label.
- [Split Button](components/split-button.md) `@nexub/react`: A primary action with related secondary actions behind a chevron, as one connected control.
- [Toolbar](components/toolbar.md) `@nexub/react`: A row of buttons and toggles with one tab stop and arrow-key movement, built on Radix.

## Components — AI

- [Approval Card](components/approval-card.md) `@nexub/react`: The agent asks before it acts: what will happen, then Approve or Deny.
- [Citation](components/citation.md) `@nexub/react`: Numbered source markers for running text, with a hover preview, plus SourceChip and SourceList for the sources under a reply.
- [Diff View](components/diff-view.md) `@nexub/react`: A unified diff with added and removed lines, for agent changes.
- [Message Bubble](components/message-bubble.md) `@nexub/react`: One message in a conversation. User messages sit in a bubble at the end; assistant replies run full width. MessageActions adds copy, feedback and regenerate.
- [Plan Tracker](components/plan-tracker.md) `@nexub/react`: An agent plan: ordered steps with done, active, pending or failed status.
- [Prompt Input](components/prompt-input.md) `@nexub/react`: The composer for a chat: an auto-growing text field with Send, which turns into Stop while a reply streams.
- [Streaming Text](components/streaming-text.md) `@nexub/react`: Assistant text as it arrives: new chunks fade in, text already shown stays still, and a caret marks the end.
- [Thinking Indicator](components/thinking-indicator.md) `@nexub/react`: Shows the assistant is working before the first token arrives: a morphing shape and a shimmering label.
- [Tool Call](components/tool-call.md) `@nexub/react`: One tool call: its name and status, expandable to input and output.

## Components — Avatar

- [Avatar](components/avatar.md) `@nexub/react`: Displays a user's profile picture with initials fallback.
- [Avatar Group](components/avatar-group.md) `@nexub/react`: Stacked group of avatars with overflow count.

## Components — Data Display

- [Amount](components/amount.md) `@nexub/react`: Honest money: Intl formatting, tabular numerals, the currency’s minor unit and a true minus sign.
- [Bar Chart](components/bar-chart.md) `@nexub/react`: Compare values across categories, grouped or stacked. Server-rendered SVG on the chart palette.
- [Chart Toggle](components/chart-toggle.md) `@nexub/react`: A legend whose entries switch series on and off, wrapped around any chart.
- [Chart Zoom](components/chart-zoom.md) `@nexub/react`: Zoom any chart to part of its range with a two-thumb slider.
- [Check List](components/check-list.md) `@nexub/react`: A list with a success tick before each item, for features, plan inclusions and requirements met.
- [Data Table](components/data-table.md) `@nexub/react`: Feature-rich data table with sorting and row selection powered by TanStack Table.
- [Donut Chart](components/donut-chart.md) `@nexub/react`: Parts of a whole, with an optional total in the hole. Keep it to six slices or fewer.
- [Empty State](components/empty-state.md) `@nexub/react`: Placeholder UI shown when a list or page has no content.
- [Error State](components/error-state.md) `@nexub/react`: Full-page or section error view with retry action.
- [Event Calendar](components/event-calendar.md) `@nexub/react`: A month or week grid of events. Display only: your app owns the events and what a click does.
- [Funnel](components/funnel.md) `@nexub/react`: Drop-off through ordered steps, with conversion from the first step.
- [Gauge](components/gauge.md) `@nexub/react`: Progress toward a target on a 270° arc.
- [Heatmap](components/heatmap.md) `@nexub/react`: Intensity over a grid, such as activity by weekday and week, in seven sequential steps.
- [Kanban](components/kanban.md) `@nexub/react`: Columns of cards people move by dragging or with Alt+Arrow keys.
- [KPI Tile](components/kpi-tile.md) `@nexub/react`: A headline number with its change versus last period and a trend line.
- [Line Chart](components/line-chart.md) `@nexub/react`: Show a trend over ordered categories such as time. Server-rendered SVG on the chart palette.
- [Number Ticker](components/number-ticker.md) `@nexub/react`: A number whose digits roll to new values on the spatial spring. The first render never animates.
- [Sortable](components/sortable.md) `@nexub/react`: A list people reorder by dragging or with Alt+Arrow keys on a handle.
- [Sparkline](components/sparkline.md) `@nexub/react`: A tiny trend line with no axes, for stat cards and table cells.
- [Table](components/table.md) `@nexub/react`: Semantic HTML table with styled variants.

## Components — Disclosure

- [Accordion](components/accordion.md) `@nexub/react`: Vertically stacked list of collapsible sections.
- [Collapsible](components/collapsible.md) `@nexub/react`: Toggle visibility of content with smooth animation.
- [Scroll Area](components/scroll-area.md) `@nexub/react`: Scrollable container with custom styled scrollbars.

## Components — Dividers

- [Gradient Divider](components/gradient-divider.md) `@nexub/react`: A decorative gradient-faded horizontal rule.
- [Separator](components/separator.md) `@nexub/react`: A horizontal or vertical visual divider.

## Components — Feedback

- [Alert](components/alert.md) `@nexub/react`: Inline contextual message with optional title, icon, and dismiss action.
- [Celebrate](components/celebrate.md) `@nexub/react`: A short confetti burst for a real win, such as a first payment or finishing onboarding.
- [Spinner](components/spinner.md) `@nexub/react`: Animated loading indicator. Inherits color from context.
- [Toast](components/toast.md) `@nexub/react`: Imperative toast notifications using the toast object. Render <Toaster /> once in your layout.

## Components — Form & Input

- [Action Bar](components/action-bar.md) `@nexub/react`: Save and cancel that stay in view at the bottom of a long form.
- [Date Picker](components/date-picker.md) `@nexub/react`: Calendar date picker with text input.
- [Date Range Picker](components/date-range-picker.md) `@nexub/react`: Dual-calendar date range selector.
- [Date Time Picker](components/date-time-picker.md) `@nexub/react`: A DatePicker and a TimePicker that edit one Date, with an optional time-zone label.
- [Fieldset](components/fieldset.md) `@nexub/react`: Groups related fields under a legend; disabling it disables everything inside.
- [Form](components/form.md) `@nexub/react`: Validates on submit with the browser’s own checks plus yours, shows each message on its FormField and focuses the first invalid field.
- [Form Error](components/form-error.md) `@nexub/react`: An error message with an alert icon, announced when it appears.
- [Form Field](components/form-field.md) `@nexub/react`: Wraps Label, Input, HelperText and FormError into a single accessible group.
- [Helper Text](components/helper-text.md) `@nexub/react`: Small supporting text placed beneath a form field to provide hints or validation feedback.
- [Inline Edit](components/inline-edit.md) `@nexub/react`: Text that becomes an input on click, for renaming things in place.
- [Input](components/input.md) `@nexub/react`: Text input field for forms. Supports size variants, icons, addons, and validation states.
- [Label](components/label.md) `@nexub/react`: An accessible form label that optionally shows a required asterisk and links to an input via htmlFor.
- [Money Input](components/money-input.md) `@nexub/react`: An amount field: locale-aware parsing as you type, grouped on blur, the currency symbol leading.
- [Number Input](components/number-input.md) `@nexub/react`: A numeric input with increment and decrement controls, supporting min/max clamping and step.
- [Password Input](components/password-input.md) `@nexub/react`: A password field with a built-in toggle to reveal or hide the entered value.
- [Search Input](components/search-input.md) `@nexub/react`: A text input pre-wired with a search icon and a clear button for filtering content.
- [Textarea](components/textarea.md) `@nexub/react`: A multi-line text input with configurable resize behaviour, size, and validation states.
- [Time Picker](components/time-picker.md) `@nexub/react`: A time field on the native time input: 12 or 24 hours from the reader’s locale, and the platform picker on phones.

## Components — Form Controls

- [Autocomplete](components/autocomplete.md) `@nexub/react`: Type-to-search input with matching options dropdown.
- [Checkbox](components/checkbox.md) `@nexub/react`: Binary checkbox input built on Radix UI.
- [Checkbox Card](components/checkbox-card.md) `@nexub/react`: A checkbox drawn as a whole card: title, description and optional icon. Pick any number.
- [Combobox](components/combobox.md) `@nexub/react`: Command-palette style searchable dropdown built on cmdk.
- [File Upload](components/file-upload.md) `@nexub/react`: A drop zone and file list: pick, drop or paste files, with type, size and count checks and per-file progress.
- [Filter Builder](components/filter-builder.md) `@nexub/react`: Build AND/OR filter queries with nested groups. The output is plain JSON your app runs.
- [Multi Select](components/multi-select.md) `@nexub/react`: Pick several options as chips, with search, "+N more" and an optional create option.
- [OTP Input](components/otp-input.md) `@nexub/react`: One box per digit for verification codes, with paste and one-time-code autofill.
- [Radio Card](components/radio-card.md) `@nexub/react`: A radio group where each option is a whole card: title, description and optional icon, one choice.
- [Radio Group](components/radio-group.md) `@nexub/react`: Group of mutually exclusive radio inputs.
- [Select](components/select.md) `@nexub/react`: Accessible dropdown select built on Radix UI. Supports groups and search.
- [Switch](components/switch.md) `@nexub/react`: Toggle control for binary on/off settings. Built on Radix UI Switch.

## Components — Forms

- [Floating Input](components/floating-input.md) `@nexub/react`: A text field whose label sits inside and floats up on focus or input. CSS only.

## Components — Inline Primitives

- [Aurora](components/aurora.md) `@nexub/react`: A decorative background of slow-drifting colour fields from the accent roles. Subtle by default, richer under data-expression="vivid".
- [Code](components/code-inline.md) `@nexub/react`: Inline code span for technical terms and short code snippets.
- [Kbd](components/kbd.md) `@nexub/react`: Keyboard key display — renders a styled <kbd> element.
- [Keyboard Shortcut](components/keyboard-shortcut.md) `@nexub/react`: A key combination as `Kbd` keys joined by plus signs, read as one label.
- [Link](components/link.md) `@nexub/react`: Styled anchor link with variant and external support.
- [Logo](components/logo.md) `@nexub/react`: The Nexub mark and wordmark, with an optional product name.
- [Text Gradient](components/text-gradient.md) `@nexub/react`: Renders text with a brand gradient fill.
- [Visually Hidden](components/visually-hidden.md) `@nexub/react`: Content for screen readers only: hidden on screen but still read out (Radix).

## Components — Interactive

- [Rating](components/rating.md) `@nexub/react`: Star rating input, supports controlled and read-only modes.
- [Segmented Control](components/segmented-control.md) `@nexub/react`: Tab-style control for mutually exclusive selections.
- [Slider](components/slider.md) `@nexub/react`: Range slider built on Radix UI Slider.
- [Toggle](components/toggle.md) `@nexub/react`: Pressable toggle button built on Radix UI Toggle.
- [Toggle Group](components/toggle-group.md) `@nexub/react`: Group of toggle buttons where one or many can be active.

## Components — Labels & Badges

- [Badge](components/badge.md) `@nexub/react`: Small status indicator or label. Communicates state, category, or count.
- [Chip](components/chip.md) `@nexub/react`: Compact label chip, optionally dismissible.
- [Country Badge](components/country-badge.md) `@nexub/react`: A pill with a country flag and its name or code.
- [Eyebrow Chip](components/eyebrow-chip.md) `@nexub/react`: A compact eyebrow label, typically used above headings.
- [Filter Chip](components/filter-chip.md) `@nexub/react`: Interactive chip for filtering, supports selected/unselected state.
- [Flag](components/flag.md) `@nexub/react`: A country flag from its ISO code, drawn with the system emoji font.

## Components — Layout

- [App Shell](components/app-shell.md) `@nexub/react`: Full-height application frame: a header row over a body with a sidebar slot and a scrolling main region.
- [Aspect Ratio](components/aspect-ratio.md) `@nexub/react`: Keeps its content at a fixed width-to-height ratio, for images, video and embeds.
- [Box](components/box.md) `@nexub/react`: Generic container primitive with style token props.
- [Card](components/card.md) `@nexub/react`: Surface container for grouping related content. Supports flat, surface, and interactive variants.
- [Container](components/container.md) `@nexub/react`: Centres content at a maximum width with responsive side padding.
- [Flex](components/flex.md) `@nexub/react`: Flexbox layout primitive.
- [Grid](components/grid.md) `@nexub/react`: CSS Grid layout primitive.
- [Media Card](components/media-card.md) `@nexub/react`: An image card with a glass caption over a soft scrim. With `href`, the whole card is one link.
- [Page Header](components/page-header.md) `@nexub/react`: The top of a page: title, description, breadcrumb and actions.
- [Resizable Panels](components/resizable-panels.md) `@nexub/react`: Panels with draggable separators, for list–detail and editor layouts.
- [Section](components/section.md) `@nexub/react`: A full-width page band with vertical padding and a background tone; put a `Container` inside.
- [Stack](components/stack.md) `@nexub/react`: Vertical stack layout with configurable gap.

## Components — Loading States

- [Progress](components/progress.md) `@nexub/react`: Horizontal progress bar with optional tone and animation.
- [Skeleton](components/skeleton.md) `@nexub/react`: Placeholder loading animation that mimics content layout.

## Components — Motion

- [Collapse](components/motion-collapse.md) `@nexub/react`: Expands and collapses content along the block axis.
- [Fade](components/motion-fade.md) `@nexub/react`: Animates opacity between 0 and 1 based on the `in` prop.
- [Float](components/motion-float.md) `@nexub/react`: Gently bobs its content (floating cards over a hero visual), in marketing mode. Server component; still under reduced motion.
- [Marquee](components/motion-marquee.md) `@nexub/react`: A row that scrolls sideways forever (logo strips, tool lists), in marketing mode. Pauses on hover and while focus is inside, stands still under reduced motion; the repeated copy is hidden from assistive tech and can’t be focused. Server component.
- [Reveal](components/motion-reveal.md) `@nexub/react`: Fades its content up as it scrolls into view, in marketing mode. CSS scroll-driven where supported, an IntersectionObserver elsewhere; content on screen at load, and every visitor without JS or with reduced motion, just sees it.
- [Scale](components/motion-scale.md) `@nexub/react`: Scales content in/out from its center.
- [Slide](components/motion-slide.md) `@nexub/react`: Slides content in from a direction based on the `in` prop.
- [Scroll Progress](components/scroll-progress.md) `@nexub/react`: A thin bar along the top that fills as the page scrolls. CSS only.
- [Shared Element](components/shared-element.md) `@nexub/react`: Morphs the same element between two states or pages inside a view transition.

## Components — Navigation

- [Breadcrumb](components/breadcrumb.md) `@nexub/react`: Hierarchical navigation trail showing page location.
- [Command Palette](components/command-palette.md) `@nexub/react`: A searchable command menu in a modal dialog (cmdk), with nested pages, recents and an optional Cmd+K shortcut.
- [Menubar](components/menubar.md) `@nexub/react`: A horizontal bar of menus, like a desktop app’s File / Edit / View, built on Radix.
- [Navigation Menu](components/navigation-menu.md) `@nexub/react`: Site navigation links with flyout panels, built on Radix.
- [Navigation Rail](components/navigation-rail.md) `@nexub/react`: Navigation for medium-width windows: icons over labels, with an active pill behind the icon.
- [Pagination](components/pagination.md) `@nexub/react`: Page navigation control with prev/next and page number buttons.
- [Saved Views](components/saved-views.md) `@nexub/react`: A menu to switch, save, update and delete saved filter views. Your app stores them.
- [Sidebar](components/sidebar.md) `@nexub/react`: Vertical app navigation: a header, grouped items with icons, and a pinned footer. Collapses to icons.
- [Stepper](components/stepper.md) `@nexub/react`: Progress through a multi-step flow, with clickable steps that follow the order you allow.
- [Tabs](components/tabs.md) `@nexub/react`: Layered content panels switched by tab triggers. Built on Radix UI Tabs.
- [Top Nav](components/top-nav.md) `@nexub/react`: A sticky app header: logo, main navigation links and trailing actions.
- [Tree View](components/tree-view.md) `@nexub/react`: A keyboard-friendly hierarchy (ARIA tree) with lazy children and tri-state checkboxes.

## Components — Overlays

- [Alert Dialog](components/alert-dialog.md) `@nexub/react`: Confirmation dialog that requires an explicit user action before proceeding.
- [Context Menu](components/context-menu.md) `@nexub/react`: A menu that opens at the pointer on right-click (or long-press), built on Radix.
- [Dialog](components/dialog.md) `@nexub/react`: Modal dialog built on Radix UI. Fully accessible with focus trapping and ARIA roles.
- [Drawer](components/drawer.md) `@nexub/react`: Slide-in panel from any edge of the screen.
- [Dropdown Menu](components/dropdown-menu.md) `@nexub/react`: A menu of actions opened from a button, built on Radix.
- [Hover Card](components/hover-card.md) `@nexub/react`: Rich tooltip card revealed on hover.
- [Popover](components/popover.md) `@nexub/react`: Floating content panel anchored to a trigger element.
- [Sheet](components/sheet.md) `@nexub/react`: Alias for Drawer — slide-in sheet panel.
- [Tooltip](components/tooltip.md) `@nexub/react`: Floating label that appears on hover. Built on Radix UI Tooltip.

## Components — Typography

- [Heading](components/heading.md) `@nexub/react`: Semantic heading component with size, weight, and tone control.
- [Text](components/text.md) `@nexub/react`: Paragraph text component with size, tone, and weight variants.

## Marketing — Marketing

- [CTABand](components/cta-band.md) `@nexub/marketing`: The closing call to action on a primary band: the hero gradient in marketing mode. Server component.
- [FAQ](components/faq.md) `@nexub/marketing`: Questions and answers in an Accordion, one open at a time. Client component.
- [FeatureSplit](components/feature-split.md) `@nexub/marketing`: Text and a check list beside a visual; `reverse` swaps the sides on wide screens. Server component.
- [Hero](components/hero.md) `@nexub/marketing`: The page hero: ambient backdrop, eyebrow, display headline (the page's one h1), lead, actions and a visual. Server component.
- [HowItWorks](components/how-it-works.md) `@nexub/marketing`: Numbered steps in an ordered list. Server component.
- [LogoStrip](components/logo-strip.md) `@nexub/marketing`: A row of customer logos under the hero, scrolling sideways (paused on hover and focus) or wrapped. Server component.
- [MarketingFooter](components/marketing-footer.md) `@nexub/marketing`: The site footer: a tools strip, the logo, link columns and the legal line. Server component.
- [MarketingNav](components/marketing-nav.md) `@nexub/marketing`: The site header: logo, links with mega-menus, a country switcher and actions. Below `lg` the links move into a side sheet.
- [PricingTable](components/pricing-table.md) `@nexub/marketing`: Plans side by side with a monthly / yearly switch, built on PlanCard and SegmentedControl. Client component.
- [ProductGrid](components/product-grid.md) `@nexub/marketing`: Product cards in a grid; each card is one link with the product's accent. Server component.
- [SectionHeader](components/section-header.md) `@nexub/marketing`: Eyebrow, headline and lead that open a section. Server component.
- [StatBand](components/stat-band.md) `@nexub/marketing`: A band of headline numbers that count up as they scroll into view. StatBandItem is named apart from the StatCard pattern. Server component.
- [TestimonialGrid](components/testimonial-grid.md) `@nexub/marketing`: Customer quotes in product-coloured cards, with an optional star rating. Server component.

## Patterns — AI

- [Conversation](components/conversation.md) `@nexub/patterns`: Chat layout: a scrolling message list that follows new content, with a sticky composer underneath.

## Patterns — Auth

- [AuthCard](components/auth-card.md) `@nexub/patterns`: Authentication layout pattern. Wraps sign-in, sign-up, and reset flows in a centered card.

## Patterns — Data

- [ActivityFeed](components/activity-feed.md) `@nexub/patterns`: Chronological list of activity events with avatar, description, and timestamp.
- [FilterBar](components/filter-bar.md) `@nexub/patterns`: Search + filter toolbar pattern for data-heavy list or table views.
- [InfoList](components/info-list.md) `@nexub/patterns`: Key–value list for displaying structured metadata or details.
- [StatCard](components/stat-card.md) `@nexub/patterns`: Metric display card showing a KPI value, label, optional delta, and icon.

## Patterns — Feedback

- [NotificationCenter](components/notification-center.md) `@nexub/patterns`: A bell with an unread count that opens the notification list.
- [NotificationItem](components/notification-item.md) `@nexub/patterns`: Single notification row for notification panels or dropdowns.

## Patterns — Forms

- [Error Summary](components/error-summary.md) `@nexub/patterns`: Lists a form’s errors after a failed submit, with a link to each field. useFormErrors wires the fields to their messages.

## Patterns — Layout

- [Bento Grid](components/bento-grid.md) `@nexub/patterns`: A grid of card tiles in mixed sizes. Responds to its own width: 1 column, 2 at 480px, 4 at 768px.
- [List Detail](components/list-detail.md) `@nexub/patterns`: The list-detail layout: side by side at 720px+ of its own width (a container query), one pane at a time below.
- [SettingsSection](components/settings-section.md) `@nexub/patterns`: Grouped settings panel with title, description, and action area.

## Patterns — Marketing

- [PlanCard](components/plan-card.md) `@nexub/patterns`: Pricing plan card with feature checklist, badge, and CTA button.

## Patterns — People

- [UserCard](components/user-card.md) `@nexub/patterns`: User profile card displaying avatar, name, role, and optional actions.

## Exported without a reference page

These exist; read their TypeScript props in `node_modules/<package>/dist/index.d.ts`.

- `@nexub/react`: AgentKit, Chart, Code, DataTableVirtual, Motion, NexubProvider, OTPInput, ThemeProvider
- `@nexub/patterns`: ActivityPage, AppHeader, AppLauncher, ChatPage, CheckoutPage, DashboardPage, PageFrame, PaywallPage, SettingsLayout, SettingsPage, SignInPage, TransactionDetailPage
