// 8.2 (T1): behaviour tests for the screen patterns patterns.test.tsx doesn't cover.
import * as React from 'react';
import { Text as RNText } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Button, NexubNativeProvider } from '../index';
import {
  AppSwitcherSheet,
  AppearanceSection,
  AuthScreen,
  ChatScreen,
  FlowStep,
  LockScreen,
  NotificationsInbox,
  OnboardingScreen,
  PaywallScreen,
  PermissionPrimer,
  ProfileHeader,
  ResultScreen,
  SearchScreen,
  SettingsScreen,
  TransactionDetail,
} from '../patterns';

jest.mock('expo-haptics', () => ({
  selectionAsync: jest.fn(() => Promise.resolve()),
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {},
  NotificationFeedbackType: {},
  AndroidHaptics: {},
}));

const Provider = ({ children }: { children: React.ReactNode }) => (
  <NexubNativeProvider scheme="light" contrast="standard" locale="en-US">
    {children}
  </NexubNativeProvider>
);
const wrap = (ui: React.ReactElement) => render(ui, { wrapper: Provider });
const press = (name: string | RegExp, role = 'button') => fireEvent.press(screen.getByRole(role, { name }));

it('AuthScreen: title, content, footer, and the error as an alert', async () => {
  await wrap(
    <AuthScreen title="Create account" description="It takes a minute." error="Email already used" footer={<Button onPress={() => {}}>Continue</Button>}>
      <RNText>fields</RNText>
    </AuthScreen>,
  );
  expect(screen.getByRole('header', { name: 'Create account' })).toBeTruthy();
  expect(screen.getByText('It takes a minute.')).toBeTruthy();
  expect(screen.getByText('fields')).toBeTruthy();
  expect(screen.getByText('Email already used')).toBeTruthy();
  expect(screen.container.queryAll((n) => n.props.accessibilityRole === 'alert')).toHaveLength(1);
  expect(screen.getByRole('button', { name: 'Continue' })).toBeTruthy();
});

it('LockScreen: unlock and the passcode fallback', async () => {
  const onUnlock = jest.fn();
  const onUsePasscode = jest.fn();
  await wrap(<LockScreen appName="Payub" unlockLabel="Unlock with Face ID" onUnlock={onUnlock} onUsePasscode={onUsePasscode} />);
  expect(screen.getByRole('header', { name: 'Payub is locked' })).toBeTruthy();
  await press('Unlock with Face ID');
  await press('Use passcode');
  expect(onUnlock).toHaveBeenCalled();
  expect(onUsePasscode).toHaveBeenCalled();
  await screen.rerender(<LockScreen unlockLabel="Unlock" onUnlock={onUnlock} />);
  expect(screen.getByRole('header', { name: 'Locked' })).toBeTruthy();
  expect(screen.queryByRole('button', { name: 'Use passcode' })).toBeNull();
});

it('FlowStep: progress reads the step; title and footer', async () => {
  await wrap(
    <FlowStep step={2} total={4} title="Who to?" footer={<Button onPress={() => {}}>Next</Button>}>
      <RNText>recipients</RNText>
    </FlowStep>,
  );
  expect(screen.getByRole('progressbar', { name: 'Page 2 of 4' })).toHaveAccessibilityValue({ now: 50 });
  expect(screen.getByRole('header', { name: 'Who to?' })).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Next' })).toBeTruthy();
});

