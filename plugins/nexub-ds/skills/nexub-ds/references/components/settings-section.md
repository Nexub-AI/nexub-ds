# SettingsSection

Grouped settings panel with title, description, and action area.

- Package: `@nexub/patterns` · Category: Layout · Status: stable
- Import: `import { SettingsSection } from '@nexub/patterns';`
- Docs: https://nexub-ds-docs.pages.dev/patterns/settings-section

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` (required) | `string` |  | Section heading. |
| `description` | `string` |  | Supporting description for the section. |
| `children` (required) | `React.ReactNode` |  | Settings controls. |
| `action` | `React.ReactNode` |  | Primary action (e.g. save button). |

## Example: Default

```tsx
<SettingsSection
  title="Profile"
  description="Update your personal information."
  action={<Button size="sm">Save changes</Button>}
>
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
    <Input placeholder="Display name" />
    <Input placeholder="Email address" type="email" />
  </div>
</SettingsSection>
```
