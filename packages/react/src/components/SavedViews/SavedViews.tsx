'use client';

import * as React from 'react';
import { Bookmark, ChevronDown } from '@nexub/icons';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { Button } from '../Button/Button.js';
import { DropdownMenu } from '../DropdownMenu/DropdownMenu.js';
import { Dialog } from '../Dialog/Dialog.js';
import { Input } from '../Input/Input.js';

export interface SavedView {
  id: string;
  name: string;
}

export interface SavedViewsProps {
  views: SavedView[];
  /** The view in use; its name shows on the button. */
  activeId?: string;
  onSelect: (id: string) => void;
  /** "Save as new view…": asks for a name, then calls this. Your app stores the view. */
  onSave?: (name: string) => void;
  /** "Update ‹view›": overwrite the active view with the current filters. */
  onUpdate?: (id: string) => void;
  /** "Delete ‹view›": remove the active view. */
  onDelete?: (id: string) => void;
  className?: string;
}

/**
 * A menu of saved filter views. UI only: your app keeps the views and what
 * each one restores (filters, sort, columns).
 */
export function SavedViews({ views, activeId, onSelect, onSave, onUpdate, onDelete, className }: SavedViewsProps) {
  const t = useNexubMessages();
  const [naming, setNaming] = React.useState(false);
  const [name, setName] = React.useState('');
  const active = views.find((v) => v.id === activeId);

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button variant="outlined" size="sm" className={className}>
            <Bookmark size="sm" aria-hidden="true" />
            {active?.name ?? t.views}
            <ChevronDown size="sm" aria-hidden="true" />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="start">
          {views.length > 0 && (
            <DropdownMenu.RadioGroup value={activeId ?? ''} onValueChange={onSelect}>
              {views.map((v) => (
                <DropdownMenu.RadioItem key={v.id} value={v.id}>
                  {v.name}
                </DropdownMenu.RadioItem>
              ))}
            </DropdownMenu.RadioGroup>
          )}
          {views.length > 0 && (onSave || (active && (onUpdate || onDelete))) && <DropdownMenu.Separator />}
          {onSave && (
            <DropdownMenu.Item
              onSelect={() => {
                setName('');
                setNaming(true);
              }}
            >
              {t.saveView}
            </DropdownMenu.Item>
          )}
          {active && onUpdate && <DropdownMenu.Item onSelect={() => onUpdate(active.id)}>{t.updateView(active.name)}</DropdownMenu.Item>}
          {active && onDelete && (
            <DropdownMenu.Item onSelect={() => onDelete(active.id)} className="text-[var(--color-error)]">
              {t.deleteView(active.name)}
            </DropdownMenu.Item>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      {onSave && (
        <Dialog.Root open={naming} onOpenChange={setNaming}>
          <Dialog.Content className="max-w-sm">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const n = name.trim();
                if (!n) return;
                onSave(n);
                setNaming(false);
              }}
              className="flex flex-col gap-4"
            >
              <Dialog.Header>
                <Dialog.Title>{t.saveView.replace(/…$/, '')}</Dialog.Title>
              </Dialog.Header>
              <Input aria-label={t.viewName} placeholder={t.viewName} value={name} onChange={(e) => setName(e.target.value)} autoFocus />
              <Dialog.Footer>
                <Dialog.Close asChild>
                  <Button type="button" variant="text">
                    {t.cancel}
                  </Button>
                </Dialog.Close>
                <Button type="submit" disabled={!name.trim()}>
                  {t.save}
                </Button>
              </Dialog.Footer>
            </form>
          </Dialog.Content>
        </Dialog.Root>
      )}
    </>
  );
}

SavedViews.displayName = 'SavedViews';
