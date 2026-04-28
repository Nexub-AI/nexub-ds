'use client';

import * as React from 'react';
import type { ControlDef, PlaygroundDef } from '@/registry/types';
import { renderPlayground, hasPlaygroundRenderer } from './PlaygroundRegistry';
import { CopyButton } from './CopyButton';
import {
  PreviewToolbar,
  DEFAULT_TOOLBAR_STATE,
  bgImage,
  widthPx,
  type PreviewToolbarState,
} from './PreviewToolbar';

interface Props {
  slug: string;
  componentName: string; // e.g. "Button" — used in generated JSX
  def: PlaygroundDef;
}

type Bag = Record<string, string | boolean | number>;

function defaultsFrom(controls: ControlDef[]): Bag {
  const out: Bag = {};
  controls.forEach((c) => {
    out[c.name] = c.default as string | boolean | number;
  });
  return out;
}

export function Playground({ slug, componentName, def }: Props) {
  const [values, setValues] = React.useState<Bag>(() => defaultsFrom(def.controls));
  const [toolbar, setToolbar] = React.useState<PreviewToolbarState>(DEFAULT_TOOLBAR_STATE);

  if (!hasPlaygroundRenderer(slug)) {
    return null;
  }

  const childrenProp = def.childrenProp ?? 'children';
  const childrenVal = typeof values[childrenProp] === 'string' ? (values[childrenProp] as string) : '';

  const omitFromCode = new Set(def.controls.filter((c) => c.omitFromCode).map((c) => c.name));
  const code = generateCode(componentName, values, childrenProp, omitFromCode);

  const set = <K extends keyof Bag>(name: K, v: Bag[K]) =>
    setValues((prev) => ({ ...prev, [name]: v }));

  return (
    <div
      style={{
        border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        marginBottom: '1.5rem',
        background: 'var(--color-bg-default)',
      }}
    >
      <div
        style={{
          padding: '8px 12px',
          borderBottom: '1px solid var(--color-border-default)',
          background: 'var(--color-bg-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--color-text-secondary)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          {def.title ?? 'Playground'}
        </span>
        <span
          style={{
            fontSize: '0.7rem',
            color: 'var(--color-text-subtle)',
            fontFamily: 'var(--font-family-mono)',
          }}
        >
          live
        </span>
      </div>

      <div className="docs-playground-grid">
        {/* Controls column */}
        <div
          style={{
            padding: '1rem',
            borderRight: '1px solid var(--color-border-subtle)',
            background: 'var(--color-bg-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            minWidth: 0,
          }}
        >
          {def.controls.map((c) => (
            <ControlField key={c.name} control={c} value={values[c.name]} onChange={(v) => set(c.name, v)} />
          ))}
        </div>

        {/* Preview + code column */}
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div
            dir={toolbar.dir}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '180px',
              padding: '2rem',
              ...bgImage(toolbar.bg),
            }}
          >
            <div
              style={{
                width: widthPx(toolbar.width),
                maxWidth: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...(toolbar.width !== 'full'
                  ? {
                      border: '1px dashed var(--color-border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                      background: 'var(--color-bg-default)',
                    }
                  : null),
              }}
            >
              {renderPlayground(slug, { ...values, [childrenProp]: childrenVal })}
            </div>
          </div>

          <PreviewToolbar state={toolbar} onChange={setToolbar} />

          <div style={{ position: 'relative', borderTop: '1px solid var(--color-border-default)' }}>
            <pre
              className="docs-snippet"
              style={{
                background: 'var(--docs-snippet-bg)',
                color: 'var(--docs-snippet-fg)',
                margin: 0,
                padding: '1rem 1.25rem',
                overflowX: 'auto',
                fontSize: '0.78rem',
                lineHeight: 1.6,
                fontFamily: 'var(--font-family-mono)',
              }}
            >
              <code>{code}</code>
            </pre>
            <div style={{ position: 'absolute', top: 8, right: 8 }}>
              <CopyButton text={code} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ControlField({
  control,
  value,
  onChange,
}: {
  control: ControlDef;
  value: unknown;
  onChange: (v: string | boolean | number) => void;
}) {
  const labelText = control.label ?? control.name;
  const labelEl = (
    <span
      style={{
        fontSize: '0.72rem',
        fontWeight: 600,
        color: 'var(--color-text-secondary)',
        fontFamily: 'var(--font-family-mono)',
      }}
    >
      {labelText}
    </span>
  );

  if (control.kind === 'select') {
    return (
      <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {labelEl}
        <select
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          style={selectStyle}
        >
          {control.options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (control.kind === 'switch') {
    return (
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          cursor: 'pointer',
        }}
      >
        {labelEl}
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          style={{ cursor: 'pointer' }}
        />
      </label>
    );
  }

  if (control.kind === 'number') {
    return (
      <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {labelEl}
        <input
          type="number"
          value={Number(value)}
          min={control.min}
          max={control.max}
          step={control.step ?? 1}
          onChange={(e) => onChange(Number(e.target.value))}
          style={inputStyle}
        />
      </label>
    );
  }

  // text
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {labelEl}
      <input
        type="text"
        value={String(value)}
        placeholder={control.placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
      />
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  padding: '6px 8px',
  fontSize: '0.78rem',
  fontFamily: 'var(--font-family-mono)',
  background: 'var(--color-bg-default)',
  border: '1px solid var(--color-border-default)',
  borderRadius: 'var(--radius-md)',
  color: 'var(--color-text-primary)',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: 'pointer',
};

function generateCode(
  name: string,
  values: Bag,
  childrenProp: string,
  omit: Set<string>
): string {
  const propEntries: string[] = [];
  let childText = '';

  Object.entries(values).forEach(([key, v]) => {
    if (key === childrenProp) {
      childText = typeof v === 'string' ? v : '';
      return;
    }
    if (omit.has(key)) return;
    if (typeof v === 'boolean') {
      if (v) propEntries.push(key);
      return;
    }
    if (typeof v === 'number') {
      propEntries.push(`${key}={${v}}`);
      return;
    }
    if (typeof v === 'string') {
      if (!v) return;
      // Treat 'none' as 'omit prop' for tone-like fields.
      if (v === 'none') return;
      propEntries.push(`${key}="${v}"`);
    }
  });

  const propsStr = propEntries.length ? ' ' + propEntries.join(' ') : '';
  if (childText) {
    return `<${name}${propsStr}>${childText}</${name}>`;
  }
  return `<${name}${propsStr} />`;
}
