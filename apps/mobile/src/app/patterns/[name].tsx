import { useState } from 'react';
import { Stack as Screen, router, useLocalSearchParams } from 'expo-router';
import { ArrowDown, Bell, Copy, CreditCard, Globe, Lock, Plus, Send as SendIcon, Trash2, User, Wallet } from '@nexub/icons/native';
import { Avatar, Button, Icon, ListItem, Text, useToast, type GlassMode } from '@nexub/react-native';
import {
  ActivityList,
  AmountStep,
  AppSwitcherSheet,
  AppearanceSection,
  ChatScreen,
  HomeScreen,
  LockScreen,
  NotificationsInbox,
  OnboardingScreen,
  PaywallScreen,
  PermissionPrimer,
  ProfileHeader,
  ResultScreen,
  ReviewStep,
  SearchScreen,
  SettingsScreen,
  SignInScreen,
  TransactionDetail,
  VerifyCodeScreen,
  type ChatMessage,
  type Transaction,
} from '@nexub/react-native/patterns';

const day = (d: number) => new Date(Date.now() - d * 86_400_000);
const TX: Transaction[] = [
  { id: '1', title: 'Amazon', subtitle: 'Card · Shopping', amount: -42.5, currency: 'USD', date: day(0) },
  { id: '2', title: 'Salary', subtitle: 'Acme Corp', amount: 4200, currency: 'USD', date: day(1) },
  { id: '3', title: 'Netflix', subtitle: 'Card · Subscriptions', amount: -15.99, currency: 'USD', date: day(1), status: 'pending' },
  { id: '4', title: 'Asha Rao', subtitle: 'Transfer', amount: -250, currency: 'USD', date: day(3) },
  { id: '5', title: 'Refund', subtitle: 'Airline', amount: 120, currency: 'USD', date: day(4), status: 'failed' },
];

