// JSX types for the @nexub/elements custom elements, so the docs examples can render
// <nx-number-input> and <nx-date-picker> in React 19. On the client React sets a prop as a
// property when the element has one, else as an attribute: there `defaultValue` reflects to
// the `value` attribute (the starting value) and `value` sets the current value. Server
// rendering writes attributes and hydration leaves them, so the docs examples, which are
// prerendered, pass `value` (the attribute a server-rendered page would write).
import type * as React from 'react';
import type { NxDatePicker, NxNumberInput } from '@nexub/elements';

type FieldProps<T> = React.DetailedHTMLProps<React.HTMLAttributes<T>, T> & {
  name?: string;
  value?: string;
  defaultValue?: string;
  min?: string;
  max?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'nx-number-input': FieldProps<NxNumberInput> & { step?: string; placeholder?: string };
      'nx-date-picker': FieldProps<NxDatePicker> & { granularity?: 'day' | 'month' | 'year'; locale?: string };
    }
  }
}
