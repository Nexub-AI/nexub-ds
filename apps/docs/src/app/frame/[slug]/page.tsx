import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { templateEntries, getTemplateEntry } from '@/registry/templates';
import { TemplatePreview } from '@/components/templates/TemplatePreview';
import { FrameThemeSync } from '@/components/platform/FrameThemeSync';

// A bare page for the docs' browser frame: one page template, no docs chrome.
export const dynamic = 'force-static';

export const metadata: Metadata = { robots: { index: false } };

export function generateStaticParams() {
  return templateEntries.map((t) => ({ slug: t.slug }));
}

export default async function TemplateFrame({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = getTemplateEntry(slug);
  if (!t) notFound();
  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <FrameThemeSync />
      <TemplatePreview slug={t.slug} />
    </div>
  );
}
