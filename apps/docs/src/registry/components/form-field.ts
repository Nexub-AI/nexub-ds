import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'form-field',
    title: 'Form Field',
    description: 'Wraps Label, Input, HelperText and FormError into a single accessible group.',
    category: 'Form & Input',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'name', type: 'string', required: true, description: 'Name attribute forwarded to the underlying input.' },
    { name: 'id', type: 'string', required: false, description: 'Explicit id for the input; defaults to the name value.' },
    { name: 'required', type: 'boolean', required: false, description: 'Marks the field as required and renders a required indicator on the label.' },
    { name: 'streaming', type: 'boolean', default: 'false', required: false, description: 'An agent is filling the field (12.4): `aria-busy` and a calm shimmer on the control. Pass the value as text arrives; the control stays editable.' },
    { name: 'generated', type: 'boolean', default: 'false', required: false, description: 'The value came from an agent (12.4): a "Suggested" mark beside the label, read as part of the control\'s description. Editing the value clears it; turning `generated` off and on shows it again.' },
    { name: 'onAcceptSuggestion', type: '() => void', required: false, description: 'With `generated`: an accept button beside the mark. Clears the mark and keeps the value.' },
    { name: 'onClearSuggestion', type: '() => void', required: false, description: 'With `generated`: a clear button beside the mark. Clear the value here; the mark goes too.' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'Agent states',
      description: '`streaming` while an agent types into the field, then `generated` with accept and clear. The person can edit at any time; editing drops the "Suggested" mark. Strings come from `suggested`, `acceptSuggestion` and `clearSuggestion` in messages.',
    },
  ],
};

export default entry;
