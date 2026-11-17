import * as React from 'react';
import {
  Alert,
  AlertDialog,
  Button,
  Card,
  DescriptionList,
  Form,
  FormField,
  SkeletonPreset,
  cn,
  safeHref,
  useNexubMessages,
  useUnsavedChanges,
  type FormErrorItem,
} from '@nexub/react';
import { ArrowLeft } from '@nexub/icons';
import { ErrorSummary } from '../ErrorSummary/index.js';
import { PageFrame, usePageMessages, type PageFrameProps, type PageTemplateMessages } from '../PageFrame/PageFrame.js';

export interface DetailField {
  /** The form field name in edit mode. */
  name: string;
  label: React.ReactNode;
  /** What view mode shows (and edit mode, for a field without `input`). */
  value: React.ReactNode;
  /** The control for edit mode, e.g. `<Input defaultValue="…" required />`. It is placed in a FormField, which sets its id and name. */
  input?: React.ReactNode;
  /** 2: the full row at wide widths. @default 1 */
  span?: 1 | 2;
}

export interface DetailSection {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  fields: DetailField[];
}

export interface DetailPageProps extends Omit<PageFrameProps, 'title' | 'children' | 'description'> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** A status badge beside the actions. */
  status?: React.ReactNode;
  /** A back link above the title. `onBack` renders a button in its place. */
  backHref?: string;
  onBack?: () => void;
  sections: DetailSection[];
  editing?: boolean;
  defaultEditing?: boolean;
  onEditingChange?: (editing: boolean) => void;
  /** Saves the edit form. A rejected promise shows its message and stays in edit mode. Without it there is no Edit button. */
  onSave?: (data: FormData) => void | Promise<unknown>;
  /** Called after edit mode is left without saving. */
  onCancel?: () => void;
  /** Beside the sections at wide widths, below them when narrow: activity, StatusSteps. */
  aside?: React.ReactNode;
  /** Skeletons in place of the sections; sets aria-busy on the page. */
  loading?: boolean;
  /** Shown in place of the sections; wins over `loading`. */
  errorState?: React.ReactNode;
  messages?: Partial<PageTemplateMessages>;
}

const span2 = '@md:col-span-2';

