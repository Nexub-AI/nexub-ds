export interface PropDef {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

export interface ExampleDef {
  title: string;
  description?: string;
  code: string;
}

/** Lifecycle status, see GOVERNANCE.md → "Status lifecycle". */
export type ComponentStatus = 'alpha' | 'beta' | 'stable' | 'deprecated';

export interface Deprecation {
  /** Slug of the replacement component (a page under /components). */
  replacement: string;
  /** The major that removes it, e.g. '3.0'. Removal only ever happens in a major. */
  removeIn: string;
  /** One-line migration; `backticks` render as code. */
  migration: string;
}

export interface ComponentMeta {
  slug: string;
  title: string;
  description: string;
  category: string;
  package: '@nexub/react' | '@nexub/patterns';
  status?: ComponentStatus;
  /** Set with `status: 'deprecated'`: shown on the page and in the AI docs. */
  deprecation?: Deprecation;
  addedIn?: string;   // semver e.g. '0.0.1' — shown as "Added in v0.0.1" badge
  updatedIn?: string; // shown alongside addedIn in the version timeline pill
  related?: string[]; // slugs surfaced in the "See also" block at page bottom
}

export interface UsageDef {
  whenToUse: string[];
  whenNotToUse: string[];
}

/* ── Interactive playground ─────────────────────────────────────────────── */

/** Set `omitFromCode` when a control drives a wrapper or synthetic state
 *  rather than a real component prop, so the generated code string stays clean. */
export type ControlDef =
  | { kind: 'select'; name: string; label?: string; options: string[]; default: string; omitFromCode?: boolean }
  | { kind: 'switch'; name: string; label?: string; default: boolean; omitFromCode?: boolean }
  | { kind: 'text';   name: string; label?: string; default: string; placeholder?: string; omitFromCode?: boolean }
  | { kind: 'number'; name: string; label?: string; default: number; min?: number; max?: number; step?: number; omitFromCode?: boolean };

export interface PlaygroundDef {
  controls: ControlDef[];
  /** Prop name used for the visible child slot (e.g. button label). */
  childrenProp?: string;
  /** Optional title override (default: "Playground"). */
  title?: string;
}

/* ── Variant matrix gallery ─────────────────────────────────────────────── */

export interface MatrixDef {
  rowsProp: string;
  rows: string[];
  colsProp: string;
  cols: string[];
  /** Fixed props applied to every cell. */
  fixed?: Record<string, string | boolean | number>;
  /** Default text for the visible child slot (e.g. button label). */
  childrenDefault?: string;
}

/* ── Accessibility panel ────────────────────────────────────────────────── */

export interface A11yKeyboardEntry {
  key: string;
  description: string;
}

export interface A11yDef {
  roles?: string[];
  keyboard?: A11yKeyboardEntry[];
  focus?: string[];
  screenReader?: string[];
  notes?: string[];
}

/* ── Component entry ────────────────────────────────────────────────────── */

export interface ComponentEntry {
  meta: ComponentMeta;
  props: PropDef[];
  examples: ExampleDef[];
  usage?: UsageDef;
  playground?: PlaygroundDef;
  matrix?: MatrixDef;
  a11y?: A11yDef;
}

export interface NavItem {
  title: string;
  href: string;
  description?: string;
  category?: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
  children?: NavGroup[]; // nested sub-sections (e.g. component categories inside "Components")
}
