// Native chrome, Nexub colours: options for the system navigation (native
// stack header, tabs, React Navigation theme). We theme it; we never redraw it.
import { fontStyle } from './fonts';
import { useTheme, type NexubTheme } from './ThemeProvider';

/** Native stack `screenOptions`: large titles on a surface-coloured native header, Nexub type and tint. */
export function nexubStackOptions(theme: NexubTheme) {
  const { roles, fonts } = theme;
  return {
    headerLargeTitle: true,
    // Opaque: a transparent header hid the expanded large title (iOS 26); the
    // system still draws its scroll-edge effect on an opaque native header.
    headerTransparent: false,
    headerShadowVisible: false,
    headerLargeTitleShadowVisible: false,
    headerTintColor: roles.primary,
    headerStyle: { backgroundColor: roles.surface },
    headerTitleStyle: { color: roles['on-surface'], ...fontStyle('sans', 600, fonts) },
    headerLargeTitleStyle: { color: roles['on-surface'], ...fontStyle('display', 700, fonts) },
    contentStyle: { backgroundColor: roles.surface },
  };
}

/** React Navigation `theme` (also Expo Router's ThemeProvider). */
export function nexubNavigationTheme(theme: NexubTheme) {
  const { roles, fonts, scheme } = theme;
  const font = (weight: 400 | 500 | 600 | 700) => {
    const f = fontStyle('sans', weight, fonts);
    return {
      fontFamily: 'fontFamily' in f ? (f.fontFamily as string) : 'System',
      fontWeight: String(weight) as '400',
    };
  };
  return {
    dark: scheme === 'dark',
    colors: {
      primary: roles.primary,
      background: roles.surface,
      card: roles['surface-container'],
      text: roles['on-surface'],
      border: roles['outline-variant'],
      notification: roles.error,
    },
    fonts: { regular: font(400), medium: font(500), bold: font(600), heavy: font(700) },
  };
}

/** Colours for native tab bars (Expo Router NativeTabs / react-native-bottom-tabs). */
export function nexubTabsOptions(theme: NexubTheme) {
  const { roles, fonts } = theme;
  return {
    tintColor: roles.primary,
    inactiveTintColor: roles['on-surface-variant'],
    backgroundColor: roles['surface-container'],
    badgeBackgroundColor: roles.error,
    labelStyle: { ...fontStyle('sans', 500, fonts), fontSize: 11 },
  };
}

/** All three for the current theme: `const nav = useNexubNavigation()`. */
export function useNexubNavigation() {
  const theme = useTheme();
  return {
    stack: nexubStackOptions(theme),
    theme: nexubNavigationTheme(theme),
    tabs: nexubTabsOptions(theme),
  };
}
