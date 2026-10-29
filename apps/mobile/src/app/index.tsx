import { Stack as Screen, router } from 'expo-router';
import { Bell, Layers, MessageSquare, Settings, Smartphone, Sparkles } from '@nexub/icons/native';
import { Icon, ListItem, ListSection, ScreenContainer } from '@nexub/react-native';

const SECTIONS = [
  { href: '/foundations', title: 'Foundations', subtitle: 'Type, surfaces, press, icons', icon: Layers },
  { href: '/actions', title: 'Actions', subtitle: 'Buttons, chips, badges, avatars', icon: Sparkles },
  { href: '/inputs', title: 'Inputs', subtitle: 'Fields, money, selection controls', icon: Settings },
  { href: '/lists', title: 'Lists & cards', subtitle: 'ListItem, ListSection, Card, Accordion', icon: MessageSquare },
  { href: '/feedback', title: 'Feedback', subtitle: 'Banner, toast, dialog, progress, states', icon: Bell },
  { href: '/mobile', title: 'Mobile patterns', subtitle: 'Sheets, swipe, OTP, keypad, privacy', icon: Smartphone },
] as const;

export default function Catalogue() {
  return (
    <ScreenContainer>
      <Screen.Screen options={{ title: 'Nexub' }} />
      <ListSection header="Components" inset={56}>
        {SECTIONS.map((s) => (
          <ListItem
            key={s.href}
            title={s.title}
            subtitle={s.subtitle}
            leading={<Icon icon={s.icon} color="primary" />}
            onPress={() => router.push(s.href)}
          />
        ))}
      </ListSection>
    </ScreenContainer>
  );
}
