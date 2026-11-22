import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'number-input-element',
    title: 'Number Input Element',
    description: '`<nx-number-input>`: the NumberInput rules as a form-associated web component, for server-rendered pages without React. A plain `<form>` posts its value.',
    category: 'Web Components',
    package: '@nexub/elements',
    element: 'nx-number-input',
    status: 'alpha',
    addedIn: '11.6.0',
    related: ['number-input', 'date-picker-element', 'form'],
    webOnly: 'It is a web component for HTML pages; native apps use NumberInput’s twin in `@nexub/react-native`, `Stepper`.',
  },
  usage: {
    whenToUse: [
      'A number on a page with no React: server-rendered HTML, a plain `<form method="post">`, a CMS template.',
      'Where `<input type="number">` would do, but it must look like the rest of Nexub, be empty without being 0, and clamp on blur as the React field does.',
    ],
    whenNotToUse: [
      'In a React app: use NumberInput from `@nexub/react` (steppers, `nullable`, NexubProvider strings).',
      'Phone numbers, codes and ids: use a text input. They are not quantities.',
      'Money: use MoneyInput.',
    ],
  },
  props: [
    { name: 'name', type: 'string', description: 'The form field name: a `<form>` posts the value under it.' },
    { name: 'value', type: 'string', description: 'The starting value, and what `form.reset()` goes back to. Empty for none. The `value` property is the current value. In React, server rendering writes `value` as this attribute; in a client-only render pass `defaultValue`, which sets it.' },
    { name: 'min', type: 'string', description: 'Smallest value, applied on blur, Enter and steps (never while typing, so 30 can be typed with a minimum of 15). Below it, the field is invalid (`rangeUnderflow`).' },
    { name: 'max', type: 'string', description: 'Largest value, applied the same way (`rangeOverflow`).' },
    { name: 'step', type: 'string', description: 'Arrow-key increment: a positive number (default 1), or `any` for any decimal (keys then move by 1).' },
    { name: 'required', type: 'boolean', description: 'Empty is invalid (`valueMissing`); the form won’t submit and shows the browser’s message.' },
    { name: 'disabled', type: 'boolean', description: 'Not editable, not posted. A disabled `<fieldset>` around it does the same.' },
    { name: 'readonly', type: 'boolean', description: 'Posted but not editable; arrow keys do nothing.' },
    { name: 'placeholder', type: 'string', description: 'Hint shown while empty.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", description: '`sm`, `md` (default) or `lg`: the control heights of `@nexub/react`.' },
    { name: 'aria-label', type: 'string', description: 'Names the field when it has no `<label for>`.' },
    { name: 'input event', type: 'Event', description: 'On every edit and step that changes the value. Read `event.target.value` (a string, `\'\'` when cleared).' },
    { name: 'change event', type: 'Event', description: 'When the value is committed: blur, Enter or a step.' },
  ],
  examples: [
    { title: 'Default', description: 'Labelled with `<label for>`, limits applied on blur. Rendered here in React 19, which passes the attributes and listens to the element’s events.' },
    { title: 'In a form', description: 'Form-associated: `FormData` has the value, `required` and `min` block the submit, and Reset goes back to the `value` attribute.' },
  ],
  a11y: {
    roles: ['spinbutton (the inner `<input>`), with `aria-valuenow`, `aria-valuemin` and `aria-valuemax`'],
    keyboard: [
      { key: 'ArrowUp / ArrowDown', description: 'One step up or down, inside `min` and `max`. Fires `input` and `change`.' },
      { key: 'PageUp / PageDown', description: 'Ten steps.' },
      { key: 'Home / End', description: 'To `min` or `max`, when set.' },
      { key: 'Enter', description: 'Applies the limits and submits the form, as a native input does.' },
    ],
    focus: [
      'One tab stop: focus is delegated to the inner input, so `<label for>` clicks and `element.focus()` land in the field.',
      'Focus ring from the tokens; forced colours draw it in Highlight.',
    ],
    screenReader: [
      'The inner input is named from the host’s `<label for>` (or a wrapping `<label>`, or `aria-label`): a label can’t reach into a shadow root, so the element copies its text.',
      '`aria-required` and `aria-invalid` follow the field; the invalid state shows only after an edit or a failed submit.',
      'Validation messages come from a native input where the browser has one, so they are in the browser’s language.',
    ],
    notes: [
      'Shadow DOM: page CSS can’t break the inside. Style it with the theme variables, or `::part(field)` and `::part(input)`.',
      'Themed by the same CSS custom properties as `@nexub/react`: load `@nexub/themes` and `data-theme` / `data-product` apply.',
    ],
  },
};

export default entry;
