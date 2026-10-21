import * as React from 'react';
import { cn } from '@nexub/react';

export interface ErrorSummaryItem {
  /** The field's DOM id (the link target). */
  id: string;
  message: string;
}

export interface ErrorSummaryProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  errors: ErrorSummaryItem[];
  /** @default 'There is a problem' */
  title?: React.ReactNode;
  /** Called after a link moves focus to its field. */
  onFocusField?: (id: string) => void;
}

/**
 * Lists a form's errors after a failed submit (GOV.UK pattern). It takes focus
 * whenever it receives a new `errors` array with entries, so pass a new array per
 * submit (not per keystroke). Each link focuses its field.
 */
export const ErrorSummary = React.forwardRef<HTMLDivElement, ErrorSummaryProps>(
  ({ errors, title = 'There is a problem', onFocusField, className, ...props }, forwardedRef) => {
    const ref = React.useRef<HTMLDivElement | null>(null);
    const headingId = React.useId();

    React.useEffect(() => {
      if (errors.length) ref.current?.focus();
    }, [errors]);

    if (!errors.length) return null;

    return (
      <div
        ref={(node) => {
          ref.current = node;
          if (typeof forwardedRef === 'function') forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        role="alert"
        aria-labelledby={headingId}
        tabIndex={-1}
        className={cn(
          'w-full rounded-shape-container border-s-4 border-s-[var(--color-error)] p-4',
          'bg-[var(--color-error-container)] text-[var(--color-on-error-container)]',
          className,
        )}
        {...props}
      >
        <h2 id={headingId} className="text-title-md font-semibold">
          {title}
        </h2>
        <ul className="mt-2 flex flex-col gap-1 text-body-md">
          {errors.map((error) => (
            <li key={error.id}>
              <a
                href={`#${error.id}`}
                className="underline underline-offset-[0.2em]"
                onClick={(e) => {
                  const field = document.getElementById(error.id);
                  if (!field) return;
                  e.preventDefault();
                  field.scrollIntoView({ block: 'center' });
                  field.focus({ preventScroll: true });
                  onFocusField?.(error.id);
                }}
              >
                {error.message}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  },
);
ErrorSummary.displayName = 'ErrorSummary';

export type FormErrorMap = Record<string, string | null | undefined | false>;

/**
 * Turns `{ fieldId: message }` into the ErrorSummary list plus the ARIA wiring
 * for each field and its inline message (`${id}-error`, the same id
 * FormField.Error uses).
 */
export function useFormErrors(map: FormErrorMap) {
  const errors = React.useMemo<ErrorSummaryItem[]>(
    () =>
      Object.entries(map).flatMap(([id, message]) => (message ? [{ id, message }] : [])),
    [map],
  );
  return {
    errors,
    fieldProps: (id: string) => ({
      id,
      'aria-invalid': map[id] ? (true as const) : undefined,
      'aria-describedby': map[id] ? `${id}-error` : undefined,
    }),
    errorProps: (id: string) => ({ id: `${id}-error` }),
  };
}
