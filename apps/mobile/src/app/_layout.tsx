import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { NexubNativeProvider, nexubFonts, useRoles } from '@nexub/react-native';

SplashScreen.preventAutoHideAsync();

function Screens() {
  const roles = useRoles();
  return (
    <Stack
      screenOptions={{
        headerLargeTitle: true,
        headerTransparent: true,
        headerBlurEffect: 'systemMaterial',
        headerTintColor: roles.primary,
        headerTitleStyle: { color: roles['on-surface'], fontFamily: 'Inter_600SemiBold' },
        headerLargeTitleStyle: { color: roles['on-surface'], fontFamily: 'PlusJakartaSans_700Bold' },
        contentStyle: { backgroundColor: roles.surface },
      }}
    />
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
      <Screens />
    </NexubNativeProvider>
  );
}
