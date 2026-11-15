'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { Button, Sidebar } from '@nexub/react';
import { BarChart3, Folder, Home, Settings } from '@nexub/icons';

export default function Example() {
  const [collapsed, setCollapsed] = React.useState(true);
  return (
    <div className="flex h-[280px] items-start gap-4">
      <Sidebar.Root aria-label="Workspace" collapsed={collapsed} className="rounded-shape-container">
        <Sidebar.Group>
          <Sidebar.Item href="#" icon={<Home size="sm" />} active>Overview</Sidebar.Item>
          <Sidebar.Item href="#" icon={<Folder size="sm" />}>Projects</Sidebar.Item>
          <Sidebar.Item href="#" icon={<BarChart3 size="sm" />}>Reports</Sidebar.Item>
          <Sidebar.Item href="#" icon={<Settings size="sm" />}>Settings</Sidebar.Item>
        </Sidebar.Group>
      </Sidebar.Root>
      <Button variant="outlined" onClick={() => setCollapsed((c) => !c)} aria-pressed={!collapsed}>
        {collapsed ? 'Expand' : 'Collapse'}
      </Button>
    </div>
  );
}
