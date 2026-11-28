import { describe, expect, it } from 'vitest';
import { parsePartial, validate } from './index.js';

const plain = (v: unknown) => JSON.parse(JSON.stringify(v));

describe('parsePartial', () => {
  it('parses whole JSON like JSON.parse, with null prototypes', () => {
    const text = '{"a":[1,-2.5e3,true,false,null,"x\\n\\u00e9\\"\\\\\\/"],"b":{},"c":[]}';
    const r = parsePartial(text);
    expect(r.complete).toBe(true);
    expect(plain(r.document)).toEqual(JSON.parse(text));
    expect(Object.getPrototypeOf(r.document)).toBe(null);
    expect(parsePartial('  "s"  ').document).toBe('s');
    expect(parsePartial('7 ').document).toBe(7);
  });

  it('closes open strings, arrays and objects and says what it closed', () => {
    const r = parsePartial('{"root":{"type":"StreamingText","props":{"text":"Hel');
    expect(r.complete).toBe(false);
    expect(plain(r.document)).toEqual({ root: { type: 'StreamingText', props: { text: 'Hel' } } });
    const doc = r.document as { root: { props: object } };
    expect(r.partial.has(doc)).toBe(true);
    expect(r.partial.has(doc.root.props)).toBe(true);
    expect(r.openString).toEqual({ parent: doc.root.props, key: 'text' });
  });

  it('leaves out what may still change: numbers, literals, keys, half escapes', () => {
    expect(plain(parsePartial('{"a":12').document)).toEqual({});
    expect(plain(parsePartial('{"a":1.').document)).toEqual({});
    expect(plain(parsePartial('{"a":1e').document)).toEqual({});
    expect(plain(parsePartial('{"a":-').document)).toEqual({});
    expect(plain(parsePartial('{"a":tr').document)).toEqual({});
    expect(plain(parsePartial('{"a":nul').document)).toEqual({});
    expect(plain(parsePartial('{"a":12,').document)).toEqual({ a: 12 });
    expect(plain(parsePartial('{"ke').document)).toEqual({});
    expect(plain(parsePartial('{"key"').document)).toEqual({});
    expect(plain(parsePartial('{"key":').document)).toEqual({});
    expect(plain(parsePartial('{"a":"x\\').document)).toEqual({ a: 'x' });
    expect(plain(parsePartial('{"a":"x\\u00').document)).toEqual({ a: 'x' });
    expect(plain(parsePartial('[1,[2,').document)).toEqual([1, [2]]);
    expect(plain(parsePartial('[true').document)).toEqual([true]);
    expect(parsePartial('').document).toBeUndefined();
    expect(parsePartial('   ').complete).toBe(false);
    expect(parsePartial('"abc').complete).toBe(false);
  });

  it('refuses text that can never be JSON', () => {
    for (const bad of ['{a:1}', '{"a" 1}', '[1 2]', '{"a":1}x', "{'a':1}", '{"a":01}', '[1.]', '{"a":"\\x"}', '{"a":"\u0001"}', '{"a":"\\u12zz"}', 'undefined', '{"a":1,}', '[,1]', '{"a":1 "b":2}', '[1}']) {
      expect(parsePartial(bad).error, bad).toBe('parse-error');
    }
    expect(parsePartial(42 as unknown as string).error).toBe('parse-error');
  });

  it('keeps forbidden keys as plain data so validate() refuses them', () => {
    const r = parsePartial('{"__proto__":{"polluted":true},"constructor":1}');
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
    expect(Object.keys(r.document as object)).toEqual(['__proto__', 'constructor']);
    expect(validate('{"version":"1.0","root":{"type":"Badge","props":{"text":"x","__proto__":{"a":1}}}}').issues[0]?.code).toBe('forbidden-key');
  });

  it('streams a document node by node: pending nodes, growing text, no early buttons', () => {
    const full = JSON.stringify({
      version: '1.0',
      root: {
        type: 'Card',
        props: { title: 'Plans' },
        children: [
          { type: 'StreamingText', props: { text: 'Two plans fit.' } },
          { type: 'Badge', props: { text: 'New', tone: 'success' } },
          { type: 'Table', props: { columns: [{ label: 'Plan' }], rows: [['Team'], ['Business']] } },
          { type: 'Button', key: 'go', props: { label: 'Choose', action: { name: 'choose', payload: { plan: 'team' } } } },
        ],
      },
    });
    let sawPendingButton = false;
    for (let i = 1; i <= full.length; i++) {
      const text = full.slice(0, i);
      const parsed = parsePartial(text);
      expect(parsed.error, text).toBeUndefined();
      const r = parsed.complete ? validate(parsed.document) : parsed.document === undefined ? null : validate(parsed.document, { partial: parsed, actions: ['choose'] });
      if (!r) continue;
      expect(r.ok, text).toBe(true);
      expect(r.issues, text).toEqual([]);
      const root = r.document!.root;
      if (root.type !== 'Card') continue;
      const button = root.children?.[3];
      if (button && typeof button === 'object' && button.type === null) sawPendingButton = true;
      if (button && typeof button === 'object' && button.type === 'Button') {
        // A button only ever appears with its whole action.
        expect(button.props.action).toEqual({ name: 'choose', payload: { plan: 'team' } });
      }
      const text0 = root.children?.[0];
      if (text0 && typeof text0 === 'object' && text0.type === 'StreamingText') expect('Two plans fit.'.startsWith(text0.props.text)).toBe(true);
    }
    expect(sawPendingButton).toBe(true);
  });

  it('while streaming, holds back enum values still arriving and shows partial tables row by row', () => {
    const p1 = parsePartial('{"version":"1.0","root":{"type":"Badge","props":{"text":"Hi","tone":"succ');
    expect(validate(p1.document, { partial: p1 }).document?.root).toEqual({ type: 'Badge', props: { text: 'Hi' } });
    const p2 = parsePartial('{"version":"1.0","root":{"type":"Table","props":{"columns":[{"label":"A"}],"rows":[["1"],["2');
    expect(validate(p2.document, { partial: p2 }).document?.root).toEqual({ type: 'Table', props: { columns: [{ label: 'A' }], rows: [['1']] } });
    const p3 = parsePartial('{"version":"1.0","root":{"type":"Car');
    expect(validate(p3.document, { partial: p3 }).document?.root).toEqual({ type: null, pending: true });
    const p4 = parsePartial('{"root":{"type":"Card"');
    expect(validate(p4.document, { partial: p4 }).document?.root).toEqual({ type: null, pending: true });
    const p5 = parsePartial('{"version":"1.0"');
    expect(validate(p5.document, { partial: p5 }).document?.root).toEqual({ type: null, pending: true });
    const p6 = parsePartial('{"version":"1.0","root":{"type":"Card","key":"a","children":[{"type":"Badge","key":"b"');
    expect(validate(p6.document, { partial: p6 }).document?.root).toEqual({ type: 'Card', key: 'a', props: {}, children: [{ type: null, key: 'b', pending: true }] });
  });
});
