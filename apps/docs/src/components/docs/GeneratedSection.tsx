import type * as React from 'react';
import recipes from '@/registry/playground.generated.json';
import type { PlaygroundRecipe } from './playground-code';
import type { PlaygroundViewProps } from './GeneratedPlayground';

/** The generated recipe of a component page, or undefined when it has none (see `skip` in the JSON). */
export function playgroundRecipe(slug: string): PlaygroundRecipe | undefined {
  const r = (recipes as Record<string, PlaygroundRecipe | { skip: string }>)[slug];
  return r && !('skip' in r) ? r : undefined;
}

// Resolved on the server like LivePreview: the page's own base module is in the
// first HTML and is the only playground module the page loads.
export async function GeneratedSection({
  slug,
  view,
}: {
  slug: string;
  view: PlaygroundViewProps['view'];
}) {
  const recipe = playgroundRecipe(slug);
  if (!recipe) return null;
  const { default: View } = (await import(`./playground/${slug}.tsx`)) as {
    default: React.ComponentType<PlaygroundViewProps>;
  };
  return <View view={view} recipe={recipe} />;
}
