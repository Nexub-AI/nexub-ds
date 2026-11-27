'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { Button, DropdownMenu } from '@nexub/react';
import { Monitor, Moon, Sun } from '@nexub/icons';

export default function Example() {
  const [theme, setTheme] = React.useState('system');
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="outlined">Theme</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content>
          <DropdownMenu.RadioGroup value={theme} onValueChange={setTheme}>
            <DropdownMenu.RadioItem value="light" indicator="end">
              <Sun size="sm" /> Light
            </DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="dark" indicator="end">
              <Moon size="sm" /> Dark
            </DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="system" indicator="end">
              <Monitor size="sm" /> System
            </DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
