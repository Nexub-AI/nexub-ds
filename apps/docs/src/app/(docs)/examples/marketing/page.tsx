import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@nexub/react';
import { PageIntro } from '@/components/kit';
import { MarketingExample } from './MarketingExample';

export const dynamic = 'force-static';

export const metadata: Metadata = { title: 'Example: Marketing page' };

const SOURCE =
  'https://github.com/Nexub-AI/nexub-ds/blob/development/apps/docs/src/app/(docs)/examples/marketing/MarketingExample.tsx';

export default function MarketingExamplePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="docs-prose">
        <PageIntro
          eyebrow="Examples"
          title="Marketing page"
          lead={
            <>
              A landing page in marketing mode, built only from <code>@nexub/marketing</code> and <code>@nexub/react</code>:
              MarketingNav with a mega-menu and country switcher, the Hero with floating cards, a logo strip, stats that count
              up, product-coloured testimonials, the product grid, the CTA band and the footer. The page is a server
              component; only the nav, the counting numbers and the buttons load JavaScript.
            </>
          }
        >
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="tonal" size="sm">
              <a href={SOURCE} target="_blank" rel="noopener noreferrer">View the source</a>
            </Button>
            <Button asChild variant="outlined" size="sm">
              <Link href="/foundations/marketing-mode">Marketing mode guidelines</Link>
            </Button>
          </div>
        </PageIntro>
      </div>
      <MarketingExample />
    </div>
  );
}
