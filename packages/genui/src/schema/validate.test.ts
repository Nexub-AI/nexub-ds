import { describe, expect, it } from 'vitest';
import { catalog, validate, type GenUIIssue } from './index.js';

const doc = (root: unknown, extra: Record<string, unknown> = {}) => ({ version: '1.0', root, ...extra });
const codes = (issues: GenUIIssue[]) => issues.map((i) => `${i.code} ${i.path}`);

const card = {
  type: 'Card',
  key: 'plan',
  props: { title: 'Team', description: '€8 per seat', tone: 'info', variant: 'surface' },
  children: [
    'Billed monthly',
    { type: 'Badge', props: { text: 'Recommended', tone: 'success', variant: 'soft', size: 'sm' } },
    { type: 'Alert', props: { title: 'Note', text: 'Prices exclude VAT', tone: 'warning' } },
    { type: 'StreamingText', props: { text: 'Here is the breakdown.' } },
    { type: 'DescriptionList', props: { items: [{ label: 'Seats', value: '12' }, { label: 'Total', value: '€96', emphasis: true }], layout: 'stacked', columns: 2, divided: true, size: 'sm' } },
    { type: 'Table', props: { caption: 'Invoices', columns: [{ label: 'No.' }, { label: 'Amount', align: 'end' }], rows: [['INV-1', 12.5], ['INV-2', null], [true, 'x']], density: 'compact', striped: true } },
    { type: 'Button', key: 'choose', props: { label: 'Choose Team', variant: 'tonal', tone: 'neutral', size: 'sm', action: { name: 'choosePlan', payload: { plan: 'team' } } } },
  ],
};

