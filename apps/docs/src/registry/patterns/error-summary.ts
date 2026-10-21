import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'error-summary',
    title: 'Error Summary',
    description: 'Lists a form’s errors after a failed submit, with a link to each field. useFormErrors wires the fields to their messages.',
    category: 'Forms',
    package: '@nexub/patterns',
    status: 'beta',
    addedIn: '1.7.0',
    related: ['form-field', 'input', 'alert'],
  },
  props: [
    { name: 'errors', type: '{ id: string; message: string }[]', required: true, description: 'One entry per invalid field; `id` is the field’s DOM id. Renders nothing when empty.' },
    { name: 'title', type: 'ReactNode', default: "'There is a problem'", required: false, description: 'Heading; it also labels the summary.' },
    { name: 'onFocusField', type: '(id: string) => void', required: false, description: 'Called after a link moves focus to its field.' },
    { name: 'useFormErrors(map)', type: 'Record<string, string | null | undefined | false>', required: true, description: 'Takes `{ fieldId: message }`. Falsy messages are skipped.' },
    { name: '→ errors', type: 'ErrorSummaryItem[]', required: false, description: 'The list for `ErrorSummary`. Stable for the same map object.' },
    { name: '→ fieldProps(id)', type: 'function', required: false, description: 'Spread on the input: `id`, plus `aria-invalid` and `aria-describedby="${id}-error"` when it has an error.' },
    { name: '→ errorProps(id)', type: 'function', required: false, description: 'Spread on the inline message: `id="${id}-error"`, the same id FormField.Error uses.' },
  ],
  examples: [
    {
      title: 'Validate on submit',
      description: 'Submit empty to see the summary. A new map per submit moves focus to the summary; links jump to each field.',
      code: `function SignUp() {
  const [submitted, setSubmitted] = React.useState<FormErrorMap>({});
  const { errors, fieldProps, errorProps } = useFormErrors(submitted);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setSubmitted({
      name: String(data.get('name')).trim() ? undefined : 'Enter your name',
      email: /^\\S+@\\S+\\.\\S+$/.test(String(data.get('email'))) ? undefined : 'Enter an email address, like name@example.com',
    });
  }

  return (
    <form noValidate onSubmit={submit}>
      <ErrorSummary errors={errors} />
      <Label htmlFor="name">Name</Label>
      <Input name="name" {...fieldProps('name')} invalid={Boolean(submitted.name)} />
      {submitted.name && <FormError {...errorProps('name')}>{submitted.name}</FormError>}
      <Label htmlFor="email">Email</Label>
      <Input name="email" type="email" {...fieldProps('email')} invalid={Boolean(submitted.email)} />
      {submitted.email && <FormError {...errorProps('email')}>{submitted.email}</FormError>}
      <Button type="submit">Create account</Button>
    </form>
  );
}`,
    },
  ],
  usage: {
    whenToUse: [
      'Forms validated on submit, especially long ones where some errors are off screen.',
      'Alongside inline messages, never instead of them.',
    ],
    whenNotToUse: [
      'Live validation while typing: pass a new array per submit, not per keystroke, or the summary steals focus.',
      'A single field: the inline message is enough.',
    ],
  },
  a11y: {
    roles: ['alert'],
    focus: [
      'Takes focus whenever it receives a new, non-empty `errors` array, so screen readers read it and keyboard users start from it.',
      'Each link scrolls its field into view and focuses it.',
    ],
    screenReader: [
      'An `alert` labelled by its heading. Fields get `aria-invalid` and `aria-describedby` pointing at their inline message.',
    ],
  },
};

export default entry;
