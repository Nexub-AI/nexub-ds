'use client';

import * as React from 'react';
import { Bookmark, ChevronDown } from '@nexub/icons';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { Button } from '../Button/Button.js';
import { DropdownMenu } from '../DropdownMenu/DropdownMenu.js';
import { Dialog } from '../Dialog/Dialog.js';
import { AlertDialog } from '../AlertDialog/AlertDialog.js';
import { Input } from '../Input/Input.js';

export interface SavedView {
  id: string;
  name: string;
}

/** 11.5: a returned promise holds the control busy; a rejection shows its message. */
type MaybeAsync = void | Promise<unknown>;

export interface SavedViewsProps {
  views: SavedView[];
  /** The view in use; its name shows on the button. */
  activeId?: string;
  onSelect: (id: string) => void;
  /** "Save as new view…": asks for a name, then calls this. Your app stores the view. May return a promise. */
  onSave?: (name: string) => MaybeAsync;
  /** "Update ‹view›": overwrite the active view with the current filters. May return a promise. */
  onUpdate?: (id: string) => MaybeAsync;
  /** "Delete ‹view›": remove the active view. May return a promise. */
  onDelete?: (id: string) => MaybeAsync;
  /** 11.5: "Rename ‹view›": asks for a new name for the active view. May return a promise. */
  onRename?: (id: string, name: string) => MaybeAsync;
  /** 11.5: ask in an AlertDialog before deleting. @default false */
  confirmDelete?: boolean;
  /**
   * 11.5: the default view's id. It is tagged "Default" in the menu, and applied (`onSelect`) once
   * on mount when `activeId` is undefined.
   */
  defaultView?: string;
  /** 11.5: the longest name allowed when saving or renaming. */
  maxLength?: number;
  /** The menu as a bottom sheet: see DropdownMenu.Content `sheet`. @default 'auto' (pass `sheet={false}` to keep a popover on small screens) */
  sheet?: boolean | 'auto';
  className?: string;
}

const errorText = (e: unknown): React.ReactNode => (e instanceof Error ? e.message : String(e));

/**
 * A menu of saved filter views. UI only: your app keeps the views and what
 * each one restores (filters, sort, columns).
 */
