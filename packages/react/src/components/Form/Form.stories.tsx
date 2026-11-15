import type { Meta, StoryObj } from '@storybook/react';
import { Form } from './Form.js';
import { FormField } from '../FormField/FormField.js';
import { Fieldset } from '../Fieldset/Fieldset.js';
import { Input } from '../Input/Input.js';
import { Button } from '../Button/Button.js';

const meta: Meta = {
  title: 'Components/Form',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Form aria-label="Workspace" className="max-w-sm" onSubmit={() => {}}>
      <Fieldset legend="Workspace" description="Visible to everyone you invite.">
        <FormField.Root name="workspace" required>
          <FormField.Label>Name</FormField.Label>
          <FormField.Control>
            <Input />
          </FormField.Control>
          <FormField.Error />
        </FormField.Root>
        <FormField.Root name="email">
          <FormField.Label>Billing email</FormField.Label>
          <FormField.Control>
            <Input type="email" />
          </FormField.Control>
          <FormField.Error />
        </FormField.Root>
      </Fieldset>
      <Button type="submit" className="self-start">Create workspace</Button>
    </Form>
  ),
};
