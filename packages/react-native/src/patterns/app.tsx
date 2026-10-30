import * as React from 'react';
import { FlatList, KeyboardAvoidingView, Platform, TextInput, View } from 'react-native';
import { ArrowUp, Bell, Check, Sparkles, type NativeIconProps } from '@nexub/icons/native';
import type { GlassMode } from '@nexub/core';
import { Button, IconButton } from '../components/actions';
import { Card, ListItem, ListSection, type ListItemProps } from '../components/containers';
import { Avatar, Badge } from '../components/display';
import { EmptyState } from '../components/feedback';
import { SearchField, SegmentedControl, Chip } from '../components/inputs';
import { BottomSheet } from '../components/overlays';
import { Carousel, StickyFooter } from '../components/mobile';
import { Pressable } from '../primitives/Pressable';
import { ScreenContainer } from '../primitives/ScreenContainer';
import { Heading, Text } from '../primitives/Text';
import { fontStyle } from '../theme/fonts';
import { useTheme, type Scheme } from '../theme/ThemeProvider';

// ─── Onboarding ──────────────────────────────────────────────────────────────

export interface OnboardingSlide {
  title: string;
  body: string;
  /** Illustration or icon above the text. */
  art?: React.ReactNode;
}

export interface OnboardingScreenProps {
  slides: OnboardingSlide[];
  onGetStarted: () => void;
  onSignIn?: () => void;
}

/** Swipeable value slides + Get started / Sign in. */
export function OnboardingScreen({ slides, onGetStarted, onSignIn }: OnboardingScreenProps) {
  const { tokens } = useTheme();
  return (
    <StickyFooter
      footer={
        <>
          <Button size="lg" fullWidth onPress={onGetStarted}>
            Get started
          </Button>
          {onSignIn && (
            <Button size="lg" fullWidth variant="text" onPress={onSignIn}>
              I already have an account
            </Button>
          )}
        </>
      }
    >
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Carousel
          data={slides}
          renderItem={({ item }) => (
            <View
              style={{ padding: tokens.spacing[6], gap: tokens.spacing[4], alignItems: 'center' }}
            >
              {item.art}
              <Heading variant="headline-md" style={{ textAlign: 'center' }}>
                {item.title}
              </Heading>
              <Text variant="body-lg" color="on-surface-variant" style={{ textAlign: 'center' }}>
                {item.body}
              </Text>
            </View>
          )}
        />
      </View>
    </StickyFooter>
  );
}

export interface PermissionPrimerProps {
  icon?: React.ComponentType<NativeIconProps>;
  title: string;
  /** Why the app needs it, in the user's terms. */
  body: string;
  /** Calls the OS prompt. */
  onAllow: () => void;
  onNotNow: () => void;
}

/** Explain a permission before the one-shot OS prompt (notifications, camera, location). */
export function PermissionPrimer({
  icon: Glyph = Bell,
  title,
  body,
  onAllow,
  onNotNow,
}: PermissionPrimerProps) {
  const { roles, tokens } = useTheme();
  return (
    <StickyFooter
      footer={
        <>
          <Button size="lg" fullWidth onPress={onAllow}>
            Continue
          </Button>
          <Button size="lg" fullWidth variant="text" onPress={onNotNow}>
            Not now
          </Button>
        </>
      }
    >
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          gap: tokens.spacing[4],
          padding: tokens.spacing[6],
        }}
      >
        <View
          style={{
            width: 88,
            height: 88,
            borderRadius: 44,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: roles['primary-container'],
          }}
        >
          <Glyph size={44} color={roles['on-primary-container']} />
        </View>
        <Heading variant="headline-sm" style={{ textAlign: 'center' }}>
          {title}
        </Heading>
        <Text variant="body-md" color="on-surface-variant" style={{ textAlign: 'center' }}>
          {body}
        </Text>
      </View>
    </StickyFooter>
  );
}

// ─── Settings & profile ──────────────────────────────────────────────────────

export interface SettingsGroup {
  header?: string;
  footer?: string;
  items: ListItemProps[];
}

export interface SettingsScreenProps {
  /** Optional profile row/card above the groups. */
  header?: React.ReactNode;
  groups: SettingsGroup[];
}

/** Grouped settings (web SettingsLayout + SettingsSection). */
export function SettingsScreen({ header, groups }: SettingsScreenProps) {
  return (
    <ScreenContainer gap="6">
      {header}
      {groups.map((g, i) => (
        <ListSection
          key={g.header ?? i}
          header={g.header}
          footer={g.footer}
          inset={g.items.some((it) => it.leading) ? 56 : 16}
        >
          {g.items.map((it) => (
            <ListItem key={it.title} {...it} />
          ))}
        </ListSection>
      ))}
    </ScreenContainer>
  );
}

