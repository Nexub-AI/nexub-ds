import * as React from 'react';
import type { Meta } from '@storybook/react';
import { Button } from '../components/Button/Button.js';
import { Card } from '../components/Card/Card.js';
import { Dialog } from '../components/Dialog/Dialog.js';
import { DropdownMenu } from '../components/DropdownMenu/DropdownMenu.js';
import { Popover } from '../components/Popover/Popover.js';
import { Provider as TooltipProvider, Root as TooltipRoot, Trigger as TooltipTrigger, Content as TooltipContent } from '../components/Tooltip/Tooltip.js';
import { Toast } from '../components/Toast/Toast.js';

// Calm Depth surfaces with every overlay forced open: the review and
// visual-regression surface for design refresh Phase 4.
const meta: Meta = { title: 'Foundations/Surfaces' };
export default meta;

/** In-flow cards: tonal + hairline (flat), elevated (surface), interactive. */
export const Cards = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, maxWidth: 760 }}>
    {(['flat', 'surface', 'interactive'] as const).map((variant) => (
      <Card key={variant} variant={variant} style={{ padding: 20 }}>
        <p className="text-title-md">{variant}</p>
        <p className="text-body-sm text-[var(--color-on-surface-muted)]">Card body copy on the {variant} variant.</p>
      </Card>
    ))}
  </div>
);

/** A menu, a popover, a tooltip and a toast, all open. */
export const Floating = () => (
  <TooltipProvider>
    <Toast.Provider>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 180px)', gap: 24, height: 340, alignItems: 'start', justifyItems: 'start' }}>
        <DropdownMenu.Root open modal={false}>
          <DropdownMenu.Trigger asChild>
            <Button variant="outlined">Menu</Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="start">
            <DropdownMenu.Label>Account</DropdownMenu.Label>
            <DropdownMenu.Item>Profile</DropdownMenu.Item>
            <DropdownMenu.Item>Settings</DropdownMenu.Item>
            <DropdownMenu.Item disabled>Billing (disabled)</DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item>Sign out</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
        <Popover.Root open>
          <Popover.Trigger asChild>
            <Button variant="outlined">Popover</Button>
          </Popover.Trigger>
          <Popover.Content align="start" style={{ width: 220 }}>
            <p className="text-title-sm">Popover</p>
            <p className="text-body-sm text-[var(--color-on-surface-muted)]">Floating surface, elevation 2.</p>
          </Popover.Content>
        </Popover.Root>
        <TooltipRoot open>
          <TooltipTrigger asChild>
            <Button variant="outlined">Tooltip</Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Inverse surface tooltip</TooltipContent>
        </TooltipRoot>
      </div>
      <Toast.Root open duration={1e9}>
        <div style={{ display: 'grid', gap: 2 }}>
          <Toast.Title>Changes saved</Toast.Title>
          <Toast.Description>Your profile is up to date.</Toast.Description>
        </div>
        <Toast.Action altText="Undo">Undo</Toast.Action>
      </Toast.Root>
      <Toast.Viewport />
    </Toast.Provider>
  </TooltipProvider>
);

/** A modal dialog on the scrim, elevation 3. */
export const DialogOpen = () => (
  <Dialog.Root open>
    <Dialog.Portal>
      <Dialog.Overlay />
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Delete project?</Dialog.Title>
          <Dialog.Description>This removes the project and its history. You can’t undo this.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer>
          <Button variant="outlined">Cancel</Button>
          <Button variant="destructive">Delete</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);
