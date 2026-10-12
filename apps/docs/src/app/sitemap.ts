import type { MetadataRoute } from 'next';
import { navGroups } from '@/registry/index';
import { SITE_URL } from './site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const hrefs = navGroups.flatMap((g) => [
    ...g.items.map((i) => i.href),
    ...(g.children ?? []).flatMap((sub) => sub.items.map((i) => i.href)),
  ]);
  return ['/', ...new Set(hrefs)].map((href) => ({ url: `${SITE_URL}${href}` }));
}
