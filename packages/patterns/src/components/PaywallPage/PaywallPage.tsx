import * as React from 'react';
import { Badge, Button, RadioCard, RadioCardGroup } from '@nexub/react';
import { Check } from '@nexub/icons';
import { PageFrame, usePageMessages, type PageFrameProps, type PageTemplateMessages, type Plan } from '../PageFrame/PageFrame.js';

export interface PaywallPageProps extends Omit<PageFrameProps, 'title' | 'children'> {
  title: string;
  plans: Plan[];
  defaultPlan?: string;
  onSubscribe: (planId: string) => void;
  onRestore?: () => void;
  /** Legal copy (auto-renewal terms). */
  terms?: string;
  loading?: boolean;
  messages?: Partial<PageTemplateMessages>;
}

/**
 * Choose a plan, then one Continue: plans are a radio group, not a row of
 * buttons, so the choice and the commitment stay separate. Web twin of the
 * native `PaywallScreen`. For a pricing page with a button per plan, use `PlanCard`.
 */
export const PaywallPage = React.forwardRef<HTMLElement, PaywallPageProps>(function PaywallPage(
  { title, description, plans, defaultPlan, onSubscribe, onRestore, terms, loading, messages, ...props },
  ref,
) {
  const m = usePageMessages(messages);
  const [plan, setPlan] = React.useState(defaultPlan ?? plans[0]?.id);
  return (
    <PageFrame ref={ref} width="sm" title={title} description={description} {...props}>
      <RadioCardGroup value={plan} onValueChange={setPlan} aria-label={m.choosePlan} columns={1}>
        {plans.map((p) => (
          <RadioCard
            key={p.id}
            value={p.id}
            title={
              <span className="flex flex-wrap items-center gap-2">
                {p.name}
                {p.badge && <Badge tone="info" size="sm">{p.badge}</Badge>}
              </span>
            }
            description={p.price}
          >
            <ul className="mt-2 flex flex-col gap-1.5">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-body-sm text-[var(--color-on-surface-variant)]">
                  <Check size="sm" aria-hidden="true" className="mt-0.5 shrink-0 text-[var(--color-success)]" />
                  {f}
                </li>
              ))}
            </ul>
          </RadioCard>
        ))}
      </RadioCardGroup>
      <div className="flex flex-col gap-2">
        <Button size="lg" fullWidth loading={loading} disabled={!plan} onClick={() => plan && onSubscribe(plan)}>
          {m.continue}
        </Button>
        {onRestore && (
          <Button variant="ghost" size="lg" fullWidth onClick={onRestore}>
            {m.restorePurchases}
          </Button>
        )}
        {terms && <p className="text-center text-label-sm text-[var(--color-on-surface-muted)]">{terms}</p>}
      </div>
    </PageFrame>
  );
});
