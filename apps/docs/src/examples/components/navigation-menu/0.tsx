'use client'; // docs preview: server pages import every example

import { NavigationMenu } from '@nexub/react';

const products = [
  { title: 'Analytics', body: 'Track key metrics in real time.' },
  { title: 'Dashboards', body: 'Build and share custom views.' },
  { title: 'Reports', body: 'Export and schedule reports.' },
];

export default function Example() {
  return (
    <NavigationMenu.Root aria-label="Site">
      <NavigationMenu.List>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <ul className="grid w-[280px] gap-1 p-2">
              {products.map((p) => (
                <li key={p.title}>
                  <NavigationMenu.Link href="#">
                    <span className="block text-label-lg">{p.title}</span>
                    <span className="mt-1 block text-body-sm text-[var(--color-on-surface-muted)]">{p.body}</span>
                  </NavigationMenu.Link>
                </li>
              ))}
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
  );
}