export interface AppearanceSectionProps {
  scheme: Scheme | 'system';
  onSchemeChange: (scheme: Scheme | 'system') => void;
  glass: GlassMode;
  onGlassChange: (glass: GlassMode) => void;
  haptics: boolean;
  onHapticsChange: (on: boolean) => void;
}

/** Theme, glass intensity dial and haptics: the user preferences NexubNativeProvider takes. */
export function AppearanceSection({
  scheme,
  onSchemeChange,
  glass,
  onGlassChange,
  haptics,
  onHapticsChange,
}: AppearanceSectionProps) {
  const { tokens, messages } = useTheme();
  return (
    <ListSection header="Appearance">
      <View style={{ padding: tokens.spacing[4], gap: tokens.spacing[3] }}>
        <SegmentedControl
          label="Theme"
          value={scheme}
          onValueChange={onSchemeChange}
          options={[
            { value: 'system', label: 'System' },
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
          ]}
        />
        <SegmentedControl
          label={messages.glass}
          value={glass}
          onValueChange={onGlassChange}
          options={[
            { value: 'clear', label: messages.glassClear },
            { value: 'balanced', label: messages.glassBalanced },
            { value: 'tinted', label: messages.glassTinted },
            { value: 'off', label: messages.glassSolid },
          ]}
        />
      </View>
      <ListItem
        variant="switch"
        title="Haptics"
        subtitle="Vibration feedback on selections"
        checked={haptics}
        onCheckedChange={onHapticsChange}
      />
    </ListSection>
  );
}

export interface ProfileHeaderProps {
  name: string;
  detail?: string;
  image?: string;
  onPress?: () => void;
}

/** Account card at the top of Settings / Profile (web UserCard). */
export function ProfileHeader({ name, detail, image, onPress }: ProfileHeaderProps) {
  const { tokens } = useTheme();
  return (
    <Card
      onPress={onPress}
      accessibilityLabel={[name, detail].filter(Boolean).join(', ')}
      style={{ flexDirection: 'row', alignItems: 'center', gap: tokens.spacing[4] }}
    >
      <Avatar name={name} src={image} size="lg" />
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="title-lg">{name}</Text>
        {detail && (
          <Text variant="body-sm" color="on-surface-variant">
            {detail}
          </Text>
        )}
      </View>
    </Card>
  );
}

// ─── Notifications ───────────────────────────────────────────────────────────

export interface NotificationEntry {
  id: string;
  title: string;
  body?: string;
  /** Preformatted, e.g. "2 min ago". */
  time: string;
  unread?: boolean;
  icon?: React.ComponentType<NativeIconProps>;
}

export interface NotificationsInboxProps {
  notifications: NotificationEntry[];
  onPress?: (n: NotificationEntry) => void;
  onMarkAllRead?: () => void;
}

/** Inbox list with unread dots (web NotificationItem). */
export function NotificationsInbox({
  notifications,
  onPress,
  onMarkAllRead,
}: NotificationsInboxProps) {
  const { roles, tokens } = useTheme();
  const unread = notifications.filter((n) => n.unread).length;
  return (
    <ScreenContainer>
      {unread > 0 && onMarkAllRead && (
        <Button
          variant="text"
          size="sm"
          leadingIcon={Check}
          onPress={onMarkAllRead}
          style={{ alignSelf: 'flex-end' }}
        >
          Mark all as read
        </Button>
      )}
      {notifications.length === 0 ? (
        <EmptyState icon={Bell} title="You’re all caught up" />
      ) : (
        <ListSection inset={56}>
          {notifications.map((n) => {
            const Glyph = n.icon ?? Bell;
            return (
              <ListItem
                key={n.id}
                title={n.title}
                subtitle={[n.body, n.time].filter(Boolean).join(' · ')}
                leading={
                  <View>
                    <Glyph size="md" color={roles['on-surface-variant']} />
                    {n.unread && (
                      <View
                        style={{
                          position: 'absolute',
                          top: -2,
                          end: -2,
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: roles.primary,
                        }}
                      />
                    )}
                  </View>
                }
                trailing={
                  n.unread ? (
                    <Badge tone="info" size="sm">
                      New
                    </Badge>
                  ) : null
                }
                onPress={onPress && (() => onPress(n))}
                variant={onPress ? 'button' : 'static'}
              />
            );
          })}
        </ListSection>
      )}
      <View style={{ height: tokens.spacing[4] }} />
    </ScreenContainer>
  );
}

// ─── Search ──────────────────────────────────────────────────────────────────

export interface SearchScreenProps<T> {
  query: string;
  onQueryChange: (q: string) => void;
  results: T[];
  renderResult: (item: T) => React.ReactNode;
  keyOf: (item: T) => string;
  recent?: string[];
  placeholder?: string;
}

