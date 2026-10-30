import { PageSkeleton } from '@/components/kit';

/** Slug-level loading boundary for pattern detail pages. */
export default function PatternSlugLoading() {
  return <PageSkeleton label="Loading pattern" badges={1} />;
}
