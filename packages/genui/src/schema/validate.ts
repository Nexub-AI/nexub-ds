// validate(): the one gate between model output and the renderer (RFC #823). Pure: no DOM, no
// React, no network, so a server runs the same check before it stores or forwards a document.
import { ACTION_NAME, KEY, MAX_PAYLOAD_BYTES, MAX_TEXT, catalog as fullCatalog, isCatalogType, type GenUICatalog, type GenUIPropSpec } from './catalog.js';
import { FORBIDDEN_KEYS, jsonDepthFor, resolveLimits, utf8Length } from './limits.js';
import { parsePartial, type ParsePartialResult } from './parse-partial.js';
import type { GenUIChild, GenUIDocument, GenUIIssue, GenUIIssueCode, GenUILimits, GenUINode, GenUIOnInvalid, GenUIPendingNode } from './types.js';

export interface ValidateOptions {
  /** `drop` (default): remove what is invalid and keep the rest. `reject`: any issue rejects the document. */
  onInvalid?: GenUIOnInvalid;
  /** Lower the limits (depth 16, 500 nodes, 256 kB). Values above the defaults are ignored. */
  limits?: Partial<GenUILimits>;
  /** Narrow the allow-list (`catalog.only([...])`). It can't add components or props. */
  catalog?: GenUICatalog;
  /**
   * The action names the host accepts. When given, a Button whose action isn't listed is
   * removed (`unknown-action`). Leave it out on a server that doesn't know the host's actions.
   */
  actions?: readonly string[];
  /**
   * While a document streams: the `parsePartial()` result the document came from. Nodes still
   * arriving come back as `{ type: null, pending: true }`, and props still arriving are left
   * out instead of reported.
   */
  partial?: ParsePartialResult;
}

export interface ValidateResult {
  /** True when there is something to render: always false after a rejection. */
  ok: boolean;
  /** The cleaned document: only catalog components and props, every value checked. */
  document?: GenUIDocument;
  issues: GenUIIssue[];
}

/** Rejects the whole document, whatever `onInvalid` says (limits, non-JSON, forbidden keys, versions). */
class Reject extends Error {
  constructor(readonly issue: GenUIIssue) {
    super(issue.message);
  }
}

type Obj = Record<string, unknown>;

const pointer = (path: string, key: string | number) => `${path}/${String(key).replace(/~/g, '~0').replace(/\//g, '~1')}`;
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);
const show = (v: unknown) => JSON.stringify(String(v).slice(0, 40));

/**
 * A copy of `value` made only of JSON (null-prototype objects), or a rejection: non-JSON values,
 * cycles, the forbidden keys and nesting past the limit never get further than this.
 */
function toJson(value: unknown, path: string, depth: number, maxDepth: number, stack: Set<object>): unknown {
  switch (typeof value) {
    case 'string':
    case 'boolean':
      return value;
    case 'number':
      if (Number.isFinite(value)) return value;
      throw new Reject({ path, code: 'parse-error', message: `Not JSON: ${value} is not a finite number.` });
    case 'object':
      break;
    default:
      throw new Reject({ path, code: 'parse-error', message: `Not JSON: a ${typeof value} can't appear in a document.` });
  }
  if (value === null) return null;
  if (depth > maxDepth) throw new Reject({ path, code: 'too-large', message: `Nested deeper than the limit allows.` });
  if (stack.has(value)) throw new Reject({ path, code: 'parse-error', message: 'Not JSON: the value contains itself.' });
  stack.add(value);
  let out: unknown;
  if (Array.isArray(value)) {
    out = value.map((v, i) => toJson(v, pointer(path, i), depth + 1, maxDepth, stack));
  } else {
    const proto = Object.getPrototypeOf(value);
    if (proto !== Object.prototype && proto !== null) {
      throw new Reject({ path, code: 'parse-error', message: 'Not JSON: only plain objects can appear in a document.' });
    }
    const copy: Obj = Object.create(null);
    for (const key of Object.keys(value)) {
      if (FORBIDDEN_KEYS.has(key)) throw new Reject({ path: pointer(path, key), code: 'forbidden-key', message: `The key "${key}" is not allowed anywhere in a document.` });
      const v = (value as Obj)[key];
      if (v === undefined) continue; // as JSON.stringify does
      copy[key] = toJson(v, pointer(path, key), depth + 1, maxDepth, stack);
    }
    out = copy;
  }
  stack.delete(value);
  return out;
}

const NODE_KEYS = new Set(['type', 'key', 'props', 'children']);
const DOC_KEYS = new Set(['$schema', 'version', 'title', 'root']);

