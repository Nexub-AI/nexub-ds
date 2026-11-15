'use client';

import * as React from 'react';
import { Button, Form, FormField, Input, Stepper } from '@nexub/react';

const steps = [
  { id: 'account', label: 'Account' },
  { id: 'workspace', label: 'Workspace' },
  { id: 'done', label: 'Done' },
];

export default function Example() {
  const [current, setCurrent] = React.useState(0);
  return (
    <div className="flex w-full max-w-lg flex-col gap-6">
      <Stepper aria-label="Sign-up steps" steps={steps} current={current} onStepChange={setCurrent} />
      {current < 2 ? (
        <Form key={current} onSubmit={() => setCurrent(current + 1)}>
          <FormField.Root name={current === 0 ? 'email' : 'workspace'} required>
            <FormField.Label>{current === 0 ? 'Work email' : 'Workspace name'}</FormField.Label>
            <FormField.Control>
              <Input type={current === 0 ? 'email' : 'text'} />
            </FormField.Control>
            <FormField.Error />
          </FormField.Root>
          <Button type="submit" className="self-start">Continue</Button>
        </Form>
      ) : (
        <p className="text-body-md">All set.</p>
      )}
    </div>
  );
}
