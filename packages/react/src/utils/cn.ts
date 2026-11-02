import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge, getDefaultConfig } from 'tailwind-merge';

// Teach tailwind-merge the token scales from the @nexub/tokens preset. Without
// this it reads `text-label-lg` as a text *color* (and drops it next to
// `text-[var(--color-…)]`) and never resolves `rounded-shape-*` vs `rounded-md`.
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
const typeRoles = ['display', 'headline', 'title', 'body', 'label'].flatMap((r) =>
  ['lg', 'md', 'sm'].map((s) => `${r}-${s}`),
);
const springs = ['spatial', 'effects', 'expressive'].flatMap((k) =>
  ['fast', 'default', 'slow'].map((s) => `${k}-${s}`),
);

// Tailwind 3 reads a bare `outline` as outline-style: solid; tailwind-merge 3
// files it under width (the Tailwind 4 meaning). Components pair it with
// `outline-[3px]` for focus rings, so keep it a style or Tailwind 3 apps lose
// the ring. This is how tailwind-merge 2 grouped it.
const outlineWidths = (getDefaultConfig().classGroups['outline-w'][0] as { readonly outline: readonly unknown[] }).outline.filter(
  (v) => v !== '',
);

const twMerge = extendTailwindMerge({
  override: {
    classGroups: { 'outline-w': [{ outline: outlineWidths as never }] },
  },
  extend: {
    theme: {
      spacing: sizes.map((s) => `control-${s}`),
      radius: ['control', 'field', 'container', 'overlay', 'tooltip', 'min'].map((s) => `shape-${s}`),
      text: typeRoles,
      shadow: ['elevation-0', 'elevation-1', 'elevation-2', 'elevation-3'],
      ease: springs,
    },
    classGroups: {
      duration: [{ duration: springs }],
      'outline-style': [{ outline: [''] }],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
