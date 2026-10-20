import type { ComponentEntry, NavGroup } from './types';

// ─── Component entries — original ─────────────────────────────────────────────
import buttonEntry from './components/button';
import badgeEntry from './components/badge';
import inputEntry from './components/input';
import cardEntry from './components/card';
import dialogEntry from './components/dialog';
import tooltipEntry from './components/tooltip';
import selectEntry from './components/select';
import tabsEntry from './components/tabs';
import switchEntry from './components/switch';
import spinnerEntry from './components/spinner';

// ─── Component entries — Actions ──────────────────────────────────────────────
import buttonGroupEntry from './components/button-group';
import iconButtonEntry from './components/icon-button';

// ─── Component entries — Form & Input ─────────────────────────────────────────
import textareaEntry from './components/textarea';
import numberInputEntry from './components/number-input';
import searchInputEntry from './components/search-input';
import passwordInputEntry from './components/password-input';
import labelEntry from './components/label';
import helperTextEntry from './components/helper-text';
import formFieldEntry from './components/form-field';
import datePickerEntry from './components/date-picker';
import dateRangePickerEntry from './components/date-range-picker';

// ─── Component entries — Labels & Badges ──────────────────────────────────────
import statusPillEntry from './components/status-pill';
import filterChipEntry from './components/filter-chip';
import chipEntry from './components/chip';
import tagEntry from './components/tag';
import eyebrowChipEntry from './components/eyebrow-chip';

// ─── Component entries — Avatar ───────────────────────────────────────────────
import avatarEntry from './components/avatar';
import avatarGroupEntry from './components/avatar-group';

// ─── Component entries — Feedback ─────────────────────────────────────────────
import alertEntry from './components/alert';
import bannerEntry from './components/banner';
import calloutEntry from './components/callout';
import toastEntry from './components/toast';

// ─── Component entries — Loading States ───────────────────────────────────────
import skeletonEntry from './components/skeleton';
import progressEntry from './components/progress';

// ─── Component entries — Disclosure ───────────────────────────────────────────
import accordionEntry from './components/accordion';
import collapsibleEntry from './components/collapsible';
import scrollAreaEntry from './components/scroll-area';

// ─── Component entries — Interactive ──────────────────────────────────────────
import ratingEntry from './components/rating';
import sliderEntry from './components/slider';
import toggleEntry from './components/toggle';
import toggleGroupEntry from './components/toggle-group';
import segmentedControlEntry from './components/segmented-control';

// ─── Component entries — Form Controls ────────────────────────────────────────
import checkboxEntry from './components/checkbox';
import radioGroupEntry from './components/radio-group';
import comboboxEntry from './components/combobox';
import autocompleteEntry from './components/autocomplete';

// ─── Component entries — Overlays ─────────────────────────────────────────────
import alertDialogEntry from './components/alert-dialog';
import popoverEntry from './components/popover';
import hoverCardEntry from './components/hover-card';
import drawerEntry from './components/drawer';
import sheetEntry from './components/sheet';

// ─── Component entries — Navigation ───────────────────────────────────────────
import breadcrumbEntry from './components/breadcrumb';
import paginationEntry from './components/pagination';

// ─── Component entries — Data Display ─────────────────────────────────────────
import tableEntry from './components/table';
import dataTableEntry from './components/data-table';
import emptyStateEntry from './components/empty-state';
import errorStateEntry from './components/error-state';

// ─── Component entries — Dividers ─────────────────────────────────────────────
import separatorEntry from './components/separator';
import gradientDividerEntry from './components/gradient-divider';

// ─── Component entries — Typography ───────────────────────────────────────────
import headingEntry from './components/heading';
import textEntry from './components/text';

// ─── Component entries — Inline Primitives ────────────────────────────────────
import codeInlineEntry from './components/code-inline';
import kbdEntry from './components/kbd';
import linkEntry from './components/link';
import textGradientEntry from './components/text-gradient';

// ─── Component entries — Layout ───────────────────────────────────────────────
import stackEntry from './components/stack';
import flexEntry from './components/flex';
import gridEntry from './components/grid';
import boxEntry from './components/box';

