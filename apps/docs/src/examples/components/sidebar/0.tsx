'use client'; // docs preview: server pages import every example

import { Badge, Logo, Sidebar } from '@nexub/react';
import { BarChart3, Folder, Home, Settings, Users } from '@nexub/icons';

export default function Example() {
  return (
    <div className="h-[380px]">
      <Sidebar.Root aria-label="Workspace" className="rounded-shape-container">
        <Sidebar.Header status={<Badge variant="soft" size="sm">Beta</Badge>}>
          <Logo size="sm" />
        </Sidebar.Header>
        <Sidebar.Group>
          <Sidebar.Item href="#" icon={<Home size="sm" />} active>Overview</Sidebar.Item>
          <Sidebar.Item href="#" icon={<Folder size="sm" />}>Projects</Sidebar.Item>
          <Sidebar.Item href="#" icon={<BarChart3 size="sm" />}>Reports</Sidebar.Item>
        </Sidebar.Group>
        <Sidebar.Group label="Admin">
          <Sidebar.Item href="#" icon={<Users size="sm" />}>Members</Sidebar.Item>
          <Sidebar.Item href="#" icon={<Settings size="sm" />}>Settings</Sidebar.Item>
        </Sidebar.Group>
        <Sidebar.Footer className="text-body-sm text-[var(--color-on-surface-muted)]">v2.4.0</Sidebar.Footer>
      </Sidebar.Root>
    </div>
  );
}
