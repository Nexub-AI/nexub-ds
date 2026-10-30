// /preview/<slug>?ex=all|<index> — one component's examples, no catalogue chrome.
import { useLocalSearchParams } from 'expo-router';
import { ErrorState, ScreenContainer, Stack } from '@nexub/react-native';
import { ComponentExamples } from '../../preview/CatalogueScreen';
import { CATALOG, type PreviewSlug } from '../../preview/catalog';
import { EXAMPLES, type Example } from '../../preview/examples';
import { usePreviewSize } from '../../preview/usePreviewSize';

export default function ComponentPreview() {
  const { slug, ex } = useLocalSearchParams<{ slug: string; ex?: string }>();
  const onContentSizeChange = usePreviewSize();
  const known = Object.hasOwn(CATALOG, slug);
  const examples = known ? (EXAMPLES[slug as PreviewSlug] as readonly Example[]) : [];
  const index = ex === undefined || ex === 'all' ? -1 : Number(ex);
  const One = Number.isInteger(index) ? examples[index] : undefined;

  return (
    <ScreenContainer testID="preview-ready" edges={['top', 'left', 'right', 'bottom']} onContentSizeChange={onContentSizeChange}>
      {!known ? (
        <ErrorState title="No preview" description={`There is no React Native preview called “${slug}”.`} />
      ) : One ? (
        <Stack>
          <One />
        </Stack>
      ) : (
        <ComponentExamples slug={slug as PreviewSlug} />
      )}
    </ScreenContainer>
  );
}