// ─── Component entries — Motion ───────────────────────────────────────────────
import motionFadeEntry from './components/motion-fade';
import motionSlideEntry from './components/motion-slide';
import motionScaleEntry from './components/motion-scale';
import motionCollapseEntry from './components/motion-collapse';

// ─── Pattern entries ──────────────────────────────────────────────────────────
import statCardEntry from './patterns/stat-card';
import authCardEntry from './patterns/auth-card';
import filterBarEntry from './patterns/filter-bar';
import userCardEntry from './patterns/user-card';
import planCardEntry from './patterns/plan-card';
import activityFeedEntry from './patterns/activity-feed';
import settingsSectionEntry from './patterns/settings-section';
import infoListEntry from './patterns/info-list';
import stepIndicatorEntry from './patterns/step-indicator';
import notificationItemEntry from './patterns/notification-item';
import listDetailEntry from './patterns/list-detail';

// ─── Design refresh Phase 5 ───────────────────────────────────────────────────
import splitButtonEntry from './components/split-button';
import navigationRailEntry from './components/navigation-rail';
import amountEntry from './components/amount';
import moneyInputEntry from './components/money-input';

// ─── 1.6.0 ────────────────────────────────────────────────────────────────────
import radioCardEntry from './components/radio-card';
import checkboxCardEntry from './components/checkbox-card';
import mediaCardEntry from './components/media-card';
import numberTickerEntry from './components/number-ticker';
import bentoGridEntry from './patterns/bento-grid';

// ─── 1.7.0 ────────────────────────────────────────────────────────────────────
import errorSummaryEntry from './patterns/error-summary';

// ─── 1.8.0 — AI ───────────────────────────────────────────────────────────────
import promptInputEntry from './components/prompt-input';
import thinkingIndicatorEntry from './components/thinking-indicator';
import streamingTextEntry from './components/streaming-text';
import messageBubbleEntry from './components/message-bubble';
import citationEntry from './components/citation';
import conversationEntry from './patterns/conversation';

// ─── All component entries (flat) ─────────────────────────────────────────────
export const componentEntries: ComponentEntry[] = [
  // Actions
  buttonEntry,
  buttonGroupEntry,
  splitButtonEntry,
  iconButtonEntry,
  navigationRailEntry,
  amountEntry,
  moneyInputEntry,
  // Form & Input
  inputEntry,
  textareaEntry,
  numberInputEntry,
  searchInputEntry,
  passwordInputEntry,
  labelEntry,
  helperTextEntry,
  formFieldEntry,
  datePickerEntry,
  dateRangePickerEntry,
  // Labels & Badges
  badgeEntry,
  statusPillEntry,
  filterChipEntry,
  chipEntry,
  tagEntry,
  eyebrowChipEntry,
  // Avatar
  avatarEntry,
  avatarGroupEntry,
  // Feedback
  alertEntry,
  bannerEntry,
  calloutEntry,
  toastEntry,
  // Loading States
  skeletonEntry,
  spinnerEntry,
  progressEntry,
  // Disclosure
  accordionEntry,
  collapsibleEntry,
  tabsEntry,
  scrollAreaEntry,
  // Interactive
  ratingEntry,
  sliderEntry,
  toggleEntry,
  toggleGroupEntry,
  segmentedControlEntry,
  // Form Controls
  selectEntry,
  checkboxEntry,
  radioGroupEntry,
  radioCardEntry,
  checkboxCardEntry,
  switchEntry,
  comboboxEntry,
  autocompleteEntry,
  // Overlays
  dialogEntry,
  alertDialogEntry,
  popoverEntry,
  tooltipEntry,
  hoverCardEntry,
  drawerEntry,
  sheetEntry,
  // Navigation
  breadcrumbEntry,
  paginationEntry,
  // Data Display
  tableEntry,
  dataTableEntry,
  emptyStateEntry,
  errorStateEntry,
  numberTickerEntry,
  cardEntry,
  mediaCardEntry,
  // Dividers
  separatorEntry,
  gradientDividerEntry,
  // Typography
  headingEntry,
  textEntry,
  // Inline Primitives
  codeInlineEntry,
  kbdEntry,
  linkEntry,
  textGradientEntry,
  // Layout
  stackEntry,
  flexEntry,
  gridEntry,
  boxEntry,
  // Motion
  motionFadeEntry,
  motionSlideEntry,
  motionScaleEntry,
  motionCollapseEntry,
  // AI
  promptInputEntry,
  messageBubbleEntry,
  streamingTextEntry,
  thinkingIndicatorEntry,
  citationEntry,
];

