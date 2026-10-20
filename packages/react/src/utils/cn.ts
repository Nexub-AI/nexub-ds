import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

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

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      spacing: sizes.map((s) => `control-${s}`),
      borderRadius: ['control', 'field', 'container', 'overlay', 'tooltip', 'min'].map((s) => `shape-${s}`),
    },
    classGroups: {
      'font-size': [{ text: typeRoles }],
      shadow: [{ shadow: ['elevation-0', 'elevation-1', 'elevation-2', 'elevation-3'] }],
      duration: [{ duration: springs }],
      ease: [{ ease: springs }],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