export function SavedViews({
  views,
  activeId,
  onSelect,
  onSave,
  onUpdate,
  onDelete,
  onRename,
  confirmDelete = false,
  defaultView,
  maxLength,
  sheet,
  className,
}: SavedViewsProps) {
  const t = useNexubMessages();
  // The name dialog: saving a new view, or renaming the view with this id.
  const [naming, setNaming] = React.useState<{ renameId?: string } | null>(null);
  const [confirming, setConfirming] = React.useState<SavedView | null>(null);
  const [name, setName] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<React.ReactNode>(null);
  const active = views.find((v) => v.id === (activeId ?? defaultView));
  const errorId = React.useId();

  const applied = React.useRef(false);
  React.useEffect(() => {
    if (applied.current) return;
    applied.current = true;
    if (activeId === undefined && defaultView && views.some((v) => v.id === defaultView)) onSelect(defaultView);
    // Once, on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync results finish at once (as before 11.5); a promise holds `busy` until it settles.
  const run = (result: MaybeAsync, done: () => void) => {
    setError(null);
    if (!result || typeof result.then !== 'function') return done();
    setBusy(true);
    result.then(
      () => {
        setBusy(false);
        done();
      },
      (e: unknown) => {
        setBusy(false);
        setError(errorText(e));
      },
    );
  };

  const openNaming = (renameId?: string) => {
    setError(null);
    setName(renameId ? (views.find((v) => v.id === renameId)?.name ?? '') : '');
    setNaming({ renameId });
  };
  const closeIfIdle = (setter: (v: null) => void) => (open: boolean) => {
    if (!open && !busy) {
      setter(null);
      setError(null);
    }
  };

  const remove = (view: SavedView) => run(onDelete?.(view.id), () => setConfirming(null));
  const renaming = naming?.renameId ? views.find((v) => v.id === naming.renameId) : undefined;
  const inlineError = error && !naming && !confirming;
  const errorLine = (id?: string) =>
    error && (
      <p id={id} role="alert" className="text-body-sm text-[var(--color-error)]">
        {error}
      </p>
    );

  return (
    <>
      <DropdownMenu.Root onOpenChange={(open) => open && inlineError && setError(null)}>
        <DropdownMenu.Trigger asChild>
          <Button variant="outlined" size="sm" className={className} loading={busy && !naming && !confirming}>
            <Bookmark size="sm" aria-hidden="true" />
            {active?.name ?? t.views}
            <ChevronDown size="sm" aria-hidden="true" />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="start" sheet={sheet}>
          {views.length > 0 && (
            <DropdownMenu.RadioGroup value={active?.id ?? ''} onValueChange={onSelect}>
              {views.map((v) => (
                <DropdownMenu.RadioItem key={v.id} value={v.id}>
                  {v.name}
                  {v.id === defaultView && (
                    <span className="ms-auto ps-3 text-label-sm text-[var(--color-on-surface-muted)]">{t.defaultViewTag}</span>
                  )}
                </DropdownMenu.RadioItem>
              ))}
            </DropdownMenu.RadioGroup>
          )}
          {views.length > 0 && (onSave || (active && (onUpdate || onRename || onDelete))) && <DropdownMenu.Separator />}
          {onSave && <DropdownMenu.Item onSelect={() => openNaming()}>{t.saveView}</DropdownMenu.Item>}
          {active && onUpdate && (
            <DropdownMenu.Item onSelect={() => run(onUpdate(active.id), () => {})}>{t.updateView(active.name)}</DropdownMenu.Item>
          )}
          {active && onRename && (
            <DropdownMenu.Item onSelect={() => openNaming(active.id)}>{t.renameView(active.name)}</DropdownMenu.Item>
          )}
          {active && onDelete && (
            <DropdownMenu.Item
              onSelect={() => {
                setError(null);
                if (confirmDelete) setConfirming(active);
                else remove(active);
              }}
              className="text-[var(--color-error)]"
            >
              {t.deleteView(active.name)}
            </DropdownMenu.Item>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      {inlineError && errorLine()}

      {(onSave || onRename) && (
        <Dialog.Root open={!!naming} onOpenChange={closeIfIdle(setNaming)}>
          <Dialog.Content className="max-w-sm">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const n = name.trim();
                if (!n || busy) return;
                const result = renaming ? onRename?.(renaming.id, n) : onSave?.(n);
                run(result, () => setNaming(null));
              }}
              aria-busy={busy || undefined}
              className="flex flex-col gap-4"
            >
              <Dialog.Header>
                <Dialog.Title>{renaming ? t.renameView(renaming.name) : t.saveView.replace(/…$/, '')}</Dialog.Title>
              </Dialog.Header>
              <Input
                aria-label={t.viewName}
                placeholder={t.viewName}
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={maxLength}
                readOnly={busy}
                invalid={!!error}
                aria-describedby={error ? errorId : undefined}
                autoFocus
              />
              {errorLine(errorId)}
              <Dialog.Footer>
                <Dialog.Close asChild>
                  <Button type="button" variant="text" disabled={busy}>
                    {t.cancel}
                  </Button>
                </Dialog.Close>
                <Button type="submit" disabled={!name.trim()} loading={busy}>
                  {t.save}
                </Button>
              </Dialog.Footer>
            </form>
          </Dialog.Content>
        </Dialog.Root>
      )}

      {onDelete && confirmDelete && (
        <AlertDialog.Root open={!!confirming} onOpenChange={closeIfIdle(setConfirming)}>
          <AlertDialog.Portal>
            <AlertDialog.Overlay />
            <AlertDialog.Content className="max-w-sm" aria-busy={busy || undefined}>
              <AlertDialog.Header>
                <AlertDialog.Title>{confirming && t.deleteViewConfirm(confirming.name)}</AlertDialog.Title>
                <AlertDialog.Description>{t.deleteViewDescription}</AlertDialog.Description>
              </AlertDialog.Header>
              {errorLine()}
              <AlertDialog.Footer>
                <AlertDialog.Cancel disabled={busy}>{t.cancel}</AlertDialog.Cancel>
                <Button variant="destructive" loading={busy} onClick={() => confirming && remove(confirming)}>
                  {t.deleteLabel}
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      )}
    </>
  );
}

SavedViews.displayName = 'SavedViews';
