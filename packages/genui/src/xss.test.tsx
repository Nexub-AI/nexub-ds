// The XSS corpus (RFC #823, security section; a required check from the first PR): hostile
// documents that must all be rejected, or rendered as inert text. It runs in this package's
// `test` task, which the required "Build, typecheck & lint" CI job runs (`pnpm turbo test`).
// The corpus itself is the 9.6 one from @nexub/react (packages/react/src/utils/xss-corpus.ts).
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { XSS_TEXT, XSS_URLS, auditDom } from 'xss-corpus';
import { GenUI, catalog, parsePartial, validate, type GenUIDocument } from './index.js';
import type { GenUIPropSpec } from './schema/catalog.js';

afterEach(cleanup);

const HOSTILE_STRINGS = [...XSS_TEXT, ...XSS_URLS];
const doc = (root: unknown, extra: Record<string, unknown> = {}) => ({ version: '1.0', root, ...extra });
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));
const describeDoc = (d: unknown) => {
  try {
    return String(JSON.stringify(d)).slice(0, 200);
  } catch {
    return 'a document that is not JSON';
  }
};

/** Renders a document the way a host would, with every action accepted, and audits the DOM. */
function renderAudit(document: unknown, extra: Partial<React.ComponentProps<typeof GenUI>> = {}) {
  const onAction = vi.fn();
  const { container } = render(<GenUI document={document} actions={['choosePlan', 'approveRefund', 'go']} onAction={onAction} {...extra} />);
  expect(auditDom(container), describeDoc(document)).toEqual([]);
  // Nothing the corpus could create, whatever the audit's rules.
  expect(container.querySelector('script, iframe, object, embed, base, style, link, meta, form, img, a, input, textarea, svg:not(.lucide), svg *:not(path)')).toBeNull();
  return { container, onAction };
}

/** Every place a string from the document is rendered: text props, list item fields, cells, children. */
function textSlots(): { name: string; build: (s: string) => unknown }[] {
  const slots: { name: string; build: (s: string) => unknown }[] = [];
  for (const type of catalog.names) {
    const spec = catalog.get(type)!;
    const base = spec.example as { props: Record<string, unknown> };
    for (const [prop, p] of Object.entries(spec.props) as [string, GenUIPropSpec][]) {
      if (p.type === 'text') {
        slots.push({ name: `${type}.${prop}`, build: (s) => ({ ...clone(base), props: { ...clone(base.props), [prop]: s.slice(0, p.maxLength ?? 2000) } }) });
      }
      if (p.type === 'list') {
        for (const [field, f] of Object.entries(p.item)) {
          if (f.type !== 'text') continue;
          slots.push({
            name: `${type}.${prop}[].${field}`,
            build: (s) => {
              const n = clone(base);
              const items = n.props[prop] as Record<string, unknown>[];
              items[0] = { ...items[0], [field]: s };
              return n;
            },
          });
        }
      }
      if (p.type === 'rows') {
        slots.push({ name: `${type}.${prop}[][]`, build: (s) => ({ ...clone(base), props: { ...clone(base.props), [prop]: [[s, s]] } }) });
      }
      if (p.type === 'action') {
        slots.push({
          name: `${type}.${prop}.payload`,
          build: (s) => ({ ...clone(base), props: { ...clone(base.props), [prop]: { name: 'approveRefund', payload: { html: s, nested: [s] } } } }),
        });
      }
    }
    if (spec.container) slots.push({ name: `${type}.children[]`, build: (s) => ({ ...clone(base), children: [s] }) });
  }
  slots.push({ name: 'document.title', build: (s) => ({ type: 'Badge', props: { text: 'x' }, $title: s }) });
  return slots;
}

