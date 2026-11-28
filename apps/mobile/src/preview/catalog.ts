// What the docs can preview: every @nexub/react-native component, grouped the
// way the showcase catalogue shows them. Pure data (no JSX) so that
// scripts/preview-manifest.mjs can read it with Node and write
// preview-manifest.json for the docs build. examples.tsx renders each entry and
// must have exactly one example per title here (enforced by its type).
//
// slug  = kebab-case of the export (`ButtonGroup` → 'button-group')
// web   = the @nexub/react docs slug of its web twin, or null (mobile-only)
// kind  = 'component' (has a web twin), 'mobile' (mobile-only), 'primitive'

export type PreviewKind = 'component' | 'mobile' | 'primitive';

export interface CatalogEntry {
  readonly title: string;
  readonly kind: PreviewKind;
  readonly web: string | null;
  readonly examples: readonly string[];
}

export const CATALOG = {
  // Foundations
  text: { title: 'Text', kind: 'primitive', web: null, examples: ['Type scale', 'Tabular figures'] },
  heading: { title: 'Heading', kind: 'primitive', web: 'heading', examples: ['Levels'] },
  surface: { title: 'Surface', kind: 'primitive', web: 'box', examples: ['Tonal tiers', 'Elevation and glass'] },
  pressable: { title: 'Pressable', kind: 'primitive', web: null, examples: ['Press feedback'] },
  icon: { title: 'Icon', kind: 'primitive', web: null, examples: ['Sizes and colours', 'Nexub marks'] },

  // Actions
  button: { title: 'Button', kind: 'component', web: 'button', examples: ['Variants', 'Tones and states', 'Full width'] },
  'button-group': { title: 'ButtonGroup', kind: 'component', web: 'button-group', examples: ['Stacked', 'Row'] },
  'icon-button': { title: 'IconButton', kind: 'component', web: 'icon-button', examples: ['Variants'] },
  tooltip: { title: 'Tooltip', kind: 'component', web: 'tooltip', examples: ['Long-press'] },
  link: { title: 'Link', kind: 'component', web: 'link', examples: ['Inline link'] },
  chip: { title: 'Chip', kind: 'component', web: 'chip', examples: ['Removable'] },
  'filter-chip': { title: 'FilterChip', kind: 'component', web: 'filter-chip', examples: ['Multi-select'] },
  badge: { title: 'Badge', kind: 'component', web: 'badge', examples: ['Tones', 'Variants'] },
  avatar: { title: 'Avatar', kind: 'component', web: 'avatar', examples: ['Sizes and badge'] },
  'avatar-group': { title: 'AvatarGroup', kind: 'component', web: 'avatar-group', examples: ['Overflow'] },
  'icon-chip': { title: 'IconChip', kind: 'component', web: 'icon-chip', examples: ['Categories', 'Sizes and shapes'] },
  'number-ticker': { title: 'NumberTicker', kind: 'component', web: 'number-ticker', examples: ['Rolling total'] },
  'stat-card': { title: 'StatCard', kind: 'component', web: 'stat-card', examples: ['With trend', 'Pressable'] },

  // Inputs
  'text-field': { title: 'TextField', kind: 'component', web: 'input', examples: ['Label and placeholder', 'Error'] },
  'password-input': { title: 'PasswordInput', kind: 'component', web: 'password-input', examples: ['With helper text'] },
  'search-field': { title: 'SearchField', kind: 'component', web: 'search-input', examples: ['Default'] },
  'money-input': { title: 'MoneyInput', kind: 'component', web: 'money-input', examples: ['With fee'] },
  stepper: { title: 'Stepper', kind: 'component', web: 'number-input', examples: ['Range'] },
  checkbox: { title: 'Checkbox', kind: 'component', web: 'checkbox', examples: ['With description'] },
  'radio-group': { title: 'RadioGroup', kind: 'component', web: 'radio-group', examples: ['Delivery speed'] },
  switch: { title: 'Switch', kind: 'component', web: 'switch', examples: ['Platform switch'] },
  'segmented-control': { title: 'SegmentedControl', kind: 'component', web: 'segmented-control', examples: ['Period'] },
  tabs: { title: 'Tabs', kind: 'component', web: 'tabs', examples: ['Line', 'Pill, scrolling'] },
  rating: { title: 'Rating', kind: 'component', web: 'rating', examples: ['Tap to rate', 'Read only'] },
  slider: { title: 'Slider', kind: 'component', web: 'slider', examples: ['Formatted value'] },
  select: { title: 'Select', kind: 'component', web: 'select', examples: ['Opens a sheet'] },
  'date-time-field': { title: 'DateTimeField', kind: 'component', web: 'date-picker', examples: ['Date'] },
  'multi-select': { title: 'MultiSelect', kind: 'component', web: 'multi-select', examples: ['Labels in a sheet'] },
  // 11.8
  'combobox-field': { title: 'ComboboxField', kind: 'component', web: 'combobox', examples: ['Searchable sheet'] },
  'currency-select': { title: 'CurrencySelect', kind: 'component', web: 'currency-select', examples: ['Currencies'] },
  'switch-field': { title: 'SwitchField', kind: 'component', web: 'switch-field', examples: ['With a description'] },
  'checkbox-field': { title: 'CheckboxField', kind: 'component', web: 'checkbox-field', examples: ['Terms'] },
  'checkbox-group-field': { title: 'CheckboxGroupField', kind: 'component', web: 'checkbox-field', examples: ['Notifications'] },
  'file-upload': { title: 'FileUpload', kind: 'component', web: 'file-upload', examples: ['Images'] },
  'prompt-dialog': { title: 'PromptDialog', kind: 'component', web: 'alert-dialog', examples: ['usePrompt'] },
  'filter-sheet': { title: 'FilterSheet', kind: 'component', web: 'filter-builder', examples: ['Deal filters'] },

  // Lists and containers
  card: { title: 'Card', kind: 'component', web: 'card', examples: ['Balance card'] },
  'list-item': { title: 'ListItem', kind: 'component', web: null, examples: ['Navigation and value', 'Switch and radio'] },
  'list-section': { title: 'ListSection', kind: 'component', web: null, examples: ['Inset grouped'] },
  table: { title: 'Table', kind: 'component', web: 'table', examples: ['Sticky first column', 'Compact and striped'] },
  'data-list': { title: 'DataList', kind: 'component', web: 'data-table', examples: ['Sort and select'] },
  'file-list': { title: 'FileList', kind: 'mobile', web: null, examples: ['Uploading'] },
  'tree-list': { title: 'TreeList', kind: 'component', web: 'tree-view', examples: ['Drill down'] },
  'sortable-list': { title: 'SortableList', kind: 'component', web: 'sortable', examples: ['Widget order'] },
  'step-progress': { title: 'StepProgress', kind: 'component', web: 'stepper', examples: ['Step 2 of 4'] },
  'inline-edit': { title: 'InlineEdit', kind: 'component', web: 'inline-edit', examples: ['Rename'] },
  'description-list': { title: 'DescriptionList', kind: 'component', web: 'description-list', examples: ['Fee breakdown', 'Stacked'] },
  'comparison-bar': { title: 'ComparisonBar', kind: 'component', web: 'comparison-bar', examples: ['This week and last'] },
  'qr-code': { title: 'QRCode', kind: 'component', web: 'qr-code', examples: ['With its value', 'With a logo'] },
  // No camera in a preview: the scanner shows its manual-entry fallback.
  'qr-scanner': { title: 'QRScanner', kind: 'mobile', web: null, examples: ['Manual entry'] },
  'phone-input': { title: 'PhoneInput', kind: 'component', web: 'phone-input', examples: ['Country and number'] },
  countdown: { title: 'Countdown', kind: 'component', web: 'countdown', examples: ['Chip and inline'] },
  accordion: { title: 'Accordion', kind: 'component', web: 'accordion', examples: ['FAQ'] },
  amount: { title: 'Amount', kind: 'component', web: 'amount', examples: ['Display size', 'Signed tones'] },
  divider: { title: 'Divider', kind: 'component', web: 'separator', examples: ['Inset'] },
  // 12.5: AI parts
  'tool-call': { title: 'ToolCall', kind: 'component', web: 'tool-call', examples: ['Run time, error and Retry'] },
  'approval-card': { title: 'ApprovalCard', kind: 'component', web: 'approval-card', examples: ['Approve, edit or deny'] },
  'diff-view': { title: 'DiffView', kind: 'component', web: 'diff-view', examples: ['Line numbers'] },
  'diff-review': { title: 'DiffReview', kind: 'component', web: 'diff-view', examples: ['Accept or reject'] },

  // Feedback
  banner: { title: 'Banner', kind: 'component', web: 'banner', examples: ['Tones', 'Action and dismiss'] },
  toast: { title: 'Toast', kind: 'component', web: 'toast', examples: ['With undo'] },
  dialog: { title: 'Dialog', kind: 'component', web: 'alert-dialog', examples: ['Destructive confirm'] },
  progress: { title: 'Progress', kind: 'component', web: 'progress', examples: ['Linear and circular'] },
  'loading-indicator': { title: 'LoadingIndicator', kind: 'component', web: 'spinner', examples: ['Default'] },
  skeleton: { title: 'Skeleton', kind: 'component', web: 'skeleton', examples: ['Text lines', 'Swap to content'] },
  'empty-state': { title: 'EmptyState', kind: 'component', web: 'empty-state', examples: ['With action'] },
  'error-state': { title: 'ErrorState', kind: 'component', web: 'error-state', examples: ['Retry'] },

  // Mobile-only
  'bottom-sheet': { title: 'BottomSheet', kind: 'mobile', web: 'sheet', examples: ['Detents'] },
  'action-sheet': { title: 'ActionSheet', kind: 'mobile', web: null, examples: ['Card actions'] },
  'context-menu': { title: 'ContextMenu', kind: 'mobile', web: null, examples: ['Long-press to copy'] },
  'swipeable-row': { title: 'SwipeableRow', kind: 'mobile', web: null, examples: ['Swipe actions'] },
  'otp-input': { title: 'OTPInput', kind: 'component', web: 'otp-input', examples: ['Six digits'] },
  'numeric-keypad': { title: 'NumericKeypad', kind: 'mobile', web: null, examples: ['Decimal'] },
  'expressive-money-input': { title: 'ExpressiveMoneyInput', kind: 'mobile', web: null, examples: ['Amount to send'] },
  'sensitive-value': { title: 'SensitiveValue', kind: 'mobile', web: null, examples: ['Hidden balance'] },
  'privacy-shield': { title: 'PrivacyShield', kind: 'mobile', web: null, examples: ['Covers when backgrounded'] },
  'offline-banner': { title: 'OfflineBanner', kind: 'mobile', web: null, examples: ['Offline'] },
  coachmark: { title: 'Coachmark', kind: 'mobile', web: null, examples: ['Feature hint'] },
  carousel: { title: 'Carousel', kind: 'mobile', web: null, examples: ['Onboarding slides'] },
  'page-indicator': { title: 'PageIndicator', kind: 'mobile', web: null, examples: ['Three pages'] },
  'sticky-footer': { title: 'StickyFooter', kind: 'mobile', web: null, examples: ['Pinned action'] },
  fab: { title: 'FAB', kind: 'mobile', web: null, examples: ['Extended'] },
} as const satisfies Record<string, CatalogEntry>;

