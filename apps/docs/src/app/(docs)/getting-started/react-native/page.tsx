import type { Metadata } from 'next';
import { CodeBlock } from '@/components/docs/CodeBlock';

export const dynamic = 'force-static';

export const metadata: Metadata = { title: 'React Native' };

// Mirrors packages/react-native/README.md (the reference AI tools read).
const twins: [web: string, native: string][] = [
  ['ThemeProvider + NexubProvider', 'NexubNativeProvider'],
  ['Button, IconButton, ButtonGroup, Link', 'same names'],
  ['Input + Label + HelperText + FormError', 'TextField'],
  ['PasswordInput, SearchInput, MoneyInput, NumberInput', 'PasswordInput, SearchField, MoneyInput, Stepper'],
  ['Checkbox, RadioGroup, Switch, SegmentedControl, Slider, Chip, FilterChip', 'same names (Switch is the platform switch)'],
  ['Select, Combobox, DatePicker', 'Select (opens a sheet), DateTimeField (platform picker)'],
  ['Amount, Badge (Tag, StatusPill), Avatar, AvatarGroup, Separator', 'Amount, Badge, Avatar, AvatarGroup, Divider'],
  ['Card, Accordion, Alert/Banner/Callout, Toast, Dialog, Progress, Skeleton, EmptyState, ErrorState', 'same names (Banner covers Alert and Callout)'],
  ['Drawer, Sheet, DropdownMenu, ContextMenu', 'BottomSheet, ActionSheet, ContextMenu'],
  ['ActivityFeed, InfoList, SettingsLayout, AuthCard, Conversation, PlanCard, AppLauncher', 'ActivityList, TransactionDetail, SettingsScreen, SignInScreen, ChatScreen, PaywallScreen, AppSwitcherSheet'],
];

export default function ReactNativePage() {
  return (
    <div className="docs-prose">
      <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
        Getting Started
      </p>
      <h1>React Native</h1>
      <p>
        <code>@nexub/react-native</code> brings Nexub to iOS and Android apps built with Expo or bare React Native. It uses
        the same tokens, product brands and prop names as <code>@nexub/react</code>, so a design change ships to web and
        mobile together. Status: <strong>alpha</strong>.
      </p>

      <h2>Native chrome, Nexub content</h2>
      <p>
        The operating system draws the navigation: tab bar, stack header and back gesture, action sheets, date pickers and
        iOS 26 Liquid Glass. Nexub only colours it, so the apps feel native on each platform. Everything people read and
        tap inside a screen (lists, cards, buttons, inputs, money) is drawn by Nexub and looks the same on iOS, Android and
        the web.
      </p>

      <h2>Install</h2>
      <CodeBlock lang="bash" code="npx expo install @nexub/react-native react-native-reanimated react-native-worklets react-native-svg react-native-safe-area-context expo-font" />
      <p>
        Optional: <code>expo-haptics</code> (haptics), <code>expo-glass-effect</code> (Liquid Glass on iOS 26+),{' '}
        <code>expo-screen-capture</code> (<code>PrivacyShield</code>) and{' '}
        <code>@react-native-community/datetimepicker</code> (<code>DateTimeField</code>). Supported: Expo SDK 57+ / React
        Native 0.86+.
      </p>

      <h2>Set up</h2>
      <CodeBlock
        lang="tsx"
        code={`import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { NexubNativeProvider, ToastProvider, nexubFonts, useNexubNavigation } from '@nexub/react-native';

function Screens() {
  const nav = useNexubNavigation();
  return <Stack screenOptions={nav.stack} />;
}

export default function RootLayout() {
  const [ready] = useFonts(nexubFonts);
  if (!ready) return null;
  return (
    <NexubNativeProvider product="payub">
      <ToastProvider>
        <Screens />
      </ToastProvider>
    </NexubNativeProvider>
  );
}`}
      />
      <p>
        <code>product</code> picks the brand (Leap, Bookub, Payub, Founderub); <code>seed</code> white-labels any other.
        Light/dark, contrast, Reduce Motion and Reduce Transparency follow the OS unless you set them.
      </p>

      <h2>Web → native</h2>
      <table>
        <thead>
          <tr>
            <th>@nexub/react / @nexub/patterns</th>
            <th>@nexub/react-native</th>
          </tr>
        </thead>
        <tbody>
          {twins.map(([web, native]) => (
            <tr key={web}>
              <td>{web}</td>
              <td>{native}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        Mobile only: <code>ListItem</code>, <code>ListSection</code>, <code>SwipeableRow</code>, <code>OTPInput</code>,{' '}
        <code>NumericKeypad</code>, <code>ExpressiveMoneyInput</code>, <code>StickyFooter</code>,{' '}
        <code>SensitiveValue</code>, <code>PrivacyShield</code>, <code>Carousel</code>, <code>FAB</code> (Android).
        Screens: <code>@nexub/react-native/patterns</code>.
      </p>

      <h2>Rules</h2>
      <ul>
        <li>Every control reaches a 44pt touch target; primary actions use <code>size=&quot;lg&quot;</code>.</li>
        <li>Text scales with the system size; on iOS each role follows its Dynamic Type curve.</li>
        <li>A list row is one screen-reader element, and swipe and long-press actions are also accessibility actions.</li>
        <li>Haptics are semantic and optional, never on plain taps.</li>
        <li>Glass is for the control layer only, solid when the user turns transparency down.</li>
        <li>
          Money screens: hide balances with <code>SensitiveValue</code>, cover the app switcher with{' '}
          <code>PrivacyShield</code>, and enter codes with <code>OTPInput</code> (SMS autofill).
        </li>
      </ul>
    </div>
  );
}