/** Search field, recent searches, results and a no-results state. */
export function SearchScreen<T>({
  query,
  onQueryChange,
  results,
  renderResult,
  keyOf,
  recent = [],
  placeholder,
}: SearchScreenProps<T>) {
  const { tokens, messages } = useTheme();
  return (
    <ScreenContainer scroll={false}>
      <SearchField value={query} onChangeText={onQueryChange} placeholder={placeholder} autoFocus />
      {!query && recent.length > 0 && (
        <View style={{ gap: tokens.spacing[2] }}>
          <Text variant="title-sm" color="on-surface-variant" accessibilityRole="header">
            Recent
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing[2] }}>
            {recent.map((r) => (
              <Chip key={r} label={r} onPress={() => onQueryChange(r)} />
            ))}
          </View>
        </View>
      )}
      {!!query && (
        <FlatList
          data={results}
          keyExtractor={keyOf}
          renderItem={({ item }) => <>{renderResult(item)}</>}
          keyboardDismissMode="on-drag"
          ListEmptyComponent={<EmptyState title={messages.noResultsFor(query)} />}
        />
      )}
    </ScreenContainer>
  );
}

// ─── Chat / AI assistant ─────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  /** Still streaming in. */
  streaming?: boolean;
}

export interface ChatScreenProps {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  /** Assistant is thinking (before the first token). */
  thinking?: boolean;
  placeholder?: string;
  empty?: React.ReactNode;
}

/** Conversation with a composer above the keyboard (web Conversation + PromptInput + MessageBubble). */
export function ChatScreen({
  messages: list,
  onSend,
  thinking,
  placeholder,
  empty,
}: ChatScreenProps) {
  const { roles, tokens, fonts, messages } = useTheme();
  const [text, setText] = React.useState('');
  const send = () => {
    const t = text.trim();
    if (!t) return;
    onSend(t);
    setText('');
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      style={{ flex: 1, backgroundColor: roles.surface }}
    >
      <FlatList
        data={[...list].reverse()}
        inverted
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: tokens.spacing[4], gap: tokens.spacing[3], flexGrow: 1 }}
        ListHeaderComponent={thinking ? <ThinkingDots /> : undefined}
        ListEmptyComponent={
          <View style={{ flex: 1, transform: [{ scaleY: -1 }] }}>
            {empty ?? <EmptyState icon={Sparkles} title="Ask anything" />}
          </View>
        }
        renderItem={({ item }) => {
          const mine = item.role === 'user';
          return (
            <View
              accessible
              accessibilityLabel={`${mine ? messages.youSaid : messages.assistantSaid}: ${item.text}`}
              style={{
                alignSelf: mine ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                paddingHorizontal: tokens.spacing[4],
                paddingVertical: tokens.spacing[3],
                borderRadius: tokens.shape.container,
                borderBottomEndRadius: mine ? tokens.shape.min : tokens.shape.container,
                borderBottomStartRadius: mine ? tokens.shape.container : tokens.shape.min,
                backgroundColor: roles[mine ? 'primary' : 'surface-container-high'],
              }}
            >
              <Text color={mine ? 'on-primary' : 'on-surface'}>
                {item.text}
                {item.streaming ? ' ▍' : ''}
              </Text>
            </View>
          );
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          gap: tokens.spacing[2],
          padding: tokens.spacing[3],
          borderTopWidth: 1,
          borderTopColor: roles['outline-variant'],
          backgroundColor: roles.surface,
        }}
      >
        <TextInput
          accessibilityLabel={messages.promptLabel}
          value={text}
          onChangeText={setText}
          placeholder={placeholder ?? messages.promptLabel}
          placeholderTextColor={roles['on-surface-muted']}
          multiline
          style={{
            flex: 1,
            minHeight: 44,
            maxHeight: 140,
            paddingHorizontal: tokens.spacing[4],
            paddingTop: 12,
            paddingBottom: 12,
            borderRadius: 22,
            backgroundColor: roles['surface-container-high'],
            color: roles['on-surface'],
            fontSize: tokens.type['body-md'].size,
            ...fontStyle('sans', 400, fonts),
          }}
        />
        <IconButton
          icon={ArrowUp}
          label={messages.sendMessage}
          variant="filled"
          disabled={!text.trim()}
          onPress={send}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

function ThinkingDots() {
  const { roles, messages } = useTheme();
  return (
    <View
      accessible
      accessibilityLabel={messages.thinking}
      accessibilityLiveRegion="polite"
      style={{ flexDirection: 'row', gap: 4, padding: 12, alignSelf: 'flex-start' }}
    >
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: roles['on-surface-variant'],
            opacity: 0.4 + i * 0.2,
          }}
        />
      ))}
    </View>
  );
}

