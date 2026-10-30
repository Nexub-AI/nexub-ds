'use client';

import * as React from 'react';
import { Badge, Input, Label, NumberInput, Select, Switch, Text } from '@nexub/react';
import type { ControlDef, PlaygroundDef } from '@/registry/types';
import { renderPlayground, hasPlaygroundRenderer } from './PlaygroundRegistry';
import { CopyButton } from './CopyButton';
import { PreviewToolbar, DEFAULT_TOOLBAR_STATE, bgClass, widthPx, type PreviewToolbarState } from './PreviewToolbar';

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
  const id = React.useId();

  if (!hasPlaygroundRenderer(slug)) {
    return null;
  }

  const childrenProp = def.childrenProp ?? 'children';
  const childrenVal = typeof values[childrenProp] === 'string' ? (values[childrenProp] as string) : '';

  const omitFromCode = new Set(def.controls.filter((c) => c.omitFromCode).map((c) => c.name));
  const code = generateCode(componentName, values, childrenProp, omitFromCode);

  const set = <K extends keyof Bag>(name: K, v: Bag[K]) => setValues((prev) => ({ ...prev, [name]: v }));
  const framed = toolbar.width !== 'full';

  return (
    <div className="overflow-hidden rounded-shape-container border border-[var(--color-outline-variant)] bg-[var(--color-surface)]">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] px-3 py-2">
        <Text size="label" weight="semibold" tone="secondary" className="uppercase tracking-wider">
          {def.title ?? 'Playground'}
        </Text>
        <Badge size="sm" variant="soft" tone="success">
          Live
        </Badge>
      </div>

      <div className="docs-playground-grid">
        <div className="flex min-w-0 flex-col gap-3 border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] p-4 max-md:border-b md:border-e">
          {def.controls.map((c) => (
            <ControlField key={c.name} id={`${id}-${c.name}`} control={c} value={values[c.name]} onChange={(v) => set(c.name, v)} />
          ))}
        </div>

        <div className="flex min-w-0 flex-col">
          <div dir={toolbar.dir} className={'flex min-h-[180px] items-center justify-center p-8 ' + bgClass(toolbar.bg)}>
            <div
              className={
                'flex max-w-full items-center justify-center' +
                (framed
                  ? ' rounded-shape-field border border-dashed border-[var(--color-outline-variant)] bg-[var(--color-surface)] p-4'
                  : '')
              }
              style={{ width: widthPx(toolbar.width) }}
            >
              {renderPlayground(slug, { ...values, [childrenProp]: childrenVal })}
            </div>
          </div>

          <PreviewToolbar state={toolbar} onChange={setToolbar} />

          <div className="relative border-t border-[var(--color-outline-variant)]">
            <pre className="docs-snippet m-0 overflow-x-auto bg-[var(--docs-snippet-bg)] py-4 pe-14 ps-5 font-mono text-label-md leading-relaxed text-[var(--docs-snippet-fg)]">
              <code>{code}</code>
            </pre>
            <div className="absolute end-2 top-2">
              <CopyButton text={code} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ControlField({
  id,
  control,
  value,
  onChange,
}: {
  id: string;
  control: ControlDef;
  value: unknown;
  onChange: (v: string | boolean | number) => void;
}) {
  const labelText = control.label ?? control.name;

  if (control.kind === 'switch') {
    return (
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={id} className="font-mono text-label-md">
          {labelText}
        </Label>
        <Switch id={id} size="sm" checked={Boolean(value)} onCheckedChange={(v) => onChange(v)} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={id} className="font-mono text-label-md">
        {labelText}
      </Label>
      {control.kind === 'select' ? (
        <Select.Root value={String(value)} onValueChange={(v) => onChange(v)}>
          <Select.Trigger id={id} className="h-control-sm font-mono text-label-md">
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            {control.options.map((o) => (
              <Select.Item key={o} value={o} className="font-mono">
                {o}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      ) : control.kind === 'number' ? (
        <NumberInput
          id={id}
          size="sm"
          value={Number(value)}
          min={control.min}
          max={control.max}
          step={control.step ?? 1}
          onChange={(v) => onChange(v)}
        />
      ) : (
        <Input
          id={id}
          size="sm"
          value={String(value)}
          placeholder={control.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

function generateCode(name: string, values: Bag, childrenProp: string, omit: Set<string>): string {
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
