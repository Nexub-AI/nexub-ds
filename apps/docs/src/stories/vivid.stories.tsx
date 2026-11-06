// Storybook coverage for the Vivid expression layer (@nexub/themes/vivid):
// the Expression page's sample, under data-expression="vivid". Plain CSF and
// createElement (this folder inherits the docs app's jsx: "preserve").
import { createElement } from 'react';
import Aurora from '../examples/components/aurora/0';
import { Badge, Button, Card, Checkbox, Input, Progress, Switch } from '@nexub/react';

export default { title: 'Expression/Vivid', parameters: { layout: 'padded' } };

const h = createElement;
export const Components = {
  render: () =>
    h('div', { 'data-expression': 'vivid', className: 'flex w-[420px] flex-col gap-4' },
      h('div', { className: 'flex flex-wrap gap-2' }, h(Button, null, 'Save changes'), h(Button, { variant: 'tonal' }, 'Preview'), h(Button, { variant: 'outlined' }, 'Cancel')),
      h(Card, { variant: 'interactive', className: 'p-4' }, 'Monthly revenue'),
      h(Input, { 'aria-label': 'Workspace name', placeholder: 'Workspace name' }),
      h('div', { className: 'flex items-center gap-4' }, h(Switch, { 'aria-label': 'Notifications', defaultChecked: true }), h(Checkbox, { 'aria-label': 'Remember me', defaultChecked: true }), h(Badge, null, 'New')),
      h(Progress, { value: 64, 'aria-label': 'Setup progress' })),
};
export const AuroraHero = { render: () => h('div', { 'data-expression': 'vivid', className: 'w-[640px]' }, createElement(Aurora)) };
