import type { Metadata } from 'next';
import { PageIntro, Prose, Section } from '@/components/kit';
import { IconGallery } from './IconGallery';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Icons',
  description: 'Every icon in @nexub/icons: the curated Lucide set plus Nexub and regulator marks. Click one to copy its import.',
};

export default function IconsPage() {
  return (
    <div className="docs-prose">
      <PageIntro eyebrow="Foundations" title="Icons" />
      <Section id="gallery" title="Gallery">
        <Prose>
          <code>@nexub/icons</code> ships a curated Lucide set plus the Nexub product and regulator marks. Only these
          names are exported, and every icon tree-shakes on its own. Click an icon to copy its import. React Native uses
          the same names from <code>@nexub/icons/native</code>.
        </Prose>
        <IconGallery />
      </Section>
    </div>
  );
}
