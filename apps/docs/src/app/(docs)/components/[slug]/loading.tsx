import { PageSkeleton } from '@/components/kit';

/** Slug-level loading boundary for component detail pages. */
export default function ComponentSlugLoading() {
  return <PageSkeleton label="Loading component" badges={2} />;
}