class Checker {
  readonly issues: GenUIIssue[] = [];
  nodes = 0;
  constructor(
    readonly limits: GenUILimits,
    readonly catalog: GenUICatalog,
    readonly actions: readonly string[] | undefined,
    readonly partial: ParsePartialResult | undefined,
    readonly reject: boolean,
  ) {}

  issue(path: string, code: GenUIIssueCode, message: string) {
    const issue = { path, code, message };
    // In reject mode the first issue ends it: no need to read the rest of a hostile document.
    if (this.reject) throw new Reject(issue);
    this.issues.push(issue);
  }

  /** The object was closed by parsePartial: more of it is still arriving. */
  open(v: unknown) {
    return this.partial !== undefined && typeof v === 'object' && v !== null && this.partial.partial.has(v);
  }

  openString(parent: unknown, key: string | number) {
    const o = this.partial?.openString;
    return o !== undefined && o.parent === parent && o.key === key;
  }

  count(path: string) {
    if (++this.nodes > this.limits.maxNodes) {
      throw new Reject({ path, code: 'too-large', message: `More than ${this.limits.maxNodes} nodes.` });
    }
  }

  text(v: unknown, max = MAX_TEXT): v is string {
    return typeof v === 'string' && v.length <= max;
  }

  /** A checked value for `spec`, or undefined after reporting why not. */
  prop(spec: GenUIPropSpec, v: unknown, path: string): unknown {
    switch (spec.type) {
      case 'text': {
        const max = spec.maxLength ?? MAX_TEXT;
        if (this.text(v, max)) return v;
        this.issue(path, 'invalid-prop', `Expected text of at most ${max} characters.`);
        return undefined;
      }
      case 'enum':
        if ((typeof v === 'string' || typeof v === 'number') && spec.values.includes(v)) return v;
        this.issue(path, 'invalid-prop', `Expected one of ${spec.values.map((x) => JSON.stringify(x)).join(', ')}; got ${show(v)}.`);
        return undefined;
      case 'boolean':
        if (typeof v === 'boolean') return v;
        this.issue(path, 'invalid-prop', 'Expected true or false.');
        return undefined;
      case 'action':
        return this.action(v, path);
      case 'list':
        return this.list(spec, v, path);
      case 'rows':
        return this.rows(spec, v, path);
    }
  }

  action(v: unknown, path: string) {
    if (!isObj(v) || typeof v.name !== 'string' || !ACTION_NAME.test(v.name)) {
      this.issue(path, 'invalid-prop', 'Expected { "name": "anAction", "payload"?: … } with a name of letters, digits, "_", "." or "-" (up to 64).');
      return undefined;
    }
    for (const key of Object.keys(v)) if (key !== 'name' && key !== 'payload') this.issue(pointer(path, key), 'unknown-prop', `An action has only "name" and "payload".`);
    const out: Obj = { name: v.name };
    if (v.payload !== undefined) {
      if (utf8Length(JSON.stringify(v.payload)) > MAX_PAYLOAD_BYTES) {
        this.issue(pointer(path, 'payload'), 'invalid-prop', `The payload is over ${MAX_PAYLOAD_BYTES} bytes of JSON.`);
        return undefined;
      }
      out.payload = v.payload;
    }
    return out;
  }

  list(spec: Extract<GenUIPropSpec, { type: 'list' }>, v: unknown, path: string) {
    if (!Array.isArray(v) || v.length > spec.maxItems) {
      this.issue(path, 'invalid-prop', `Expected a list of at most ${spec.maxItems} items.`);
      return undefined;
    }
    const out: Obj[] = [];
    v.forEach((item, i) => {
      const at = pointer(path, i);
      if (this.open(item)) return; // still arriving
      if (!isObj(item)) return this.issue(at, 'invalid-prop', 'Expected an object.');
      const clean: Obj = {};
      for (const key of Object.keys(item)) {
        const field = Object.hasOwn(spec.item, key) ? spec.item[key] : undefined;
        if (!field) {
          this.issue(pointer(at, key), 'unknown-prop', `Unknown field "${key}". Fields: ${Object.keys(spec.item).join(', ')}.`);
          continue;
        }
        const checked = this.prop(field, item[key], pointer(at, key));
        if (checked !== undefined) clean[key] = checked;
      }
      for (const [key, field] of Object.entries(spec.item)) {
        if ('required' in field && field.required && clean[key] === undefined) {
          return this.issue(pointer(at, key), 'missing-prop', `"${key}" is required; the item was removed.`);
        }
      }
      out.push(clean);
    });
    return out;
  }