describe('validate', () => {
  it('accepts every catalog component with every prop', () => {
    const r = validate(doc(card, { title: 'Plans', $schema: 'https://unpkg.com/@nexub/genui/dist/schema/v1.json' }), { actions: ['choosePlan'] });
    expect(r.issues).toEqual([]);
    expect(r.ok).toBe(true);
    expect(r.document).toEqual(doc(card, { title: 'Plans', $schema: 'https://unpkg.com/@nexub/genui/dist/schema/v1.json' }));
  });

  it('every catalog example is valid', () => {
    for (const name of catalog.names) {
      const r = validate(doc(catalog.get(name)!.example), { onInvalid: 'reject' });
      expect(r.ok, name).toBe(true);
    }
  });

  it('accepts JSON text and returns plain data', () => {
    const r = validate(JSON.stringify(doc({ type: 'Badge', props: { text: 'Paid' } })));
    expect(r.ok).toBe(true);
    expect(r.document?.root).toEqual({ type: 'Badge', props: { text: 'Paid' } });
  });

  it('drops unknown components with their children, and reports a pointer to each', () => {
    const r = validate(doc({ type: 'Card', children: [{ type: 'script', children: ['x'] }, { type: 'Badge', props: { text: 'ok' } }] }));
    expect(r.ok).toBe(true);
    expect(codes(r.issues)).toEqual(['unknown-component /root/children/0/type']);
    expect(r.document?.root).toEqual({ type: 'Card', props: {}, children: [{ type: 'Badge', props: { text: 'ok' } }] });
  });

  it('drops unknown and invalid props; the component default applies', () => {
    const r = validate(doc({ type: 'Badge', props: { text: 'x', tone: 'purple', className: 'evil', style: { color: 'red' }, onClick: 'alert(1)' } }));
    expect(codes(r.issues)).toEqual([
      'invalid-prop /root/props/tone',
      'unknown-prop /root/props/className',
      'unknown-prop /root/props/style',
      'unknown-prop /root/props/onClick',
    ]);
    expect(r.document?.root).toEqual({ type: 'Badge', props: { text: 'x' } });
  });

  it('removes a node whose required prop is missing or invalid', () => {
    const r = validate(doc({ type: 'Card', children: [{ type: 'Badge', props: {} }, { type: 'Button', props: { label: 'Go' } }, { type: 'Table', props: { columns: [], rows: [] } }] }));
    expect(codes(r.issues)).toEqual(['missing-prop /root/children/0/props/text', 'missing-prop /root/children/1/props/label'.replace('label', 'action'), 'missing-prop /root/children/2/props/columns']);
    expect(r.document?.root).toMatchObject({ children: [] });
  });

  it('removes children of non-containers and unknown node keys', () => {
    const r = validate(doc({ type: 'Badge', props: { text: 'x' }, children: ['y'], dangerouslySetInnerHTML: { __html: '<b>' } }));
    expect(codes(r.issues)).toEqual(['unknown-prop /root/dangerouslySetInnerHTML', 'unexpected-children /root/children']);
    expect(r.document?.root).toEqual({ type: 'Badge', props: { text: 'x' } });
  });

  it('removes a Button whose action the host does not accept', () => {
    const button = { type: 'Button', props: { label: 'Refund', action: { name: 'refund' } } };
    expect(validate(doc(button)).ok).toBe(true); // a server without the host's list
    const r = validate(doc(button), { actions: ['choosePlan'] });
    expect(r.ok).toBe(false);
    expect(codes(r.issues)).toEqual(['unknown-action /root/props/action']);
  });

  it('checks action names and payload size', () => {
    const bad = (action: unknown) => validate(doc({ type: 'Button', props: { label: 'x', action } }));
    expect(bad({ name: 'javascript:alert(1)' }).ok).toBe(false);
    expect(bad('approve').ok).toBe(false);
    expect(bad({ name: 'ok', payload: 'x'.repeat(5000) }).issues[0]?.code).toBe('invalid-prop');
    const extra = bad({ name: 'ok', run: 'eval' });
    expect(extra.ok).toBe(true);
    expect(codes(extra.issues)).toEqual(['unknown-prop /root/props/action/run']);
  });

  it('drops invalid list items and rows, keeping the rest', () => {
    const r = validate(
      doc({
        type: 'Card',
        children: [
          { type: 'DescriptionList', props: { items: [{ label: 'a', value: 'b', html: '<b>' }, { label: 'c' }, 'nope'] } },
          { type: 'Table', props: { columns: [{ label: 'A' }, { align: 'end' }], rows: [['ok'], [{ $: 1 }], 'row', [Number.MAX_VALUE]] } },
        ],
      }),
    );
    expect(codes(r.issues)).toEqual([
      'unknown-prop /root/children/0/props/items/0/html',
      'missing-prop /root/children/0/props/items/1/value',
      'invalid-prop /root/children/0/props/items/2',
      'missing-prop /root/children/1/props/columns/1/label',
      'invalid-prop /root/children/1/props/rows/1',
      'invalid-prop /root/children/1/props/rows/2',
    ]);
    expect(r.document?.root).toMatchObject({
      children: [{ props: { items: [{ label: 'a', value: 'b' }] } }, { props: { columns: [{ label: 'A' }], rows: [['ok'], [Number.MAX_VALUE]] } }],
    });
  });

  it('rejects the whole document in reject mode', () => {
    const r = validate(doc({ type: 'Badge', props: { text: 'x', size: 'xxl' } }), { onInvalid: 'reject' });
    expect(r).toEqual({ ok: false, issues: [{ path: '/root/props/size', code: 'invalid-prop', message: expect.any(String) }] });
  });

  it('rejects unsupported versions, non-objects, bad JSON and incomplete JSON', () => {
    expect(codes(validate({ version: '2.0', root: {} }).issues)).toEqual(['unsupported-version /version']);
    expect(codes(validate({ root: {} }).issues)).toEqual(['unsupported-version /version']);
    expect(validate({ version: '1.7', root: { type: 'Badge', props: { text: 'x' } } }).ok).toBe(true); // a later minor reads
    expect(codes(validate([1]).issues)).toEqual(['parse-error ']);
    expect(codes(validate('{"version":').issues)).toEqual(['parse-error ']);
    expect(codes(validate('{nope}').issues)).toEqual(['parse-error ']);
    expect(codes(validate(null).issues)).toEqual(['parse-error ']);
  });

  it('rejects a document whose root is dropped', () => {
    expect(validate(doc({ type: 'Iframe' })).ok).toBe(false);
    expect(codes(validate(doc('text')).issues)).toEqual(['invalid-node /root']);
  });

  it('validates document fields', () => {
    const r = validate(doc({ type: 'Badge', props: { text: 'x' } }, { title: 7, extra: true }));
    expect(codes(r.issues)).toEqual(['unknown-prop /extra', 'invalid-prop /title']);
    expect(r.document).toEqual(doc({ type: 'Badge', props: { text: 'x' } }));
  });

  it('checks node keys and node shapes', () => {
    const r = validate(doc({ type: 'Card', key: 'bad key!', props: 'x', children: [42, { props: {} }] }));
    expect(codes(r.issues)).toEqual(['invalid-prop /root/key', 'invalid-node /root/props', 'invalid-node /root/children/0', 'invalid-node /root/children/1/type']);
    expect(codes(validate(doc({ type: 'Card', children: 'x' })).issues)).toEqual(['invalid-node /root/children']);
    expect(codes(validate(doc({ type: 'Card', children: ['x'.repeat(2001)] })).issues)).toEqual(['invalid-prop /root/children/0']);
  });

  it('narrows to the host catalog', () => {
    const only = catalog.only(['Card', 'Text', 'Badge']);
    expect(only.names).toEqual(['Card', 'Badge']);
    const r = validate(doc({ type: 'Card', children: [{ type: 'Alert', props: { text: 'x' } }, { type: 'Badge', props: { text: 'y' } }] }), { catalog: only });
    expect(codes(r.issues)).toEqual(['unknown-component /root/children/0/type']);
    expect(catalog.without(['Button']).names).not.toContain('Button');
    expect(catalog.without(['Button']).only(['Button']).names).toEqual([]);
    expect(catalog.get('constructor')).toBeUndefined();
    expect(catalog.get('toString')).toBeUndefined();
  });

  it('escapes JSON Pointer paths', () => {
    const r = validate(doc({ type: 'Badge', props: { text: 'x', 'a/b~c': 1 } }));
    expect(r.issues[0]?.path).toBe('/root/props/a~1b~0c');
  });
});
