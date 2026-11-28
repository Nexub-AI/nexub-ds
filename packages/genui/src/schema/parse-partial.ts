// A tolerant JSON parser for documents that are still streaming (RFC #823). It reads the text
// so far, closes whatever is open, and says what it closed. It never evaluates anything: it
// builds plain data with null prototypes, and keeps every key (validate() refuses the
// forbidden ones), so what streams in is checked exactly like a finished document.
import { DEFAULT_LIMITS, jsonDepthFor, resolveLimits, utf8Length } from './limits.js';
import type { GenUILimits } from './types.js';

export interface ParsePartialResult {
  /** The value so far, or undefined when nothing usable has arrived (or the text is not JSON). */
  document?: unknown;
  /** True when the text is one whole JSON value. */
  complete: boolean;
  /** Set when the text can't become JSON, or is past the limits. */
  error?: 'parse-error' | 'too-large';
  /** Objects and arrays the parser closed because the text ended inside them. */
  partial: ReadonlySet<object>;
  /** The string the text ended inside: where it sits. Its value so far is in the document. */
  openString?: { parent: object; key: string | number };
}

class Stop extends Error {
  constructor(readonly code: 'parse-error' | 'too-large') {
    super(code);
  }
}

const WS = new Set([' ', '\t', '\n', '\r']);
const ESCAPES: Record<string, string> = { '"': '"', '\\': '\\', '/': '/', b: '\b', f: '\f', n: '\n', r: '\r', t: '\t' };
const NUMBER = /-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/y;
/** What a number may look like while it is still arriving: "-", "12", "1.", "1e", "1e+". */
const PARTIAL_NUMBER = /^-?(?:\d+(?:\.\d*)?(?:[eE][+-]?\d*)?)?$/;
const LITERALS = [
  ['true', true],
  ['false', false],
  ['null', null],
] as const;

class Parser {
  i = 0;
  eof = false;
  /** Something was cut off: an open string, container, number or literal. */
  truncated = false;
  depth = 0;
  readonly partial = new Set<object>();
  openString?: { parent: object; key: string | number };

  constructor(
    readonly s: string,
    readonly maxDepth: number,
  ) {}

  /** Skips whitespace; true at the end of the text. */
  ws() {
    while (this.i < this.s.length && WS.has(this.s[this.i]!)) this.i++;
    if (this.i >= this.s.length) this.eof = true;
    return this.eof;
  }

  cut<T>(value: T): T {
    this.i = this.s.length;
    this.eof = true;
    this.truncated = true;
    return value;
  }

  /** A string's contents after its opening quote; at the end of the text, what arrived so far. */
  string(): string {
    const s = this.s;
    let out = '';
    let start = this.i;
    while (this.i < s.length) {
      const c = s.charCodeAt(this.i);
      if (c === 0x22) {
        out += s.slice(start, this.i++);
        return out;
      }
      if (c < 0x20) throw new Stop('parse-error');
      if (c !== 0x5c) {
        this.i++;
        continue;
      }
      out += s.slice(start, this.i);
      const e = s[this.i + 1];
      if (e === undefined) return this.cut(out); // ends on a backslash: drop it
      if (e === 'u') {
        const hex = s.slice(this.i + 2, this.i + 6);
        if (/^[0-9a-fA-F]{4}$/.test(hex)) {
          out += String.fromCharCode(parseInt(hex, 16));
          this.i += 6;
        } else if (this.i + 2 + hex.length === s.length && /^[0-9a-fA-F]*$/.test(hex)) {
          return this.cut(out); // "\u12" at the end: drop the half escape
        } else throw new Stop('parse-error');
      } else {
        const r = ESCAPES[e];
        if (r === undefined) throw new Stop('parse-error');
        out += r;
        this.i += 2;
      }
      start = this.i;
    }
    return this.cut(out + s.slice(start));
  }

