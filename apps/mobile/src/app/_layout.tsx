import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { NexubNativeProvider, ToastProvider, nexubFonts, useNexubNavigation } from '@nexub/react-native';

SplashScreen.preventAutoHideAsync();

function Screens() {
  const nav = useNexubNavigation();
  return (
    <Stack screenOptions={nav.stack}>
      {/* Docs previews bring their own theme and header (preview/_layout.tsx). */}
      <Stack.Screen name="preview" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts(nexubFonts);
  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);
  if (!loaded) return null;
  return (
    <NexubNativeProvider product="payub">
      <ToastProvider>
        <Screens />
      </ToastProvider>
    </NexubNativeProvider>
  );
}
