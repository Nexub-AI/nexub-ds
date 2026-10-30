import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@nexub/react';
import { PageIntro } from '@/components/kit';
import { DashboardExample } from './DashboardExample';

export const metadata: Metadata = { title: 'Example: Web dashboard' };

const SOURCE =
  'https://github.com/Nexub-AI/nexub-ds/blob/development/apps/docs/src/app/(docs)/examples/dashboard/DashboardExample.tsx';

export default function DashboardExamplePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="docs-prose">
        <PageIntro
          eyebrow="Examples"
          title="Web dashboard"
          lead={
            <>
              A payments dashboard built only from public exports of <code>@nexub/react</code> and <code>@nexub/patterns</code>,
              with Tailwind utilities on colour roles and no custom CSS: AppHeader, NavigationRail, PageHeader with a
              SplitButton, a BentoGrid of animated StatCards and a chart on the <code>--color-chart-*</code> palette, a
              DataTable with Amount and status badges, a RadioCard plan picker, undoable toasts and an assistant panel. Switch
              the direction to check it right to left.
            </>
          }
        >
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="tonal" size="sm">
              <a href={SOURCE} target="_blank" rel="noopener noreferrer">View the source</a>
            </Button>
            <Button asChild variant="outlined" size="sm">
              <Link href="/examples/mobile">See the mobile dashboard</Link>
            </Button>
          </div>
        </PageIntro>
      </div>
      <DashboardExample />
    </div>
  );
}
