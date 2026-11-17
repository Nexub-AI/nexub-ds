'use client';

// A client module: it reads localised text. EmptyState itself stays a server component.

import * as React from 'react';
import { FileX, Inbox, Lock, Search, ServerCrash, Settings, WifiOff } from '@nexub/icons';
import type { NexubMessages } from '@nexub/core';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { Illustration } from '../Illustration/Illustration.js';
import { EmptyState, type EmptyStateRootProps } from './EmptyState.js';

export type EmptyStateKind = keyof NexubMessages['emptyStates'];

const presetIcon = { noData: Inbox, noResults: Search, noAccess: Lock, serverError: ServerCrash, offline: WifiOff, notFound: FileX, maintenance: Settings };

export interface EmptyStatePresetProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    Pick<EmptyStateRootProps, 'size' | 'animate'> {
  /** noData, noResults, noAccess (403), serverError (500), offline, notFound (404) or maintenance. */
  kind: EmptyStateKind;
  /** Overrides the preset's title; the description too. Both default to localised text. */
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Buttons under the text, e.g. Retry or Clear filters. */
  actions?: React.ReactNode;
  /** 10.5: a spot illustration in place of the icon. @default false */
  illustrated?: boolean;
}

/** A ready-made empty state: icon, title and description for common cases. */
export const EmptyStatePreset = React.forwardRef<HTMLDivElement, EmptyStatePresetProps>(
  ({ kind, title, description, actions, illustrated = false, ...props }, ref) => {
    const text = useNexubMessages().emptyStates[kind];
    const Icon = presetIcon[kind];
    return (
      <EmptyState.Root ref={ref} role={kind === 'serverError' || kind === 'offline' ? 'alert' : undefined} {...props}>
        <EmptyState.Illustration>
          {illustrated ? <Illustration kind={kind} size={props.size} /> : <Icon size="xl" aria-hidden="true" />}
        </EmptyState.Illustration>
        <EmptyState.Title>{title ?? text.title}</EmptyState.Title>
        <EmptyState.Description>{description ?? text.description}</EmptyState.Description>
        {actions && <EmptyState.Actions>{actions}</EmptyState.Actions>}
      </EmptyState.Root>
    );
  },
);
EmptyStatePreset.displayName = 'EmptyStatePreset';

