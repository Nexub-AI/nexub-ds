import * as React from 'react';
import type { Decorator } from '@storybook/react';
// The source, not dist: registers <nx-number-input> and <nx-date-picker> before React renders.
import '../src/define';
import type { NxDatePicker, NxNumberInput } from '../src/index';

// React 19 sets a prop as a property when the element has one, else as an attribute. Every
// attribute these elements read has a reflecting property, except `value`: the `value`
// property is the current value and the attribute is the default `form.reset()` goes back to.
// So the stories pass `defaultValue` (it reflects to the `value` attribute), as server-rendered
// HTML would write `value="…"`.
type ElementProps<T> = React.DetailedHTMLProps<React.HTMLAttributes<T>, T> & {
  name?: string;
  defaultValue?: string;
  min?: string;
  max?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
};
declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'nx-number-input': ElementProps<NxNumberInput> & { step?: string; placeholder?: string };
      'nx-date-picker': ElementProps<NxDatePicker> & { granularity?: 'day' | 'month' | 'year'; locale?: string };
    }
  }
}

// Deterministic for the visual baselines: fixed dates in March 2024 (never "today", so no
// day carries the today ring whatever the clock says), a fixed locale (en-US through `lang`),
// and no animation (the elements only animate under prefers-reduced-motion: no-preference,
// and the visual tests reduce motion).
export const stack: React.CSSProperties = { display: 'grid', gap: '1rem', maxInlineSize: '20rem' };
const labelStyle: React.CSSProperties = { display: 'block', marginBlockEnd: '0.25rem', fontWeight: 600, fontSize: '0.875rem' };

export const lang: Decorator = (Story) => <div lang="en-US">{Story()}</div>;

export function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} style={labelStyle}>
        {label}
      </label>
      {children}
    </div>
  );
}

/** Shows the invalid state on mount, as after a failed submit (`invalid` marks the field touched). */
export const validateOnMount = (el: (HTMLElement & { checkValidity(): boolean }) | null) => {
  el?.checkValidity();
};

/** Opens the calendar on mount, in the same commit as the render, so screenshots see it open. */
export const openOnMount = (el: NxDatePicker | null) => {
  el?.show();
};
