import * as React from 'react';
import { cn } from '../../utils/cn.js';

export interface FieldsetProps extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
  /** The group's name, read before each field inside it. */
  legend: React.ReactNode;
  description?: React.ReactNode;
}

/**
 * Groups related fields under a heading (`<fieldset>` + `<legend>`). `disabled`
 * disables every control inside it, natively.
 */
export const Fieldset = React.forwardRef<HTMLFieldSetElement, FieldsetProps>(function Fieldset(
  { legend, description, className, children, ...props },
  ref,
) {
  const descriptionId = React.useId();
  return (
    <fieldset
      ref={ref}
      aria-describedby={description ? descriptionId : undefined}
      className={cn('m-0 flex min-w-0 flex-col gap-4 border-0 p-0', className)}
      {...props}
    >
      <legend className="mb-1 p-0 text-title-sm font-semibold text-[var(--color-on-surface)]">
        {legend}
      </legend>
      {description && (
        <p id={descriptionId} className="text-body-sm text-[var(--color-on-surface-muted)]">
          {description}
        </p>
      )}
      {children}
    </fieldset>
  );
});
