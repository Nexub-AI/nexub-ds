import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';

export const textareaVariants = cva(
  [
    'w-full rounded-md border bg-[var(--color-bg-default)] text-[var(--color-text-primary)]',
    'placeholder:text-[var(--color-text-placeholder)]',
    'border-[var(--color-border-default)] transition-colors',
    'focus-visible:outline-none focus-visible:border-[var(--color-ring-default)] focus-visible:ring-2 focus-visible:ring-[var(--color-ring-default)]',
    'disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed',
  ],
  {
    variants: {
      size: {
        sm: 'px-3 py-1.5 text-sm min-h-[64px]',
        md: 'px-3 py-2 text-sm min-h-[80px]',
        lg: 'px-4 py-2.5 text-base min-h-[96px]',
      },
      invalid: {
        true: 'border-[var(--color-danger-500)] focus-visible:ring-[var(--color-danger-500)]',
      },
      resize: {
        none: 'resize-none',
        vertical: 'resize-y',
        horizontal: 'resize-x',
        both: 'resize',
      },
    },
    defaultVariants: {
      size: 'md',
      resize: 'vertical',
    },
  },
);

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    VariantProps<typeof textareaVariants> {
  invalid?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  autoGrow?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      size,
      invalid,
      resize = 'vertical',
      autoGrow = false,
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = React.useState<string>(
      (defaultValue as string | undefined) ?? '',
    );
    const controlled = value !== undefined;
    const resolvedValue = controlled ? String(value) : internalValue;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (!controlled) setInternalValue(e.target.value);
      onChange?.(e);
    };

    const sharedClass = cn(
      textareaVariants({ size, invalid, resize: autoGrow ? 'none' : resize }),
      className,
    );

    if (autoGrow) {
      return (
        /*
         * CSS grid trick: the grid area is shared between the mirror span
         * and the textarea, so the container grows to fit the larger of the two.
         * The textarea is stretched to fill the container height automatically.
         */
        <div
          className="grid w-full"
          style={{ gridTemplateAreas: '"grow"' }}
        >
          <span
            aria-hidden="true"
            className={cn(sharedClass, 'invisible whitespace-pre-wrap break-words pointer-events-none')}
            style={{ gridArea: 'grow' }}
          >
            {resolvedValue + '\u200b'}
          </span>
          <textarea
            ref={ref}
            value={value}
            defaultValue={!controlled ? defaultValue : undefined}
            onChange={handleChange}
            className={cn(sharedClass, 'overflow-hidden')}
            aria-invalid={invalid ?? undefined}
            style={{ gridArea: 'grow' }}
            {...props}
          />
        </div>
      );
    }

    return (
      <textarea
        ref={ref}
        value={value}
        defaultValue={!controlled ? defaultValue : undefined}
        onChange={handleChange}
        className={sharedClass}
        aria-invalid={invalid ?? undefined}
        {...props}
      />
    );
  },
);

Textarea.displayName = 'Textarea';