export type PreviewSlug = keyof typeof CATALOG;

/** Catalogue screens: section headings and the components they show, in order. */
export const SECTIONS = {
  foundations: [
    { heading: 'Type', slugs: ['text', 'heading'] },
    { heading: 'Surfaces', slugs: ['surface'] },
    { heading: 'Press', slugs: ['pressable', 'icon'] },
  ],
  actions: [
    { heading: 'Buttons', slugs: ['button', 'button-group', 'link'] },
    { heading: 'Icon buttons', slugs: ['icon-button', 'tooltip'] },
    { heading: 'Chips', slugs: ['filter-chip', 'chip'] },
    { heading: 'Badges', slugs: ['badge'] },
    { heading: 'Avatars', slugs: ['avatar', 'avatar-group'] },
    { heading: 'Stats', slugs: ['icon-chip', 'stat-card', 'number-ticker'] },
  ],
  inputs: [
    { heading: 'Fields', slugs: ['search-field', 'text-field', 'password-input', 'money-input'] },
    { heading: 'Selection', slugs: ['segmented-control', 'tabs', 'rating', 'checkbox', 'radio-group', 'switch', 'stepper', 'slider'] },
    { heading: 'Form fields', slugs: ['combobox-field', 'currency-select', 'switch-field', 'checkbox-field', 'checkbox-group-field', 'file-upload', 'prompt-dialog'] },
  ],
  lists: [
    { heading: 'Cards', slugs: ['card', 'amount'] },
    { heading: 'Lists', slugs: ['list-section', 'list-item', 'divider'] },
    { heading: 'Data', slugs: ['table', 'data-list', 'file-list', 'tree-list', 'sortable-list'] },
    { heading: 'Flow', slugs: ['step-progress', 'inline-edit'] },
    { heading: 'Details', slugs: ['description-list', 'comparison-bar', 'countdown'] },
    { heading: 'Codes and phone', slugs: ['qr-code', 'qr-scanner', 'phone-input'] },
    { heading: 'FAQ', slugs: ['accordion'] },
    { heading: 'AI', slugs: ['tool-call', 'approval-card', 'diff-view', 'diff-review'] },
  ],
  feedback: [
    { heading: 'Banners', slugs: ['banner'] },
    { heading: 'Toast and dialog', slugs: ['toast', 'dialog'] },
    { heading: 'Progress', slugs: ['progress', 'loading-indicator', 'skeleton'] },
    { heading: 'States', slugs: ['empty-state', 'error-state'] },
  ],
  mobile: [
    { heading: 'Sheets and menus', slugs: ['bottom-sheet', 'action-sheet', 'select', 'multi-select', 'filter-sheet', 'date-time-field'] },
    { heading: 'Money', slugs: ['sensitive-value', 'expressive-money-input', 'numeric-keypad'] },
    { heading: 'Swipe and long-press', slugs: ['swipeable-row', 'context-menu'] },
    { heading: 'Verify', slugs: ['otp-input'] },
    { heading: 'Onboarding', slugs: ['carousel', 'page-indicator', 'coachmark'] },
    { heading: 'App chrome', slugs: ['offline-banner', 'sticky-footer', 'fab', 'privacy-shield'] },
  ],
} as const satisfies Record<string, readonly { heading: string; slugs: readonly PreviewSlug[] }[]>;

export type SectionName = keyof typeof SECTIONS;

/** Brands the preview can show: 'nexub' is the base theme, the rest remap the tertiary family. */
export const BRANDS = ['nexub', 'payub', 'bookub', 'leap', 'founderub'] as const;
export type Brand = (typeof BRANDS)[number];