// ─── All pattern entries (flat) ───────────────────────────────────────────────
export const patternEntries: ComponentEntry[] = [
  statCardEntry,
  authCardEntry,
  filterBarEntry,
  userCardEntry,
  planCardEntry,
  activityFeedEntry,
  settingsSectionEntry,
  infoListEntry,
  stepIndicatorEntry,
  notificationItemEntry,
  listDetailEntry,
  bentoGridEntry,
  errorSummaryEntry,
  conversationEntry,
];

// ─── Lookup by slug ───────────────────────────────────────────────────────────
// Pre-build Maps at module-load time so every lookup is O(1).
// With .find() the cost was O(n) per call — called twice per page render
// (generateMetadata + ComponentPage). Maps pay the build cost once.
const _componentMap = new Map(componentEntries.map((e) => [e.meta.slug, e]));
const _patternMap = new Map(patternEntries.map((e) => [e.meta.slug, e]));

export function getComponentEntry(slug: string): ComponentEntry | undefined {
  return _componentMap.get(slug);
}

export function getPatternEntry(slug: string): ComponentEntry | undefined {
  return _patternMap.get(slug);
}

// ─── Flat search index ────────────────────────────────────────────────────────
export interface SearchEntry {
  id: string;
  label: string;
  description: string;
  href: string;
  category: string;
}

export const searchIndex: SearchEntry[] = [
  // Static pages
  { id: 'getting-started', label: 'Getting Started', description: 'Install and set up Nexub DS', href: '/getting-started', category: 'Docs' },
  { id: 'brand-assets', label: 'Using the brand assets', description: 'Favicons, app icons and the web manifest from @nexub/brand', href: '/getting-started/brand-assets', category: 'Docs' },
  { id: 'strict-csp', label: 'Strict CSP', description: 'Which components are CSP-safe, scroll lock, fonts', href: '/getting-started/strict-csp', category: 'Docs' },
  { id: 'internationalization', label: 'Internationalization', description: 'NexubProvider: locale, RTL direction and translated strings', href: '/getting-started/internationalization', category: 'Docs' },
  { id: 'ai-surfaces', label: 'Building AI surfaces', description: 'The AI kit: motion, accessibility, security and strings for chat UIs', href: '/getting-started/ai-surfaces', category: 'Docs' },
  { id: 'foundations-principles', label: 'Principles', description: 'Calm Depth: the six principles behind the design language', href: '/foundations/principles', category: 'Foundations' },
  { id: 'foundations-colors', label: 'Colors', description: 'Color roles, tonal palettes and contrast levels', href: '/foundations/colors', category: 'Foundations' },
  { id: 'foundations-typography', label: 'Typography', description: 'Inter and Plus Jakarta Sans; the 15 type roles', href: '/foundations/typography', category: 'Foundations' },
  { id: 'foundations-spacing', label: 'Spacing', description: 'Spacing scale and layout tokens', href: '/foundations/spacing', category: 'Foundations' },
  { id: 'foundations-motion', label: 'Motion & interaction', description: 'Spring tokens, state layers, focus ring', href: '/foundations/motion', category: 'Foundations' },
  { id: 'foundations-shadows', label: 'Elevation & shape', description: 'Tonal elevation, shadow levels, semantic shapes', href: '/foundations/shadows', category: 'Foundations' },
  { id: 'foundations-materials', label: 'Materials', description: 'Glass 2.0 and the intensity dial', href: '/foundations/materials', category: 'Foundations' },
  { id: 'content-tone', label: 'Tone of Voice', description: 'How Nexub products sound', href: '/content/tone-of-voice', category: 'Content' },
  { id: 'content-grammar', label: 'Grammar & Style', description: 'UI copy conventions and rules', href: '/content/grammar-style', category: 'Content' },
  { id: 'content-vocabulary', label: 'Vocabulary', description: 'Approved terms and words to avoid', href: '/content/vocabulary', category: 'Content' },
  { id: 'content-illustration', label: 'Illustration', description: 'When and how to use illustrations', href: '/content/illustration', category: 'Content' },
  // Components
  ...componentEntries.map((e) => ({
    id: `component-${e.meta.slug}`,
    label: e.meta.title,
    description: e.meta.description,
    href: `/components/${e.meta.slug}`,
    category: e.meta.category,
  })),
  // Patterns
  ...patternEntries.map((e) => ({
    id: `pattern-${e.meta.slug}`,
    label: e.meta.title,
    description: e.meta.description,
    href: `/patterns/${e.meta.slug}`,
    category: `Pattern · ${e.meta.category}`,
  })),
];