/** One record: read it as description lists, edit it in place with the same layout. */
export const DetailPage = React.forwardRef<HTMLElement, DetailPageProps>(function DetailPage(
  {
    title,
    subtitle,
    status,
    actions,
    backHref,
    onBack,
    sections,
    editing: editingProp,
    defaultEditing = false,
    onEditingChange,
    onSave,
    onCancel,
    aside,
    loading,
    errorState,
    messages,
    ...props
  },
  ref,
) {
  const m = usePageMessages(messages);
  const t = useNexubMessages();
  const [editingState, setEditingState] = React.useState(defaultEditing);
  const editing = editingProp ?? editingState;
  const [dirty, setDirty] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string>();
  const [invalid, setInvalid] = React.useState<FormErrorItem[]>([]);
  const [confirming, setConfirming] = React.useState(false);
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  useUnsavedChanges(editing && dirty);

  // Switching mode swaps the content: move focus to it (not on first render).
  const first = React.useRef(true);
  React.useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [editing]);

  const setEditing = (next: boolean) => {
    setEditingState(next);
    setDirty(false);
    setError(undefined);
    setInvalid([]);
    onEditingChange?.(next);
  };
  const leave = () => {
    setConfirming(false);
    setEditing(false);
    onCancel?.();
  };
  const save = async (data: FormData) => {
    setError(undefined);
    setInvalid([]);
    setBusy(true);
    try {
      await onSave?.(data);
      setEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const editable = !!onSave && sections.some((s) => s.fields.some((f) => f.input != null));
  const failed = errorState != null;
  const back = backHref ? (
    <Button variant="text" size="sm" className="self-start" asChild>
      <a href={safeHref(backHref)}>
        <ArrowLeft size="sm" className="rtl:-scale-x-100" aria-hidden="true" />
        {m.back}
      </a>
    </Button>
  ) : (
    onBack && (
      <Button variant="text" size="sm" className="self-start" onClick={onBack} leadingIcon={<ArrowLeft size="sm" className="rtl:-scale-x-100" aria-hidden="true" />}>
        {m.back}
      </Button>
    )
  );

  const section = (s: DetailSection, i: number, body: React.ReactNode) => (
    <section key={s.id} aria-labelledby={`${s.id}-title`} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 id={`${s.id}-title`} ref={i === 0 ? headingRef : undefined} tabIndex={i === 0 ? -1 : undefined} className="text-title-md text-[var(--color-on-surface)] outline-none">
          {s.title}
        </h2>
        {s.description && <p className="text-body-sm text-[var(--color-on-surface-muted)]">{s.description}</p>}
      </div>
      <Card className="p-4 @xl:p-6">{body}</Card>
    </section>
  );

  const content = editing ? (
    <Form
      onSubmit={save}
      onInvalidSubmit={setInvalid}
      // ponytail: dirty = anything was typed or changed since edit mode began, not a value diff.
      onInput={() => setDirty(true)}
      onChange={() => setDirty(true)}
      className="gap-6"
    >
      <ErrorSummary errors={invalid} />
      {error && (
        <Alert tone="danger" role="alert">
          {error}
        </Alert>
      )}
      {sections.map((s, i) =>
        section(
          s,
          i,
          <div className="grid gap-4 @xl:grid-cols-2">
            {s.fields.map((f) =>
              f.input != null ? (
                <FormField.Root key={f.name} name={f.name} className={cn(f.span === 2 && '@xl:col-span-2')}>
                  <FormField.Label>{f.label}</FormField.Label>
                  {React.isValidElement(f.input) ? (
                    <FormField.Control>{f.input as React.ReactElement<Record<string, unknown>>}</FormField.Control>
                  ) : (
                    f.input
                  )}
                  <FormField.Error />
                </FormField.Root>
              ) : (
                <div key={f.name} className={cn('flex flex-col gap-1.5', f.span === 2 && '@xl:col-span-2')}>
                  <span className="text-label-lg text-[var(--color-on-surface-variant)]">{f.label}</span>
                  <span className="text-body-md text-[var(--color-on-surface)]">{f.value}</span>
                </div>
              ),
            )}
          </div>,
        ),
      )}
      {/* Sticky at the end of the form's own flow: it rides the bottom edge while the form is taller than the screen and never sits over the last field. */}
      <div className="sticky bottom-0 z-[1] flex flex-wrap justify-end gap-2 border-t border-[var(--color-outline-variant)] bg-[var(--color-surface)] py-3">
        <Button type="button" variant="text" disabled={busy} onClick={() => (dirty ? setConfirming(true) : leave())}>
          {t.cancel}
        </Button>
        <Button type="submit" loading={busy}>
          {t.save}
        </Button>
      </div>
    </Form>
  ) : (
    <div className="flex flex-col gap-6">
      {sections.map((s, i) =>
        section(
          s,
          i,
          <DescriptionList.Root layout="stacked" columns={2}>
            {s.fields.map((f) => (
              <DescriptionList.Item key={f.name} label={f.label} className={cn(f.span === 2 && span2)}>
                {f.value}
              </DescriptionList.Item>
            ))}
          </DescriptionList.Root>,
        ),
      )}
    </div>
  );

  return (
    <PageFrame
      ref={ref}
      width="lg"
      title={title}
      description={subtitle}
      eyebrow={back}
      aria-busy={(loading && !failed) || undefined}
      actions={
        (status || actions || (editable && !editing)) && (
          <>
            {status}
            {actions}
            {editable && !editing && !loading && !failed && (
              <Button variant="tonal" onClick={() => setEditing(true)}>
                {m.edit}
              </Button>
            )}
          </>
        )
      }
      {...props}
    >
      {failed ? (
        errorState
      ) : loading ? (
        <SkeletonPreset preset="form" count={4} />
      ) : (
        <div className={cn('grid gap-6', aside != null && '@[60rem]:grid-cols-3')}>
          <div className={cn('min-w-0', aside != null && '@[60rem]:col-span-2')}>{content}</div>
          {aside != null && <aside className="min-w-0">{aside}</aside>}
        </div>
      )}
      <AlertDialog.Root open={confirming} onOpenChange={setConfirming}>
        <AlertDialog.Content sheet="auto">
          <AlertDialog.Header>
            <AlertDialog.Title>{m.discardChangesTitle}</AlertDialog.Title>
            <AlertDialog.Description>{m.discardChangesDescription}</AlertDialog.Description>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <AlertDialog.Cancel>{m.keepEditing}</AlertDialog.Cancel>
            <AlertDialog.Action onClick={leave}>{m.discard}</AlertDialog.Action>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </PageFrame>
  );
});