  /** A value, or undefined for one cut off before it means anything (a number or literal at the end). */
  value(parent: object | null, key: string | number): unknown {
    const c = this.s[this.i]!;
    if (c === '{') return this.object();
    if (c === '[') return this.array();
    if (c === '"') {
      this.i++;
      const v = this.string();
      if (this.eof && parent) this.openString = { parent, key };
      return v;
    }
    const left = this.s.length - this.i;
    for (const [word, v] of LITERALS) {
      if (this.s.startsWith(word, this.i)) {
        this.i += word.length;
        return v;
      }
      if (left < word.length && word.startsWith(this.s.slice(this.i))) return this.cut(undefined); // "tru"
    }
    // "12" at the end may be the start of "125": not a value yet.
    if (left <= 64 && PARTIAL_NUMBER.test(this.s.slice(this.i))) return this.cut(undefined);
    NUMBER.lastIndex = this.i;
    const m = NUMBER.exec(this.s);
    if (!m) throw new Stop('parse-error');
    this.i += m[0].length;
    if (/[-+.eE\d]/.test(this.s[this.i] ?? '')) throw new Stop('parse-error');
    return Number(m[0]);
  }

  enter() {
    if (++this.depth > this.maxDepth) throw new Stop('too-large');
  }

  object(): Record<string, unknown> {
    this.enter();
    this.i++;
    const obj: Record<string, unknown> = Object.create(null);
    const open = () => {
      this.partial.add(obj);
      this.depth--;
      return this.cut(obj);
    };
    const close = () => {
      this.depth--;
      return obj;
    };
    if (this.ws()) return open();
    if (this.s[this.i] === '}') {
      this.i++;
      return close();
    }
    for (;;) {
      if (this.ws()) return open();
      if (this.s[this.i] !== '"') throw new Stop('parse-error');
      this.i++;
      const key = this.string();
      if (this.eof) return open(); // a key without its value: drop it
      if (this.ws()) return open();
      if (this.s[this.i] !== ':') throw new Stop('parse-error');
      this.i++;
      if (this.ws()) return open();
      const v = this.value(obj, key);
      // An own data property on a null-prototype object: "__proto__" is just a key here.
      if (v !== undefined) obj[key] = v;
      if (this.eof || this.ws()) return open();
      const c = this.s[this.i++];
      if (c === '}') return close();
      if (c !== ',') throw new Stop('parse-error');
    }
  }

  array(): unknown[] {
    this.enter();
    this.i++;
    const arr: unknown[] = [];
    const open = () => {
      this.partial.add(arr);
      this.depth--;
      return this.cut(arr);
    };
    const close = () => {
      this.depth--;
      return arr;
    };
    if (this.ws()) return open();
    if (this.s[this.i] === ']') {
      this.i++;
      return close();
    }
    for (;;) {
      if (this.ws()) return open();
      const v = this.value(arr, arr.length);
      if (v !== undefined) arr.push(v);
      if (this.eof || this.ws()) return open();
      const c = this.s[this.i++];
      if (c === ']') return close();
      if (c !== ',') throw new Stop('parse-error');
    }
  }
}

/**
 * Parses JSON that may be cut off: open strings, arrays and objects are closed, and a number
 * or literal still arriving is left out. Enforces the size and depth limits before and while
 * it reads. Never evaluates anything.
 */
export function parsePartial(text: string, options: { limits?: Partial<GenUILimits> } = {}): ParsePartialResult {
  const limits = options.limits ? resolveLimits(options.limits) : DEFAULT_LIMITS;
  if (typeof text !== 'string') return { complete: false, error: 'parse-error', partial: new Set() };
  if (text.length > limits.maxBytes || utf8Length(text) > limits.maxBytes) return { complete: false, error: 'too-large', partial: new Set() };
  const p = new Parser(text, jsonDepthFor(limits.maxDepth));
  try {
    if (p.ws()) return { complete: false, partial: p.partial };
    const document = p.value(null, '');
    if (!p.eof && !p.ws()) throw new Stop('parse-error'); // something after the value
    return { document, complete: document !== undefined && !p.truncated, partial: p.partial, openString: p.openString };
  } catch (e) {
    if (e instanceof Stop) return { complete: false, error: e.code, partial: new Set() };
    throw e;
  }
}