function Signin() {
  return <SignInScreen logo={<Icon icon={Wallet} color="tertiary" size="xl" />} title="Welcome back" onSubmit={() => router.push('/patterns/verify')} biometricLabel="Sign in with Face ID" onBiometric={() => router.push('/patterns/activity')} onForgotPassword={() => {}} onCreateAccount={() => {}} />;
}
function Verify() {
  return <VerifyCodeScreen destination="+65 •••• 4821" onComplete={() => router.push('/patterns/activity')} onResend={() => {}} />;
}
function Lockscreen() {
  return <LockScreen appName="Payub" unlockLabel="Unlock with Face ID" onUnlock={() => router.back()} onUsePasscode={() => {}} />;
}
function Onboarding() {
  return (
    <OnboardingScreen
      slides={[
        { title: 'Send money abroad', body: 'The real exchange rate, with every fee shown before you pay.', art: <Icon icon={Globe} size={64} color="primary" /> },
        { title: 'One card, 40 currencies', body: 'Spend like a local. Freeze it in a tap.', art: <Icon icon={CreditCard} size={64} color="tertiary" /> },
      ]}
      onGetStarted={() => router.push('/patterns/permission')}
      onSignIn={() => router.push('/patterns/signin')}
    />
  );
}
function Permission() {
  return <PermissionPrimer icon={Bell} title="Know when money arrives" body="We’ll notify you about payments and security alerts. Nothing else." onAllow={() => router.back()} onNotNow={() => router.back()} />;
}
function Home() {
  const [refreshing, setRefreshing] = useState(false);
  return (
    <HomeScreen
      greeting="Good morning, Asha"
      balance={{ value: 12840.5, currency: 'USD' }}
      quickActions={[
        { id: 'send', label: 'Send', icon: SendIcon, onPress: () => router.push('/patterns/send') },
        { id: 'add', label: 'Add money', icon: Plus, onPress: () => {} },
        { id: 'request', label: 'Request', icon: ArrowDown, onPress: () => {} },
        { id: 'card', label: 'Card', icon: CreditCard, onPress: () => {} },
      ]}
      recent={TX.slice(0, 3)}
      onTransactionPress={(t) => router.push(`/patterns/detail?id=${t.id}`)}
      onSeeAllActivity={() => router.push('/patterns/activity')}
      insights={[
        { id: 'spend', title: 'Spending is down 12%', body: 'You spent $420 less on shopping than last month.' },
        { id: 'bill', title: 'Netflix renews tomorrow', body: '$15.99 from your USD balance.', action: { label: 'Manage', onPress: () => {} } },
      ]}
      refreshing={refreshing}
      onRefresh={() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
      }}
    />
  );
}
function Activity() {
  const toast = useToast();
  const [refreshing, setRefreshing] = useState(false);
  return (
    <ActivityList
      transactions={TX}
      onPress={(t) => router.push({ pathname: '/patterns/[name]', params: { name: 'detail', id: t.id } })}
      refreshing={refreshing}
      onRefresh={() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 800);
      }}
      actions={(t) => [
        { label: 'Copy', icon: Copy, onPress: () => toast({ message: `${t.title} copied` }) },
        { label: 'Hide', icon: Trash2, tone: 'danger', onPress: () => toast({ message: `${t.title} hidden`, action: { label: 'Undo', onPress: () => {} } }) },
      ]}
    />
  );
}
function Detail() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const t = TX.find((x) => x.id === id) ?? TX[0]!;
  return <TransactionDetail transaction={t} rows={[{ label: 'Reference', value: 'NX-4821-XQ' }]} actions={<Button variant="tonal" fullWidth size="lg">Get help</Button>} />;
}
function Send() {
  return <AmountStep from="USD" to="EUR" balance={12480.5} quote={(a) => ({ fee: Math.max(1, +(a * 0.004).toFixed(2)), rate: 0.9182, arrives: 'In seconds' })} onContinue={() => router.push('/patterns/review')} />;
}
function Review() {
  const [loading, setLoading] = useState(false);
  return (
    <ReviewStep
      rows={[
        { label: 'To', value: 'Asha Rao · ••••4821' },
        { label: 'You send', value: '$250.00' },
        { label: 'Fee', value: '$1.00' },
        { label: 'Rate', value: '1 USD = 0.9182 EUR' },
        { label: 'Asha gets', value: '€228.63' },
        { label: 'Arrives', value: 'In seconds' },
      ]}
      confirmLabel="Confirm and send"
      confirmHint="You’ll confirm with Face ID"
      loading={loading}
      onConfirm={() => {
        setLoading(true);
        setTimeout(() => router.push('/patterns/success'), 600);
      }}
    />
  );
}
function Success() {
  return <ResultScreen kind="success" title="Money sent" amount={{ value: 250, currency: 'USD' }} description="Asha will get €228.63 in seconds." primary={{ label: 'Done', onPress: () => router.dismissAll() }} secondary={{ label: 'Share receipt', onPress: () => {} }} />;
}
function Settings() {
  const [faceId, setFaceId] = useState(true);
  return (
    <SettingsScreen
      header={<ProfileHeader name="Asha Rao" detail="asha@example.com" onPress={() => {}} />}
      groups={[
        {
          header: 'Security',
          footer: 'Face ID approves payments over $500.',
          items: [
            { variant: 'switch', title: 'Face ID', leading: <Icon icon={Lock} />, checked: faceId, onCheckedChange: setFaceId },
            { title: 'Lock screen', leading: <Icon icon={User} />, onPress: () => router.push('/patterns/lock') },
          ],
        },
        { header: 'Notifications', items: [{ title: 'Inbox', value: '2 new', leading: <Icon icon={Bell} />, onPress: () => router.push('/patterns/inbox') }] },
        { items: [{ variant: 'button', title: 'Sign out', destructive: true, onPress: () => {} }] },
      ]}
    />
  );
}
function Appearance() {
  const [scheme, setScheme] = useState<'system' | 'light' | 'dark'>('system');
  const [glass, setGlass] = useState<GlassMode>('balanced');
  const [haptics, setHaptics] = useState(true);
  return (
    <SettingsScreen
      groups={[]}
      header={<AppearanceSection scheme={scheme} onSchemeChange={setScheme} glass={glass} onGlassChange={setGlass} haptics={haptics} onHapticsChange={setHaptics} />}
    />
  );
}
function Inbox() {
  const [read, setRead] = useState(false);
  return (
    <NotificationsInbox
      onMarkAllRead={() => setRead(true)}
      notifications={[
        { id: '1', title: 'You received $4,200.00', body: 'From Acme Corp', time: '1 h ago', unread: !read, icon: Wallet },
        { id: '2', title: 'New sign-in on iPad', body: 'Singapore', time: 'Yesterday', unread: !read, icon: Lock },
        { id: '3', title: 'Card payment declined', body: 'Netflix · insufficient funds', time: 'Mon', icon: CreditCard },
      ]}
    />
  );
}
function Search() {
  const [q, setQ] = useState('');
  const results = TX.filter((t) => t.title.toLowerCase().includes(q.toLowerCase()));
  return <SearchScreen query={q} onQueryChange={setQ} results={results} keyOf={(t) => t.id} recent={['Amazon', 'Salary']} renderResult={(t) => <ListItem title={t.title} subtitle={t.subtitle} leading={<Avatar name={t.title} />} />} />;
}
function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: '0', role: 'assistant', text: 'Hi Asha, how can I help with your money today?' }]);
  const [thinking, setThinking] = useState(false);
  return (
    <ChatScreen
      messages={messages}
      thinking={thinking}
      onSend={(text) => {
        setMessages((m) => [...m, { id: String(m.length), role: 'user', text }]);
        setThinking(true);
        setTimeout(() => {
          setThinking(false);
          setMessages((m) => [...m, { id: String(m.length), role: 'assistant', text: 'You spent $58.49 on subscriptions this month: Netflix and Spotify.' }]);
        }, 900);
      }}
    />
  );
}
function Paywall() {
  return (
    <PaywallScreen
      title="Payub Plus"
      plans={[
        { id: 'monthly', name: 'Monthly', price: '$4.99 / month', features: ['Free international transfers', 'Interest on balances'] },
        { id: 'yearly', name: 'Yearly', price: '$39.99 / year', badge: 'Save 33%', features: ['Everything in Monthly', 'Priority support'] },
      ]}
      defaultPlan="yearly"
      onSubscribe={() => router.back()}
      onRestore={() => {}}
      terms="Renews automatically. Cancel anytime in Settings."
    />
  );
}
function Apps() {
  const [open, setOpen] = useState(true);
  return (
    <>
      <Button onPress={() => setOpen(true)} style={{ margin: 16 }}>
        Open app switcher
      </Button>
      <Text style={{ marginHorizontal: 16 }} color="on-surface-variant">
        The Nexub apps sheet (web AppLauncher).
      </Text>
      <AppSwitcherSheet
        open={open}
        onOpenChange={setOpen}
        current="payub"
        onOpenApp={() => {}}
        apps={[
          { id: 'payub', name: 'Payub', tone: 'payub' },
          { id: 'bookub', name: 'Bookub', tone: 'bookub' },
          { id: 'leap', name: 'Leap', tone: 'leap' },
          { id: 'founderub', name: 'Founderub', tone: 'founderub' },
        ]}
      />
    </>
  );
}

