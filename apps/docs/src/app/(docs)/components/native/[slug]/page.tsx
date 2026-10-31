import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Badge } from '@nexub/react';
import { NATIVE_STATUS, getMobileOnly, mobileOnly } from '@/registry/native';
import { StatusBadge } from '@/components/docs/StatusBadge';
import { PageIntro, Section } from '@/components/kit';
import { MobilePanel } from '@/components/platform/MobilePanel';

export const dynamic = 'force-static';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return mobileOnly.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const m = getMobileOnly(slug);
  return { title: m ? `${m.title} (mobile)` : 'Component', description: m?.description };
}

export default async function MobileOnlyComponentPage({ params }: Props) {
  const { slug } = await params;
  const m = getMobileOnly(slug);
  if (!m) notFound();
  const status = m.status ?? NATIVE_STATUS;

  return (
    <div className="docs-prose">
      <PageIntro
        eyebrow={`Components · Mobile only · ${m.category}`}
        title={m.title}
        lead={m.description}
        badges={
          <>
            <StatusBadge status={status} />
            <Badge tone="info" variant="soft">iOS &amp; Android</Badge>
          </>
        }
      />
      <Section id="mobile" title="Usage">
        <MobilePanel name={m.name} title={m.title} preview={`preview/${m.preview}`} code={m.code} webAlternative={m.webAlternative} status={status} />
      </Section>
    </div>
  );
}
