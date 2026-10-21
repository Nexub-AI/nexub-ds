import type { Metadata } from 'next';
import { DashboardExample } from './DashboardExample';

export const metadata: Metadata = { title: 'Example: Dashboard' };

const SOURCE =
  'https://github.com/Nexub-AI/nexub-ds/blob/development/apps/docs/src/app/(docs)/examples/dashboard/DashboardExample.tsx';

export default function DashboardExamplePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="docs-prose">
        <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          Examples
        </p>
        <h1>Dashboard</h1>
        <p>
          A payments dashboard built only from public exports of <code>@nexub/react</code> and{' '}
          <code>@nexub/patterns</code>, with Tailwind utilities on colour roles and no custom CSS: AppHeader,
          NavigationRail, PageHeader with a SplitButton, a BentoGrid of animated StatCards and a chart on the{' '}
          <code>--color-chart-*</code> palette, a DataTable with Amount and StatusPill, a RadioCard plan picker,
          undoable toasts and an assistant panel (Conversation + PromptInput). Switch the direction to check it
          right to left.
        </p>
        <p>
          <a href={SOURCE} target="_blank" rel="noopener noreferrer">View the source on GitHub</a>
        </p>
      </div>
      <DashboardExample />
    </div>
  );
}
