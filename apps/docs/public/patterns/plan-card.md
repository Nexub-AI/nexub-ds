# PlanCard

Pricing plan card with feature checklist, badge, and CTA button.

- Package: `@nexub/patterns` · Category: Marketing · Status: stable
- Import: `import { PlanCard } from '@nexub/patterns';`
- Docs: https://nexub-ds-docs.pages.dev/patterns/plan-card

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` (required) | `string` |  | Plan name (e.g. "Pro"). |
| `price` (required) | `string` |  | Price string (e.g. "$49/mo"). |
| `description` | `string` |  | Short plan description. |
| `features` | `string[]` |  | List of included features. |
| `highlighted` | `boolean` | `false` | Applies brand accent styling for recommended plans. |
| `badge` | `string` |  | Label for the plan badge (e.g. "Most Popular"). |
| `cta` | `string` | `'Get started'` | CTA button label. |
| `onSelect` | `() => void` |  | CTA button click handler. |

## Example: Default

```tsx
import { PlanCard } from '@nexub/patterns';

export default function Example() {
  return (
    <div className="w-[280px]">
      <PlanCard
        name="Pro"
        price="$49"
        period="/ month"
        description="For growing teams that need more power."
        features={['Unlimited seats', 'Advanced analytics', 'Priority support']}
        cta="Get started"
        onSelect={() => {}}
      />
    </div>
  );
}
```
