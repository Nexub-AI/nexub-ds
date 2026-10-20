import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';
import { field, fieldFocusVisible, fieldInvalid } from '../../utils/control.js';

export const textareaVariants = cva(
  [
    'w-full',
    field,
    'placeholder:text-[var(--color-text-placeholder)]',
    fieldFocusVisible,
    'disabled:cursor-not-allowed disabled:border-[var(--color-outline-variant)] disabled:bg-[var(--color-surface-container-low)] disabled:text-[var(--color-text-disabled)]',
  ],
  {
    variants: {
      size: {
        sm: 'px-3 py-1.5 text-body-sm min-h-[64px]',
        md: 'px-3.5 py-2 text-body-md min-h-[80px]',
        lg: 'px-4 py-2.5 text-body-md min-h-[96px]',
      },
      invalid: {
        true: fieldInvalid,
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
        <div className="grid w-full">
          <span
            aria-hidden="true"
            className={cn(sharedClass, 'col-start-1 row-start-1 invisible whitespace-pre-wrap break-words pointer-events-none')}
          >
            {resolvedValue + '\u200b'}
          </span>
          <textarea
            ref={ref}
            value={value}
            defaultValue={!controlled ? defaultValue : undefined}
            onChange={handleChange}
            className={cn(sharedClass, 'col-start-1 row-start-1 overflow-hidden')}
            aria-invalid={invalid ?? undefined}
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
