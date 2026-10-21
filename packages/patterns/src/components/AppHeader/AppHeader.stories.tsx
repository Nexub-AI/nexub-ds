import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { AppShell, DropdownMenu, ThemeProvider } from '@nexub/react';
import { FileText, Folder, Settings } from '@nexub/icons';
import { AppHeader, type AppHeaderProps, type AppHeaderSearchGroup } from './AppHeader.js';

const projects = ['Apollo', 'Gemini', 'Mercury', 'Artemis', 'Skylab'];

// A fake backend: 400ms latency, case-insensitive match.
const search = (query: string): Promise<AppHeaderSearchGroup[]> =>
  new Promise((resolve) =>
    setTimeout(() => {
      const q = query.trim().toLowerCase();
      const hits = projects.filter((p) => p.toLowerCase().includes(q));
      resolve(
        hits.length === 0
          ? []
          : [
              {
                label: 'Projects',
                items: hits.map((p) => ({ id: p, label: p, hint: 'Project', icon: <Folder size="sm" />, onSelect: () => {} })),
              },
              {
                label: 'Documents',
                items: hits.map((p) => ({ id: `${p}-brief`, label: `${p} brief`, icon: <FileText size="sm" />, onSelect: () => {} })),
              },
            ],
      );
    }, 400),
  );

const full: AppHeaderProps = {
  productName: 'Command Hub',
  homeHref: '#',
  onSearch: search,
  orgs: [
    { id: 'acme', name: 'Acme Corporation International' },
    { id: 'globex', name: 'Globex' },
  ],
  currentOrgId: 'acme',
  apps: [
    { id: 'hub', name: 'Command Hub', href: '#', current: true },
    { id: 'account', name: 'Account', href: '#' },
    { id: 'payub', name: 'Payub', href: '#' },
  ],
  user: { name: 'Sam Lee', email: 'sam.lee@example.com' },
  accountHref: '#account',
  privacyHref: '#privacy',
  termsHref: '#terms',
  onSignOut: () => new Promise((r) => setTimeout(r, 1500)),
  accountMenuItems: (
    <DropdownMenu.Item>
      <Settings size="sm" aria-hidden="true" className="mr-2" />
      Preferences
    </DropdownMenu.Item>
  ),
};

function Page(props: AppHeaderProps) {
  const [orgId, setOrgId] = React.useState(props.currentOrgId);
  return (
    <>
      <AppHeader {...props} currentOrgId={orgId} onOrgChange={setOrgId} />
      <main className="mx-auto flex max-w-3xl flex-col gap-4 p-6 text-[var(--color-text-secondary)]">
        {Array.from({ length: 30 }, (_, i) => (
          <p key={i}>Scroll: the header stays put. Paragraph {i + 1}.</p>
        ))}
      </main>
    </>
  );
}

const phone = {
  viewport: {
    viewports: { phone375: { name: 'Phone 375', styles: { width: '375px', height: '812px' } } },
    defaultViewport: 'phone375',
  },
};

const meta: Meta<typeof AppHeader> = {
  title: 'Patterns/AppHeader',
  component: AppHeader,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story, ctx) => {
      // Follow the toolbar theme; the header's own switch still works within a story.
      try {
        localStorage.removeItem('sb-app-header-theme');
      } catch {
        // storage unavailable
      }
      const theme = ctx.globals.theme === 'dark' ? 'dark' : 'light';
      return (
        <ThemeProvider key={theme} defaultTheme={theme} storageKey="sb-app-header-theme">
          <Story />
        </ThemeProvider>
      );
    },
  ],
  args: full,
  render: (args) => <Page {...args} />,
};
export default meta;
type Story = StoryObj<typeof meta>;

/** Search provider, two orgs, launcher and account menu. Try ⌘K / Ctrl+K or "/". */
export const Desktop: Story = {};

export const DesktopDark: Story = { name: 'Desktop (dark)', globals: { theme: 'dark' } };

/** Search becomes an icon; the org name truncates; nothing wraps. */
export const Phone375: Story = { name: 'Phone (375px)', parameters: phone };

export const Phone375Dark: Story = { name: 'Phone (375px, dark)', parameters: phone, globals: { theme: 'dark' } };

/** One org: plain truncated text, no menu. */
export const OneOrg: Story = { args: { orgs: [{ id: 'acme', name: 'Acme Corporation International' }] } };

/** Just a product name and static search items. */
export const Minimal: Story = {
  args: {
    productName: 'Account',
    onSearch: undefined,
    searchItems: [
      { label: 'Pages', items: ['Profile', 'Security', 'Billing'].map((p) => ({ id: p, label: p, onSelect: () => {} })) },
    ],
    orgs: [],
    apps: undefined,
    user: undefined,
  },
};

/** Static results open in the palette. */
export const SearchOpen: Story = {
  args: {
    onSearch: undefined,
    searchItems: [
      {
        label: 'Projects',
        items: projects.map((p) => ({ id: p, label: p, hint: 'Project', icon: <Folder size="sm" />, onSelect: () => {} })),
      },
    ],
  },
  play: async ({ canvasElement }) => {
    canvasElement.querySelector<HTMLButtonElement>('button[aria-keyshortcuts]')?.click();
  },
};

/** `surface="glass"` over content (needs `@nexub/themes/glass`). */
export const Glass: Story = {
  args: { surface: 'glass' },
  render: (args) => (
    <div className="min-h-[200vh] bg-[linear-gradient(160deg,var(--color-fill-primary),var(--color-bg-default)_60%)]">
      <Page {...args} />
    </div>
  ),
};

/** In `AppShell.Header`: the header's spacer sizes the row, so `Body` starts below it. */
export const InAppShell: Story = {
  render: (args) => (
    <AppShell.Root>
      <AppShell.Header>
        <AppHeader {...args} />
      </AppShell.Header>
      <AppShell.Body>
        <AppShell.Sidebar className="w-56 border-r border-[var(--color-border-default)] p-4 text-sm">Sidebar</AppShell.Sidebar>
        <AppShell.Main>Main content starts right under the header.</AppShell.Main>
      </AppShell.Body>
    </AppShell.Root>
  ),
};

/** `position="static"`: in flow with no spacer, for embeds and previews. */
export const Embedded: Story = {
  args: { position: 'static' },
  render: (args) => (
    <div className="rounded-shape-container border border-[var(--color-outline-variant)]">
      <AppHeader {...args} />
      <div className="p-4 text-sm">Embedded content</div>
    </div>
  ),
};
