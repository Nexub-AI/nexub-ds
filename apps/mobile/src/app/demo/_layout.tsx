// /demo: a small connected app built from the screen patterns.
//   /demo → /demo/verify → tabs (/demo/home, /demo/activity, /demo/settings) → /demo/transaction/<id>
// Sign out (Settings) returns to /demo. The session lives in memory (src/demo/auth.tsx).
import { Stack } from 'expo-router';
import { useNexubNavigation } from '@nexub/react-native';
import { DemoAuthProvider } from '../../demo/auth';

export default function DemoLayout() {
  const nav = useNexubNavigation();
  return (
    <DemoAuthProvider>
      <Stack screenOptions={{ ...nav.stack, headerLargeTitle: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </DemoAuthProvider>
  );
}
