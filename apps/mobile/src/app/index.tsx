import { Stack as Screen } from 'expo-router';
import { Bell, Check, Search } from '@nexub/icons/native';
import {
  Heading,
  Icon,
  Inline,
  Pressable,
  ScreenContainer,
  Stack,
  Surface,
  Text,
  type SurfaceTone,
} from '@nexub/react-native';

const TIERS: SurfaceTone[] = [
  'surface-container-lowest',
  'surface-container-low',
  'surface-container',
  'surface-container-high',
  'surface-container-highest',
];

export default function Foundations() {
  return (
    <ScreenContainer>
      <Screen.Screen options={{ title: 'Foundations' }} />

      <Stack gap="2">
        <Heading variant="title-lg">Type</Heading>
        <Text variant="display-sm">Display</Text>
        <Text variant="headline-sm">Headline</Text>
        <Text variant="title-md">Title</Text>
        <Text variant="body-md">Body text reads at 16 and scales with Dynamic Type.</Text>
        <Text variant="label-md" color="on-surface-variant">
          Label
        </Text>
        <Text variant="title-lg" tabular>
          $12,480.50
        </Text>
      </Stack>

      <Stack gap="2">
        <Heading variant="title-lg">Surfaces</Heading>
        <Inline>
          {TIERS.map((tone) => (
            <Surface key={tone} tone={tone} radius="field" style={{ width: 56, height: 56 }} />
          ))}
        </Inline>
        <Surface tone="surface-container-lowest" elevation={2} radius="container" style={{ padding: 16 }}>
          <Text>Elevation 2</Text>
        </Surface>
        <Surface material="glass" radius="control" style={{ padding: 16 }}>
          <Text>Glass (control layer)</Text>
        </Surface>
      </Stack>

      <Stack gap="2">
        <Heading variant="title-lg">Press</Heading>
        <Pressable
          haptic="confirm"
          accessibilityLabel="Press me"
          style={{ borderRadius: 9999, backgroundColor: '#0059c7', paddingVertical: 14, alignItems: 'center' }}
          stateLayer="on-primary"
        >
          <Text color="on-primary" variant="label-lg">
            Press me
          </Text>
        </Pressable>
        <Inline gap="4">
          <Icon icon={Search} />
          <Icon icon={Bell} color="tertiary" />
          <Icon icon={Check} color="success" size="lg" label="Done" />
        </Inline>
      </Stack>
    </ScreenContainer>
  );
}
