// /preview/pattern/<name> — one screen pattern as the app shows it, with its header.
import { View } from 'react-native';
import { Stack as Screen, useLocalSearchParams } from 'expo-router';
import { ErrorState } from '@nexub/react-native';
import { PATTERNS } from '../../patterns/[name]';

export default function PatternPreview() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const p = Object.hasOwn(PATTERNS, name) ? PATTERNS[name] : undefined;
  if (!p) return <ErrorState title="No preview" description={`There is no screen pattern called “${name}”.`} />;
  return (
    <View testID="preview-ready" style={{ flex: 1 }}>
      <Screen.Screen options={{ title: p.title, headerShown: p.headerShown ?? true, headerLargeTitle: false }} />
      <p.Component />
    </View>
  );
}
