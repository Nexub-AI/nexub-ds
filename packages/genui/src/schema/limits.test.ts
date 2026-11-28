import { describe, expect, it } from 'vitest';
import { DEFAULT_LIMITS, resolveLimits, utf8Length } from './limits.js';
import { parsePartial, validate } from './index.js';

const deep = (levels: number): unknown => (levels <= 1 ? { type: 'Badge', props: { text: 'x' } } : { type: 'Card', children: [deep(levels - 1)] });

describe('limits', () => {
  it('a host can lower a limit, never raise it', () => {
    expect(resolveLimits()).toEqual(DEFAULT_LIMITS);
    expect(resolveLimits({ maxNodes: 10, maxDepth: 99, maxBytes: Number.NaN })).toEqual({ ...DEFAULT_LIMITS, maxNodes: 10 });
    expect(resolveLimits({ maxDepth: -1 }).maxDepth).toBe(16);
  });

  it('counts UTF-8 bytes like TextEncoder', () => {
    for (const s of ['abc', 'é', '€', '😀', '\ud800', 'a\udc00b']) expect(utf8Length(s), s).toBe(new TextEncoder().encode(s).length);
  });

  it('rejects documents nested past the depth limit, whatever onInvalid says', () => {
    expect(validate({ version: '1.0', root: deep(16) }).ok).toBe(true);
    const r = validate({ version: '1.0', root: deep(17) });
    expect(r.ok).toBe(false);
    expect(r.issues[0]?.code).toBe('too-large');
    expect(validate({ version: '1.0', root: deep(5) }, { limits: { maxDepth: 4 } }).issues[0]?.code).toBe('too-large');
  });

  it('rejects documents with too many nodes', () => {
    const children = Array.from({ length: 500 }, () => 'x');
    expect(validate({ version: '1.0', root: { type: 'Card', children } }).issues[0]?.code).toBe('too-large');
    expect(validate({ version: '1.0', root: { type: 'Card', children: children.slice(0, 499) } }).ok).toBe(true);
    expect(validate({ version: '1.0', root: { type: 'Card', children: ['a', 'b'] } }, { limits: { maxNodes: 2 } }).ok).toBe(false);
  });

  it('rejects documents over the size limit, as text or as objects', () => {
    const big = { version: '1.0', root: { type: 'Card', children: Array.from({ length: 200 }, () => 'x'.repeat(1500)) } };
    expect(validate(big).issues[0]?.code).toBe('too-large');
    expect(validate(JSON.stringify(big)).issues[0]?.code).toBe('too-large');
    expect(parsePartial(JSON.stringify(big)).error).toBe('too-large');
    expect(validate({ version: '1.0', root: { type: 'Badge', props: { text: 'x' } } }, { limits: { maxBytes: 20 } }).issues[0]?.code).toBe('too-large');
  });

  it('rejects JSON nested past the limit inside props, before walking it', () => {
    let payload: unknown = 1;
    for (let i = 0; i < 100; i++) payload = [payload];
    const r = validate({ version: '1.0', root: { type: 'Button', props: { label: 'x', action: { name: 'a', payload } } } });
    expect(r.issues[0]?.code).toBe('too-large');
    expect(parsePartial(JSON.stringify({ a: payload })).error).toBe('too-large');
  });
});
