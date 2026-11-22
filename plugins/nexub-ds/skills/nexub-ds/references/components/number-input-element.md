# Number Input Element

`<nx-number-input>`: the NumberInput rules as a form-associated web component, for server-rendered pages without React. A plain `<form>` posts its value.

- Package: `@nexub/elements` · Category: Web Components · Status: alpha
- Load: `<script type="module" src="https://cdn.jsdelivr.net/npm/@nexub/elements/dist/define.js"></script>`
- Install: `npm install @nexub/elements`. No build step: the script tag above registers `<nx-number-input>`. With a bundler, `import '@nexub/elements/define';` once does the same.
- Web only: It is a web component for HTML pages; native apps use NumberInput’s twin in `@nexub/react-native`, `Stepper`.
- Docs: https://nexub-ds-docs.pages.dev/components/number-input-element

## When to use

- A number on a page with no React: server-rendered HTML, a plain `<form method="post">`, a CMS template.
- Where `<input type="number">` would do, but it must look like the rest of Nexub, be empty without being 0, and clamp on blur as the React field does.

## When not to use

- In a React app: use NumberInput from `@nexub/react` (steppers, `nullable`, NexubProvider strings).
- Phone numbers, codes and ids: use a text input. They are not quantities.
- Money: use MoneyInput.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` |  | The form field name: a `<form>` posts the value under it. |
| `value` | `string` |  | The starting value, and what `form.reset()` goes back to. Empty for none. The `value` property is the current value. In React, server rendering writes `value` as this attribute; in a client-only render pass `defaultValue`, which sets it. |
| `min` | `string` |  | Smallest value, applied on blur, Enter and steps (never while typing, so 30 can be typed with a minimum of 15). Below it, the field is invalid (`rangeUnderflow`). |
| `max` | `string` |  | Largest value, applied the same way (`rangeOverflow`). |
| `step` | `string` |  | Arrow-key increment: a positive number (default 1), or `any` for any decimal (keys then move by 1). |
| `required` | `boolean` |  | Empty is invalid (`valueMissing`); the form won’t submit and shows the browser’s message. |
| `disabled` | `boolean` |  | Not editable, not posted. A disabled `<fieldset>` around it does the same. |
| `readonly` | `boolean` |  | Posted but not editable; arrow keys do nothing. |
| `placeholder` | `string` |  | Hint shown while empty. |
| `size` | `'sm' \| 'md' \| 'lg'` |  | `sm`, `md` (default) or `lg`: the control heights of `@nexub/react`. |
| `aria-label` | `string` |  | Names the field when it has no `<label for>`. |
| `input event` | `Event` |  | On every edit and step that changes the value. Read `event.target.value` (a string, `''` when cleared). |
| `change event` | `Event` |  | When the value is committed: blur, Enter or a step. |

## Example: Default

Labelled with `<label for>`, limits applied on blur. Rendered here in React 19, which passes the attributes and listens to the element’s events.

```tsx
'use client';

import * as React from 'react';
// Registers <nx-number-input> and <nx-date-picker>. On a page without a bundler, use
// <script type="module" src="…/@nexub/elements/dist/define.js"></script> instead.
import '@nexub/elements/define';

export default function Example() {
  const ref = React.useRef<HTMLElementTagNameMap['nx-number-input']>(null);
  const [value, setValue] = React.useState('4');
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onChange = () => setValue(el.value);
    el.addEventListener('change', onChange);
    return () => el.removeEventListener('change', onChange);
  }, []);

  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <label htmlFor="seats" className="text-label-lg text-on-surface">
        Seats
      </label>
      <nx-number-input ref={ref} id="seats" name="seats" min="1" max="50" step="1" value="4" placeholder="1–50" />
      <p className="text-body-sm text-on-surface-muted">Committed value: {value === '' ? 'empty' : value}</p>
    </div>
  );
}
```

## Example: In a form

Form-associated: `FormData` has the value, `required` and `min` block the submit, and Reset goes back to the `value` attribute.

```tsx
'use client';

import * as React from 'react';
import { Button } from '@nexub/react';
import '@nexub/elements/define';

export default function Example() {
  const [posted, setPosted] = React.useState<string | null>(null);

  return (
    <form
      className="flex w-full max-w-xs flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        // The element is form-associated: FormData has its value, as a native input's.
        setPosted(JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))));
      }}
      onReset={() => setPosted(null)}
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="guests" className="text-label-lg text-on-surface">
          Guests (required, 2 or more)
        </label>
        <nx-number-input id="guests" name="guests" min="2" required />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="budget" className="text-label-lg text-on-surface">
          Budget per guest
        </label>
        <nx-number-input id="budget" name="budget" step="any" value="42.5" size="sm" />
      </div>
      <div className="flex gap-2">
        <Button type="submit">Send</Button>
        <Button type="reset" variant="outlined">
          Reset
        </Button>
      </div>
      <p className="text-body-sm text-on-surface-muted">Posted: {posted ?? 'nothing yet'}</p>
    </form>
  );
}
```

## Accessibility

- Roles: spinbutton (the inner `<input>`), with `aria-valuenow`, `aria-valuemin` and `aria-valuemax`
- `ArrowUp / ArrowDown`: One step up or down, inside `min` and `max`. Fires `input` and `change`.
- `PageUp / PageDown`: Ten steps.
- `Home / End`: To `min` or `max`, when set.
- `Enter`: Applies the limits and submits the form, as a native input does.
- One tab stop: focus is delegated to the inner input, so `<label for>` clicks and `element.focus()` land in the field.
- Focus ring from the tokens; forced colours draw it in Highlight.
- The inner input is named from the host’s `<label for>` (or a wrapping `<label>`, or `aria-label`): a label can’t reach into a shadow root, so the element copies its text.
- `aria-required` and `aria-invalid` follow the field; the invalid state shows only after an edit or a failed submit.
- Validation messages come from a native input where the browser has one, so they are in the browser’s language.
- Shadow DOM: page CSS can’t break the inside. Style it with the theme variables, or `::part(field)` and `::part(input)`.
- Themed by the same CSS custom properties as `@nexub/react`: load `@nexub/themes` and `data-theme` / `data-product` apply.

Related: [number-input](number-input.md), [date-picker-element](date-picker-element.md), [form](form.md)
