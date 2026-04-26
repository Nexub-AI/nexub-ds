import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { Label } from '../Label/Label.js';
import { HelperText } from '../HelperText/HelperText.js';
import { FormError } from '../FormError/FormError.js';

export interface FormFieldContextValue {
  id: string;
  name?: string;
  invalid?: boolean;
  required?: boolean;
  disabled?: boolean;
  descriptionId: string;
  errorId: string;
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null);

function useFormField(): FormFieldContextValue {
  const ctx = React.useContext(FormFieldContext);
  if (!ctx) {
    throw new Error('FormField parts must be used inside <FormField.Root>');
  }
  return ctx;
}

export interface FormFieldRootProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  name?: string;
  invalid?: boolean;
  required?: boolean;
  disabled?: boolean;
}

function Root({
  id: idProp,
  name,
  invalid,
  required,
  disabled,
  className,
  children,
  ...props
}: FormFieldRootProps) {
  const generatedId = React.useId();
  const id = idProp ?? generatedId;

  const value: FormFieldContextValue = React.useMemo(
    () => ({
      id,
      name,
      invalid,
      required,
      disabled,
      descriptionId: `${id}-description`,
      errorId: `${id}-error`,
    }),
    [id, name, invalid, required, disabled],
  );

  return (
    <FormFieldContext.Provider value={value}>
      <div className={cn('flex flex-col gap-1.5', className)} {...props}>
        {children}
      </div>
    </FormFieldContext.Provider>
  );
}

Root.displayName = 'FormField.Root';

function FieldLabel({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Label>) {
  const { id, required, disabled } = useFormField();
  return (
    <Label
      htmlFor={id}
      required={required}
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </Label>
  );
}

FieldLabel.displayName = 'FormField.Label';

function Control({ children }: { children: React.ReactElement<Record<string, unknown>> }) {
  const { id, name, invalid, required, disabled, descriptionId, errorId } =
    useFormField();

  const describedBy = [descriptionId, invalid ? errorId : null]
    .filter(Boolean)
    .join(' ') || undefined;

  return React.cloneElement(children, {
    id,
    name: children.props['name'] ?? name,
    invalid: children.props['invalid'] ?? invalid,
    required: children.props['required'] ?? required,
    disabled: children.props['disabled'] ?? disabled,
    'aria-describedby': describedBy,
    'aria-invalid': invalid ?? undefined,
    'aria-required': required ?? undefined,
  });
}

Control.displayName = 'FormField.Control';

function Description({
  className,
  children,
  ...props
}: React.ComponentProps<typeof HelperText>) {
  const { descriptionId } = useFormField();
  return (
    <HelperText id={descriptionId} className={className} {...props}>
      {children}
    </HelperText>
  );
}

Description.displayName = 'FormField.Description';

function FieldError({
  className,
  children,
  ...props
}: React.ComponentProps<typeof FormError>) {
  const { errorId, invalid } = useFormField();
  if (!invalid) return null;
  return (
    <FormError id={errorId} className={className} {...props}>
      {children}
    </FormError>
  );
}

FieldError.displayName = 'FormField.Error';

export const FormField = { Root, Label: FieldLabel, Control, Description, Error: FieldError };
