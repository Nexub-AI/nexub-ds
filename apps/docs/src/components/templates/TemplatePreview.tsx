'use client';

import * as React from 'react';
import {
  ActivityPage,
  ChatPage,
  CheckoutPage,
  DashboardPage,
  PaywallPage,
  SettingsPage,
  SignInPage,
  TransactionDetailPage,
  type ChatMessage,
  type Transaction,
} from '@nexub/patterns';
import { Avatar, Button, Logo, Switch } from '@nexub/react';
import { ArrowDown, CreditCard, Plus, Send } from '@nexub/icons';

const day = (d: number, h = 10) => new Date(2026, 9, 30 - d, h, 12);
const txs: Transaction[] = [
  { id: '1', title: 'Grab', subtitle: 'Transport', amount: -18.4, currency: 'SGD', date: day(0, 9) },
  { id: '2', title: 'Salary', subtitle: 'Nexub Pte. Ltd.', amount: 6200, currency: 'SGD', date: day(0, 8) },
  { id: '3', title: 'FairPrice', subtitle: 'Groceries', amount: -86.15, currency: 'SGD', date: day(1) },
  { id: '4', title: 'Mei Tan', subtitle: 'Dinner split', amount: 42.5, currency: 'SGD', date: day(1, 20) },
  { id: '5', title: 'Singtel', subtitle: 'Bills', amount: -45, currency: 'SGD', date: day(2), status: 'pending' },
  { id: '6', title: 'Netflix', subtitle: 'Subscriptions', amount: -19.98, currency: 'SGD', date: day(3) },
];
const noop = () => {};

function Dashboard() {
  return (
    <DashboardPage
      as="div"
      title="Good morning, Mei"
      balance={{ value: 12480.32, currency: 'SGD', label: 'Total balance' }}
      quickActions={[
        { id: 'send', label: 'Send', icon: <Send size={18} />, onSelect: noop },
        { id: 'add', label: 'Add money', icon: <Plus size={18} />, onSelect: noop },
        { id: 'request', label: 'Request', icon: <ArrowDown size={18} />, onSelect: noop },
        { id: 'card', label: 'Card', icon: <CreditCard size={18} />, onSelect: noop },
      ]}
      stats={[
        { label: 'Spent this month', value: 'S$1,842', delta: '8%', deltaType: 'decrease', sentiment: 'positive' },
        { label: 'Saved', value: 'S$2,400', delta: '12%', deltaType: 'increase', sentiment: 'positive' },
        { label: 'Bills due', value: '2', description: 'Next: Singtel on 2 Nov' },
      ]}
      recent={txs.slice(0, 4)}
      onSelectTransaction={noop}
      onSeeAllActivity={noop}
      insights={[{ id: 'i1', title: 'Transport is up 18%', body: 'You took 6 more rides than last month.', action: { label: 'See breakdown', onSelect: noop } }]}
    />
  );
}

function Activity() {
  const [refreshing, setRefreshing] = React.useState(false);
  return (
    <ActivityPage
      as="div"
      transactions={txs}
      onSelect={noop}
      refreshing={refreshing}
      onRefresh={() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 900);
      }}
      hasMore
      onLoadMore={noop}
    />
  );
}

function Detail() {
  return (
    <TransactionDetailPage
      as="div"
      transaction={txs[3]!}
      rows={[
        { label: 'From', value: 'Mei Tan' },
        { label: 'Reference', value: 'Dinner at Burnt Ends' },
        { label: 'Transaction ID', value: 'PX-2026-104233' },
      ]}
      footer={<Button variant="tonal">Split bill</Button>}
      onBack={noop}
    />
  );
}

function Settings() {
  const [faceId, setFaceId] = React.useState(true);
  return (
    <SettingsPage
      as="div"
      header={
        <div className="flex items-center gap-3">
          <Avatar name="Mei Tan" size="lg" />
          <div>
            <p className="m-0 text-title-md text-[var(--color-on-surface)]">Mei Tan</p>
            <p className="m-0 text-body-sm text-[var(--color-on-surface-variant)]">mei@payub.sg</p>
          </div>
        </div>
      }
      groups={[
        { header: 'Security', items: [
          { title: 'Face ID', subtitle: 'Unlock and approve payments', control: <Switch aria-label="Face ID" checked={faceId} onCheckedChange={setFaceId} /> },
          { title: 'Change PIN', href: '#' },
        ] },
        { header: 'Preferences', footer: 'Used for receipts and statements.', items: [
          { title: 'Language', value: 'English' },
          { title: 'Currency', value: 'SGD' },
        ] },
        { items: [{ title: 'Sign out', destructive: true, onSelect: noop }] },
      ]}
    />
  );
}

function SignIn() {
  return <SignInPage as="div" logo={<Logo size="md" product="Payub" />} onSubmit={noop} onBiometric={noop} biometricLabel="Sign in with a passkey" onForgotPassword={noop} onCreateAccount={noop} />;
}

function Checkout() {
  return (
    <CheckoutPage
      as="div"
      from="SGD"
      to="MYR"
      balance={12480.32}
      quote={(a) => ({ fee: Math.max(1.5, a * 0.004), rate: 3.38, arrives: 'In seconds' })}
      confirmLabel="Send money"
      confirmHint="To Ahmad Ismail, Maybank ••4821"
      onConfirm={() => new Promise((r) => setTimeout(r, 700))}
      onDone={noop}
    />
  );
}

function Chat() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    { id: 'a', role: 'user', text: 'How much did I spend on transport this month?' },
    { id: 'b', role: 'assistant', text: 'S$214.60 across 23 rides, up 18% on September. Most of it was Grab between 8 and 9 am.' },
  ]);
  return (
    <ChatPage
      as="div"
      messages={messages}
      onSend={(text) => setMessages((m) => [...m, { id: String(m.length), role: 'user', text }])}
      title="Payub assistant"
    />
  );
}

function Paywall() {
  return (
    <PaywallPage
      as="div"
      title="Payub Plus"
      plans={[
        { id: 'monthly', name: 'Monthly', price: 'S$6.98 / month', features: ['Free overseas transfers', 'Unlimited virtual cards'] },
        { id: 'yearly', name: 'Yearly', price: 'S$59.90 / year', features: ['Everything in Monthly', '2 months free'], badge: 'Best value' },
      ]}
      defaultPlan="yearly"
      onSubscribe={noop}
      onRestore={noop}
      terms="Renews automatically. Cancel any time in Settings."
    />
  );
}

export const templatePreviews = {
  dashboard: Dashboard,
  activity: Activity,
  'transaction-detail': Detail,
  settings: Settings,
  'sign-in': SignIn,
  checkout: Checkout,
  chat: Chat,
  paywall: Paywall,
} as const;

export type TemplateSlug = keyof typeof templatePreviews;

export function TemplatePreview({ slug }: { slug: TemplateSlug }) {
  const C = templatePreviews[slug];
  return <C />;
}
