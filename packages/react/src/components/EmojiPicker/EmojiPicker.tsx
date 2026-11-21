'use client';

import * as React from 'react';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';
import type { EmojiCategory } from './emojiData.js';
import { PickerGrid, PickerShell, useRecent, type PickerFieldProps, type PickerItem, type PickerSection } from './pickerShared.js';

/** 0 = no modifier (the yellow default); 1–5 = light to dark (U+1F3FB–U+1F3FF). */
export type SkinTone = 0 | 1 | 2 | 3 | 4 | 5;

const TONE_KEYS = ['default', 'light', 'mediumLight', 'medium', 'mediumDark', 'dark'] as const;
const RECENT_KEY = 'nx-emoji-recent';
const TONE_KEY = 'nx-emoji-skin';

/** `emoji` with the skin tone modifier after its first code point (a variation selector there is dropped). */
export function withSkinTone(emoji: string, tone: SkinTone): string {
  if (!tone) return emoji;
  const [first = '', ...rest] = Array.from(emoji);
  if (rest[0] === '️') rest.shift();
  return first + String.fromCodePoint(0x1f3fa + tone) + rest.join('');
}

/** The emoji without skin tone modifiers or variation selectors, to look up its name. */
const baseOf = (emoji: string) => emoji.replace(/[\u{1F3FB}-\u{1F3FF}]|️/gu, '');

let dataPromise: Promise<EmojiCategory[]> | undefined;
/** Loads the emoji set (its own chunk). Call early, e.g. on hover, to have it ready on open. */
export function loadEmojiData(): Promise<EmojiCategory[]> {
  return (dataPromise ??= import('./emojiData.js').then(
    (m) => m.emojiCategories,
    (error: unknown) => {
      dataPromise = undefined;
      throw error;
    },
  ));
}

function useEmojiData(): EmojiCategory[] | null {
  const [data, setData] = React.useState<EmojiCategory[] | null>(null);
  React.useEffect(() => {
    let live = true;
    loadEmojiData().then(
      (d) => live && setData(d),
      () => {},
    );
    return () => {
      live = false;
    };
  }, []);
  return data;
}

function useSkinTone(controlled: SkinTone | undefined, defaultTone: SkinTone | undefined, onChange?: (tone: SkinTone) => void) {
  const [stored, setStored] = React.useState<SkinTone>(defaultTone ?? 0);
  React.useEffect(() => {
    if (controlled !== undefined || defaultTone !== undefined) return;
    try {
      const n = Number(localStorage.getItem(TONE_KEY));
      if (n >= 1 && n <= 5) setStored(n as SkinTone);
    } catch {
      // Storage blocked: the default tone.
    }
  }, [controlled, defaultTone]);
  const set = (tone: SkinTone) => {
    if (controlled === undefined) {
      setStored(tone);
      try {
        localStorage.setItem(TONE_KEY, String(tone));
      } catch {
        // Storage blocked: the tone lasts until the page closes.
      }
    }
    onChange?.(tone);
  };
  return [controlled ?? stored, set] as const;
}

export interface EmojiPickerPanelProps {
  /** The picked emoji, marked in the grid. */
  value?: string | null;
  /** Called with the picked emoji (skin tone applied). */
  onValueChange?: (emoji: string) => void;
  /** Recent picks, newest first. When set, they are not read from or saved to localStorage. */
  recent?: string[];
  skinTone?: SkinTone;
  /** @default the last tone chosen on this device, else 0 */
  defaultSkinTone?: SkinTone;
  onSkinToneChange?: (tone: SkinTone) => void;
  /** Focus the search box on mount. */
  autoFocus?: boolean;
  /** The listbox's id. */
  listId?: string;
  className?: string;
  /** Names the emoji list. @default messages.pickEmoji */
  'aria-label'?: string;
}

/**
 * 11.2: the emoji grid on its own (search, categories, recent picks, skin tone), for any popover
 * or page. The emoji set loads on mount, in its own chunk.
 */
