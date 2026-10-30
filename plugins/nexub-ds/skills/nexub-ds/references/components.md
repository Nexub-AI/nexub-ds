# Component index

Nexub DS v2.1.0. Open `components/<slug>.md` for props, examples and accessibility notes.
Never use a component marked deprecated.

## Components — Actions

- [Button](components/button.md) `@nexub/react`: Triggers an action or event. Supports multiple variants, sizes, and semantic tones.
- [Button Group](components/button-group.md) `@nexub/react`: Groups related buttons together with optional attachment and orientation.
- [Icon Button](components/icon-button.md) `@nexub/react`: A square button designed to hold a single icon, with an accessible label.
- [Split Button](components/split-button.md) `@nexub/react`: A primary action with related secondary actions behind a chevron, as one connected control.

## Components — AI

- [Citation](components/citation.md) `@nexub/react`: Numbered source markers for running text, with a hover preview, plus SourceChip and SourceList for the sources under a reply.
- [Message Bubble](components/message-bubble.md) `@nexub/react`: One message in a conversation. User messages sit in a bubble at the end; assistant replies run full width. MessageActions adds copy, feedback and regenerate.
- [Prompt Input](components/prompt-input.md) `@nexub/react`: The composer for a chat: an auto-growing text field with Send, which turns into Stop while a reply streams.
- [Streaming Text](components/streaming-text.md) `@nexub/react`: Assistant text as it arrives: new chunks fade in, text already shown stays still, and a caret marks the end.
- [Thinking Indicator](components/thinking-indicator.md) `@nexub/react`: Shows the assistant is working before the first token arrives: a morphing shape and a shimmering label.

## Components — Avatar

- [Avatar](components/avatar.md) `@nexub/react`: Displays a user's profile picture with initials fallback.
- [Avatar Group](components/avatar-group.md) `@nexub/react`: Stacked group of avatars with overflow count.

## Components — Data Display

- [Amount](components/amount.md) `@nexub/react`: Honest money: Intl formatting, tabular numerals, the currency’s minor unit and a true minus sign.
- [Data Table](components/data-table.md) `@nexub/react`: Feature-rich data table with sorting and row selection powered by TanStack Table.
- [Empty State](components/empty-state.md) `@nexub/react`: Placeholder UI shown when a list or page has no content.
- [Error State](components/error-state.md) `@nexub/react`: Full-page or section error view with retry action.
- [Number Ticker](components/number-ticker.md) `@nexub/react`: A number whose digits roll to new values on the spatial spring. The first render never animates.
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
- [Banner](components/banner.md) `@nexub/react` **(deprecated)**: Deprecated — use Alert. Full-width announcement banner, typically used at the top of a page.
- [Callout](components/callout.md) `@nexub/react` **(deprecated)**: Deprecated — use Alert. Highlighted content block for tips, warnings, or notes.
- [Spinner](components/spinner.md) `@nexub/react`: Animated loading indicator. Inherits color from context.
- [Toast](components/toast.md) `@nexub/react`: Imperative toast notifications using the toast object. Render <Toaster /> once in your layout.

## Components — Form & Input

- [Date Picker](components/date-picker.md) `@nexub/react`: Calendar date picker with text input.
- [Date Range Picker](components/date-range-picker.md) `@nexub/react`: Dual-calendar date range selector.
- [Form Field](components/form-field.md) `@nexub/react`: Wraps Label, Input, HelperText and FormError into a single accessible group.
- [Helper Text](components/helper-text.md) `@nexub/react`: Small supporting text placed beneath a form field to provide hints or validation feedback.
- [Input](components/input.md) `@nexub/react`: Text input field for forms. Supports size variants, icons, addons, and validation states.
- [Label](components/label.md) `@nexub/react`: An accessible form label that optionally shows a required asterisk and links to an input via htmlFor.
- [Money Input](components/money-input.md) `@nexub/react`: An amount field: locale-aware parsing as you type, grouped on blur, the currency symbol leading.
- [Number Input](components/number-input.md) `@nexub/react`: A numeric input with increment and decrement controls, supporting min/max clamping and step.
- [Password Input](components/password-input.md) `@nexub/react`: A password field with a built-in toggle to reveal or hide the entered value.
- [Search Input](components/search-input.md) `@nexub/react`: A text input pre-wired with a search icon and a clear button for filtering content.
- [Textarea](components/textarea.md) `@nexub/react`: A multi-line text input with configurable resize behaviour, size, and validation states.