// ─── Paywall ─────────────────────────────────────────────────────────────────

export interface Plan {
  id: string;
  name: string;
  /** Preformatted, e.g. "$9.99 / month". */
  price: string;
  features: string[];
  badge?: string;
}

export interface PaywallScreenProps {
  title: string;
  plans: Plan[];
  defaultPlan?: string;
  onSubscribe: (planId: string) => void;
  onRestore?: () => void;
  /** Legal copy (auto-renewal terms). */
  terms?: string;
}

/** Plan choice + subscribe (web PlanCard). */
export function PaywallScreen({
  title,
  plans,
  defaultPlan,
  onSubscribe,
  onRestore,
  terms,
}: PaywallScreenProps) {
  const { roles, tokens } = useTheme();
  const [plan, setPlan] = React.useState(defaultPlan ?? plans[0]?.id);
  return (
    <StickyFooter
      footer={
        <>
          <Button size="lg" fullWidth onPress={() => plan && onSubscribe(plan)}>
            Continue
          </Button>
          {onRestore && (
            <Button size="lg" fullWidth variant="text" onPress={onRestore}>
              Restore purchases
            </Button>
          )}
          {terms && (
            <Text variant="label-sm" color="on-surface-variant" style={{ textAlign: 'center' }}>
              {terms}
            </Text>
          )}
        </>
      }
    >
      <ScreenContainer>
        <Heading variant="headline-md">{title}</Heading>
        <View accessibilityRole="radiogroup" style={{ gap: tokens.spacing[3] }}>
          {plans.map((p) => {
            const on = p.id === plan;
            return (
              <Pressable
                key={p.id}
                accessibilityRole="radio"
                accessibilityLabel={`${p.name}, ${p.price}`}
                accessibilityState={{ checked: on }}
                haptic={on ? undefined : 'selection'}
                onPress={() => setPlan(p.id)}
                pressScale={0.98}
                style={{
                  padding: tokens.spacing[4],
                  gap: tokens.spacing[2],
                  borderRadius: tokens.shape.container,
                  borderWidth: on ? 2 : 1,
                  borderColor: on ? roles.primary : roles['outline-variant'],
                  backgroundColor: roles['surface-container-lowest'],
                }}
              >
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: tokens.spacing[2] }}
                >
                  <Text variant="title-md" style={{ flex: 1 }}>
                    {p.name}
                  </Text>
                  {p.badge && <Badge tone="info">{p.badge}</Badge>}
                </View>
                <Text variant="title-lg" tabular>
                  {p.price}
                </Text>
                {p.features.map((f) => (
                  <View key={f} style={{ flexDirection: 'row', gap: tokens.spacing[2] }}>
                    <Check size="sm" color={roles.success} />
                    <Text variant="body-sm" color="on-surface-variant" style={{ flex: 1 }}>
                      {f}
                    </Text>
                  </View>
                ))}
              </Pressable>
            );
          })}
        </View>
      </ScreenContainer>
    </StickyFooter>
  );
}

// ─── App switcher ────────────────────────────────────────────────────────────

export interface NexubApp {
  id: string;
  name: string;
  /** Tile art (e.g. @nexub/brand icon as an Image), else initials on the product tone. */
  icon?: React.ReactNode;
  tone?: 'leap' | 'bookub' | 'payub' | 'founderub' | 'primary';
}

export interface AppSwitcherSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apps: NexubApp[];
  current?: string;
  onOpenApp: (app: NexubApp) => void;
}

/** Nexub apps in a sheet (web AppLauncher). */
export function AppSwitcherSheet({
  open,
  onOpenChange,
  apps,
  current,
  onOpenApp,
}: AppSwitcherSheetProps) {
  const { roles, tokens } = useTheme();
  return (
    <BottomSheet open={open} onOpenChange={onOpenChange} title="Nexub apps">
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: tokens.spacing[4] }}>
        {apps.map((a) => {
          const tone = a.tone ?? 'primary';
          return (
            <Pressable
              key={a.id}
              accessibilityLabel={a.name}
              accessibilityState={{ selected: a.id === current }}
              onPress={() => {
                onOpenChange(false);
                onOpenApp(a);
              }}
              stateLayer={false}
              style={{ width: '25%', alignItems: 'center', gap: 6 }}
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  overflow: 'hidden',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: roles[`${tone}-container`],
                  borderWidth: a.id === current ? 2 : 0,
                  borderColor: roles.primary,
                }}
              >
                {a.icon ?? (
                  <Text variant="title-md" color={`on-${tone}-container`}>
                    {a.name.slice(0, 2)}
                  </Text>
                )}
              </View>
              <Text variant="label-md" numberOfLines={1}>
                {a.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </BottomSheet>
  );
}
