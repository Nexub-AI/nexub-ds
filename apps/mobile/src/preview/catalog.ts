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
  icon: { title: 'Icon', kind: 'primitive', web: null, examples: ['Sizes and colours'] },

  // Actions
  button: { title: 'Button', kind: 'component', web: 'button', examples: ['Variants', 'Tones and states', 'Full width'] },
  'button-group': { title: 'ButtonGroup', kind: 'component', web: 'button-group', examples: ['Stacked', 'Row'] },
  'icon-button': { title: 'IconButton', kind: 'component', web: 'icon-button', examples: ['Variants'] },
  link: { title: 'Link', kind: 'component', web: 'link', examples: ['Inline link'] },
  chip: { title: 'Chip', kind: 'component', web: 'chip', examples: ['Removable'] },
  'filter-chip': { title: 'FilterChip', kind: 'component', web: 'filter-chip', examples: ['Multi-select'] },
  badge: { title: 'Badge', kind: 'component', web: 'badge', examples: ['Tones', 'Variants'] },
  avatar: { title: 'Avatar', kind: 'component', web: 'avatar', examples: ['Sizes and badge'] },
  'avatar-group': { title: 'AvatarGroup', kind: 'component', web: 'avatar-group', examples: ['Overflow'] },

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
  slider: { title: 'Slider', kind: 'component', web: 'slider', examples: ['Formatted value'] },
  select: { title: 'Select', kind: 'component', web: 'select', examples: ['Opens a sheet'] },
  'date-time-field': { title: 'DateTimeField', kind: 'component', web: 'date-picker', examples: ['Date'] },

  // Lists and containers
  card: { title: 'Card', kind: 'component', web: 'card', examples: ['Balance card'] },
  'list-item': { title: 'ListItem', kind: 'component', web: null, examples: ['Navigation and value', 'Switch and radio'] },
  'list-section': { title: 'ListSection', kind: 'component', web: null, examples: ['Inset grouped'] },
  accordion: { title: 'Accordion', kind: 'component', web: 'accordion', examples: ['FAQ'] },
  amount: { title: 'Amount', kind: 'component', web: 'amount', examples: ['Display size', 'Signed tones'] },
  divider: { title: 'Divider', kind: 'component', web: 'separator', examples: ['Inset'] },

  // Feedback
  banner: { title: 'Banner', kind: 'component', web: 'banner', examples: ['Tones', 'Action and dismiss'] },
  toast: { title: 'Toast', kind: 'component', web: 'toast', examples: ['With undo'] },
  dialog: { title: 'Dialog', kind: 'component', web: 'alert-dialog', examples: ['Destructive confirm'] },
  progress: { title: 'Progress', kind: 'component', web: 'progress', examples: ['Linear and circular'] },
  'loading-indicator': { title: 'LoadingIndicator', kind: 'component', web: 'spinner', examples: ['Default'] },
  skeleton: { title: 'Skeleton', kind: 'component', web: 'skeleton', examples: ['Text lines'] },
  'empty-state': { title: 'EmptyState', kind: 'component', web: 'empty-state', examples: ['With action'] },
  'error-state': { title: 'ErrorState', kind: 'component', web: 'error-state', examples: ['Retry'] },

  // Mobile-only
  'bottom-sheet': { title: 'BottomSheet', kind: 'mobile', web: 'sheet', examples: ['Detents'] },
  'action-sheet': { title: 'ActionSheet', kind: 'mobile', web: null, examples: ['Card actions'] },
  'context-menu': { title: 'ContextMenu', kind: 'mobile', web: null, examples: ['Long-press to copy'] },
  'swipeable-row': { title: 'SwipeableRow', kind: 'mobile', web: null, examples: ['Swipe actions'] },
  'otp-input': { title: 'OTPInput', kind: 'mobile', web: null, examples: ['Six digits'] },
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
    { heading: 'Icon buttons', slugs: ['icon-button'] },
    { heading: 'Chips', slugs: ['filter-chip', 'chip'] },
    { heading: 'Badges', slugs: ['badge'] },
    { heading: 'Avatars', slugs: ['avatar', 'avatar-group'] },
  ],
  inputs: [
    { heading: 'Fields', slugs: ['search-field', 'text-field', 'password-input', 'money-input'] },
    { heading: 'Selection', slugs: ['segmented-control', 'checkbox', 'radio-group', 'switch', 'stepper', 'slider'] },
  ],
  lists: [
    { heading: 'Cards', slugs: ['card', 'amount'] },
    { heading: 'Lists', slugs: ['list-section', 'list-item', 'divider'] },
    { heading: 'FAQ', slugs: ['accordion'] },
  ],
  feedback: [
    { heading: 'Banners', slugs: ['banner'] },
    { heading: 'Toast and dialog', slugs: ['toast', 'dialog'] },
    { heading: 'Progress', slugs: ['progress', 'loading-indicator', 'skeleton'] },
    { heading: 'States', slugs: ['empty-state', 'error-state'] },
  ],
  mobile: [
    { heading: 'Sheets and menus', slugs: ['bottom-sheet', 'action-sheet', 'select', 'date-time-field'] },
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
