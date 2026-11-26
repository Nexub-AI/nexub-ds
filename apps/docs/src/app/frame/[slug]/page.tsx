import * as React from 'react';
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
    <div className="min-h-screen bg-surface">
      <FrameThemeSync />
      {/* 12.1: the template hydrates in its own task, after the frame shell (mobile TBT). */}
      <React.Suspense>
        <TemplatePreview slug={t.slug} />
      </React.Suspense>
    </div>
  );
}
