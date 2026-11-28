// The v1 allow-list (RFC #823, accepted with changes): display-only components plus Button with a
// named action. Forms and fields come in v1.1. This file is the single source: the validator,
// the JSON Schema (json-schema.ts) and the MCP tools all read it.
import type { GenUINode, GenUIType } from './types.js';

/** Strings rendered as text: labels, titles, cells. */
export const MAX_TEXT = 2000;
/** StreamingText is the long-answer part. */
export const MAX_LONG_TEXT = 10_000;
/** An action payload, as JSON text. */
export const MAX_PAYLOAD_BYTES = 4096;
export const ACTION_NAME = /^[A-Za-z][A-Za-z0-9_.-]{0,63}$/;
export const KEY = /^[A-Za-z0-9_-]{1,64}$/;

export const TONES = ['neutral', 'info', 'success', 'warning', 'danger'] as const;

/** A prop's declared type. The validator checks every value against it. */
export type GenUIPropSpec =
  | { type: 'text'; required?: boolean; maxLength?: number; description: string }
  | { type: 'enum'; values: readonly (string | number)[]; default?: string | number; description: string }
  | { type: 'boolean'; default?: boolean; description: string }
  | { type: 'action'; required?: boolean; description: string }
  | {
      type: 'list';
      required?: boolean;
      maxItems: number;
      /** Fields of each item (an object). */
      item: Record<string, GenUIPropSpec>;
      description: string;
    }
  | { type: 'rows'; required?: boolean; maxItems: number; maxCells: number; description: string };

export interface GenUIComponentSpec {
  /** One line for agents and docs. */
  description: string;
  /** Takes `children` (nodes and strings). */
  container: boolean;
  props: Readonly<Record<string, GenUIPropSpec>>;
  /** A valid node, for agents. */
  example: GenUINode;
}

const tone = { type: 'enum', values: TONES, default: 'neutral', description: 'Colour role: never the only signal.' } as const;

