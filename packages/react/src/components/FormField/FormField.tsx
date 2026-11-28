'use client';

import * as React from 'react';
import { Check, Sparkles, X } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { Label } from '../Label/Label.js';
import { HelperText } from '../HelperText/HelperText.js';
import { FormError } from '../FormError/FormError.js';
import { useForm } from '../Form/Form.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';

export interface FormFieldContextValue {
  id: string;
  name?: string;
  invalid?: boolean;
  required?: boolean;
  disabled?: boolean;
  descriptionId: string;
  errorId: string;
  /** The message from the enclosing Form for this field's `name`. */
  formError?: string;
  /** 12.4: an agent is filling the control. */
  streaming?: boolean;
  /** 12.4: the value came from an agent and the person hasn't edited, accepted or cleared it yet. */
  suggested?: boolean;
  /** 12.4: id of the "Suggested" mark, read as part of the control's description. */
  suggestionId: string;
  /** 12.4: hides the "Suggested" mark (the person edited, accepted or cleared the value). */
  settleSuggestion: () => void;
  onAcceptSuggestion?: () => void;
  onClearSuggestion?: () => void;
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
  /**
   * 12.4: an agent is filling this field. Sets `aria-busy` and a calm shimmer on the control;
   * pass the value as it arrives. The control stays editable.
   */
  streaming?: boolean;
  /**
   * 12.4: the value came from an agent. Shows a "Suggested" mark beside the label, read as part of
   * the control's description. Editing the value clears the mark; so do accept and clear.
   */
  generated?: boolean;
  /** 12.4: with `generated`, shows an accept button beside the mark. */
  onAcceptSuggestion?: () => void;
  /** 12.4: with `generated`, shows a clear button beside the mark. Clear the value here. */
  onClearSuggestion?: () => void;
}

const Root = React.forwardRef<HTMLDivElement, FormFieldRootProps>(function Root(
  {
    id: idProp,
    name,
    invalid: invalidProp,
    required,
    disabled,
    streaming,
    generated,
    onAcceptSuggestion,
    onClearSuggestion,
    className,
    children,
    ...props
  },
  ref,
) {
  const generatedId = React.useId();
  const id = idProp ?? generatedId;
  const form = useForm();
  const formError = name ? form?.errors[name] : undefined;
  const invalid = invalidProp ?? (formError ? true : undefined);
  // The mark settles when the person acts on the value; a new suggestion (generated turning on again) shows it again.
  const [settled, setSettled] = React.useState(false);
  const [prevGenerated, setPrevGenerated] = React.useState(generated);
  if (prevGenerated !== generated) {
    setPrevGenerated(generated);
    if (generated) setSettled(false);
  }
  const suggested = !!generated && !settled;
  const settleSuggestion = React.useCallback(() => setSettled(true), []);

  const value: FormFieldContextValue = React.useMemo(
    () => ({
      id,
      name,
      invalid,
      required,
      disabled,
      descriptionId: `${id}-description`,
      errorId: `${id}-error`,
      formError,
      streaming,
      suggested,
      suggestionId: `${id}-suggestion`,
      settleSuggestion,
      onAcceptSuggestion,
      onClearSuggestion,
    }),
    [
      id,
      name,
      invalid,
      required,
      disabled,
      formError,
      streaming,
      suggested,
      settleSuggestion,
      onAcceptSuggestion,
      onClearSuggestion,
    ],
  );

  return (
    <FormFieldContext.Provider value={value}>
      <div ref={ref} className={cn('flex flex-col gap-1.5', className)} {...props}>
        {children}
      </div>
    </FormFieldContext.Provider>
  );
});

Root.displayName = 'FormField.Root';

function FieldLabel({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Label>) {
  const { id, required, disabled, suggested } = useFormField();
  const label = (
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
  if (!suggested) return label;
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
      {label}
      <Suggestion />
    </div>
  );
}

// A small square ghost button on the control ladder (IconButton's look, without its weight).
// `pressable` from utils/control, spelled out so FormField doesn't pull that module in.
const suggestionButton =
  'nx-state-layer nx-press nx-hit rounded-shape-control select-none relative inline-flex h-control-xs w-control-xs items-center justify-center bg-transparent text-[var(--color-on-surface-variant)]';

/** 12.4: the "Suggested" mark and its optional accept / clear buttons. */
function Suggestion() {
  const messages = useNexubMessages();
  const { id, suggestionId, settleSuggestion, onAcceptSuggestion, onClearSuggestion } =
    useFormField();
  // The buttons go with the mark, so focus moves on to the control.
  const settle = (then: () => void) => () => {
    settleSuggestion();
    then();
    document.getElementById(id)?.focus();
  };
  return (
    <span className="inline-flex items-center gap-1" data-suggestion="">
      <span
        id={suggestionId}
        className="inline-flex items-center gap-1 text-label-sm text-[var(--color-on-surface-variant)]"
      >
        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
        {messages.suggested}
      </span>
      {onAcceptSuggestion && (
        <button
          type="button"
          aria-label={messages.acceptSuggestion}
          title={messages.acceptSuggestion}
          className={suggestionButton}
          onClick={settle(onAcceptSuggestion)}
        >
          <Check className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
      {onClearSuggestion && (
        <button
          type="button"
          aria-label={messages.clearSuggestion}
          title={messages.clearSuggestion}
          className={suggestionButton}
          onClick={settle(onClearSuggestion)}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </span>
  );
}


FieldLabel.displayName = 'FormField.Label';

function Control({ children }: { children: React.ReactElement<Record<string, unknown>> }) {
  const {
    id,
    name,
    invalid,
    required,
    disabled,
    descriptionId,
    errorId,
    streaming,
    suggested,
    suggestionId,
    settleSuggestion,
  } = useFormField();

  const describedBy = [descriptionId, invalid ? errorId : null, suggested ? suggestionId : null]
    .filter(Boolean)
    .join(' ') || undefined;

  // 12.4: only touch the child's handlers and class while the field is streaming or suggested.
  const extra: Record<string, unknown> = {};
  if (streaming) {
    extra['aria-busy'] = true;
    extra['data-streaming'] = '';
    extra['className'] = cn(children.props['className'] as string | undefined, 'nx-skeleton-shimmer');
  }
  if (suggested) {
    // An edit by the person settles the mark; the agent's own updates arrive through `value`.
    for (const key of ['onChange', 'onValueChange'] as const) {
      const own = children.props[key] as ((...args: unknown[]) => void) | undefined;
      if (key === 'onChange' || own) {
        extra[key] = (...args: unknown[]) => {
          settleSuggestion();
          own?.(...args);
        };
      }
    }
  }

  return React.cloneElement(children, {
    ...extra,
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
  const { errorId, invalid, formError } = useFormField();
  if (!invalid) return null;
  return (
    <FormError id={errorId} className={className} {...props}>
      {children ?? formError}
    </FormError>
  );
}

FieldError.displayName = 'FormField.Error';

export const FormField = { Root, Label: FieldLabel, Control, Description, Error: FieldError };
