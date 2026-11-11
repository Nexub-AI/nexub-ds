import { Avatar, IconButton, Logo, TopNav } from '@nexub/react';
import { Bell } from '@nexub/icons';

export default function Example() {
  return (
    <TopNav.Root className="static w-full">
      <TopNav.Logo><Logo size="sm" /></TopNav.Logo>
      <TopNav.Menu>
        <TopNav.Item href="#" active>Overview</TopNav.Item>
        <TopNav.Item href="#">Projects</TopNav.Item>
        <TopNav.Item href="#">Reports</TopNav.Item>
      </TopNav.Menu>
      <TopNav.Actions>
        <IconButton variant="ghost" label="Notifications"><Bell size="sm" /></IconButton>
        <Avatar size="sm" name="Jane Smith" />
      </TopNav.Actions>
    </TopNav.Root>
  );
}