describe('XSS corpus: strings render as inert text', () => {
  const slots = textSlots();

  it('covers every text prop, list field, cell, payload and text child in the catalog', () => {
    expect(slots.map((s) => s.name)).toEqual(
      expect.arrayContaining([
        'Card.title',
        'Card.description',
        'Card.children[]',
        'DescriptionList.items[].label',
        'DescriptionList.items[].value',
        'Table.columns[].label',
        'Table.rows[][]',
        'Table.caption',
        'Badge.text',
        'Alert.title',
        'Alert.text',
        'StreamingText.text',
        'Button.label',
        'Button.action.payload',
      ]),
    );
  });

  for (const slot of slots) {
    it(`${slot.name}: every corpus value is text, never markup`, () => {
      for (const s of HOSTILE_STRINGS) {
        const node = slot.build(s) as Record<string, unknown>;
        const title = node.$title as string | undefined;
        delete node.$title;
        const document = doc(node, title ? { title } : {});
        const r = validate(document, { actions: ['approveRefund', 'go', 'choosePlan'] });
        expect(r.ok, `${slot.name} ${s}`).toBe(true);
        const { container, onAction } = renderAudit(document);
        if (slot.name.endsWith('.payload')) {
          container.querySelector('button')!.click();
          // The payload reaches the host as data, exactly as sent: never parsed, never run.
          expect(onAction).toHaveBeenCalledWith(expect.objectContaining({ payload: { html: s, nested: [s] } }));
        } else if (title) {
          expect(container.querySelector('[role=region]')!.getAttribute('aria-label')).toBe(s);
        } else {
          const shown = s.slice(0, 64).trim();
          expect(container.textContent, `${slot.name} ${s}`).toContain(shown.slice(0, 20));
        }
        cleanup();
      }
    });
  }
});

describe('XSS corpus: URLs and markup props never reach the DOM', () => {
  const props = ['href', 'src', 'srcdoc', 'action', 'formAction', 'xlinkHref', 'poster', 'data', 'url', 'link', 'target', 'download'];
  for (const type of catalog.names) {
    it(`${type}: URL props are not in the catalog and are dropped`, () => {
      for (const url of XSS_URLS) {
        const base = clone(catalog.get(type)!.example) as { props: Record<string, unknown> };
        const hostile = { ...base, props: { ...base.props, ...Object.fromEntries(props.filter((p) => p !== 'action' || type !== 'Button').map((p) => [p, url])) } };
        const r = validate(doc(hostile), { actions: ['approveRefund', 'choosePlan', 'go'] });
        expect(r.ok).toBe(true);
        expect(r.issues.every((i) => i.code === 'unknown-prop')).toBe(true);
        for (const p of props) if (p !== 'action') expect(((r.document!.root as { props: Record<string, unknown> }).props)[p]).toBeUndefined();
        renderAudit(doc(hostile));
        cleanup();
      }
    });
  }

  it('React and DOM escape hatches are dropped from every component and node', () => {
    const hatches = {
      dangerouslySetInnerHTML: { __html: '<img src=x onerror=alert(1)>' },
      className: 'x" onmouseover="alert(1)',
      style: { background: 'url(javascript:alert(1))' },
      as: 'script',
      asChild: true,
      ref: 'x',
      id: 'root',
      key: 'k',
      role: 'button',
      tabIndex: 0,
      onClick: 'alert(1)',
      onMouseOver: 'alert(1)',
      onError: 'alert(1)',
      onLoad: 'alert(1)',
      onFocus: 'alert(1)',
      'aria-hidden': true,
      'data-x': '1',
      children: '<script>alert(1)</script>',
      innerHTML: '<script>alert(1)</script>',
      srcDoc: '<script>alert(1)</script>',
    };
    for (const type of catalog.names) {
      const base = clone(catalog.get(type)!.example) as Record<string, unknown> & { props: Record<string, unknown> };
      const node = { ...base, ...hatches, key: base.key ?? 'k', props: { ...base.props, ...hatches } };
      const r = validate(doc(node), { actions: ['approveRefund', 'choosePlan', 'go'] });
      expect(r.ok, type).toBe(true);
      const props = (r.document!.root as { props: Record<string, unknown> }).props;
      for (const k of Object.keys(hatches)) expect(props[k], `${type}.${k}`).toBeUndefined();
      expect(Object.keys(r.document!.root).sort()).toEqual(['children', 'key', 'props', 'type'].filter((k) => k in (r.document!.root as object)).sort());
      const { container } = renderAudit(doc(node));
      expect(container.querySelector('[id="root"], [class*="onmouseover"], [data-x]')).toBeNull();
      expect(validate(doc(node), { onInvalid: 'reject' }).ok).toBe(false);
      cleanup();
    }
  });

  it('action names that look like code or URLs never become actions', () => {
    for (const name of [...XSS_URLS, 'alert(1)', ' choosePlan', 'choosePlan()', 'a'.repeat(65), '', '__proto__', 'a b', 'x<y>']) {
      const r = validate(doc({ type: 'Button', props: { label: 'Go', action: { name } } }), { actions: [name] });
      expect(r.ok, name).toBe(false);
    }
    // A valid-looking name the host didn't list is dropped too: the model can't invent capabilities.
    const { container } = renderAudit(doc({ type: 'Card', children: [{ type: 'Button', props: { label: 'Delete everything', action: { name: 'deleteAll' } } }] }));
    expect(container.querySelector('button')).toBeNull();
  });
});

