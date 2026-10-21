import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Sidebar } from './Sidebar.js';
import { Badge } from '../Badge/Badge.js';
import { Logo } from '../Logo/Logo.js';

const meta: Meta = {
  title: 'Navigation/Sidebar',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

const DashboardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
);

const BarChartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const Default: Story = {
  render: () => (
    <div style={{ height: '480px', display: 'flex' }}>
      <Sidebar.Root>
        <Sidebar.Group label="Main">
          <Sidebar.Item href="#" active icon={<DashboardIcon />}>
            Dashboard
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={<BarChartIcon />}>
            Analytics
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={<UsersIcon />}>
            Team
          </Sidebar.Item>
        </Sidebar.Group>

        <Sidebar.Separator />

        <Sidebar.Group label="System">
          <Sidebar.Item href="#" icon={<SettingsIcon />}>
            Settings
          </Sidebar.Item>
        </Sidebar.Group>

        <Sidebar.Footer>
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Nexub DS v1.0
          </span>
        </Sidebar.Footer>
      </Sidebar.Root>
    </div>
  ),
};

/** Many items in a short sidebar: they scroll, the footer stays pinned at the bottom. */
export const StickyFooter: Story = {
  render: () => (
    <div className="flex h-[320px]">
      <Sidebar.Root>
        <Sidebar.Group label="Pages">
          {Array.from({ length: 12 }, (_, i) => (
            <Sidebar.Item key={i} href="#" active={i === 0} icon={<DashboardIcon />}>
              Page {i + 1}
            </Sidebar.Item>
          ))}
        </Sidebar.Group>
        <Sidebar.Footer className="text-xs text-[var(--color-on-surface-muted)]">v1.2.0 · Updated 21 Oct 2026</Sidebar.Footer>
      </Sidebar.Root>
    </div>
  ),
};

/** Product logo with a status. The status moves under the logo when they don't fit, and a logo wider than the sidebar truncates. */
export const HeaderWithStatus: Story = {
  render: () => (
    <div style={{ height: '320px', display: 'flex', gap: '24px' }}>
      {[240, 200].map((width) => (
        <Sidebar.Root key={width} style={{ width }}>
          <Sidebar.Header status={<Badge variant="soft" tone="success">Live</Badge>}>
            <Logo product="Command Hub" size="sm" />
          </Sidebar.Header>
          <Sidebar.Group>
            <Sidebar.Item href="#" active icon={<DashboardIcon />}>Overview</Sidebar.Item>
            <Sidebar.Item href="#" icon={<SettingsIcon />}>Settings</Sidebar.Item>
          </Sidebar.Group>
        </Sidebar.Root>
      ))}
      <Sidebar.Root collapsed>
        <Sidebar.Header status={<Badge variant="soft" tone="success">Live</Badge>}>
          <Logo variant="icon" product="Command Hub" size="sm" />
        </Sidebar.Header>
        <Sidebar.Group>
          <Sidebar.Item href="#" active icon={<DashboardIcon />}>Overview</Sidebar.Item>
        </Sidebar.Group>
      </Sidebar.Root>
    </div>
  ),
};