## Components — Form Controls

- [Autocomplete](components/autocomplete.md) `@nexub/react`: Type-to-search input with matching options dropdown.
- [Checkbox](components/checkbox.md) `@nexub/react`: Binary checkbox input built on Radix UI.
- [Checkbox Card](components/checkbox-card.md) `@nexub/react`: A checkbox drawn as a whole card: title, description and optional icon. Pick any number.
- [Combobox](components/combobox.md) `@nexub/react`: Command-palette style searchable dropdown built on cmdk.
- [Radio Card](components/radio-card.md) `@nexub/react`: A radio group where each option is a whole card: title, description and optional icon, one choice.
- [Radio Group](components/radio-group.md) `@nexub/react`: Group of mutually exclusive radio inputs.
- [Select](components/select.md) `@nexub/react`: Accessible dropdown select built on Radix UI. Supports groups and search.
- [Switch](components/switch.md) `@nexub/react`: Toggle control for binary on/off settings. Built on Radix UI Switch.

## Components — Inline Primitives

- [Code](components/code-inline.md) `@nexub/react`: Inline code span for technical terms and short code snippets.
- [Kbd](components/kbd.md) `@nexub/react`: Keyboard key display — renders a styled <kbd> element.
- [Link](components/link.md) `@nexub/react`: Styled anchor link with variant and external support.
- [Text Gradient](components/text-gradient.md) `@nexub/react`: Renders text with a brand gradient fill.

## Components — Interactive

- [Rating](components/rating.md) `@nexub/react`: Star rating input, supports controlled and read-only modes.
- [Segmented Control](components/segmented-control.md) `@nexub/react`: Tab-style control for mutually exclusive selections.
- [Slider](components/slider.md) `@nexub/react`: Range slider built on Radix UI Slider.
- [Toggle](components/toggle.md) `@nexub/react`: Pressable toggle button built on Radix UI Toggle.
- [Toggle Group](components/toggle-group.md) `@nexub/react`: Group of toggle buttons where one or many can be active.

## Components — Labels & Badges

- [Badge](components/badge.md) `@nexub/react`: Small status indicator or label. Communicates state, category, or count.
- [Chip](components/chip.md) `@nexub/react`: Compact label chip, optionally dismissible.
- [Eyebrow Chip](components/eyebrow-chip.md) `@nexub/react`: A compact eyebrow label, typically used above headings.
- [Filter Chip](components/filter-chip.md) `@nexub/react`: Interactive chip for filtering, supports selected/unselected state.
- [Status Pill](components/status-pill.md) `@nexub/react` **(deprecated)**: Deprecated — use Badge. A pill indicator for status values like active, pending, error.
- [Tag](components/tag.md) `@nexub/react` **(deprecated)**: Deprecated — use Badge. Non-interactive label tag for categorisation.

## Components — Layout

- [Box](components/box.md) `@nexub/react`: Generic container primitive with style token props.
- [Card](components/card.md) `@nexub/react`: Surface container for grouping related content. Supports flat, surface, and interactive variants.
- [Flex](components/flex.md) `@nexub/react`: Flexbox layout primitive.
- [Grid](components/grid.md) `@nexub/react`: CSS Grid layout primitive.
- [Media Card](components/media-card.md) `@nexub/react`: An image card with a glass caption over a soft scrim. With `href`, the whole card is one link.
- [Stack](components/stack.md) `@nexub/react`: Vertical stack layout with configurable gap.

## Components — Loading States

- [Progress](components/progress.md) `@nexub/react`: Horizontal progress bar with optional tone and animation.
- [Skeleton](components/skeleton.md) `@nexub/react`: Placeholder loading animation that mimics content layout.