// ─── Sidebar nav groups ───────────────────────────────────────────────────────
const componentsByCategory = (category: string) =>
  componentEntries
    .filter((e) => e.meta.category === category)
    .map((e) => ({ title: e.meta.title, href: `/components/${e.meta.slug}` }));

export const navGroups: NavGroup[] = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', href: '/getting-started' },
      { title: 'Using the brand assets', href: '/getting-started/brand-assets' },
      { title: 'Strict CSP', href: '/getting-started/strict-csp' },
      { title: 'Internationalization', href: '/getting-started/internationalization' },
      { title: 'Building AI surfaces', href: '/getting-started/ai-surfaces' },
    ],
  },
  {
    title: 'Foundations',
    items: [
      { title: 'Principles', href: '/foundations/principles' },
      { title: 'Colors', href: '/foundations/colors' },
      { title: 'Typography', href: '/foundations/typography' },
      { title: 'Spacing', href: '/foundations/spacing' },
      { title: 'Elevation & shape', href: '/foundations/shadows' },
      { title: 'Motion & interaction', href: '/foundations/motion' },
      { title: 'Materials', href: '/foundations/materials' },
    ],
  },
  {
    title: 'Components',
    items: [], // sub-items live in children
    children: [
      { title: 'Actions',        items: componentsByCategory('Actions') },
      { title: 'Form & Input',   items: componentsByCategory('Form & Input') },
      { title: 'Labels & Badges', items: componentsByCategory('Labels & Badges') },
      { title: 'Avatar',         items: componentsByCategory('Avatar') },
      { title: 'Feedback',       items: componentsByCategory('Feedback') },
      { title: 'Loading States', items: componentsByCategory('Loading States') },
      { title: 'Disclosure',     items: componentsByCategory('Disclosure') },
      { title: 'Interactive',    items: componentsByCategory('Interactive') },
      { title: 'Form Controls',  items: componentsByCategory('Form Controls') },
      { title: 'Overlays',       items: componentsByCategory('Overlays') },
      { title: 'Navigation',     items: componentsByCategory('Navigation') },
      { title: 'Data Display',   items: componentsByCategory('Data Display') },
      { title: 'Dividers',       items: componentsByCategory('Dividers') },
      { title: 'Typography',     items: componentsByCategory('Typography') },
      { title: 'Inline',         items: componentsByCategory('Inline Primitives') },
      { title: 'Layout',         items: componentsByCategory('Layout') },
      { title: 'Motion',         items: componentsByCategory('Motion') },
      { title: 'AI',             items: componentsByCategory('AI') },
    ],
  },
  {
    title: 'Patterns',
    items: patternEntries.map((e) => ({
      title: e.meta.title,
      href: `/patterns/${e.meta.slug}`,
    })),
  },
  {
    title: 'Content',
    items: [
      { title: 'Tone of Voice',    href: '/content/tone-of-voice',  description: 'How Nexub products sound' },
      { title: 'Grammar & Style',  href: '/content/grammar-style',  description: 'UI copy conventions and rules' },
      { title: 'Vocabulary',       href: '/content/vocabulary',     description: 'Approved terms and words to avoid' },
      { title: 'Illustration',     href: '/content/illustration',   description: 'When and how to use illustrations' },
    ],
  },
];
