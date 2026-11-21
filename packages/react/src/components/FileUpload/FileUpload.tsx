'use client';

import * as React from 'react';
import { Paperclip, Upload, X } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { useLocale, useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { Progress } from '../Progress/Progress.js';
import { SPRING_MS } from '../Motion/useMotion.js';
import { Slot } from '@radix-ui/react-slot';
import { disabledContainer, disabledText, pressable } from '../../utils/control.js';

/** Localised file size ("12.3 kB", "1,5 Mo"), 1024-based as before. */
export function formatFileSize(bytes: number, locale: string): string {
  const [value, unit] =
    bytes < 1024 ? [bytes, 'byte'] : bytes < 1024 * 1024 ? [bytes / 1024, 'kilobyte'] : [bytes / (1024 * 1024), 'megabyte'];
  return new Intl.NumberFormat(locale, { style: 'unit', unit, unitDisplay: 'short', maximumFractionDigits: 1 }).format(value);
}

/**
 * Whether `file` matches an `accept` list: MIME types (`image/png`), wildcards
 * (`image/*`) and extensions (`.pdf`), like the native input. A UX filter only:
 * the server must still check what it receives.
 */
export function fileAccepted(file: File, accept?: string[]): boolean {
  if (!accept?.length) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return accept.some((raw) => {
    const a = raw.trim().toLowerCase();
    if (a.startsWith('.')) return name.endsWith(a);
    if (a.endsWith('/*')) return type.startsWith(a.slice(0, -1));
    return type === a;
  });
}

export interface FileRejection {
  file: File;
  reason: 'type' | 'size' | 'count' | 'custom';
  /** The message returned by `validate` (reason `'custom'`). */
  message?: string;
}

interface FileUploadContextValue {
  accept?: string[];
  maxFiles?: number;
  maxSize?: number;
  onFilesChange?: (files: File[]) => void;
  files: File[];
  rejections: FileRejection[];
  addFiles: (newFiles: File[]) => void | Promise<void>;
  removeFile: (index: number) => void;
  isDragging: boolean;
  setIsDragging: (v: boolean) => void;
  invalid?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  busy?: boolean;
  progress?: number;
  capture?: FileUploadRootProps['capture'];
}

const FileUploadContext = React.createContext<FileUploadContextValue | null>(null);

function useFileUpload() {
  const ctx = React.useContext(FileUploadContext);
  if (!ctx) throw new Error('FileUpload parts must be used inside FileUpload.Root');
  return ctx;
}

export interface FileUploadRootProps extends React.HTMLAttributes<HTMLDivElement> {
  accept?: string[];
  maxFiles?: number;
  /** Largest file in bytes. Bigger files are rejected with a message. */
  maxSize?: number;
  onFilesChange?: (files: File[]) => void;
  /** Files turned away by `accept`, `maxSize` or `maxFiles`, from the picker or a drop. */
  onReject?: (rejections: FileRejection[]) => void;
  /**
   * Your own check, run after `accept` and `maxSize`: return a message to reject
   * the file. Client-side checks are a convenience; validate again on the server.
   */
  validate?: (file: File) => string | null | undefined;
  /** Error border on the drop zone and `aria-invalid` on its file input. */
  invalid?: boolean;
  /** Files stay listed; nothing can be picked, dropped, pasted or removed. */
  readOnly?: boolean;
  /**
   * 11.1: controlled list. Pass `files` with `onFilesChange` to clear or set the list from
   * outside (e.g. `files={[]}` after a send), instead of remounting with a `key`.
   */
  files?: File[];
  /** 11.1: the starting list when uncontrolled. */
  defaultFiles?: File[];
  /** 11.1: nothing can be picked, dropped or pasted; the zone and trigger look disabled. */
  disabled?: boolean;
  /** 11.1: an upload is running. Picking is blocked and the zone or trigger shows it (with `progress`, a bar). */
  busy?: boolean;
  /** 11.1: 0–100 while `busy`. */
  progress?: number;
  /**
   * 11.1: open the phone camera instead of the file list (the input's `capture`):
   * `'environment'` (back), `'user'` (front), or `true` for the browser's choice.
   */
  capture?: boolean | 'user' | 'environment';
  /**
   * 11.1: runs on each file after the `accept` check and before `maxSize` and `validate`, e.g.
   * to shrink a photo. Return the file to keep (a new File or the same one). May be async.
   */
  transform?: (file: File) => File | Promise<File>;
}

const Root = React.forwardRef<HTMLDivElement, FileUploadRootProps>(
  (
    {
      className,
      accept,
      maxFiles,
      maxSize,
      onFilesChange,
      onReject,
      validate,
      invalid,
      readOnly,
      onPaste,
      files: filesProp,
      defaultFiles,
      disabled,
      busy,
      progress,
      capture,
      transform,
      children,
      ...props
    },
    ref,
  ) => {
    const [internalFiles, setInternalFiles] = React.useState<File[]>(defaultFiles ?? []);
    const controlled = filesProp !== undefined;
    const files = controlled ? filesProp : internalFiles;
    const setFiles = (next: File[]) => {
      if (!controlled) setInternalFiles(next);
    };
    const [rejections, setRejections] = React.useState<FileRejection[]>([]);
    const [isDragging, setIsDragging] = React.useState(false);
    // Latest list for the async transform path: files picked while one is transforming append, not replace.
    const filesRef = React.useRef(files);
    filesRef.current = files;
    const blocked = readOnly || disabled || busy;

    // Picker, drop, paste and Trigger all come through here, so all are filtered.
    const addFiles = React.useCallback(
      async (newFiles: File[]) => {
        if (blocked) return;
        const rejected: FileRejection[] = [];
        const kept: File[] = [];
        let custom: string | null;
        for (const original of newFiles) {
          if (!fileAccepted(original, accept)) {
            rejected.push({ file: original, reason: 'type' });
            continue;
          }
          let file = original;
          if (transform) {
            try {
              file = await transform(original);
            } catch (error) {
              rejected.push({ file: original, reason: 'custom', message: error instanceof Error ? error.message : String(error) });
              continue;
            }
          }
          if (maxSize !== undefined && file.size > maxSize) rejected.push({ file, reason: 'size' });
          else if ((custom = validate?.(file) || null)) rejected.push({ file, reason: 'custom', message: custom });
          else kept.push(file);
        }
        const next = [...filesRef.current];
        for (const file of kept) {
          if (maxFiles !== undefined && next.length >= maxFiles) rejected.push({ file, reason: 'count' });
          else next.push(file);
        }
        setRejections(rejected);
        if (next.length !== filesRef.current.length) {
          filesRef.current = next;
          setFiles(next);
          onFilesChange?.(next);
        }
        if (rejected.length) onReject?.(rejected);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [accept, maxFiles, maxSize, onFilesChange, onReject, validate, blocked, transform, controlled],
    );

    const removeFile = React.useCallback(
      (index: number) => {
        if (readOnly) return;
        const next = files.filter((_, i) => i !== index);
        setFiles(next);
        setRejections([]);
        filesRef.current = next;
        onFilesChange?.(next);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [files, onFilesChange, readOnly, controlled],
    );

    // Memoize the context value so that consumers only re-render when one of
    // the tracked values actually changes — not on every parent render cycle.
    const contextValue = React.useMemo(
      () => ({ accept, maxFiles, maxSize, onFilesChange, files, rejections, addFiles, removeFile, isDragging, setIsDragging, invalid, readOnly, disabled, busy, progress, capture }),
      [accept, maxFiles, maxSize, onFilesChange, files, rejections, addFiles, removeFile, isDragging, setIsDragging, invalid, readOnly, disabled, busy, progress, capture],
    );

    return (
      <FileUploadContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn('flex flex-col gap-4', className)}
          // Pasted files (focus anywhere inside, e.g. the drop zone) take the picker's path.
          onPaste={(e) => {
            onPaste?.(e);
            const pasted = Array.from(e.clipboardData?.files ?? []);
            if (e.defaultPrevented || !pasted.length || blocked) return;
            e.preventDefault();
            addFiles(pasted);
          }}
          {...props}
        >
          {children}
        </div>
      </FileUploadContext.Provider>
    );
  },
);
Root.displayName = 'FileUpload.Root';

/** Rejection messages: always mounted so screen readers announce new errors. */
function Rejections({ id, className }: { id: string; className?: string }) {
  const { maxFiles, maxSize, rejections } = useFileUpload();
  const messages = useNexubMessages();
  const { locale } = useLocale();
  return (
    <div id={id} role="alert" className={cn('empty:hidden text-start text-body-sm text-error', className)}>
      {rejections.length > 0 && (
        <ul>
          {rejections.map(({ file, reason, message }, i) => (
            <li key={`${file.name}-${i}`}>
              {reason === 'custom'
                ? message
                : reason === 'type'
                  ? messages.fileTypeRejected(file.name)
                  : reason === 'size'
                    ? messages.fileTooLarge(file.name, formatFileSize(maxSize ?? 0, locale))
                    : messages.tooManyFiles(maxFiles ?? 0)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Props for the hidden native input shared by Dropzone and Trigger. */
function useFileInputProps(errorId: string): React.InputHTMLAttributes<HTMLInputElement> {
  const { accept, maxFiles, rejections, addFiles, invalid, readOnly, disabled, busy, capture } = useFileUpload();
  return {
    type: 'file',
    className: 'sr-only',
    multiple: maxFiles !== 1,
    accept: accept?.join(','),
    capture: capture === true ? ('' as never) : capture || undefined,
    disabled,
    'aria-invalid': invalid || undefined,
    'aria-describedby': rejections.length ? errorId : undefined,
    // Read-only and busy: stays focusable, the picker never opens.
    onClick: (e) => {
      if (readOnly || busy) e.preventDefault();
    },
    onChange: (e) => {
      if (e.target.files) void addFiles(Array.from(e.target.files));
      e.target.value = '';
    },
  };
}

export interface FileUploadDropzoneProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 11.1: `'sm'` is a compact one-line zone for forms and side panels. @default 'md' */
  size?: 'sm' | 'md';
}

const Dropzone = React.forwardRef<HTMLDivElement, FileUploadDropzoneProps>(
  ({ className, children, size = 'md', ...props }, ref) => {
    const { addFiles, isDragging, setIsDragging, invalid, readOnly, disabled, busy, progress } = useFileUpload();
    const messages = useNexubMessages();
    const errorId = React.useId();
    const inputProps = useFileInputProps(errorId);
    const inert = readOnly || disabled || busy;
    const compact = size === 'sm';

    function handleDrop(e: React.DragEvent) {
      e.preventDefault();
      setIsDragging(false);
      if (inert) return;
      void addFiles(Array.from(e.dataTransfer.files));
    }

    return (
      // A <label> around the native file input: click, Enter and Space open the
      // picker natively, the visible text is the accessible name, and the
      // focus ring follows the input's keyboard focus onto the drop zone.
      <div
        ref={ref}
        data-disabled={disabled ? '' : undefined}
        aria-busy={busy || undefined}
        onDragOver={(e) => {
          e.preventDefault();
          if (!inert) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          // Hover/press = the state layer.
          'rounded-shape-container border-2 border-dashed text-center text-on-surface transition-colors',
          'has-[input:focus-visible]:outline has-[input:focus-visible]:outline-3 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-primary',
          !inert && 'nx-state-layer',
          disabled
            ? 'border-outline-variant text-[var(--color-text-disabled)]'
            : readOnly || busy
              ? 'border-outline-variant bg-surface-container-low'
              : isDragging
                ? 'border-primary bg-[color-mix(in_srgb,var(--color-primary)_8%,transparent)]'
                : invalid
                  ? 'border-error'
                  : 'border-outline hover:border-primary',
          className,
        )}
        {...props}
      >
        <label
          className={cn(
            'flex items-center justify-center',
            compact ? 'flex-row gap-2 px-4 py-3' : 'flex-col gap-2 p-8',
            disabled ? 'cursor-not-allowed' : inert ? 'cursor-default' : 'cursor-pointer',
          )}
        >
          <Upload size={compact ? 'sm' : 'lg'} className={disabled ? undefined : 'text-on-surface-muted'} aria-hidden="true" />
          {busy ? (
            <span className="text-body-sm text-on-surface-muted">{messages.uploading}</span>
          ) : (
            (children ?? (
              <span className={cn('text-body-sm', !disabled && 'text-on-surface-muted')}>
                <span className={cn('font-semibold', !disabled && 'text-primary')}>{messages.clickToUpload}</span>{' '}
                {messages.orDragAndDrop}
              </span>
            ))
          )}
          <input {...inputProps} />
        </label>
        {busy && progress !== undefined && (
          <div className={compact ? 'px-4 pb-3' : 'px-8 pb-6'}>
            <Progress value={Math.round(progress)} size="sm" aria-label={messages.uploading} />
          </div>
        )}
        <Rejections id={errorId} className="px-4 pb-3" />
      </div>
    );
  },
);
Dropzone.displayName = 'FileUpload.Dropzone';


export interface FileUploadTriggerProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /**
   * 11.1: no visible text, only the icon (a paperclip by default). The button's name is
   * `aria-label` or the `uploadFile` message.
   */
  iconOnly?: boolean;
  /** The icon. @default a paperclip */
  icon?: React.ReactNode;
  /** Your own button (e.g. `<Button>`) as the trigger: it gets the click and the ARIA wiring. */
  asChild?: boolean;
}

// The outlined Button and the ghost IconButton, from the shared control classes: importing
// Button or IconButton would add their whole code to every FileUpload. Any other look: asChild.
const triggerButton = `${pressable} nx-hit relative inline-flex max-w-full items-center justify-center gap-2 whitespace-nowrap h-control-md px-5 text-label-lg bg-transparent border border-[var(--button-outlined-border,var(--color-outline-variant))] text-[var(--button-outlined-fg,var(--color-on-surface))] ${disabledContainer}`;
const triggerIcon = `${pressable} nx-hit relative inline-flex flex-shrink-0 items-center justify-center h-control-md w-control-md bg-transparent text-on-surface-variant ${disabledText}`;

/**
 * 11.1: a button that opens the file picker, with no drop zone: a composer's paperclip, an
 * "Import CSV" button, a photo button with `capture`. Files take the same path as the drop
 * zone (accept, transform, size, validate, count), and rejections show under the button.
 * It looks like an outlined Button (or, `iconOnly`, a plain IconButton); for any other look
 * pass your own Button with `asChild`.
 */
const Trigger = React.forwardRef<HTMLButtonElement, FileUploadTriggerProps>(
  ({ iconOnly = false, icon, asChild = false, children, className, disabled: disabledProp, onClick, 'aria-label': ariaLabel, ...props }, ref) => {
    const { disabled: rootDisabled, readOnly, busy, rejections } = useFileUpload();
    const messages = useNexubMessages();
    const errorId = React.useId();
    const inputProps = useFileInputProps(errorId);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const disabled = disabledProp || rootDisabled;
    const glyph = busy ? (
      <span aria-hidden="true" className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-t-transparent" />
    ) : (
      (icon ?? <Paperclip size="sm" aria-hidden="true" />)
    );
    const Comp = asChild ? Slot : 'button';
    return (
      <span className={cn('inline-flex flex-col items-start gap-1', className)}>
        <Comp
          ref={ref}
          type="button"
          disabled={disabled}
          aria-busy={busy || undefined}
          aria-disabled={busy || undefined}
          aria-label={ariaLabel ?? (iconOnly ? messages.uploadFile : undefined)}
          aria-describedby={rejections.length ? errorId : undefined}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            onClick?.(e);
            if (!e.defaultPrevented && !readOnly && !busy) inputRef.current?.click();
          }}
          className={asChild ? undefined : iconOnly ? triggerIcon : triggerButton}
          {...props}
        >
          {asChild ? (
            children
          ) : iconOnly ? (
            glyph
          ) : (
            <>
              {glyph}
              {busy ? messages.uploading : (children ?? messages.uploadFile)}
            </>
          )}
        </Comp>
        <input {...inputProps} ref={inputRef} tabIndex={-1} aria-hidden="true" />
        <Rejections id={errorId} />
      </span>
    );
  },
);
Trigger.displayName = 'FileUpload.Trigger';

const List = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => {
    const { files } = useFileUpload();
    if (files.length === 0) return null;
    // No gap: each item carries its own spacing so it collapses with it.
    return <ul ref={ref} className={cn('flex flex-col', className)} {...props} />;
  },
);
List.displayName = 'FileUpload.List';

export interface FileUploadItemProps extends React.HTMLAttributes<HTMLLIElement> {
  index: number;
  /** Upload progress 0–100. Below 100 shows a bar and, with `onCancel`, a cancel button. Your app does the upload. */
  progress?: number;
  /** Stops this file's upload (e.g. AbortController.abort()); shown while `progress` is below 100. */
  onCancel?: () => void;
  /** Why this file failed; shown under its name. */
  error?: string;
}

const Item = React.forwardRef<HTMLLIElement, FileUploadItemProps>(({ className, index, progress, onCancel, error, ...props }, ref) => {
  const { files, removeFile, readOnly } = useFileUpload();
  const messages = useNexubMessages();
  const { locale } = useLocale();
  const file = files[index];
  // Exit is tied to the file, so an index-keyed item reused for the next file isn't stuck exiting.
  const [exiting, setExiting] = React.useState<File | null>(null);
  const [entered, setEntered] = React.useState(false);
  const [thumb, setThumb] = React.useState<string>();
  React.useEffect(() => {
    if (!file?.type.startsWith('image/') || typeof URL.createObjectURL !== 'function') return;
    const url = URL.createObjectURL(file);
    setThumb(url);
    return () => {
      URL.revokeObjectURL(url);
      setThumb(undefined);
    };
  }, [file]);
  const isExiting = !!file && exiting === file;
  React.useEffect(() => {
    if (!isExiting) return;
    // animationend may never fire (hidden, reduced motion), so a timer backs it up.
    const t = setTimeout(() => removeFile(index), SPRING_MS.effects.default + 50);
    return () => clearTimeout(t);
  }, [isExiting, index, removeFile]);
  if (!file) return null;
  const uploading = progress !== undefined && progress < 100;
  const percent = Math.round(Math.max(0, Math.min(100, progress ?? 0)));
  return (
    // nx-list-item: grows in on add, collapses out on remove (grid rows, spring tokens).
    <li
      ref={ref}
      className="nx-list-item"
      data-state={isExiting ? 'exit' : entered ? undefined : 'enter'}
      onAnimationEnd={(e) => {
        if (e.target !== e.currentTarget) return;
        if (isExiting) removeFile(index);
        else setEntered(true);
      }}
      {...props}
    >
      <div className="nx-list-item-inner">
        <div className="[li:not(:last-child)>.nx-list-item-inner>&]:pb-2">
          <div
            className={cn(
              'flex items-center justify-between gap-3 rounded-shape-container border border-[var(--color-outline-variant)] bg-[var(--color-surface)] p-3',
              className,
            )}
          >
            {thumb && <img src={thumb} alt="" className="h-10 w-10 shrink-0 rounded-shape-min object-cover" />}
            <div className="min-w-0 flex-1">
              <p className="truncate text-body-sm font-medium text-[var(--color-on-surface)]">
                {file.name}
              </p>
              <p className="text-label-sm font-normal text-[var(--color-on-surface-muted)]">
                {formatFileSize(file.size, locale)}
                {uploading && ` · ${percent}%`}
              </p>
              {uploading && (
                <Progress value={percent} size="sm" className="mt-1.5" aria-label={messages.uploadProgress(file.name, percent)} />
              )}
              {error && (
                <p role="alert" className="mt-1 text-label-sm font-normal text-[var(--color-error)]">
                  {error}
                </p>
              )}
            </div>
            {!readOnly && <button
              type="button"
              onClick={() => {
                if (uploading && onCancel) return onCancel();
                setEntered(true);
                setExiting(file);
              }}
              aria-label={uploading && onCancel ? messages.cancelUpload(file.name) : messages.removeFile(file.name)}
              className="nx-state-layer shrink-0 rounded-full p-1 text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)] transition-colors"
            >
              <X size="sm" aria-hidden="true" />
            </button>}
          </div>
        </div>
      </div>
    </li>
  );
});
Item.displayName = 'FileUpload.Item';

export const FileUpload = { Root, Dropzone, Trigger, List, Item };
