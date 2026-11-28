# Form Field

Wraps Label, Input, HelperText and FormError into a single accessible group.

- Package: `@nexub/react` · Category: Form & Input · Status: stable
- Import: `import { FormField } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/form-field

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` (required) | `string` |  | Name attribute forwarded to the underlying input. |
| `id` | `string` |  | Explicit id for the input; defaults to the name value. |
| `required` | `boolean` |  | Marks the field as required and renders a required indicator on the label. |
| `streaming` | `boolean` | `false` | An agent is filling the field (12.4): `aria-busy` and a calm shimmer on the control. Pass the value as text arrives; the control stays editable. |
| `generated` | `boolean` | `false` | The value came from an agent (12.4): a "Suggested" mark beside the label, read as part of the control's description. Editing the value clears it; turning `generated` off and on shows it again. |
| `onAcceptSuggestion` | `() => void` |  | With `generated`: an accept button beside the mark. Clears the mark and keeps the value. |
| `onClearSuggestion` | `() => void` |  | With `generated`: a clear button beside the mark. Clear the value here; the mark goes too. |

## Example: Default

```tsx
import { Label, Input, HelperText } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-col gap-1 items-start w-70">
      <Label htmlFor="field-name" required>Full name</Label>
      <Input id="field-name" placeholder="Jane Smith" />
      <HelperText>Enter your legal name.</HelperText>
    </div>
  );
}
```

## Example: Agent states

`streaming` while an agent types into the field, then `generated` with accept and clear. The person can edit at any time; editing drops the "Suggested" mark. Strings come from `suggested`, `acceptSuggestion` and `clearSuggestion` in messages.

```tsx
import * as React from 'react';
import { Button, FormField, Input } from '@nexub/react';

const draft = 'Refund approved for order 1042';

export default function Example() {
  const [value, setValue] = React.useState('');
  const [streaming, setStreaming] = React.useState(false);
  const [generated, setGenerated] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setInterval>>(undefined);
  React.useEffect(() => () => clearInterval(timer.current), []);

  // Stand-in for an agent typing the value a few characters at a time.
  const fill = () => {
    clearInterval(timer.current);
    setGenerated(false);
    setStreaming(true);
    let n = 0;
    timer.current = setInterval(() => {
      n += 3;
      setValue(draft.slice(0, n));
      if (n >= draft.length) {
        clearInterval(timer.current);
        setStreaming(false);
        setGenerated(true);
      }
    }, 80);
  };

  return (
    <div className="flex w-80 flex-col items-start gap-4">
      <FormField.Root
        id="agent-summary"
        streaming={streaming}
        generated={generated}
        onAcceptSuggestion={() => setGenerated(false)}
        onClearSuggestion={() => {
          setValue('');
          setGenerated(false);
        }}
        className="w-full"
      >
        <FormField.Label>Summary</FormField.Label>
        <FormField.Control>
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
        </FormField.Control>
        <FormField.Description>Shown to the customer.</FormField.Description>
      </FormField.Root>
      <Button variant="outlined" size="sm" onClick={fill} disabled={streaming}>
        Draft with AI
      </Button>
    </div>
  );
}
```
