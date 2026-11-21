'use client';

import * as React from 'react';
import * as RadixPopover from '@radix-ui/react-popover';
import { ChevronDown } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { field, fieldFocusVisible, fieldInvalid, fieldReadOnly, type Size } from '../../utils/control.js';
import { COLLISION_PADDING, type SheetProp } from '../../utils/popper.js';
import { floatingSurface } from '../../utils/surface.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { Input } from '../Input/Input.js';
import { contrastRatio, parseHex } from './contrast.js';

export { contrastRatio, parseHex } from './contrast.js';

/** A swatch: a hex colour, or one with a name read out instead of the hex. */
export type ColorSwatch = string | { value: string; label?: string };

export interface ColorPickerProps {
  /** The picked colour as `#rrggbb`. */
  value?: string;
  /** @default '#000000' */
  defaultValue?: string;
  /** Called with a lowercase `#rrggbb`. */
  onValueChange?: (hex: string) => void;
  /** The colours offered as swatches. @default neutrals and hues */
  swatches?: ColorSwatch[];
  /** A background hex: shows the WCAG contrast ratio of the colour against it and the AA text hint (4.5:1). */
  contrastAgainst?: string;
  disabled?: boolean;
  /** Shows the colour; the popover can't open. Stays focusable. */
  readOnly?: boolean;
  invalid?: boolean;
  /** @default 'md' */
  size?: Size;
  /** @default 'auto' (a bottom sheet below 768px) */
  sheet?: SheetProp;
  /** With `name`, a hidden input carries the value, so a plain `<form>` posts it. */
  name?: string;
  id?: string;
  className?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
}

// The colours on offer are data, not styling: kept as bare hex digits (the design lint keeps
// literal colours out of component styles).
const DEFAULT_SWATCHES = '000000 525252 a3a3a3 ffffff dc2626 ea580c ca8a04 16a34a 0d9488 2563eb 7c3aed db2777'
  .split(' ')
  .map((hex) => `#${hex}`);
const BLACK = DEFAULT_SWATCHES[0]!;
const COLUMNS = 6;

const triggerSizes: Record<Size, string> = {
  sm: 'h-control-sm px-3 gap-1.5 text-body-sm',
  md: 'h-control-md px-3.5 gap-2 text-body-md',
  lg: 'h-control-lg px-4 gap-2 text-body-md',
};

const dot = 'shrink-0 rounded-full border border-outline-variant';

/**
 * 11.2: pick a colour from swatches or type a hex, with an optional WCAG contrast hint against a
 * background. A field-styled button that opens a popover (a bottom sheet on phones).
 */
