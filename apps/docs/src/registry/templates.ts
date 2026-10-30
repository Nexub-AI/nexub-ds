/**
 * Page templates: full pages in @nexub/patterns, each paired with the
 * @nexub/react-native screen that does the same job.
 */
import type { NativeTwin } from './native';

export interface TemplateEntry {
  slug: 'dashboard' | 'activity' | 'transaction-detail' | 'settings' | 'sign-in' | 'checkout' | 'chat' | 'paywall';
  title: string;
  /** Export from @nexub/patterns. */
  web: string;
  description: string;
  code: string;
  native: NativeTwin;
}

export const templateEntries: TemplateEntry[] = [
  {
    slug: 'dashboard',
    title: 'Dashboard',
    web: 'DashboardPage',
    description: 'The home of a money app: balance, quick actions, this month at a glance, recent activity and insights.',
    code: `<DashboardPage
  title="Good morning, Mei"
  balance={{ value: 12480.32, currency: 'SGD', label: 'Total balance' }}
  quickActions={[{ id: 'send', label: 'Send', icon: <Send />, onSelect: send }]}
  stats={[{ label: 'Spent this month', value: 'S$1,842', delta: '8%', deltaType: 'decrease', sentiment: 'positive' }]}
  recent={transactions}
  onSelectTransaction={open}
  onSeeAllActivity={() => router.push('/activity')}
/>`,
    native: {
      name: 'HomeScreen',
      preview: 'pattern/home',
      differences: [
        { aspect: 'Layout', web: 'Stats in a grid beside the activity at desktop widths.', mobile: 'One column: balance hero, up to four quick actions, recent activity, insights.' },
        { aspect: 'Refresh', web: 'Data refreshes in place.', mobile: 'Pull to refresh (`onRefresh`).' },
        { aspect: 'Actions', web: '`onSelect` and an icon element.', mobile: '`onPress` and an icon component.' },
      ],
      code: `import { HomeScreen } from '@nexub/react-native/patterns';

<HomeScreen greeting="Good morning, Mei" balance={balance} quickActions={actions} recent={txs} onTransactionPress={open} />`,
    },
  },
  {
    slug: 'activity',
    title: 'Activity',
    web: 'ActivityPage',
    description: 'Transactions grouped by day, with refresh, load more and row actions.',
    code: `<ActivityPage transactions={txs} onSelect={open} onRefresh={refetch} refreshing={loading} hasMore onLoadMore={next} />`,
    native: {
      name: 'ActivityList',
      preview: 'pattern/activity',
      differences: [
        { aspect: 'Refresh', web: 'A Refresh button.', mobile: 'Pull to refresh.' },
        { aspect: 'Paging', web: 'Load more.', mobile: 'Infinite scroll (`onEndReached`).' },
        { aspect: 'Row actions', web: '`rowActions` renders buttons or a menu.', mobile: 'Swipe actions, also accessibility actions.' },
      ],
      code: `import { ActivityList } from '@nexub/react-native/patterns';

<ActivityList transactions={txs} onPress={open} onRefresh={refetch} refreshing={loading} />`,
    },
  },
  {
    slug: 'transaction-detail',
    title: 'Transaction detail',
    web: 'TransactionDetailPage',
    description: 'One transaction: the amount, who and when, the details as rows, and follow-up actions.',
    code: `<TransactionDetailPage transaction={tx} rows={[{ label: 'Reference', value: tx.ref }]} footer={<Button variant="tonal">Split bill</Button>} onBack={back} />`,
    native: {
      name: 'TransactionDetail',
      preview: 'pattern/detail',
      differences: [{ aspect: 'Back', web: '`onBack` renders a back link.', mobile: 'The native stack header handles back.' }],
      code: `import { TransactionDetail } from '@nexub/react-native/patterns';

<TransactionDetail transaction={tx} rows={rows} actions={<Button variant="tonal">Split bill</Button>} />`,
    },
  },
  {
    slug: 'settings',
    title: 'Settings',
    web: 'SettingsPage',
    description: 'Grouped settings with a profile header, controls at the end of each row, and a destructive sign-out.',
    code: `<SettingsPage header={<ProfileCard />} groups={[{ header: 'Security', items: [{ title: 'Face ID', control: <Switch aria-label="Face ID" /> }] }]} />`,
    native: {
      name: 'SettingsScreen',
      preview: 'pattern/settings',
      differences: [{ aspect: 'Rows', web: '`control` puts any control at the end of a static row.', mobile: 'ListItem variants (`switch`, `navigation`, `value`), one target per row.' }],
      code: `import { SettingsScreen } from '@nexub/react-native/patterns';

<SettingsScreen groups={[{ header: 'Security', items: [{ title: 'Face ID', variant: 'switch', checked, onCheckedChange }] }]} />`,
    },
  },
  {
    slug: 'sign-in',
    title: 'Sign in',
    web: 'SignInPage',
    description: 'Email and password with passkey autofill, a biometric or passkey option, and recovery links.',
    code: `<SignInPage logo={<Logo product="Payub" />} onSubmit={signIn} onBiometric={passkey} biometricLabel="Sign in with a passkey" error={error} />`,
    native: {
      name: 'SignInScreen',
      preview: 'pattern/signin',
      differences: [
        { aspect: 'Autofill', web: '`autocomplete="username webauthn"` for password managers and passkeys.', mobile: 'Platform autofill hints for iCloud Keychain and Android Autofill.' },
        { aspect: 'Biometrics', web: 'Passkeys through the browser.', mobile: 'Face ID or fingerprint via `onBiometric`.' },
      ],
      code: `import { SignInScreen } from '@nexub/react-native/patterns';

<SignInScreen onSubmit={signIn} onBiometric={unlock} biometricLabel="Sign in with Face ID" />`,
    },
  },
  {
    slug: 'checkout',
    title: 'Send money',
    web: 'CheckoutPage',
    description: 'Amount, review and result in one page: live quote, fee and rate, balance check, and focus moved to each step.',
    code: `<CheckoutPage from="SGD" to="MYR" balance={balance} quote={getQuote} confirmLabel="Send money" onConfirm={send} onDone={done} />`,
    native: {
      name: 'AmountStep + ReviewStep + ResultScreen',
      preview: 'pattern/send',
      differences: [
        { aspect: 'Steps', web: 'One page; steps swap in place.', mobile: 'One screen per step on the navigation stack.' },
        { aspect: 'Amount entry', web: 'MoneyInput with the keyboard.', mobile: 'ExpressiveMoneyInput with the NumericKeypad.' },
      ],
      code: `import { AmountStep, ReviewStep, ResultScreen } from '@nexub/react-native/patterns';`,
    },
  },
  {
    slug: 'chat',
    title: 'Chat',
    web: 'ChatPage',
    description: 'An assistant conversation: messages, streaming, thinking state, and a composer with stop.',
    code: `<ChatPage messages={messages} onSend={send} onStop={stop} thinking={streaming} title="Payub assistant" />`,
    native: {
      name: 'ChatScreen',
      preview: 'pattern/chat',
      differences: [{ aspect: 'Composer', web: 'PromptInput with keyboard shortcuts.', mobile: 'Pinned above the keyboard; send on return.' }],
      code: `import { ChatScreen } from '@nexub/react-native/patterns';

<ChatScreen messages={messages} onSend={send} thinking={streaming} />`,
    },
  },
  {
    slug: 'paywall',
    title: 'Paywall',
    web: 'PaywallPage',
    description: 'Plans as a radio group, one Continue button, restore and terms.',
    code: `<PaywallPage title="Payub Plus" plans={plans} defaultPlan="yearly" onSubscribe={subscribe} onRestore={restore} terms={terms} />`,
    native: {
      name: 'PaywallScreen',
      preview: 'pattern/paywall',
      differences: [{ aspect: 'Purchases', web: 'Your checkout.', mobile: 'In-app purchase; Restore purchases is required by the App Store.' }],
      code: `import { PaywallScreen } from '@nexub/react-native/patterns';

<PaywallScreen title="Payub Plus" plans={plans} onSubscribe={buy} onRestore={restore} />`,
    },
  },
];

export const getTemplateEntry = (slug: string) => templateEntries.find((t) => t.slug === slug);