describe('XSS corpus: structure', () => {
  it('unknown components are removed, whatever they are called', () => {
    const types = ['script', 'iframe', 'a', 'img', 'style', 'object', 'embed', 'svg', 'form', 'input', 'Link', 'Image', 'Form', 'Input', 'Html', 'Markdown', 'div', 'Fragment', 'toString', 'constructor', 'hasOwnProperty', 'valueOf', '', 'Card ', 'card', 'BUTTON'];
    for (const type of types) {
      const document = doc({ type: 'Card', children: [{ type, props: { src: 'javascript:alert(1)', href: 'javascript:alert(1)', text: '<script>alert(1)</script>' }, children: ['<script>alert(1)</script>'] }] });
      const r = validate(document);
      expect(r.issues.map((i) => i.code), type).toEqual([type === '' ? 'unknown-component' : 'unknown-component']);
      const { container } = renderAudit(document);
      expect(container.textContent).not.toContain('alert');
      cleanup();
    }
  });

  it('prototype-pollution keys reject the whole document, at any depth, as objects or as JSON text', () => {
    const before = Object.getOwnPropertyNames(Object.prototype).length;
    const places = [
      (k: string) => `{"version":"1.0","${k}":{"polluted":true},"root":{"type":"Badge","props":{"text":"x"}}}`,
      (k: string) => `{"version":"1.0","root":{"type":"Badge","${k}":{"polluted":true},"props":{"text":"x"}}}`,
      (k: string) => `{"version":"1.0","root":{"type":"Badge","props":{"text":"x","${k}":{"polluted":true}}}}`,
      (k: string) => `{"version":"1.0","root":{"type":"Button","props":{"label":"x","action":{"name":"go","payload":{"a":[{"${k}":{"polluted":true}}]}}}}}`,
      (k: string) => `{"version":"1.0","root":{"type":"DescriptionList","props":{"items":[{"label":"a","value":"b","${k}":{"polluted":true}}]}}}`,
      (k: string) => `{"version":"1.0","root":{"type":"Card","children":[{"type":"Badge","props":{"text":"x"},"${k}":{"polluted":true}}]}}`,
    ];
    for (const key of ['__proto__', 'constructor', 'prototype']) {
      for (const place of places) {
        const text = place(key);
        for (const input of [text, JSON.parse(text)]) {
          const r = validate(input);
          expect(r.ok, text).toBe(false);
          expect(r.issues[0]?.code).toBe('forbidden-key');
          renderAudit(input);
          cleanup();
        }
        // And while streaming: the partial document is refused the same way.
        const cut = text.slice(0, text.indexOf(key) + key.length + 25);
        const parsed = parsePartial(cut);
        expect(validate(parsed.document, { partial: parsed }).ok, cut).toBe(false);
      }
    }
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
    expect(Object.getOwnPropertyNames(Object.prototype).length).toBe(before);
  });

  it('non-JSON values are rejected', () => {
    class Thing {
      text = 'x';
    }
    const cyclic: Record<string, unknown> = { type: 'Card' };
    cyclic.children = [cyclic];
    const values: unknown[] = [() => 'x', Symbol('x'), BigInt(1), new Date(), new Map(), new Thing(), Number.NaN, Number.POSITIVE_INFINITY, /x/];
    for (const v of values) {
      const r = validate(doc({ type: 'Badge', props: { text: v } }));
      expect(r.ok, String(typeof v)).toBe(false);
      expect(r.issues[0]?.code).toBe('parse-error');
    }
    expect(validate(doc(cyclic)).issues[0]?.code).toBe('parse-error');
    expect(validate(doc(new Thing())).ok).toBe(false);
    renderAudit(doc(cyclic));
    // undefined is absent, as in JSON.
    expect(validate(doc({ type: 'Badge', props: { text: 'x', tone: undefined } })).issues).toEqual([]);
  });

  it('oversized, deep and crowded documents are rejected before they are walked', () => {
    let deep: unknown = { type: 'Badge', props: { text: 'x' } };
    for (let i = 0; i < 40; i++) deep = { type: 'Card', children: [deep] };
    let jsonDeep = '1';
    for (let i = 0; i < 5000; i++) jsonDeep = `[${jsonDeep}]`;
    const cases: unknown[] = [
      doc(deep),
      JSON.stringify(doc(deep)),
      `{"version":"1.0","root":${jsonDeep}}`,
      doc({ type: 'Card', children: Array.from({ length: 2000 }, () => 'x') }),
      doc({ type: 'StreamingText', props: { text: 'x'.repeat(300_000) } }),
      'x'.repeat(300_000),
      `{"version":"1.0","root":{"type":"Card","children":[${Array.from({ length: 600 }, () => '{"type":"Badge","props":{"text":"x"}}').join(',')}]}}`,
    ];
    for (const c of cases) {
      const started = performance.now();
      const r = validate(c);
      expect(r.ok).toBe(false);
      expect(['too-large', 'parse-error']).toContain(r.issues[0]?.code);
      expect(performance.now() - started).toBeLessThan(1000);
      renderAudit(c);
      cleanup();
    }
    // Long text past a prop's cap is dropped, not truncated into something else.
    expect(validate(doc({ type: 'Badge', props: { text: 'x'.repeat(65) } })).ok).toBe(false);
  });

  it('half-streamed actions and buttons never become pressable', () => {
    const full = JSON.stringify(doc({ type: 'Card', children: [{ type: 'Button', props: { label: 'Approve', action: { name: 'approveRefund', payload: { id: 1 } } } }] }));
    const onAction = vi.fn();
    for (let i = 1; i < full.length; i++) {
      const { container } = render(<GenUI document={full.slice(0, i)} streaming actions={['approveRefund']} onAction={onAction} />);
      const button = container.querySelector('button');
      if (button) {
        expect(button).toBeDisabled();
        button.click();
      }
      expect(auditDom(container)).toEqual([]);
      cleanup();
    }
    expect(onAction).not.toHaveBeenCalled();
    // A name cut short is not the accepted one: the button only appears once the name is whole.
    const cut = parsePartial(full.slice(0, full.indexOf('approveRefund') + 7));
    expect(JSON.stringify(validate(cut.document, { partial: cut, actions: ['approve'] }).document)).not.toContain('"Button"');
  });

  it('documents rendered in reject mode show only the fallback', () => {
    for (const s of XSS_TEXT) {
      const document: GenUIDocument | unknown = doc({ type: 'Badge', props: { text: 'x', onClick: s } });
      const { container } = renderAudit(document, { onInvalid: 'reject' });
      expect(container.textContent).toContain('This answer couldn’t be shown');
      expect(container.textContent).not.toContain(s);
      cleanup();
    }
  });
});