  rows(spec: Extract<GenUIPropSpec, { type: 'rows' }>, v: unknown, path: string) {
    if (!Array.isArray(v) || v.length > spec.maxItems) {
      this.issue(path, 'invalid-prop', `Expected at most ${spec.maxItems} rows.`);
      return undefined;
    }
    const out: unknown[][] = [];
    v.forEach((row, i) => {
      const at = pointer(path, i);
      if (this.open(row)) return; // still arriving
      const cellOk = (c: unknown) => c === null || typeof c === 'boolean' || (typeof c === 'number' && Number.isFinite(c)) || this.text(c);
      if (!Array.isArray(row) || row.length > spec.maxCells || !row.every(cellOk)) {
        return this.issue(at, 'invalid-prop', `Expected a row of at most ${spec.maxCells} cells (text, numbers, booleans or null); the row was removed.`);
      }
      out.push(row);
    });
    return out;
  }

  pending(raw: Obj): GenUIPendingNode {
    return typeof raw.key === 'string' && KEY.test(raw.key) ? { type: null, key: raw.key, pending: true } : { type: null, pending: true };
  }

  node(raw: unknown, path: string, depth: number): GenUINode | GenUIPendingNode | undefined {
    this.count(path);
    if (depth > this.limits.maxDepth) throw new Reject({ path, code: 'too-large', message: `Nodes nested deeper than ${this.limits.maxDepth} levels.` });
    if (!isObj(raw)) {
      this.issue(path, 'invalid-node', 'Expected a node: { "type": …, "props": { … } }.');
      return undefined;
    }
    const arriving = this.open(raw);
    const type = raw.type;
    if (typeof type !== 'string' || this.openString(raw, 'type')) {
      if (arriving) return this.pending(raw);
      this.issue(pointer(path, 'type'), 'invalid-node', 'A node needs a "type": a catalog component name.');
      return undefined;
    }
    for (const key of Object.keys(raw)) {
      if (!NODE_KEYS.has(key)) this.issue(pointer(path, key), 'unknown-prop', `A node has only "type", "key", "props" and "children"; "${key}" was removed.`);
    }
    // Allowed only when the host's catalog lists it AND the renderer knows it: a catalog only narrows.
    if (!this.catalog.names.includes(type as never) || !isCatalogType(type)) {
      this.issue(pointer(path, 'type'), 'unknown-component', `${show(type)} is not in the catalog. Components: ${this.catalog.names.join(', ')}.`);
      return undefined;
    }
    const spec = fullCatalog.get(type)!;
    const node: Obj = { type };
    if (raw.key !== undefined && !this.openString(raw, 'key')) {
      if (typeof raw.key === 'string' && KEY.test(raw.key)) node.key = raw.key;
      else this.issue(pointer(path, 'key'), 'invalid-prop', 'A key is 1 to 64 letters, digits, "_" or "-".');
    }

    const rawProps = raw.props ?? {};
    const propsArriving = arriving && (raw.props === undefined || this.open(raw.props));
    const props: Obj = {};
    if (!isObj(rawProps)) {
      this.issue(pointer(path, 'props'), 'invalid-node', '"props" must be an object.');
    } else {
      for (const key of Object.keys(rawProps)) {
        const at = pointer(pointer(path, 'props'), key);
        const p = Object.hasOwn(spec.props, key) ? spec.props[key] : undefined;
        if (!p) {
          this.issue(at, 'unknown-prop', `${type} has no prop "${key}". Props: ${Object.keys(spec.props).join(', ')}.`);
          continue;
        }
        const v = rawProps[key];
        if (this.partial) {
          // Still arriving: text may show while it grows; anything else waits until it's whole.
          if (this.openString(rawProps, key) && p.type !== 'text') continue;
          if (this.open(v) && p.type !== 'list' && p.type !== 'rows') continue;
        }
        const checked = this.prop(p, v, at);
        if (checked !== undefined) props[key] = checked;
      }
    }
    for (const [key, p] of Object.entries(spec.props)) {
      const required = 'required' in p && p.required;
      const empty = props[key] === undefined || (p.type === 'list' && (props[key] as unknown[]).length === 0);
      if (required && empty) {
        if (propsArriving) return this.pending(raw);
        this.issue(pointer(pointer(path, 'props'), key), 'missing-prop', `${type} needs "${key}"; the node was removed.`);
        return undefined;
      }
    }
    if (type === 'Button' && this.actions) {
      const name = (props.action as { name: string }).name;
      if (!this.actions.includes(name)) {
        this.issue(pointer(pointer(path, 'props'), 'action'), 'unknown-action', `The host doesn't accept the action ${show(name)}; the button was removed.${this.actions.length ? ` Actions: ${this.actions.join(', ')}.` : ''}`);
        return undefined;
      }
    }
    node.props = props;

    if (raw.children !== undefined) {
      const at = pointer(path, 'children');
      if (!spec.container) this.issue(at, 'unexpected-children', `${type} takes no children; they were removed.`);
      else if (!Array.isArray(raw.children)) this.issue(at, 'invalid-node', '"children" must be a list of nodes and text.');
      else {
        const children: GenUIChild[] = [];
        raw.children.forEach((child, i) => {
          const ci = pointer(at, i);
          if (typeof child === 'string') {
            this.count(ci);
            if (this.text(child)) children.push(child);
            else this.issue(ci, 'invalid-prop', `Text children are at most ${MAX_TEXT} characters.`);
            return;
          }
          const n = this.node(child, ci, depth + 1);
          if (n) children.push(n);
        });
        node.children = children;
      }
    }
    return node as GenUINode;
  }
}