describe('TransactionDetail', () => {
  const tx = { id: '1', title: 'Coffee Lab', subtitle: 'Card •• 4821', amount: -4.5, currency: 'USD', date: new Date(2026, 9, 30, 9, 15) };

  it('shows the payee, signed amount, status, date and extra rows', async () => {
    await wrap(<TransactionDetail transaction={tx} rows={[{ label: 'Reference', value: 'NX-42' }]} actions={<Button onPress={() => {}}>Report</Button>} />);
    expect(screen.getByRole('image', { name: 'Coffee Lab' })).toBeTruthy();
    expect(screen.getByLabelText('-$4.50')).toBeTruthy();
    expect(screen.getByText('Completed')).toBeTruthy();
    expect(screen.getByLabelText(/^Date, Friday, October 30, 2026/)).toBeTruthy();
    expect(screen.getByLabelText('Details, Card •• 4821')).toBeTruthy();
    expect(screen.getByLabelText('Reference, NX-42')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Report' })).toBeTruthy();
  });

  it('pending and failed statuses', async () => {
    await wrap(<TransactionDetail transaction={{ ...tx, status: 'failed' }} />);
    expect(screen.getByText('Failed')).toBeTruthy();
    await screen.rerender(<TransactionDetail transaction={{ ...tx, status: 'pending' }} />);
    expect(screen.getByText('Pending')).toBeTruthy();
  });
});

it('ResultScreen: title, amount, primary and secondary actions', async () => {
  const done = jest.fn();
  const share = jest.fn();
  await wrap(
    <ResultScreen
      title="Money sent"
      description="Arrives in seconds."
      amount={{ value: 20, currency: 'USD' }}
      primary={{ label: 'Done', onPress: done }}
      secondary={{ label: 'Share receipt', onPress: share }}
    />,
  );
  expect(screen.getByRole('header', { name: 'Money sent' })).toBeTruthy();
  expect(screen.getByLabelText('$20.00')).toBeTruthy();
  await press('Done');
  await press('Share receipt');
  expect(done).toHaveBeenCalled();
  expect(share).toHaveBeenCalled();
});

it('OnboardingScreen: slides with a page indicator; Get started and Sign in', async () => {
  const onGetStarted = jest.fn();
  const onSignIn = jest.fn();
  await wrap(
    <OnboardingScreen
      slides={[
        { title: 'Send money', body: 'In seconds.' },
        { title: 'Track spending', body: 'Every day.' },
      ]}
      onGetStarted={onGetStarted}
      onSignIn={onSignIn}
    />,
  );
  expect(screen.getByRole('header', { name: 'Send money' })).toBeTruthy();
  expect(screen.getByLabelText('Page 1 of 2')).toBeTruthy();
  await press('Get started');
  await press('I already have an account');
  expect(onGetStarted).toHaveBeenCalled();
  expect(onSignIn).toHaveBeenCalled();
});

it('PermissionPrimer: explains, then Continue or Not now', async () => {
  const onAllow = jest.fn();
  const onNotNow = jest.fn();
  await wrap(<PermissionPrimer title="Turn on notifications" body="Know when money arrives." onAllow={onAllow} onNotNow={onNotNow} />);
  expect(screen.getByRole('header', { name: 'Turn on notifications' })).toBeTruthy();
  await press('Continue');
  await press('Not now');
  expect(onAllow).toHaveBeenCalled();
  expect(onNotNow).toHaveBeenCalled();
});

it('SettingsScreen: grouped rows with headers, footers and actions', async () => {
  const onLanguage = jest.fn();
  const onFaceId = jest.fn();
  await wrap(
    <SettingsScreen
      header={<RNText>profile</RNText>}
      groups={[
        { header: 'General', footer: 'Applies everywhere.', items: [{ title: 'Language', value: 'English', onPress: onLanguage }] },
        { header: 'Security', items: [{ title: 'Face ID', variant: 'switch', checked: false, onCheckedChange: onFaceId }] },
      ]}
    />,
  );
  expect(screen.getByText('profile')).toBeTruthy();
  expect(screen.getByRole('header', { name: 'General' })).toBeTruthy();
  expect(screen.getByText('Applies everywhere.')).toBeTruthy();
  await press('Language, English');
  expect(onLanguage).toHaveBeenCalled();
  await press('Face ID', 'switch');
  expect(onFaceId).toHaveBeenCalledWith(true);
});

it('AppearanceSection: theme, glass and haptics drive their callbacks', async () => {
  const onSchemeChange = jest.fn();
  const onGlassChange = jest.fn();
  const onHapticsChange = jest.fn();
  await wrap(
    <AppearanceSection
      scheme="system"
      onSchemeChange={onSchemeChange}
      glass="balanced"
      onGlassChange={onGlassChange}
      haptics
      onHapticsChange={onHapticsChange}
    />,
  );
  expect(screen.getByRole('tab', { name: 'System' })).toBeSelected();
  expect(screen.getByRole('tab', { name: 'Balanced' })).toBeSelected();
  await press('Dark', 'tab');
  expect(onSchemeChange).toHaveBeenCalledWith('dark');
  await press('Solid', 'tab');
  expect(onGlassChange).toHaveBeenCalledWith('off');
  await press(/^Haptics/, 'switch');
  expect(onHapticsChange).toHaveBeenCalledWith(false);
});

it('ProfileHeader: one button named by name and detail', async () => {
  const onPress = jest.fn();
  await wrap(<ProfileHeader name="Mei Tan" detail="mei@example.com" onPress={onPress} />);
  await press('Mei Tan, mei@example.com');
  expect(onPress).toHaveBeenCalled();
});

describe('NotificationsInbox', () => {
  const items = [
    { id: 'a', title: 'Money received', body: '$20 from Ana', time: '2 min ago', unread: true },
    { id: 'b', title: 'Card shipped', time: 'Yesterday' },
  ];

  it('marks unread, opens an item, and marks all read', async () => {
    const onPress = jest.fn();
    const onMarkAllRead = jest.fn();
    await wrap(<NotificationsInbox notifications={items} onPress={onPress} onMarkAllRead={onMarkAllRead} />);
    expect(screen.getAllByText('New')).toHaveLength(1);
    await press(/^Money received, \$20 from Ana · 2 min ago/);
    expect(onPress).toHaveBeenCalledWith(items[0]);
    await press('Mark all as read');
    expect(onMarkAllRead).toHaveBeenCalled();
  });

  it('no Mark all read when nothing is unread; an empty state when there is nothing', async () => {
    await wrap(<NotificationsInbox notifications={[items[1]!]} onMarkAllRead={() => {}} />);
    expect(screen.queryByRole('button', { name: 'Mark all as read' })).toBeNull();
    await screen.rerender(<NotificationsInbox notifications={[]} />);
    expect(screen.getByText('You’re all caught up')).toBeTruthy();
  });
});

describe('SearchScreen', () => {
  const props = {
    onQueryChange: jest.fn(),
    keyOf: (s: string) => s,
    renderResult: (s: string) => <RNText>{s}</RNText>,
    recent: ['coffee'],
  };

  it('recent searches fill the query; typing reports it', async () => {
    await wrap(<SearchScreen {...props} query="" results={[]} />);
    await press('coffee');
    expect(props.onQueryChange).toHaveBeenLastCalledWith('coffee');
    await fireEvent.changeText(screen.getByLabelText('Search'), 'tea');
    expect(props.onQueryChange).toHaveBeenLastCalledWith('tea');
  });

  it('shows results, or a no-results state for the query', async () => {
    await wrap(<SearchScreen {...props} query="cof" results={['Coffee Lab']} />);
    expect(screen.getByText('Coffee Lab')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'coffee' })).toBeNull(); // recent hidden while searching
    await screen.rerender(<SearchScreen {...props} query="zzz" results={[]} />);
    expect(screen.getByText('No results for “zzz”')).toBeTruthy();
  });
});