const SPECS: Record<GenUIType, GenUIComponentSpec> = {
  Card: {
    description: 'A surface that groups related content. The only container: its children are nodes or text.',
    container: true,
    props: {
      title: { type: 'text', description: 'Heading of the card (a heading element, level set by the host).' },
      description: { type: 'text', description: 'One muted line under the title.' },
      tone: { ...tone, description: 'A coloured edge at the start for a status card.' },
      variant: { type: 'enum', values: ['flat', 'surface'], default: 'flat', description: '`surface` adds a shadow.' },
    },
    example: {
      type: 'Card',
      key: 'refund',
      props: { title: 'Refund for order A-1042', description: 'Requested today' },
      children: [{ type: 'Badge', props: { text: 'Pending', tone: 'warning' } }],
    },
  },
  DescriptionList: {
    description: 'Label and value rows: the details of a record, a receipt, a fee breakdown.',
    container: false,
    props: {
      items: {
        type: 'list',
        required: true,
        maxItems: 100,
        item: {
          label: { type: 'text', required: true, description: 'The label.' },
          value: { type: 'text', required: true, description: 'The value.' },
          emphasis: { type: 'boolean', description: 'A total: stronger, with a rule above.' },
        },
        description: 'The rows, in order.',
      },
      layout: { type: 'enum', values: ['inline', 'stacked'], default: 'inline', description: 'Label beside or above the value.' },
      columns: { type: 'enum', values: [1, 2, 3], default: 1, description: 'Pairs per row on wide screens.' },
      divided: { type: 'boolean', description: 'A hairline between rows.' },
      size: { type: 'enum', values: ['sm', 'md'], default: 'md', description: 'Text size.' },
    },
    example: {
      type: 'DescriptionList',
      props: {
        items: [
          { label: 'Order', value: 'A-1042' },
          { label: 'Amount', value: '€42.00', emphasis: true },
        ],
      },
    },
  },
  Table: {
    description: 'Rows of data under column headers. Cells are text, numbers, booleans or null.',
    container: false,
    props: {
      columns: {
        type: 'list',
        required: true,
        maxItems: 20,
        item: {
          label: { type: 'text', required: true, description: 'Column header (required: tables need headers).' },
          align: { type: 'enum', values: ['start', 'end'], default: 'start', description: '`end` for numbers.' },
        },
        description: 'Column headers, in order.',
      },
      rows: { type: 'rows', required: true, maxItems: 200, maxCells: 20, description: 'One array of cells per row, in column order.' },
      caption: { type: 'text', description: 'What the table shows; its accessible name.' },
      density: { type: 'enum', values: ['comfortable', 'compact'], default: 'comfortable', description: 'Row height.' },
      striped: { type: 'boolean', description: 'Tint every other row.' },
    },
    example: {
      type: 'Table',
      props: {
        caption: 'Open invoices',
        columns: [{ label: 'Invoice' }, { label: 'Amount', align: 'end' }],
        rows: [
          ['INV-001', '€120.00'],
          ['INV-002', '€80.00'],
        ],
      },
    },
  },
  Badge: {
    description: 'A short status or count label.',
    container: false,
    props: {
      text: { type: 'text', required: true, maxLength: 64, description: 'The label.' },
      tone,
      variant: { type: 'enum', values: ['solid', 'soft', 'outline'], default: 'solid', description: 'Fill style.' },
      size: { type: 'enum', values: ['sm', 'md', 'lg'], default: 'md', description: 'Size.' },
    },
    example: { type: 'Badge', props: { text: 'Paid', tone: 'success' } },
  },
  Alert: {
    description: 'A message that needs attention: a warning, an error, a note.',
    container: false,
    props: {
      title: { type: 'text', description: 'Bold first line.' },
      text: { type: 'text', description: 'The message.' },
      tone,
    },
    example: { type: 'Alert', props: { title: 'Card expires soon', text: 'Update it before 1 December.', tone: 'warning' } },
  },
  StreamingText: {
    description: 'Plain text that may still be growing while the answer streams. Not Markdown.',
    container: false,
    props: {
      text: { type: 'text', required: true, maxLength: MAX_LONG_TEXT, description: 'The text so far.' },
    },
    example: { type: 'StreamingText', props: { text: 'Here is what I found in your last three invoices.' } },
  },
  Button: {
    description: 'Sends a named action to the host. Never navigates, never runs code; the host decides what happens.',
    container: false,
    props: {
      label: { type: 'text', required: true, maxLength: 80, description: 'The button text (its accessible name).' },
      action: {
        type: 'action',
        required: true,
        description: '`{ "name", "payload"? }`. The name must be one the host accepts, or the button is dropped.',
      },
      variant: { type: 'enum', values: ['filled', 'tonal', 'outlined', 'text'], default: 'filled', description: 'Emphasis.' },
      tone,
      size: { type: 'enum', values: ['sm', 'md'], default: 'md', description: 'Size.' },
    },
    example: {
      type: 'Button',
      props: { label: 'Approve refund', variant: 'filled', action: { name: 'approveRefund', payload: { orderId: 'A-1042' } } },
    },
  },
};

/** The allow-list: which components render, and which props each takes. */
export interface GenUICatalog {
  /** The schema version this catalog belongs to. */
  readonly version: '1.0';
  /** Component names, in catalog order. */
  readonly names: readonly GenUIType[];
  /** The entry for a name, or undefined when the name isn't in this catalog. */
  get(name: string): GenUIComponentSpec | undefined;
  /** A narrower catalog with only these components. */
  only(names: readonly string[]): GenUICatalog;
  /** A narrower catalog without these components. */
  without(names: readonly string[]): GenUICatalog;
}

const ALL = Object.keys(SPECS) as GenUIType[];

function make(names: readonly GenUIType[]): GenUICatalog {
  const set = new Set<string>(names);
  return Object.freeze({
    version: '1.0' as const,
    names: Object.freeze([...names]),
    // Lookup by own key of a fixed table, so "constructor" or "__proto__" never resolve.
    get: (name: string) => (set.has(name) && Object.hasOwn(SPECS, name) ? SPECS[name as GenUIType] : undefined),
    // Narrowing only: a name outside this catalog stays out.
    only: (keep: readonly string[]) => make(names.filter((n) => keep.includes(n))),
    without: (drop: readonly string[]) => make(names.filter((n) => !drop.includes(n))),
  });
}

/** The whole v1 catalog: Card, DescriptionList, Table, Badge, Alert, StreamingText and Button. */
export const catalog: GenUICatalog = make(ALL);

/** Names the v1 renderer knows: a catalog can only ever narrow this list. */
export const isCatalogType = (name: string): name is GenUIType => Object.hasOwn(SPECS, name);
