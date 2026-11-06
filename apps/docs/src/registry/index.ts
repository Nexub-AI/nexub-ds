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
import filterChipEntry from './components/filter-chip';
import chipEntry from './components/chip';
import eyebrowChipEntry from './components/eyebrow-chip';

// ─── Component entries — Avatar ───────────────────────────────────────────────
import avatarEntry from './components/avatar';
import avatarGroupEntry from './components/avatar-group';

// ─── Component entries — Feedback ─────────────────────────────────────────────
import alertEntry from './components/alert';
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
import floatingInputEntry from './components/floating-input';
import scrollProgressEntry from './components/scroll-progress';
import sharedElementEntry from './components/shared-element';
import celebrateEntry from './components/celebrate';
import auroraEntry from './components/aurora';

// ─── Component entries — Layout ───────────────────────────────────────────────
import stackEntry from './components/stack';
import flexEntry from './components/flex';
import gridEntry from './components/grid';
import boxEntry from './components/box';

// ─── Component entries — Motion ───────────────────────────────────────────────
import motionFadeEntry from './components/motion-fade';
import motionRevealEntry from './components/motion-reveal';
import motionFloatEntry from './components/motion-float';
import motionMarqueeEntry from './components/motion-marquee';
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
import barChartEntry from './components/bar-chart';
import lineChartEntry from './components/line-chart';
import donutChartEntry from './components/donut-chart';
import sparklineEntry from './components/sparkline';
import kpiTileEntry from './components/kpi-tile';
import funnelEntry from './components/funnel';
import heatmapEntry from './components/heatmap';
import gaugeEntry from './components/gauge';
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

// ─── Marketing sections (@nexub/marketing) ───────────────────────────────────
import marketingNavEntry from './patterns/marketing-nav';
import heroEntry from './patterns/hero';
import logoStripEntry from './patterns/logo-strip';
import statBandEntry from './patterns/stat-band';
import sectionHeaderEntry from './patterns/section-header';
import featureSplitEntry from './patterns/feature-split';
import howItWorksEntry from './patterns/how-it-works';
import productGridEntry from './patterns/product-grid';
import testimonialGridEntry from './patterns/testimonial-grid';
import pricingTableEntry from './patterns/pricing-table';
import faqEntry from './patterns/faq';
import ctaBandEntry from './patterns/cta-band';
import marketingFooterEntry from './patterns/marketing-footer';
import { mobileOnly } from './native';
import { templateEntries } from './templates';

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
  filterChipEntry,
  chipEntry,
  eyebrowChipEntry,
  // Avatar
  avatarEntry,
  avatarGroupEntry,
  // Feedback
  alertEntry,
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
  barChartEntry,
  lineChartEntry,
  donutChartEntry,
  sparklineEntry,
  kpiTileEntry,
  funnelEntry,
  heatmapEntry,
  gaugeEntry,
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
  floatingInputEntry,
  scrollProgressEntry,
  sharedElementEntry,
  celebrateEntry,
  auroraEntry,
  // Layout
  stackEntry,
  flexEntry,
  gridEntry,
  boxEntry,
  // Motion
  motionFadeEntry,
  motionRevealEntry,
  motionFloatEntry,
  motionMarqueeEntry,
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

