// Accessibility smoke test: runs axe-core over components rendered the way a
// consumer would (with labels). jsdom has no layout, so contrast is covered by
// the token contrast checks instead.
import * as React from 'react';
import { render } from '@testing-library/react';
import axe from 'axe-core';
import { describe, it, expect } from 'vitest';
import * as N from './index.js';

const cases: [string, React.ReactElement][] = [
  ['Button', <N.Button>Save</N.Button>],
  [
    'IconButton',
    <N.IconButton label="Close">
      <svg aria-hidden />
    </N.IconButton>,
  ],
  [
    'Input',
    <N.FormField.Root id="email" name="email">
      <N.FormField.Label>Email</N.FormField.Label>
      <N.FormField.Control>
        <N.Input />
      </N.FormField.Control>
    </N.FormField.Root>,
  ],
  [
    'Textarea',
    <N.FormField.Root id="bio" name="bio">
      <N.FormField.Label>Bio</N.FormField.Label>
      <N.FormField.Control>
        <N.Textarea />
      </N.FormField.Control>
    </N.FormField.Root>,
  ],
  ['NumberInput', <N.NumberInput aria-label="Quantity" showSteppers />],
  ['SearchInput', <N.SearchInput aria-label="Search" />],
  ['PasswordInput', <N.PasswordInput aria-label="Password" />],
  ['Checkbox', <N.Checkbox aria-label="Accept" />],
  ['Switch', <N.Switch aria-label="Notifications" />],
  [
    'RadioGroup',
    <N.RadioGroup.Root aria-label="Plan" defaultValue="a">
      <N.RadioGroup.Item value="a" aria-label="A" />
      <N.RadioGroup.Item value="b" aria-label="B" />
    </N.RadioGroup.Root>,
  ],
  ['Slider', <N.Slider defaultValue={[20]} aria-label="Volume" />],
  ['Rating', <N.Rating value={3} />],
  ['Progress', <N.Progress value={40} aria-label="Upload" />],
  ['Avatar', <N.Avatar name="Ada Lovelace" />],
  ['Alert', <N.Alert>Saved</N.Alert>],
  ['Badge', <N.Badge>New</N.Badge>],
  ['Link', <N.Link href="/x">Docs</N.Link>],
  [
    'Breadcrumb',
    <N.Breadcrumb.Root>
      <N.Breadcrumb.List>
        <N.Breadcrumb.Item>
          <N.Breadcrumb.Link href="/">Home</N.Breadcrumb.Link>
        </N.Breadcrumb.Item>
        <N.Breadcrumb.Separator />
        <N.Breadcrumb.Item>
          <N.Breadcrumb.Page>Page</N.Breadcrumb.Page>
        </N.Breadcrumb.Item>
      </N.Breadcrumb.List>
    </N.Breadcrumb.Root>,
  ],
  ['Pagination', <N.Pagination page={2} totalItems={50} onPageChange={() => {}} />],
  [
    'Tabs',
    <N.Tabs.Root defaultValue="a">
      <N.Tabs.List>
        <N.Tabs.Trigger value="a">A</N.Tabs.Trigger>
        <N.Tabs.Trigger value="b">B</N.Tabs.Trigger>
      </N.Tabs.List>
      <N.Tabs.Content value="a">Panel A</N.Tabs.Content>
    </N.Tabs.Root>,
  ],
  [
    'Accordion',
    <N.Accordion.Root type="single" collapsible>
      <N.Accordion.Item value="a">
        <N.Accordion.Trigger>Q</N.Accordion.Trigger>
        <N.Accordion.Content>A</N.Accordion.Content>
      </N.Accordion.Item>
    </N.Accordion.Root>,
  ],
  [
    'Sidebar',
    <N.Sidebar.Root>
      <N.Sidebar.Item href="#">Home</N.Sidebar.Item>
    </N.Sidebar.Root>,
  ],
  [
    'TopNav',
    <N.TopNav.Root>
      <N.TopNav.Menu>
        <N.TopNav.Item href="#">Docs</N.TopNav.Item>
      </N.TopNav.Menu>
    </N.TopNav.Root>,
  ],
  [
    'Table',
    <N.Table.Root>
      <N.Table.Header>
        <N.Table.Row>
          <N.Table.Head>Name</N.Table.Head>
        </N.Table.Row>
      </N.Table.Header>
      <N.Table.Body>
        <N.Table.Row>
          <N.Table.Cell>Ada</N.Table.Cell>
        </N.Table.Row>
      </N.Table.Body>
    </N.Table.Root>,
  ],
];

describe('a11y (axe)', () => {
  it.each(cases)('%s has no axe violations', async (_name, el) => {
    const { container } = render(el);
    const { violations } = await axe.run(container, {
      rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
    });
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.html).join(' | ')}`)).toEqual([]);
  });
});