describe('ChatScreen', () => {
  it('sends the trimmed draft and clears it; Send is off while empty', async () => {
    const onSend = jest.fn();
    await wrap(<ChatScreen messages={[]} onSend={onSend} />);
    expect(screen.getByText('Ask anything')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Send message' })).toBeDisabled();
    await fireEvent.changeText(screen.getByLabelText('Message'), '  hello  ');
    await press('Send message');
    expect(onSend).toHaveBeenCalledWith('hello');
    expect(screen.getByLabelText('Message').props.value).toBe('');
  });

  it('reads each bubble with its speaker and shows thinking', async () => {
    await wrap(
      <ChatScreen
        thinking
        onSend={() => {}}
        messages={[
          { id: '1', role: 'user', text: 'Hi' },
          { id: '2', role: 'assistant', text: 'Hello!' },
        ]}
      />,
    );
    expect(screen.getByLabelText('You said: Hi')).toBeTruthy();
    expect(screen.getByLabelText('Assistant said: Hello!')).toBeTruthy();
    expect(screen.getByLabelText('Thinking')).toBeTruthy();
  });
});

it('PaywallScreen: plans are radios; Continue subscribes to the chosen one', async () => {
  const onSubscribe = jest.fn();
  const onRestore = jest.fn();
  await wrap(
    <PaywallScreen
      title="Go Pro"
      terms="Renews monthly."
      plans={[
        { id: 'm', name: 'Monthly', price: '$9', features: ['Unlimited'] },
        { id: 'y', name: 'Yearly', price: '$90', features: [], badge: 'Save 17%' },
      ]}
      onSubscribe={onSubscribe}
      onRestore={onRestore}
    />,
  );
  expect(screen.getByRole('radio', { name: 'Monthly, $9' })).toBeChecked();
  await press('Yearly, $90', 'radio');
  expect(screen.getByRole('radio', { name: 'Yearly, $90' })).toBeChecked();
  expect(screen.getByRole('radio', { name: 'Monthly, $9' })).not.toBeChecked();
  await press('Continue');
  expect(onSubscribe).toHaveBeenCalledWith('y');
  await press('Restore purchases');
  expect(onRestore).toHaveBeenCalled();
  expect(screen.getByText('Renews monthly.')).toBeTruthy();
});

it('AppSwitcherSheet: marks the current app; opening one closes the sheet', async () => {
  const onOpenChange = jest.fn();
  const onOpenApp = jest.fn();
  const apps = [
    { id: 'leap', name: 'Leap' },
    { id: 'payub', name: 'Payub', tone: 'payub' as const },
  ];
  await wrap(<AppSwitcherSheet open onOpenChange={onOpenChange} apps={apps} current="leap" onOpenApp={onOpenApp} />);
  expect(screen.getByRole('header', { name: 'Nexub apps' })).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Leap' })).toBeSelected();
  await press('Payub');
  expect(onOpenChange).toHaveBeenCalledWith(false);
  expect(onOpenApp).toHaveBeenCalledWith(apps[1]);
});