// Marketing sections share the pattern pages (/patterns/<slug>) under their own nav group.
export const marketingEntries: ComponentEntry[] = [
  marketingNavEntry,
  heroEntry,
  logoStripEntry,
  statBandEntry,
  sectionHeaderEntry,
  featureSplitEntry,
  howItWorksEntry,
  productGridEntry,
  testimonialGridEntry,
  pricingTableEntry,
  faqEntry,
  ctaBandEntry,
  marketingFooterEntry,
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
  ...marketingEntries,
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
  { id: 'changelog', label: 'Changelog', description: 'What changed in each release, across every @nexub package', href: '/changelog', category: 'Docs' },
  { id: 'brand-assets', label: 'Using the brand assets', description: 'Favicons, app icons and the web manifest from @nexub/brand', href: '/getting-started/brand-assets', category: 'Docs' },
  { id: 'without-tailwind', label: 'Use without Tailwind', description: 'Prebuilt @nexub/react/styles.css; rem sizing', href: '/getting-started/without-tailwind', category: 'Docs' },
  { id: 'strict-csp', label: 'Strict CSP', description: 'Which components are CSP-safe, scroll lock, fonts', href: '/getting-started/strict-csp', category: 'Docs' },
  { id: 'internationalization', label: 'Internationalization', description: 'NexubProvider: locale, RTL direction and translated strings', href: '/getting-started/internationalization', category: 'Docs' },
  { id: 'react-native', label: 'React Native', description: '@nexub/react-native for Expo and React Native apps: setup, components, screens', href: '/getting-started/react-native', category: 'Docs' },
  { id: 'ai-tools', label: 'AI tools and MCP', description: 'Connect @nexub/mcp, the Claude Code plugin, llms.txt and Markdown pages to your AI tool', href: '/getting-started/ai-tools', category: 'Docs' },
  { id: 'figma', label: 'Figma', description: 'Import the tokens into Figma as variables with light, dark and contrast modes', href: '/getting-started/figma', category: 'Docs' },
  { id: 'ai-surfaces', label: 'Building AI surfaces', description: 'The AI kit: motion, accessibility, security and strings for chat UIs', href: '/getting-started/ai-surfaces', category: 'Docs' },
  { id: 'upgrading', label: 'Upgrading', description: 'Changed roles and markup, new conventions, the nexub-migrate codemod', href: '/getting-started/upgrading', category: 'Docs' },
  { id: 'nextjs', label: 'Next.js and server components', description: 'Server components, per-component imports, next/font and Tailwind 4', href: '/getting-started/nextjs', category: 'Docs' },
  { id: 'migrating-to-4', label: 'Migrating to 4.0', description: 'What 4.0 removes (Tailwind 3 preset, Expo SDK 57) and how to clear it on 3.9', href: '/getting-started/migrating-to-4', category: 'Docs' },
  { id: 'migrating-to-3', label: 'Migrating to 3.0', description: 'What 3.0 removes (Banner, Callout, Tag, StatusPill, legacy colour names) and the codemod that moves you off it', href: '/getting-started/migrating-to-3', category: 'Docs' },
  { id: 'example-dashboard', label: 'Example: Dashboard', description: 'A product dashboard built only from public @nexub/react and @nexub/patterns exports', href: '/examples/dashboard', category: 'Examples' },
  { id: 'components-status', label: 'Component status', description: 'Lifecycle status of every component and pattern on web and native', href: '/components/status', category: 'Docs' },
  { id: 'foundations-principles', label: 'Principles', description: 'Calm Depth: the six principles behind the design language', href: '/foundations/principles', category: 'Foundations' },
  { id: 'foundations-colors', label: 'Colors', description: 'Color roles, tonal palettes and contrast levels', href: '/foundations/colors', category: 'Foundations' },
  { id: 'foundations-typography', label: 'Typography', description: 'Inter and Plus Jakarta Sans; the 15 type roles', href: '/foundations/typography', category: 'Foundations' },
  { id: 'foundations-spacing', label: 'Spacing', description: 'Spacing scale and layout tokens', href: '/foundations/spacing', category: 'Foundations' },
  { id: 'foundations-motion', label: 'Motion & interaction', description: 'Spring tokens, state layers, focus ring', href: '/foundations/motion', category: 'Foundations' },
  { id: 'foundations-shadows', label: 'Elevation & shape', description: 'Tonal elevation, shadow levels, semantic shapes', href: '/foundations/shadows', category: 'Foundations' },
  { id: 'foundations-materials', label: 'Materials', description: 'Glass 2.0 and the intensity dial', href: '/foundations/materials', category: 'Foundations' },
  { id: 'foundations-accessibility', label: 'Accessibility conformance', description: 'WCAG 2.2 AA report per component: automated, documented and not yet covered', href: '/foundations/accessibility', category: 'Foundations' },
  { id: 'foundations-expression', label: 'Expression: Calm and Vivid', description: 'The opt-in Vivid layer: accent gradients, glow, tinted depth and aurora', href: '/foundations/expression', category: 'Foundations' },
  { id: 'foundations-marketing-mode', label: 'Marketing mode', description: 'The nexub.com look, opt-in under data-mode="marketing"', href: '/foundations/marketing-mode', category: 'Foundations' },
  { id: 'foundations-theme-builder', label: 'Theme builder', description: 'One brand colour to a contrast-checked theme, exported as CSS, React, React Native or tokens', href: '/foundations/theme-builder', category: 'Foundations' },
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
  // Mobile-only components (@nexub/react-native)
  ...mobileOnly.map((m) => ({
    id: `native-${m.slug}`,
    label: m.title,
    description: m.description,
    href: `/components/native/${m.slug}`,
    category: 'Mobile only',
  })),
  // Page templates
  ...templateEntries.map((t) => ({
    id: `template-${t.slug}`,
    label: `${t.title} page`,
    description: t.description,
    href: `/patterns/pages/${t.slug}`,
    category: 'Pattern · Pages',
  })),
  { id: 'examples', label: 'Examples', description: 'Web and mobile dashboards and full-page references', href: '/examples', category: 'Examples' },
  { id: 'example-marketing', label: 'Example: Marketing page', description: 'A landing page from @nexub/marketing, rendered as server components', href: '/examples/marketing', category: 'Examples' },
  { id: 'example-mobile', label: 'Example: Mobile dashboard', description: 'The Payub-style home screen in @nexub/react-native', href: '/examples/mobile', category: 'Examples' },
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
      { title: 'Use without Tailwind', href: '/getting-started/without-tailwind' },
      { title: 'Strict CSP', href: '/getting-started/strict-csp' },
      { title: 'Internationalization', href: '/getting-started/internationalization' },
      { title: 'React Native', href: '/getting-started/react-native' },
      { title: 'AI tools and MCP', href: '/getting-started/ai-tools' },
      { title: 'Building AI surfaces', href: '/getting-started/ai-surfaces' },
      { title: 'Figma', href: '/getting-started/figma' },
      { title: 'Upgrading', href: '/getting-started/upgrading' },
      { title: 'Next.js and server components', href: '/getting-started/nextjs' },
      { title: 'Migrating to 4.0', href: '/getting-started/migrating-to-4' },
      { title: 'Migrating to 3.0', href: '/getting-started/migrating-to-3' },
      { title: 'Changelog', href: '/changelog' },
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
      { title: 'Expression', href: '/foundations/expression' },
      { title: 'Marketing mode', href: '/foundations/marketing-mode' },
      { title: 'Theme builder', href: '/foundations/theme-builder' },
      { title: 'Accessibility', href: '/foundations/accessibility' },
    ],
  },
  {
    title: 'Components',
    items: [{ title: 'Overview', href: '/components' }, { title: 'Status', href: '/components/status' }],
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
      { title: 'Mobile only',    items: mobileOnly.map((m) => ({ title: m.title, href: `/components/native/${m.slug}` })) },
    ],
  },
  {
    title: 'Patterns',
    items: [{ title: 'Overview', href: '/patterns' }],
    children: [
      { title: 'Pages', items: templateEntries.map((t) => ({ title: t.title, href: `/patterns/pages/${t.slug}` })) },
      { title: 'Blocks', items: patternEntries.filter((e) => e.meta.category !== 'Marketing').map((e) => ({ title: e.meta.title, href: `/patterns/${e.meta.slug}` })) },
      { title: 'Marketing', items: marketingEntries.map((e) => ({ title: e.meta.title, href: `/patterns/${e.meta.slug}` })) },
    ],
  },
  {
    title: 'Examples',
    items: [
      { title: 'Overview', href: '/examples' },
      { title: 'Web dashboard', href: '/examples/dashboard' },
      { title: 'Mobile dashboard', href: '/examples/mobile' },
      { title: 'Marketing page', href: '/examples/marketing' },
    ],
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
