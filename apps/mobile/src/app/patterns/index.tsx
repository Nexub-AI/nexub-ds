import { Stack as Screen, router } from 'expo-router';
import { ListItem, ListSection, ScreenContainer } from '@nexub/react-native';
import { PATTERNS } from './[name]';

export default function PatternsList() {
  return (
    <ScreenContainer>
      <Screen.Screen options={{ title: 'Patterns' }} />
      <ListSection header="Payub flows" footer="Each screen uses only public @nexub/react-native APIs.">
        {Object.entries(PATTERNS).map(([name, p]) => (
          <ListItem key={name} title={p.title} subtitle={p.subtitle} onPress={() => router.push(`/patterns/${name}`)} />
        ))}
      </ListSection>
    </ScreenContainer>
  );
}
