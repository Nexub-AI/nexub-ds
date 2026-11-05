# HowItWorks

Numbered steps in an ordered list. Server component.

- Package: `@nexub/marketing` · Category: Marketing · Status: beta
- Import: `import { HowItWorks } from '@nexub/marketing';`
- Docs: https://nexub-ds-docs.pages.dev/patterns/how-it-works

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `steps` (required) | `{ title, description, icon? }[]` |  | The steps; the number shows unless an icon is given. |
| `header` | `React.ReactNode` |  | A SectionHeader, usually. |

## Example: Default

```tsx
import { HowItWorks, SectionHeader } from '@nexub/marketing';

export default function Example() {
  return (
    <div data-mode="marketing" className="w-full">
      <HowItWorks
        header={<SectionHeader title="Up and running in a day" />}
        steps={[
          { title: 'Create your account', description: 'Sign up with your company details.' },
          { title: 'Invite your team', description: 'Add people and their bank details.' },
          { title: 'Run your first payroll', description: 'Review, approve and pay.' },
        ]}
      />
    </div>
  );
}
```
