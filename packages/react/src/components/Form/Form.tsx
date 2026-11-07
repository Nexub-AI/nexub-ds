'use client';

import * as React from 'react';
import { cn } from '../../utils/cn.js';

export interface FormErrorItem {
  /** The field's `name`. */
  name: string;
  /** The field's DOM id, or its name when it has none (ErrorSummary link target). */
  id: string;
  message: string;
}

export type FormErrors = Record<string, string>;

export interface FormContextValue {
  errors: FormErrors;
  submitting: boolean;
}

const FormContext = React.createContext<FormContextValue | null>(null);

/** Errors and submitting state of the closest `Form`, or null outside one. */
export function useForm(): FormContextValue | null {
  return React.useContext(FormContext);
}

type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const isControl = (el: Element): el is Control =>
  'validity' in el && 'name' in el && Boolean((el as Control).name);

export interface FormProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'onInvalid'> {
  /**
   * Extra checks after the browser's own (`required`, `type`, `pattern`, `min`…).
   * Return `{ fieldName: message }`; empty values mean valid. Plug zod or any
   * schema library in here.
   */
  validate?: (data: FormData) => Record<string, string | null | undefined | false> | void;
  /** Called with the form data only when every field is valid. A promise sets `submitting`. */
  onSubmit?: (data: FormData, event: React.FormEvent<HTMLFormElement>) => void | Promise<unknown>;
  /** Called after a failed submit, in field order; pass the list to ErrorSummary. */
  onInvalidSubmit?: (errors: FormErrorItem[]) => void;
}

/**
 * A `<form>` that validates on submit with the browser's constraint validation
 * plus your `validate`, shows the messages through FormField, and focuses the
 * first invalid field. A field's error clears as soon as it is edited.
 */
export const Form = React.forwardRef<HTMLFormElement, FormProps>(function Form(
  { validate, onSubmit, onInvalidSubmit, onInput, className, children, ...props },
  ref,
) {
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const controls = Array.from(form.elements).filter(isControl).filter((el) => !el.disabled);

    const next: FormErrors = {};
    for (const el of controls) {
      if (!el.validity.valid && !next[el.name]) next[el.name] = el.validationMessage;
    }
    for (const [name, message] of Object.entries(validate?.(data) ?? {})) {
      if (message && !next[name]) next[name] = message;
    }
    setErrors(next);

    if (Object.keys(next).length) {
      // Field order, not object order, so the summary reads top to bottom.
      const seen = new Set<string>();
      const items: FormErrorItem[] = [];
      for (const el of controls) {
        if (next[el.name] && !seen.has(el.name)) {
          seen.add(el.name);
          items.push({ name: el.name, id: el.id || el.name, message: next[el.name]! });
        }
      }
      for (const name of Object.keys(next)) {
        if (!seen.has(name)) items.push({ name, id: name, message: next[name]! });
      }
      onInvalidSubmit?.(items);
      // ponytail: focuses the native control; a custom control whose input is hidden
      // (Radix Select/Checkbox) gets no focus. Pass onInvalidSubmit + ErrorSummary then.
      const first = controls.find((el) => next[el.name] && el.type !== 'hidden');
      first?.focus();
      return;
    }

    const result = onSubmit?.(data, event);
    if (result instanceof Promise) {
      setSubmitting(true);
      try {
        await result;
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleInput = (event: React.InputEvent<HTMLFormElement>) => {
    onInput?.(event);
    const name = (event.target as Partial<Control>).name;
    if (name && errors[name]) {
      setErrors(({ [name]: _cleared, ...rest }) => rest);
    }
  };

  const value = React.useMemo(() => ({ errors, submitting }), [errors, submitting]);

  return (
    <FormContext.Provider value={value}>
      <form
        ref={ref}
        noValidate
        aria-busy={submitting || undefined}
        className={cn('flex flex-col gap-5', className)}
        onSubmit={handleSubmit}
        onInput={handleInput}
        {...props}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
});
