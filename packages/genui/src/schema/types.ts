// The document format (RFC #823). Plain JSON: no functions, no markup, nothing the renderer runs.

/** Any JSON value. Payloads and table cells are data, never markup. */
export type GenUIJson = string | number | boolean | null | GenUIJson[] | { [key: string]: GenUIJson };

/** `"<major>.<minor>"`, independent of the npm version. This release writes and reads major 1. */
export type GenUIVersion = `${number}.${number}`;

/** A named action with an optional JSON payload: what a Button sends to the host. Never code, never a URL. */
export interface GenUIAction {
  name: string;
  payload?: GenUIJson;
}

export type GenUITone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

/** One row of a DescriptionList. */
export interface GenUIDescriptionItem {
  label: string;
  value: string;
  emphasis?: boolean;
}

/** One column of a Table: its header text and where its cells sit. */
export interface GenUITableColumn {
  label: string;
  align?: 'start' | 'end';
}

export type GenUICell = string | number | boolean | null;

/** Props of each catalog component, as the validator returns them. */
export interface GenUIPropsByType {
  Card: { title?: string; description?: string; tone?: GenUITone; variant?: 'flat' | 'surface' };
  DescriptionList: {
    items: GenUIDescriptionItem[];
    layout?: 'inline' | 'stacked';
    columns?: 1 | 2 | 3;
    divided?: boolean;
    size?: 'sm' | 'md';
  };
  Table: {
    columns: GenUITableColumn[];
    rows: GenUICell[][];
    caption?: string;
    density?: 'comfortable' | 'compact';
    striped?: boolean;
  };
  Badge: { text: string; tone?: GenUITone; variant?: 'solid' | 'soft' | 'outline'; size?: 'sm' | 'md' | 'lg' };
  Alert: { title?: string; text?: string; tone?: GenUITone };
  StreamingText: { text: string };
  Button: {
    label: string;
    action: GenUIAction;
    variant?: 'filled' | 'tonal' | 'outlined' | 'text';
    tone?: GenUITone;
    size?: 'sm' | 'md';
  };
}

/** A component name in the v1 catalog. */
export type GenUIType = keyof GenUIPropsByType;

/** A node: one catalog component. `key` is identity for streaming and React keys; it never reaches the DOM. */
export type GenUINode = {
  [T in GenUIType]: {
    type: T;
    key?: string;
    props: GenUIPropsByType[T];
    /** Only on containers (Card). A string child is text. */
    children?: GenUIChild[];
  };
}[GenUIType];

/**
 * A node still arriving while a document streams (`validate(…, { partial })`): the renderer
 * shows a skeleton in its place. Never in a finished document.
 */
export interface GenUIPendingNode {
  type: null;
  key?: string;
  pending: true;
}

export type GenUIChild = GenUINode | GenUIPendingNode | string;

/** A validated document: what the renderer draws. */
export interface GenUIDocument {
  $schema?: string;
  version: GenUIVersion;
  /** The accessible name of the rendered region. */
  title?: string;
  root: GenUINode | GenUIPendingNode;
}

export type GenUIIssueCode =
  | 'parse-error'
  | 'too-large'
  | 'forbidden-key'
  | 'unsupported-version'
  | 'invalid-node'
  | 'unknown-component'
  | 'unknown-prop'
  | 'invalid-prop'
  | 'missing-prop'
  | 'unexpected-children'
  | 'unknown-action';

/** One problem, with a JSON Pointer to where it is, written so an agent can fix its output. */
export interface GenUIIssue {
  path: string;
  code: GenUIIssueCode;
  message: string;
}

/** Caps on what a document may contain. A host can lower each one, never raise it. */
export interface GenUILimits {
  /** Node nesting depth. @default 16 */
  maxDepth: number;
  /** Nodes and text children in the whole document. @default 500 */
  maxNodes: number;
  /** Size of the JSON text, in bytes (UTF-8). @default 262144 (256 kB) */
  maxBytes: number;
}

export type GenUIOnInvalid = 'drop' | 'reject';