## Components — Motion

- [Collapse](components/motion-collapse.md) `@nexub/react`: Expands and collapses content along the block axis.
- [Fade](components/motion-fade.md) `@nexub/react`: Animates opacity between 0 and 1 based on the `in` prop.
- [Scale](components/motion-scale.md) `@nexub/react`: Scales content in/out from its center.
- [Slide](components/motion-slide.md) `@nexub/react`: Slides content in from a direction based on the `in` prop.

## Components — Navigation

- [Breadcrumb](components/breadcrumb.md) `@nexub/react`: Hierarchical navigation trail showing page location.
- [Navigation Rail](components/navigation-rail.md) `@nexub/react`: Navigation for medium-width windows: icons over labels, with an active pill behind the icon.
- [Pagination](components/pagination.md) `@nexub/react`: Page navigation control with prev/next and page number buttons.
- [Tabs](components/tabs.md) `@nexub/react`: Layered content panels switched by tab triggers. Built on Radix UI Tabs.

## Components — Overlays

- [Alert Dialog](components/alert-dialog.md) `@nexub/react`: Confirmation dialog that requires an explicit user action before proceeding.
- [Dialog](components/dialog.md) `@nexub/react`: Modal dialog built on Radix UI. Fully accessible with focus trapping and ARIA roles.
- [Drawer](components/drawer.md) `@nexub/react`: Slide-in panel from any edge of the screen.
- [Hover Card](components/hover-card.md) `@nexub/react`: Rich tooltip card revealed on hover.
- [Popover](components/popover.md) `@nexub/react`: Floating content panel anchored to a trigger element.
- [Sheet](components/sheet.md) `@nexub/react`: Alias for Drawer — slide-in sheet panel.
- [Tooltip](components/tooltip.md) `@nexub/react`: Floating label that appears on hover. Built on Radix UI Tooltip.

## Components — Typography

- [Heading](components/heading.md) `@nexub/react`: Semantic heading component with size, weight, and tone control.
- [Text](components/text.md) `@nexub/react`: Paragraph text component with size, tone, and weight variants.

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

- [NotificationItem](components/notification-item.md) `@nexub/patterns`: Single notification row for notification panels or dropdowns.

## Patterns — Forms

- [Error Summary](components/error-summary.md) `@nexub/patterns`: Lists a form’s errors after a failed submit, with a link to each field. useFormErrors wires the fields to their messages.

## Patterns — Layout

- [Bento Grid](components/bento-grid.md) `@nexub/patterns`: A grid of card tiles in mixed sizes. Responds to its own width: 1 column, 2 at 480px, 4 at 768px.
- [List Detail](components/list-detail.md) `@nexub/patterns`: The list-detail layout: side by side at 720px+ of its own width (a container query), one pane at a time below.
- [SettingsSection](components/settings-section.md) `@nexub/patterns`: Grouped settings panel with title, description, and action area.

## Patterns — Marketing

- [PlanCard](components/plan-card.md) `@nexub/patterns`: Pricing plan card with feature checklist, badge, and CTA button.

## Patterns — Navigation

- [StepIndicator](components/step-indicator.md) `@nexub/patterns`: Visual progress indicator for multi-step flows like onboarding or checkout.

## Patterns — People

- [UserCard](components/user-card.md) `@nexub/patterns`: User profile card displaying avatar, name, role, and optional actions.

## Exported without a reference page

These exist; read their TypeScript props in `node_modules/<package>/dist/index.d.ts`.

- `@nexub/react`: AppShell, AspectRatio, CheckList, Code, CommandPalette, Container, ContextMenu, CountryBadge, DropdownMenu, FileUpload, Flag, FormError, KeyboardShortcut, Logo, Menubar, Motion, NavigationMenu, NexubProvider, PageHeader, Section, Sidebar, ThemeProvider, Toolbar, TopNav, VisuallyHidden
- `@nexub/patterns`: AppHeader, AppLauncher, SettingsLayout
