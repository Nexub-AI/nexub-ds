// Storybook coverage for components and sections whose only rendering lived in
// the docs: each story renders the component's first docs example (the single
// source the docs page shows), so axe (visual/a11y.visual.spec.ts) and the
// screenshot suite run on them. Each example is imported under the component's
// own name. Plain CSF objects: no Storybook types, so the docs typecheck needs
// nothing new. createElement, not JSX: this folder inherits the docs app's
// `jsx: preserve` (Next compiles it), which Storybook's Vite build would not.
import { createElement } from 'react';
import BarChart from '../examples/components/bar-chart/0';
import LineChart from '../examples/components/line-chart/0';
import DonutChart from '../examples/components/donut-chart/0';
import Sparkline from '../examples/components/sparkline/0';
import Gauge from '../examples/components/gauge/0';
import Heatmap from '../examples/components/heatmap/0';
import Funnel from '../examples/components/funnel/0';
import KpiTile from '../examples/components/kpi-tile/0';
import MoneyInput from '../examples/components/money-input/0';
import NavigationRail from '../examples/components/navigation-rail/0';
import SplitButton from '../examples/components/split-button/0';
import Float from '../examples/components/motion-float/0';
import Marquee from '../examples/components/motion-marquee/0';
import Reveal from '../examples/components/motion-reveal/0';
import Celebrate from '../examples/components/celebrate/0';
import SharedElement from '../examples/components/shared-element/0';
import ScrollProgress from '../examples/components/scroll-progress/0';
import FloatingInput from '../examples/components/floating-input/0';
import Hero from '../examples/patterns/hero/0';
import SectionHeader from '../examples/patterns/section-header/0';
import LogoStrip from '../examples/patterns/logo-strip/0';
import StatBand from '../examples/patterns/stat-band/0';
import FeatureSplit from '../examples/patterns/feature-split/0';
import HowItWorks from '../examples/patterns/how-it-works/0';
import ProductGrid from '../examples/patterns/product-grid/0';
import TestimonialGrid from '../examples/patterns/testimonial-grid/0';
import PricingTable from '../examples/patterns/pricing-table/0';
import FAQ from '../examples/patterns/faq/0';
import CTABand from '../examples/patterns/cta-band/0';
import MarketingNav from '../examples/patterns/marketing-nav/0';
import MarketingFooter from '../examples/patterns/marketing-footer/0';

export default { title: 'Coverage/Docs examples', parameters: { layout: 'padded' } };

export const BarChartStory = { name: 'BarChart', render: () => createElement(BarChart) };
export const LineChartStory = { name: 'LineChart', render: () => createElement(LineChart) };
export const DonutChartStory = { name: 'DonutChart', render: () => createElement(DonutChart) };
export const SparklineStory = { name: 'Sparkline', render: () => createElement(Sparkline) };
export const MoneyInputStory = { name: 'MoneyInput', render: () => createElement(MoneyInput) };
export const NavigationRailStory = { name: 'NavigationRail', render: () => createElement(NavigationRail) };
export const SplitButtonStory = { name: 'SplitButton', render: () => createElement(SplitButton) };
export const FloatStory = { name: 'Float', render: () => createElement(Float) };
export const MarqueeStory = { name: 'Marquee', render: () => createElement(Marquee) };
export const RevealStory = { name: 'Reveal', render: () => createElement(Reveal) };
export const CelebrateStory = { name: 'Celebrate', render: () => createElement(Celebrate) };
export const SharedElementStory = { name: 'SharedElement', render: () => createElement(SharedElement) };
export const ScrollProgressStory = { name: 'ScrollProgress', render: () => createElement(ScrollProgress) };
export const FloatingInputStory = { name: 'FloatingInput', render: () => createElement(FloatingInput) };
export const HeroStory = { name: 'Hero', render: () => createElement(Hero) };
export const SectionHeaderStory = { name: 'SectionHeader', render: () => createElement(SectionHeader) };
export const LogoStripStory = { name: 'LogoStrip', render: () => createElement(LogoStrip) };
export const StatBandStory = { name: 'StatBand', render: () => createElement(StatBand) };
export const FeatureSplitStory = { name: 'FeatureSplit', render: () => createElement(FeatureSplit) };
export const HowItWorksStory = { name: 'HowItWorks', render: () => createElement(HowItWorks) };
export const ProductGridStory = { name: 'ProductGrid', render: () => createElement(ProductGrid) };
export const TestimonialGridStory = { name: 'TestimonialGrid', render: () => createElement(TestimonialGrid) };
export const PricingTableStory = { name: 'PricingTable', render: () => createElement(PricingTable) };
export const FAQStory = { name: 'FAQ', render: () => createElement(FAQ) };
export const CTABandStory = { name: 'CTABand', render: () => createElement(CTABand) };
export const MarketingNavStory = { name: 'MarketingNav', render: () => createElement(MarketingNav) };
export const MarketingFooterStory = { name: 'MarketingFooter', render: () => createElement(MarketingFooter) };
export const GaugeStory = { name: 'Gauge', render: () => createElement(Gauge) };
export const HeatmapStory = { name: 'Heatmap', render: () => createElement(Heatmap) };
export const FunnelStory = { name: 'Funnel', render: () => createElement(Funnel) };
export const KpiTileStory = { name: 'KpiTile', render: () => createElement(KpiTile) };
