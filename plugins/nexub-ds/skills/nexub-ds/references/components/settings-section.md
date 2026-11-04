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
import { SettingsSection } from '@nexub/patterns';
import { Switch } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-full max-w-[560px]">
      <SettingsSection title="Notifications" description="Control how and when you receive notifications.">
        <div className="flex flex-col gap-3 items-start">
          {['Email alerts', 'Push notifications'].map((item) => (
            <div key={item} className="flex items-center justify-between">
              <span className="text-body-sm text-[var(--color-on-surface)]">{item}</span>
              <Switch defaultChecked />
            </div>
          ))}
        </div>
      </SettingsSection>
    </div>
  );
}
```