export function EmojiPickerPanel({
  value,
  onValueChange,
  recent: recentProp,
  skinTone,
  defaultSkinTone,
  onSkinToneChange,
  autoFocus,
  listId,
  className,
  'aria-label': ariaLabel,
}: EmojiPickerPanelProps) {
  const messages = useNexubMessages();
  const data = useEmojiData();
  const [recent, addRecent] = useRecent(RECENT_KEY, recentProp);
  const [tone, setTone] = useSkinTone(skinTone, defaultSkinTone, onSkinToneChange);
  const [toneOpen, setToneOpen] = React.useState(false);
  const toneButton = React.useRef<HTMLButtonElement>(null);

  const categories = React.useMemo(() => {
    if (!data) return null;
    const byBase = new Map<string, PickerItem>();
    const sections: PickerSection[] = data.map((c) => ({
      id: c.id,
      label: messages.emojiCategories[c.id],
      icon: c.icon,
      items: c.emoji.map((em) => {
        const value = em.t ? withSkinTone(em.e, tone) : em.e;
        const item = { value, label: em.n, content: value, search: `${em.n} ${em.k ?? ''}`.toLowerCase() };
        byBase.set(baseOf(em.e), item);
        return item;
      }),
    }));
    return { sections, byBase };
  }, [data, tone, messages.emojiCategories]);

  const sections = React.useMemo(() => {
    if (!categories) return null;
    if (!recent.length) return categories.sections;
    const recentItems = recent.map((e): PickerItem => {
      const known = categories.byBase.get(baseOf(e));
      return { value: e, label: known?.label ?? e, content: e, search: known?.search ?? '' };
    });
    return [{ id: 'recent', label: messages.recentlyUsed, icon: '🕘', items: recentItems }, ...categories.sections];
  }, [categories, recent, messages.recentlyUsed]);

  const toneLabel = (t: SkinTone) => messages.skinTones[TONE_KEYS[t]];

  const toolbar = (
    <button
      ref={toneButton}
      type="button"
      aria-label={`${messages.skinTone}: ${toneLabel(tone)}`}
      title={messages.skinTone}
      aria-expanded={toneOpen}
      onClick={() => setToneOpen((o) => !o)}
      className="nx-state-layer flex size-8 shrink-0 items-center justify-center rounded-shape-control text-body-md"
    >
      {withSkinTone('✋', tone)}
    </button>
  );

  return (
    <div className={className}>
      <PickerGrid
        label={ariaLabel ?? messages.pickEmoji}
        sections={sections}
        value={value}
        listId={listId}
        autoFocus={autoFocus}
        toolbar={toolbar}
        onPick={(e) => {
          addRecent(e);
          onValueChange?.(e);
        }}
        className={toneOpen ? 'pb-0' : undefined}
      />
      {toneOpen && (
        <div role="group" aria-label={messages.skinTone} className="flex justify-end gap-0.5 px-2 pb-2">
          {([0, 1, 2, 3, 4, 5] as const).map((t) => (
            <button
              key={t}
              type="button"
              aria-label={toneLabel(t)}
              title={toneLabel(t)}
              aria-pressed={t === tone}
              onClick={() => {
                setTone(t);
                setToneOpen(false);
                toneButton.current?.focus();
              }}
              className="nx-state-layer flex size-8 items-center justify-center rounded-shape-control text-body-md aria-pressed:bg-secondary-container"
            >
              {withSkinTone('✋', t)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export interface EmojiPickerProps
  extends PickerFieldProps,
    Pick<EmojiPickerPanelProps, 'recent' | 'skinTone' | 'defaultSkinTone' | 'onSkinToneChange'> {
  /** The picked emoji; `null` (or `undefined` when uncontrolled) for none. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (emoji: string) => void;
  /** Shown when nothing is picked. @default messages.pickEmoji */
  placeholder?: string;
}

const EmojiPickerRoot = React.forwardRef<HTMLButtonElement, EmojiPickerProps>(function EmojiPicker(
  { value: valueProp, defaultValue = null, onValueChange, placeholder, recent, skinTone, defaultSkinTone, onSkinToneChange, ...field },
  ref,
) {
  const messages = useNexubMessages();
  const [open, setOpen] = React.useState(false);
  const [internal, setInternal] = React.useState<string | null>(defaultValue);
  const value = valueProp !== undefined ? valueProp : internal;
  return (
    <PickerShell
      ref={ref}
      {...field}
      value={value}
      open={open}
      onOpenChange={setOpen}
      fallbackLabel={messages.pickEmoji}
      display={value ? <span className="text-body-lg leading-none">{value}</span> : <span className="truncate">{placeholder ?? messages.pickEmoji}</span>}
    >
      {(listId) => (
        <EmojiPickerPanel
          listId={listId}
          autoFocus
          value={value}
          recent={recent}
          skinTone={skinTone}
          defaultSkinTone={defaultSkinTone}
          onSkinToneChange={onSkinToneChange}
          onValueChange={(e) => {
            if (valueProp === undefined) setInternal(e);
            onValueChange?.(e);
            setOpen(false);
          }}
        />
      )}
    </PickerShell>
  );
});

/**
 * 11.2: a field-styled button that opens an emoji grid (a bottom sheet on phones): search,
 * categories, recent picks and skin tone. The emoji set loads when it opens, in its own chunk.
 * `EmojiPicker.Panel` is the grid alone.
 */
export const EmojiPicker = Object.assign(EmojiPickerRoot, { Panel: EmojiPickerPanel });
