import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { NavigationMenu } from './NavigationMenu.js';

const meta: Meta = {
  title: 'Navigation/NavigationMenu',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <NavigationMenu.Root>
      <NavigationMenu.List>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="#">Home</NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <ul className="grid w-[300px] gap-3 p-4">
              <li>
                <NavigationMenu.Link href="#">
                  <p className="text-sm font-semibold leading-none">Analytics</p>
                  <p className="mt-1 text-xs leading-snug text-muted-foreground">
                    Track your key metrics in real time.
                  </p>
                </NavigationMenu.Link>
              </li>
              <li>
                <NavigationMenu.Link href="#">
                  <p className="text-sm font-semibold leading-none">Dashboards</p>
                  <p className="mt-1 text-xs leading-snug text-muted-foreground">
                    Build and share custom dashboards.
                  </p>
                </NavigationMenu.Link>
              </li>
              <li>
                <NavigationMenu.Link href="#">
                  <p className="text-sm font-semibold leading-none">Reports</p>
                  <p className="mt-1 text-xs leading-snug text-muted-foreground">
                    Export and schedule detailed reports.
                  </p>
                </NavigationMenu.Link>
              </li>
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link href="#">Pricing</NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link href="#">Docs</NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  ),
};
