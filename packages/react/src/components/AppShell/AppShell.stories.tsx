import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { AppShell } from './AppShell.js';
import { Sidebar } from '../Sidebar/Sidebar.js';
import { TopNav } from '../TopNav/TopNav.js';

const meta: Meta = {
  title: 'Navigation/AppShell',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
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

export const Default: Story = {
  render: () => (
    <AppShell.Root style={{ height: '100vh' }}>
      <AppShell.Header>
        <TopNav.Root>
          <TopNav.Logo>
            <span style={{ fontWeight: 700, fontSize: '17px' }}>Nexub</span>
          </TopNav.Logo>
          <TopNav.Actions>
            <button
              style={{
                height: '32px',
                width: '32px',
                borderRadius: '50%',
                background: 'var(--color-bg-subtle, #f4f4f5)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '13px',
              }}
              aria-label="User menu"
            >
              JD
            </button>
          </TopNav.Actions>
        </TopNav.Root>
      </AppShell.Header>

      <AppShell.Body>
        <AppShell.Sidebar>
          <Sidebar.Root style={{ height: '100%' }}>
            <Sidebar.Group>
              <Sidebar.Item href="#" active icon={<HomeIcon />}>
                Dashboard
              </Sidebar.Item>
              <Sidebar.Item href="#" icon={<BarChartIcon />}>
                Analytics
              </Sidebar.Item>
              <Sidebar.Item href="#" icon={<SettingsIcon />}>
                Settings
              </Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Root>
        </AppShell.Sidebar>

        <AppShell.Main>
          <h1 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
            Dashboard
          </h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Welcome back! Here is what is happening with your projects today.
          </p>
          <div
            style={{
              marginTop: '24px',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
            }}
          >
            {['Total Revenue', 'Active Users', 'New Signups'].map((title) => (
              <div
                key={title}
                style={{
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid var(--color-border-default)',
                  background: 'var(--color-bg-default)',
                }}
              >
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{title}</p>
                <p style={{ fontSize: '24px', fontWeight: 700, marginTop: '4px' }}>—</p>
              </div>
            ))}
          </div>
        </AppShell.Main>
      </AppShell.Body>
    </AppShell.Root>
  ),
};