/**
 * Checks a document (an object, or its JSON text) against the catalog, the prop types and the
 * limits. Returns the cleaned document and every issue with a JSON Pointer path.
 */
export function validate(doc: unknown, options: ValidateOptions = {}): ValidateResult {
  const limits = resolveLimits(options.limits);
  const reject = options.onInvalid === 'reject';
  try {
    let input = doc;
    if (typeof doc === 'string') {
      const parsed = parsePartial(doc, { limits });
      if (parsed.error === 'too-large') throw new Reject({ path: '', code: 'too-large', message: `The document is over ${limits.maxBytes} bytes, or nested too deep.` });
      if (parsed.error || !parsed.complete) throw new Reject({ path: '', code: 'parse-error', message: parsed.error ? 'Not valid JSON.' : 'The JSON is incomplete.' });
      input = parsed.document;
    }
    const json = toJson(input, '', 0, jsonDepthFor(limits.maxDepth), new Set());
    if (utf8Length(JSON.stringify(json)) > limits.maxBytes) throw new Reject({ path: '', code: 'too-large', message: `The document is over ${limits.maxBytes} bytes of JSON.` });
    if (!isObj(json)) throw new Reject({ path: '', code: 'parse-error', message: 'A document is a JSON object with "version" and "root".' });

    const partial = options.partial && options.partial.document === doc ? options.partial : undefined;
    const version = json.version;
    if (partial && partial.partial.has(doc as object) && (version === undefined || (partial.openString?.parent === doc && partial.openString?.key === 'version'))) {
      // Streaming, and the version hasn't arrived yet: nothing to check or show but a placeholder.
      return { ok: true, document: { version: '1.0', root: { type: null, pending: true } }, issues: [] };
    }
    const major = typeof version === 'string' ? /^(\d{1,4})\.(\d{1,4})$/.exec(version)?.[1] : undefined;
    if (major !== '1') {
      throw new Reject({ path: '/version', code: 'unsupported-version', message: `Unsupported version ${show(version)}: this renderer reads "1.x" (write "1.0").` });
    }

    const c = new Checker(limits, options.catalog ?? fullCatalog, options.actions, partial, reject);
    const out: Obj = { version };
    for (const key of Object.keys(json)) {
      if (!DOC_KEYS.has(key)) c.issue(pointer('', key), 'unknown-prop', `A document has only "$schema", "version", "title" and "root"; "${key}" was removed.`);
    }
    for (const key of ['$schema', 'title'] as const) {
      if (json[key] === undefined) continue;
      if (c.text(json[key])) out[key] = json[key];
      else c.issue(pointer('', key), 'invalid-prop', `Expected text of at most ${MAX_TEXT} characters.`);
    }
    // The raw (uncopied) root keeps the identity parsePartial's sets refer to; it is plain JSON too.
    const rawRoot = partial ? (input as Obj).root : json.root;
    if (rawRoot === undefined && partial && c.open(input)) {
      return { ok: true, document: { ...out, root: { type: null, pending: true } } as GenUIDocument, issues: c.issues };
    }
    const root = c.node(rawRoot, '/root', 1);
    if (!root) return { ok: false, issues: c.issues.length ? c.issues : [{ path: '/root', code: 'invalid-node', message: 'Nothing to render.' }] };
    out.root = root;
    return { ok: true, document: out as unknown as GenUIDocument, issues: c.issues };
  } catch (e) {
    if (e instanceof Reject) return { ok: false, issues: [e.issue] };
    throw e;
  }
}
