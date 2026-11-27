'use client'; // docs preview: server pages import every example

import { Sidebar } from '@nexub/react';
import { BarChart3, Folder, Home, Settings } from '@nexub/icons';

export default function Example() {
  return (
    <div className="flex h-70 items-start">
      <Sidebar.Root aria-label="Workspace" className="rounded-shape-container">
        <Sidebar.Group label="Work" collapsible>
          <Sidebar.Item href="#" icon={<Home size="sm" />} active>Overview</Sidebar.Item>
          <Sidebar.Item href="#" icon={<Folder size="sm" />}>Projects</Sidebar.Item>
        </Sidebar.Group>
        <Sidebar.Group label="Admin" collapsible defaultOpen={false}>
          <Sidebar.Item href="#" icon={<BarChart3 size="sm" />}>Reports</Sidebar.Item>
          <Sidebar.Item href="#" icon={<Settings size="sm" />}>Settings</Sidebar.Item>
        </Sidebar.Group>
      </Sidebar.Root>
    </div>
  );
}
