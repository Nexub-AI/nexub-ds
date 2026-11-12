// 9.6: the XSS corpus (packages/react/src/utils/xss-corpus.ts) against every @nexub/patterns
// prop that renders a URL or user text. Menus and popovers are opened first, so links
// that only exist once open are audited too.
import * as React from 'react';
import { cleanup, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
// @nexub/react's test corpus, aliased in vitest.config.ts (it is outside this package's rootDir).
import { XSS_TEXT, XSS_URLS, auditDom } from 'xss-corpus';
import { NexubProvider, ThemeProvider } from '@nexub/react';
import { AppHeader } from './components/AppHeader/index.js';
import { AppLauncher } from './components/AppLauncher/index.js';
import { NotificationItem } from './components/NotificationItem/index.js';
import { NotificationCenter } from './components/NotificationCenter/index.js';
import { PlanCard } from './components/PlanCard/index.js';
import { UserCard } from './components/UserCard/index.js';
import { SettingsPage } from './components/SettingsPage/index.js';
import { SettingsLayout } from './components/SettingsLayout/index.js';
import { ActivityPage } from './components/ActivityPage/index.js';
import { TransactionDetailPage } from './components/TransactionDetailPage/index.js';
import { ChatPage } from './components/ChatPage/index.js';


afterEach(cleanup);

/** Renders, opens every closed menu, popover and section, then audits the document. */
async function findings(ui: React.ReactElement) {
  const user = userEvent.setup();
  render(
    <ThemeProvider>
      <NexubProvider>{ui}</NexubProvider>
    </ThemeProvider>,
  );
  for (let round = 0; round < 3; round++) {
    const closed = [...document.querySelectorAll<HTMLElement>('button[aria-expanded="false"]')];
    if (closed.length === 0) break;
    await user.click(closed[0]!);
  }
  return auditDom();
}

const date = new Date('2026-10-30T09:00:00Z');
const URL_PROPS: Record<string, (url: string) => React.ReactElement> = {
  'AppHeader hrefs, user.avatarUrl and apps': (u) => (
    <AppHeader
      productName="Hub"
      homeHref={u}
      accountHref={u}
      privacyHref={u}
      termsHref={u}
      user={{ name: 'Ada', email: 'ada@x.test', avatarUrl: u }}
      apps={[{ id: 'a', name: 'Account', href: u, icon: u }]}
    />
  ),
  'AppLauncher apps[].href and icon': (u) => <AppLauncher apps={[{ id: 'a', name: 'Account', href: u, icon: u }]} />,
  'NotificationItem href': (u) => <NotificationItem title="t" href={u} />,
  'NotificationCenter notifications[].href': (u) => <NotificationCenter notifications={[{ id: '1', title: 't', href: u }]} />,
  'PlanCard ctaHref': (u) => <PlanCard name="Pro" price="$9" features={[]} cta="Go" ctaHref={u} />,
  'UserCard avatarSrc': (u) => <UserCard name="Ada" email="a@x.test" avatarSrc={u} />,
  'SettingsPage groups[].items[].href': (u) => <SettingsPage groups={[{ items: [{ title: 't', href: u }] }]} />,
  'SettingsLayout items[].href': (u) => (
    <SettingsLayout items={[{ id: 'a', label: 'Profile', href: u }]} activeId="a">
      content
    </SettingsLayout>
  ),
  'ActivityPage transactions[].image': (u) => <ActivityPage transactions={[{ id: '1', title: 't', amount: 1, currency: 'USD', date, image: u }]} />,
  'TransactionDetailPage transaction.image': (u) => (
    <TransactionDetailPage transaction={{ id: '1', title: 't', amount: 1, currency: 'USD', date, image: u }} />
  ),
};

const TEXT_PROPS: Record<string, (text: string) => React.ReactElement> = {
  'NotificationCenter text': (t) => <NotificationCenter notifications={[{ id: '1', title: t, description: t, timestamp: t }]} />,
  'PlanCard text': (t) => <PlanCard name={t} price={t} description={t} features={[t]} cta={t} />,
  'UserCard text': (t) => <UserCard name={t} email={t} role={t} />,
  'SettingsPage text': (t) => <SettingsPage groups={[{ header: t, footer: t, items: [{ title: t, subtitle: t, value: t }] }]} />,
  'ActivityPage text': (t) => <ActivityPage transactions={[{ id: '1', title: t, subtitle: t, amount: 1, currency: 'USD', date }]} />,
  'ChatPage messages (model output)': (t) => (
    <ChatPage
      messages={[
        { id: '1', role: 'user', text: t },
        { id: '2', role: 'assistant', text: t, streaming: true },
      ]}
      onSend={() => {}}
    />
  ),
};

describe.each(Object.entries(URL_PROPS))('%s', (_name, ui) => {
  it.each(XSS_URLS)('renders nothing script-capable for %j', async (url) => {
    expect(await findings(ui(url))).toEqual([]);
  });
});

describe.each(Object.entries(TEXT_PROPS))('%s', (_name, ui) => {
  it.each(XSS_TEXT)('renders %j as text', async (text) => {
    expect(await findings(ui(text))).toEqual([]);
    expect(document.body.textContent).toContain(text);
  });
});

it('opens menus before auditing: the launcher and account links are in the DOM', async () => {
  await findings(URL_PROPS['AppHeader hrefs, user.avatarUrl and apps']!('/ok'));
  expect(document.querySelectorAll('a[href="/ok"]').length).toBeGreaterThanOrEqual(2);
  cleanup();
  await findings(URL_PROPS['AppLauncher apps[].href and icon']!('/ok'));
  expect(document.querySelector('a[href="/ok"] img[src="/ok"]')).not.toBeNull();
});
