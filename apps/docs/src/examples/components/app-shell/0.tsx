import { AppShell, Logo, Sidebar, Text, TopNav } from '@nexub/react';
import { BarChart3, Home, Settings } from '@nexub/icons';

export default function Example() {
  return (
    <AppShell.Root className="h-[360px] w-full rounded-shape-container border border-[var(--color-outline-variant)]">
      <AppShell.Header>
        <TopNav.Root className="static">
          <TopNav.Logo><Logo size="sm" /></TopNav.Logo>
        </TopNav.Root>
      </AppShell.Header>
      <AppShell.Body>
        <AppShell.Sidebar>
          <Sidebar.Root aria-label="Workspace">
            <Sidebar.Group>
              <Sidebar.Item href="#" icon={<Home size="sm" />} active>Overview</Sidebar.Item>
              <Sidebar.Item href="#" icon={<BarChart3 size="sm" />}>Reports</Sidebar.Item>
              <Sidebar.Item href="#" icon={<Settings size="sm" />}>Settings</Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Root>
        </AppShell.Sidebar>
        <AppShell.Main>
          <Text size="body-sm" tone="muted">Page content scrolls here, under a fixed header and sidebar.</Text>
        </AppShell.Main>
      </AppShell.Body>
    </AppShell.Root>
  );
}
