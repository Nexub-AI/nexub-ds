# FAQ

Questions and answers in an Accordion, one open at a time. Client component.

- Package: `@nexub/marketing` · Category: Marketing · Status: beta
- Import: `import { Faq } from '@nexub/marketing';`
- Docs: https://nexub-ds-docs.pages.dev/patterns/faq

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` (required) | `{ question, answer }[]` |  | The questions; answers can hold links. |
| `header` | `React.ReactNode` |  | A SectionHeader, usually. |

## Example: Default

```tsx
import { FAQ, SectionHeader } from '@nexub/marketing';

export default function Example() {
  return (
    <div data-mode="marketing" className="w-full">
      <FAQ
        header={<SectionHeader title="Questions" />}
        items={[
          { question: 'Which countries do you support?', answer: 'Singapore, India, Indonesia, Malaysia and Vietnam.' },
          { question: 'Can I switch plans later?', answer: 'Yes, at any time. We prorate the difference.' },
          { question: 'Is my data secure?', answer: 'Data is encrypted at rest and in transit, and stored in the region you choose.' },
        ]}
      />
    </div>
  );
}
```
