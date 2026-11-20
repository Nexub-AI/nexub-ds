import { useEffect } from 'react';
import { router } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import { Activity, Home, Settings, type NativeIconProps } from '@nexub/icons/native';
import { useNexubNavigation } from '@nexub/react-native';
import { useDemoAuth } from '../../../demo/auth';

// The tab bar passes the tint we set below, always a colour string.
const tabIcon = (Glyph: React.ComponentType<NativeIconProps>) =>
  function TabIcon({ color, size }: { color: unknown; size: number }) {
    return <Glyph color={String(color)} size={size} />;
  };

export default function DemoTabs() {
  const { signedIn } = useDemoAuth();
  const nav = useNexubNavigation();

  // Signed out (Settings → Sign out, or a link straight to a tab): back to sign-in.
  useEffect(() => {
    if (!signedIn) router.replace('/demo');
  }, [signedIn]);
  if (!signedIn) return null;

  return (
    <Tabs
      screenOptions={{
        headerStyle: nav.stack.headerStyle,
        headerTitleStyle: nav.stack.headerTitleStyle,
        headerShadowVisible: false,
        sceneStyle: nav.stack.contentStyle,
        tabBarActiveTintColor: nav.tabs.tintColor,
        tabBarInactiveTintColor: nav.tabs.inactiveTintColor,
        tabBarStyle: { backgroundColor: nav.tabs.backgroundColor },
        tabBarLabelStyle: nav.tabs.labelStyle,
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home', tabBarIcon: tabIcon(Home) }} />
      <Tabs.Screen name="activity" options={{ title: 'Activity', tabBarIcon: tabIcon(Activity) }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings', tabBarIcon: tabIcon(Settings) }} />
    </Tabs>
  );
}
