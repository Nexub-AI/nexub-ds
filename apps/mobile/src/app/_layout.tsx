import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NexubNativeProvider, ToastProvider, nexubFonts, useNexubNavigation } from '@nexub/react-native';

SplashScreen.preventAutoHideAsync();

function Screens() {
  const nav = useNexubNavigation();
  return (
    <Stack screenOptions={nav.stack}>
      {/* Docs previews bring their own theme and header (preview/_layout.tsx). */}
      <Stack.Screen name="preview" options={{ headerShown: false }} />
      {/* The demo app has its own stack and tabs (demo/_layout.tsx). */}
      <Stack.Screen name="demo" options={{ headerShown: false }} />
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
    // Sheets, swipe rows, sliders and toasts read their gestures through this root.
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NexubNativeProvider product="payub">
        <ToastProvider>
          <Screens />
        </ToastProvider>
      </NexubNativeProvider>
    </GestureHandlerRootView>
  );
}