export const ColorPicker = React.forwardRef<HTMLButtonElement, ColorPickerProps>(function ColorPicker(
  {
    value: valueProp,
    defaultValue = BLACK,
    onValueChange,
    swatches = DEFAULT_SWATCHES,
    contrastAgainst,
    disabled,
    readOnly,
    invalid,
    size = 'md',
    sheet = 'auto',
    name,
    id,
    className,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
  },
  ref,
) {
  const messages = useNexubMessages();
  const [open, setOpen] = React.useState(false);
  const [internal, setInternal] = React.useState(defaultValue);
  const value = parseHex(valueProp ?? internal) ?? BLACK;
  const [draft, setDraft] = React.useState(value);
  const [draftInvalid, setDraftInvalid] = React.useState(false);
  const swatchRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const hexId = React.useId();

  React.useEffect(() => {
    setDraft(value);
    setDraftInvalid(false);
  }, [value]);

  const items = swatches.map((s) => (typeof s === 'string' ? { value: s, label: undefined } : s)).map((s) => ({ ...s, value: parseHex(s.value) ?? s.value }));
  const checkedIndex = items.findIndex((s) => s.value === value);

  const choose = (next: string) => {
    if (valueProp === undefined) setInternal(next);
    if (next !== value) onValueChange?.(next);
  };

  const commitDraft = () => {
    const next = parseHex(draft);
    if (next) {
      setDraftInvalid(false);
      setDraft(next);
      choose(next);
    } else {
      setDraftInvalid(true);
    }
  };

  const onSwatchKey = (e: React.KeyboardEvent, i: number) => {
    const last = items.length - 1;
    const next =
      e.key === 'ArrowRight' ? (i + 1) % items.length :
      e.key === 'ArrowLeft' ? (i - 1 + items.length) % items.length :
      e.key === 'ArrowDown' ? Math.min(last, i + COLUMNS) :
      e.key === 'ArrowUp' ? Math.max(0, i - COLUMNS) :
      e.key === 'Home' ? 0 :
      e.key === 'End' ? last : null;
    if (next === null) return;
    e.preventDefault();
    choose(items[next]!.value);
    swatchRefs.current[next]?.focus();
  };

  const isInvalid = invalid || ariaInvalid === true || ariaInvalid === 'true';
  const ratio = contrastAgainst ? contrastRatio(value, contrastAgainst) : null;
  const background = ratio === null ? undefined : parseHex(contrastAgainst!)!;

  return (
    <>
      <RadixPopover.Root open={open && !readOnly} onOpenChange={(next) => setOpen(next && !readOnly)}>
        <RadixPopover.Trigger asChild>
          <button
            ref={ref}
            id={id}
            type="button"
            role="combobox"
            aria-haspopup="dialog"
            aria-expanded={open && !readOnly}
            aria-readonly={readOnly || undefined}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
            aria-invalid={isInvalid || undefined}
            disabled={disabled}
            data-readonly={readOnly ? '' : undefined}
            onKeyDown={(e) => {
              if (readOnly && (e.key === 'Enter' || e.key === ' ')) e.preventDefault();
            }}
            className={cn(
              'flex w-full items-center text-start',
              triggerSizes[size],
              field,
              fieldFocusVisible,
              fieldReadOnly,
              'data-[state=open]:border-primary data-[state=open]:shadow-[inset_0_0_0_1px_var(--color-primary)]',
              'disabled:cursor-not-allowed disabled:border-outline-variant disabled:bg-surface-container-low disabled:text-[var(--color-text-disabled)]',
              isInvalid && fieldInvalid,
              className,
            )}
          >
            <span className={cn(dot, 'size-5')} style={{ backgroundColor: value }} aria-hidden="true" />
            <span className="flex-1 truncate font-mono uppercase">{value}</span>
            <ChevronDown size="sm" className="shrink-0 text-on-surface-variant" aria-hidden="true" />
          </button>
        </RadixPopover.Trigger>
        <RadixPopover.Portal>
          <RadixPopover.Content
            align="start"
            sideOffset={4}
            collisionPadding={COLLISION_PADDING}
            aria-label={ariaLabel ?? messages.colorPicker}
            data-nx-sheet={sheet || undefined}
            className={cn(
              'z-[var(--z-popover)] flex w-64 flex-col gap-3 p-3 outline-none',
              floatingSurface,
              'nx-motion nx-pop origin-[var(--radix-popover-content-transform-origin)]',
            )}
          >
            <div role="radiogroup" aria-label={messages.colorSwatches} className="grid grid-cols-6 gap-2">
              {items.map((s, i) => (
                <button
                  key={`${s.value}-${i}`}
                  ref={(el) => {
                    swatchRefs.current[i] = el;
                  }}
                  type="button"
                  role="radio"
                  aria-checked={i === checkedIndex}
                  aria-label={s.label ?? s.value}
                  tabIndex={i === (checkedIndex < 0 ? 0 : checkedIndex) ? 0 : -1}
                  onClick={() => choose(s.value)}
                  onKeyDown={(e) => onSwatchKey(e, i)}
                  className={cn(dot, 'size-8 justify-self-center', i === checkedIndex && 'ring-2 ring-primary ring-offset-2 ring-offset-[var(--color-surface-elevated)]')}
                  style={{ backgroundColor: s.value }}
                />
              ))}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor={hexId} className="text-label-md text-on-surface-variant">
                {messages.colorHex}
              </label>
              <Input
                id={hexId}
                size="sm"
                value={draft}
                invalid={draftInvalid || undefined}
                spellCheck={false}
                autoComplete="off"
                className="font-mono"
                onChange={(e) => {
                  setDraft(e.target.value);
                  if (draftInvalid && parseHex(e.target.value)) setDraftInvalid(false);
                }}
                onBlur={commitDraft}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    commitDraft();
                  }
                }}
              />
            </div>
            {ratio !== null && (
              <div className="flex items-center gap-2 text-body-sm" aria-live="polite">
                <span className={cn(dot, 'flex size-8 items-center justify-center font-semibold')} style={{ backgroundColor: background, color: value }} aria-hidden="true">
                  Aa
                </span>
                <span className="flex flex-col">
                  <span className="tabular-nums">{messages.contrastRatio((Math.floor(ratio * 10) / 10).toFixed(1))}</span>
                  <span className={ratio >= 4.5 ? 'text-success' : 'text-error'}>{ratio >= 4.5 ? messages.contrastPasses : messages.contrastFails}</span>
                </span>
              </div>
            )}
          </RadixPopover.Content>
        </RadixPopover.Portal>
      </RadixPopover.Root>
      {name && <input type="hidden" name={name} value={value} disabled={disabled} />}
    </>
  );
});
