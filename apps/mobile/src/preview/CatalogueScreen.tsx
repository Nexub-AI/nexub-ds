import { Fragment } from 'react';
import { Stack as Screen } from 'expo-router';
import { Heading, ScreenContainer, Stack, Text } from '@nexub/react-native';
import { CATALOG, SECTIONS, type PreviewSlug, type SectionName } from './catalog';
import { EXAMPLES, type Example } from './examples';

/** Every example of one component, each under its title. */
export function ComponentExamples({ slug, titles = true }: { slug: PreviewSlug; titles?: boolean }) {
  const entry = CATALOG[slug];
  const examples = EXAMPLES[slug] as readonly Example[];
  return (
    <>
      {examples.map((Ex, i) => (
        <Stack key={i} gap="2">
          {titles && (
            <Text variant="label-md" color="on-surface-variant">
              {entry.title} · {entry.examples[i]}
            </Text>
          )}
          <Ex />
        </Stack>
      ))}
    </>
  );
}

/** A catalogue screen: section headings, then each section's components. */
export function CatalogueScreen({ name, title }: { name: SectionName; title: string }) {
  return (
    <ScreenContainer keyboardDismissMode="interactive">
      <Screen.Screen options={{ title }} />
      {SECTIONS[name].map((section) => (
        <Stack key={section.heading}>
          <Heading variant="title-lg">{section.heading}</Heading>
          {section.slugs.map((slug) => (
            <Fragment key={slug}>
              <ComponentExamples slug={slug} />
            </Fragment>
          ))}
        </Stack>
      ))}
    </ScreenContainer>
  );
}
