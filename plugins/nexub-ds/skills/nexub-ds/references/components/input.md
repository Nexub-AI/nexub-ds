# Input

Text input field for forms. Supports size variants, icons, addons, and validation states.

- Package: `@nexub/react` · Category: Form & Input · Status: stable
- Import: `import { Input } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/input

## When to use

- Capturing short free-form text (name, email, search term)
- Single-line data entry within a form
- Filtering or searching a list of items
- Inline editing of a single value

## When not to use

- Multi-line text — use Textarea instead
- Choosing from a fixed list of options — use Select or Combobox
- Numeric stepping — use NumberInput for increment/decrement control
- Passwords — use PasswordInput which toggles visibility

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Control height and font size. |
| `invalid` | `boolean` | `false` | Applies error ring styling. |
| `disabled` | `boolean` | `false` | Disables the input. |
| `placeholder` | `string` |  | Placeholder text. |
| `type` | `string` | `'text'` | HTML input type attribute. |
| `leadingIcon` | `React.ReactNode` |  | Icon rendered at the start of the input. |
| `trailingIcon` | `React.ReactNode` |  | Icon rendered at the end of the input. |
| `leadingAddon` | `string` |  | Text addon rendered before the input (e.g. "https://"). |
| `trailingAddon` | `string` |  | Text addon rendered after the input (e.g. ".com"). |

## Example: Default

```tsx
<Input placeholder="Enter value…" />
```

## Example: Sizes

```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '320px' }}>
  <Input size="sm" placeholder="Small" />
  <Input size="md" placeholder="Medium" />
  <Input size="lg" placeholder="Large" />
</div>
```

## Example: Invalid state

```tsx
<Input invalid placeholder="Invalid value" />
```

## Example: With label and helper

```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '320px' }}>
  <Label htmlFor="email">Email address</Label>
  <Input id="email" type="email" placeholder="you@example.com" />
  <HelperText>We'll never share your email.</HelperText>
</div>
```

## Accessibility

- Roles: textbox
- `Tab`: Moves focus to the input.
- `Esc`: Browsers may revert recent changes (autofill suggestions).
- Visible focus ring on `:focus-visible`. Pair with a `<Label htmlFor>` so clicking the label moves focus into the field.
- `invalid` toggles `aria-invalid="true"` so AT users hear the error state.
- Use `aria-describedby` to associate `HelperText` or error messages.

Related: [textarea](textarea.md), [number-input](number-input.md), [password-input](password-input.md), [search-input](search-input.md)