export const PATTERNS: Record<string, { title: string; subtitle: string; Component: () => React.JSX.Element; headerShown?: boolean }> = {
  onboarding: { title: 'Onboarding', subtitle: 'Slides → permission primer', Component: Onboarding, headerShown: false },
  permission: { title: 'Permission primer', subtitle: 'Before the OS prompt', Component: Permission },
  signin: { title: 'Sign in', subtitle: 'Email, password, Face ID', Component: Signin },
  verify: { title: 'Verify code', subtitle: 'OTP with SMS autofill', Component: Verify },
  lock: { title: 'Lock screen', subtitle: 'Biometric unlock', Component: Lockscreen },
  home: { title: 'Home', subtitle: 'Balance, quick actions, insights', Component: Home },
  activity: { title: 'Activity', subtitle: 'Grouped list, swipe, refresh', Component: Activity },
  detail: { title: 'Transaction', subtitle: 'Detail and status', Component: Detail },
  send: { title: 'Send money', subtitle: 'Amount with live quote', Component: Send },
  review: { title: 'Review', subtitle: 'Confirm before money moves', Component: Review },
  success: { title: 'Success', subtitle: 'Result screen', Component: Success, headerShown: false },
  settings: { title: 'Settings', subtitle: 'Profile, security, sign out', Component: Settings },
  appearance: { title: 'Appearance', subtitle: 'Theme, glass dial, haptics', Component: Appearance },
  inbox: { title: 'Notifications', subtitle: 'Inbox with unread', Component: Inbox },
  search: { title: 'Search', subtitle: 'Recent, results, empty', Component: Search },
  chat: { title: 'Assistant', subtitle: 'Chat with composer', Component: Chat },
  paywall: { title: 'Paywall', subtitle: 'Plans and subscribe', Component: Paywall },
  apps: { title: 'App switcher', subtitle: 'Nexub apps sheet', Component: Apps },
};

export default function PatternScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const p = PATTERNS[name] ?? PATTERNS.activity!;
  return (
    <>
      <Screen.Screen options={{ title: p.title, headerShown: p.headerShown ?? true, headerLargeTitle: false }} />
      <p.Component />
    </>
  );
}
