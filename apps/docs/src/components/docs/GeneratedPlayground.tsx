'use client';

import * as React from 'react';
import { Button, Input, Label, NumberInput, SegmentedControl, Select, Switch, Text } from '@nexub/react';
import { CodeSnippet } from './CodeFrame';
import { effective, printAttr, printJsx, type PlaygroundBag, type PlaygroundControl, type PlaygroundRecipe, type PlaygroundValue } from './playground-code';

/**
 * 11.0: the playground and the states gallery every component page gets from its
 * prop types. The recipe comes from registry/playground.generated.json; `base` is
 * the page's own module under ./playground (the first docs example with the props
 * spread onto the component). Both views are in the server HTML: nothing loads
 * after first paint, so nothing shifts.
 */
export interface PlaygroundViewProps {
  view: 'playground' | 'states';
  recipe: PlaygroundRecipe;
}

type Base = React.ComponentType<Record<string, unknown>>;

export function PlaygroundView({ view, recipe, base }: PlaygroundViewProps & { base: Base }) {
  return view === 'states' ? <StatesGallery recipe={recipe} base={base} /> : <GeneratedPlayground recipe={recipe} base={base} />;
}

const frame = 'overflow-hidden rounded-shape-container border border-outline-variant bg-surface';

function GeneratedPlayground({ recipe, base: Base }: { recipe: PlaygroundRecipe; base: Base }) {
  // Only what the reader changed; everything else stays as the example has it.
  const [bag, setBag] = React.useState<PlaygroundBag>({});
  const [resets, setResets] = React.useState(0);
  const id = React.useId();
  const set = (name: string, v: PlaygroundValue) => setBag((prev) => ({ ...prev, [name]: v }));

  return (
    <div className={frame}>
      <div className="flex items-center justify-between gap-3 border-b border-outline-variant bg-surface-container-low px-3 py-2">
        <Text size="label" weight="semibold" tone="secondary" className="uppercase tracking-wider">
          Props
        </Text>
        <Button
          size="sm"
          variant="outlined"
          onClick={() => {
            setBag({});
            setResets((n) => n + 1);
          }}
        >
          Reset
        </Button>
      </div>

      <div className="docs-playground-grid">
        <div key={resets} className="flex min-w-0 flex-col gap-3 border-outline-variant bg-surface-container-low p-4 max-md:border-b md:border-e">
          {recipe.controls.map((c) => (
            <ControlField key={c.name} id={`${id}-${c.name}`} control={c} value={effective(c, bag)} onChange={(v) => set(c.name, v)} />
          ))}
        </div>

        <div className="flex min-w-0 flex-col">
          <div role="group" aria-label="Preview" className="docs-bg-grid flex min-h-55 flex-1 items-center justify-center overflow-hidden p-8">
            {/* Remounts on change so mount-only props apply and nothing switches between controlled and uncontrolled. */}
            <Base key={JSON.stringify(bag)} {...bag} />
          </div>
          <CodeSnippet code={printJsx(recipe, bag)} lang="tsx" className="rounded-none border-x-0 border-b-0" />
        </div>
      </div>
    </div>
  );
}

const labelClass = 'font-mono text-label-md';

function ControlField({ id, control, value, onChange }: { id: string; control: PlaygroundControl; value: PlaygroundValue | undefined; onChange: (v: PlaygroundValue) => void }) {
  if (control.kind === 'switch') {
    return (
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={id} className={labelClass}>
          {control.name}
        </Label>
        <Switch id={id} size="sm" checked={value === true} onCheckedChange={onChange} />
      </div>
    );
  }

  if (control.kind === 'select') {
    const index = value === undefined ? -1 : control.options.indexOf(value);
    const pick = (i: string) => {
      const option = control.options[Number(i)];
      if (i !== '' && option !== undefined) onChange(option);
    };
    // A few options with a known value: all visible at once. Otherwise a menu.
    if (control.options.length <= 4 && index >= 0) {
      return (
        <div className="flex flex-col gap-1">
          <span id={id} className={labelClass + ' font-medium text-on-surface'}>
            {control.name}
          </span>
          <SegmentedControl.Root size="sm" aria-labelledby={id} value={String(index)} onValueChange={pick} className="w-full">
            {control.options.map((o, i) => (
              <SegmentedControl.Item key={String(o)} value={String(i)} className="min-w-0 flex-1 px-1 font-mono">
                {String(o)}
              </SegmentedControl.Item>
            ))}
          </SegmentedControl.Root>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-1">
        <Label htmlFor={id} className={labelClass}>
          {control.name}
        </Label>
        <Select.Root value={index >= 0 ? String(index) : undefined} onValueChange={pick}>
          <Select.Trigger id={id} className="h-control-sm font-mono text-label-md">
            <Select.Value placeholder="default" />
          </Select.Trigger>
          <Select.Content>
            {control.options.map((o, i) => (
              <Select.Item key={String(o)} value={String(i)} className="font-mono">
                {String(o)}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={id} className={labelClass}>
        {control.name}
      </Label>
      {control.kind === 'number' ? (
        <NumberInput id={id} size="sm" value={typeof value === 'number' ? value : 0} onValueChange={onChange} />
      ) : (
        <Input id={id} size="sm" value={typeof value === 'string' ? value : ''} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

function StatesGallery({ recipe, base: Base }: { recipe: PlaygroundRecipe; base: Base }) {
  return (
    <ul className={frame + ' docs-states-grid m-0 list-none p-0'}>
      {recipe.states.map(({ prop, value }) => {
        const isDefault = prop === 'default';
        return (
          <li key={`${prop}-${value}`} className="flex min-w-0 flex-col bg-surface">
            <div className="flex min-h-24 flex-1 items-center justify-center overflow-hidden p-4">
              <Base {...(isDefault ? {} : { [prop]: value })} />
            </div>
            <code className="border-t border-outline-variant bg-surface-container-low px-3 py-1.5 font-mono text-label-md text-on-surface-variant">
              {isDefault ? 'default' : printAttr(prop, value)}
            </code>
          </li>
        );
      })}
    </ul>
  );
}
