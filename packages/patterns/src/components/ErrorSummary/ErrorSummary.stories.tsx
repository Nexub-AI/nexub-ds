import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Button, FormError, FormField, Input, Label } from '@nexub/react';
import { ErrorSummary, useFormErrors, type FormErrorMap } from './ErrorSummary.js';

const meta: Meta<typeof ErrorSummary> = {
  title: 'Patterns/ErrorSummary',
  component: ErrorSummary,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

type Values = { name: string; email: string; password: string };

function validate(v: Values): FormErrorMap {
  return {
    name: v.name.trim() ? undefined : 'Enter your name',
    email: /^\S+@\S+\.\S+$/.test(v.email) ? undefined : 'Enter an email address, like name@example.com',
    password: v.password.length >= 8 ? undefined : 'Password must be 8 characters or more',
  };
}

/**
 * Validate on submit (summary + inline messages), then per field on blur/change.
 * The summary keeps the submit-time list until the next submit, so it never
 * steals focus while the user is fixing fields.
 */
export const SignUp: Story = {
  render: () => {
    const Form = () => {
      const [values, setValues] = React.useState<Values>({ name: '', email: '', password: '' });
      const [submitted, setSubmitted] = React.useState(false);
      const [live, setLive] = React.useState<FormErrorMap>({});
      const [summary, setSummary] = React.useState<FormErrorMap>({});
      const { fieldProps, errorProps } = useFormErrors(live);
      const { errors: summaryErrors } = useFormErrors(summary);

      const update = (key: keyof Values) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const next = { ...values, [key]: e.target.value };
        setValues(next);
        if (submitted) setLive((m) => ({ ...m, [key]: validate(next)[key] }));
      };
      const blur = (key: keyof Values) => () => {
        if (submitted) setLive((m) => ({ ...m, [key]: validate(values)[key] }));
      };
      const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const result = validate(values);
        setSubmitted(true);
        setLive(result);
        setSummary(result);
      };

      return (
        <form noValidate onSubmit={submit} className="flex max-w-md flex-col gap-4">
          <ErrorSummary errors={summaryErrors} />

          {/* Bare Input wired by the hook. */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              {...fieldProps('name')}
              invalid={Boolean(live.name)}
              value={values.name}
              onChange={update('name')}
              onBlur={blur('name')}
            />
            {live.name && <FormError {...errorProps('name')}>{live.name}</FormError>}
          </div>

          {/* FormField uses the same `${id}-error` convention. */}
          {(['email', 'password'] as const).map((key) => (
            <FormField.Root key={key} id={key} invalid={Boolean(live[key])}>
              <FormField.Label>{key === 'email' ? 'Email' : 'Password'}</FormField.Label>
              <FormField.Control>
                <Input
                  type={key}
                  value={values[key]}
                  onChange={update(key)}
                  onBlur={blur(key)}
                />
              </FormField.Control>
              <FormField.Error>{live[key]}</FormField.Error>
            </FormField.Root>
          ))}

          <Button type="submit">Create account</Button>
        </form>
      );
    };
    return <Form />;
  },
};
