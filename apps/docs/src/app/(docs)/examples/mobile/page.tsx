import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@nexub/react';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { DocTable, PageIntro, Section } from '@/components/kit';
import { PhoneFrame } from '@/components/platform/PhoneFrame';
import { getTemplateEntry } from '@/registry/templates';

export const dynamic = 'force-static';
export const metadata: Metadata = { title: 'Example: Mobile dashboard', description: 'The Payub-style home screen in @nexub/react-native.' };

const dashboard = getTemplateEntry('dashboard')!;

export default function MobileDashboardPage() {
  return (
    <div className="docs-prose">
      <PageIntro
        eyebrow="Examples"
        title="Mobile dashboard"
        lead={
          <>
            The home of a Payub-style money app, built from <code>HomeScreen</code> in{' '}
            <code>@nexub/react-native/patterns</code>: a balance you can hide, four quick actions, recent activity grouped by day,
            and insights, with pull to refresh. The same data drives the web <code>DashboardPage</code>.
          </>
        }
      >
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="tonal" size="sm">
            <Link href="/examples/dashboard">See the web dashboard</Link>
          </Button>
          <Button asChild variant="outlined" size="sm">
            <Link href="/patterns/pages/dashboard">Dashboard page template</Link>
          </Button>
        </div>
      </PageIntro>

      <div className="grid items-start gap-10 lg:grid-cols-[auto_minmax(0,1fr)]">
        <div className="flex justify-center">
          <PhoneFrame path={`preview/${dashboard.native.preview}`} title="Mobile dashboard" height={680} />
        </div>
        <div className="flex min-w-0 flex-col">
          <Section id="code" title="Code" className="!mt-0">
            <CodeBlock lang="tsx" code={dashboard.native.code} />
          </Section>
          <Section id="web-vs-mobile" title="Web vs mobile">
            <DocTable
              caption="Dashboard: web vs mobile"
              head={['', 'Web (DashboardPage)', 'iOS & Android (HomeScreen)']}
              rows={dashboard.native.differences.map((d) => [<strong key="a">{d.aspect}</strong>, d.web, d.mobile])}
            />
          </Section>
        </div>
      </div>
    </div>
  );
}
