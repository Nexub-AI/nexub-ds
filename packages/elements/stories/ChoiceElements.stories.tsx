import type { Meta, StoryObj } from '@storybook/react';
import { Field, lang, stack, validateOnMount } from './shared';

/** 11.9: `<nx-select>`, `<nx-combobox>` and `<nx-phone-input>` from `@nexub/elements`, for pages without React. */
const meta: Meta = {
  title: 'Components/ChoiceElements',
  parameters: { layout: 'padded' },
  decorators: [lang],
};
export default meta;
type Story = StoryObj;

export const Select: Story = {
  render: () => (
    <div style={stack}>
      <Field id="plan" label="Plan">
        <nx-select id="plan" name="plan" defaultValue="team">
          <option value="free">Free</option>
          <option value="team">Team</option>
          <option value="business">Business</option>
        </nx-select>
      </Field>
    </div>
  ),
};

export const Combobox: Story = {
  render: () => (
    <div style={stack}>
      <Field id="city" label="City">
        <nx-combobox id="city" name="city" placeholder="Search cities">
          <option value="sg">Singapore</option>
          <option value="kl">Kuala Lumpur</option>
          <option value="bkk">Bangkok</option>
          <option value="jkt">Jakarta</option>
        </nx-combobox>
      </Field>
    </div>
  ),
};

export const PhoneInput: Story = {
  name: 'Phone input',
  render: () => (
    <div style={stack}>
      <Field id="phone" label="Mobile number">
        <nx-phone-input id="phone" name="phone" default-country="SG" defaultValue="+6591234567" />
      </Field>
    </div>
  ),
};

/** Required and empty after a failed submit: each field shows its invalid state. */
export const Required: Story = {
  render: () => (
    <form style={stack}>
      <Field id="req-plan" label="Plan">
        <nx-select ref={validateOnMount} id="req-plan" name="plan" required>
          <option value="free">Free</option>
          <option value="team">Team</option>
        </nx-select>
      </Field>
      <Field id="req-city" label="City">
        <nx-combobox ref={validateOnMount} id="req-city" name="city" required>
          <option value="sg">Singapore</option>
        </nx-combobox>
      </Field>
      <Field id="req-phone" label="Mobile number">
        <nx-phone-input ref={validateOnMount} id="req-phone" name="phone" default-country="SG" required />
      </Field>
    </form>
  ),
};
