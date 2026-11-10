'use client';

import * as React from 'react';
import { Upload, X } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { useLocale, useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { Progress } from '../Progress/Progress.js';
import { SPRING_MS } from '../Motion/useMotion.js';

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
  addFiles: (newFiles: File[]) => void;
  removeFile: (index: number) => void;
  isDragging: boolean;
  setIsDragging: (v: boolean) => void;
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
}

const Root = React.forwardRef<HTMLDivElement, FileUploadRootProps>(
  ({ className, accept, maxFiles, maxSize, onFilesChange, onReject, validate, onPaste, children, ...props }, ref) => {
    const [files, setFiles] = React.useState<File[]>([]);
    const [rejections, setRejections] = React.useState<FileRejection[]>([]);
    const [isDragging, setIsDragging] = React.useState(false);

    // Picker and drop both come through here, so both are filtered.
    const addFiles = React.useCallback(
      (newFiles: File[]) => {
        const rejected: FileRejection[] = [];
        let custom: string | null;
        const next = [...files];
        for (const file of newFiles) {
          if (!fileAccepted(file, accept)) rejected.push({ file, reason: 'type' });
          else if (maxSize !== undefined && file.size > maxSize) rejected.push({ file, reason: 'size' });
          else if ((custom = validate?.(file) || null)) rejected.push({ file, reason: 'custom', message: custom });
          else if (maxFiles !== undefined && next.length >= maxFiles) rejected.push({ file, reason: 'count' });
          else next.push(file);
        }
        setRejections(rejected);
        if (next.length !== files.length) {
          setFiles(next);
          onFilesChange?.(next);
        }
        if (rejected.length) onReject?.(rejected);
      },
      [files, accept, maxFiles, maxSize, onFilesChange, onReject, validate],
    );

    const removeFile = React.useCallback(
      (index: number) => {
        const next = files.filter((_, i) => i !== index);
        setFiles(next);
        setRejections([]);
        onFilesChange?.(next);
      },
      [files, onFilesChange],
    );

    // Memoize the context value so that consumers only re-render when one of
    // the tracked values actually changes — not on every parent render cycle.
    const contextValue = React.useMemo(
      () => ({ accept, maxFiles, maxSize, onFilesChange, files, rejections, addFiles, removeFile, isDragging, setIsDragging }),
      [accept, maxFiles, maxSize, onFilesChange, files, rejections, addFiles, removeFile, isDragging, setIsDragging],
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
            if (e.defaultPrevented || !pasted.length) return;
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

const Dropzone = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { accept, maxFiles, maxSize, rejections, addFiles, isDragging, setIsDragging } = useFileUpload();
    const messages = useNexubMessages();
    const { locale } = useLocale();
    const errorId = React.useId();
    const inputRef = React.useRef<HTMLInputElement>(null);

    function handleDrop(e: React.DragEvent) {
      e.preventDefault();
      setIsDragging(false);
      const dropped = Array.from(e.dataTransfer.files);
      addFiles(dropped);
    }

    return (
      // A <label> around the native file input: click, Enter and Space open the
      // picker natively, the visible text is the accessible name, and the
      // focus ring follows the input's keyboard focus onto the drop zone.
      <div
        ref={ref}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          // Hover/press = the state layer.
          'nx-state-layer rounded-shape-container border-2 border-dashed text-center text-[var(--color-on-surface)] transition-colors',
          'has-[input:focus-visible]:outline has-[input:focus-visible]:outline-[3px] has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-[var(--color-primary)]',
          isDragging
            ? 'border-[var(--color-primary)] bg-[color-mix(in_srgb,var(--color-primary)_8%,transparent)]'
            : 'border-[var(--color-outline)] hover:border-[var(--color-primary)]',
          className,
        )}
        {...props}
      >
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 p-8">
          <Upload size="lg" className="text-[var(--color-on-surface-muted)]" aria-hidden="true" />
          {children ?? (
            <span className="text-sm text-[var(--color-on-surface-muted)]">
              <span className="font-semibold text-[var(--color-primary)]">{messages.clickToUpload}</span>{' '}
              {messages.orDragAndDrop}
            </span>
          )}
          <input
            ref={inputRef}
            type="file"
            className="sr-only"
            multiple
            accept={accept?.join(',')}
            onChange={(e) => {
              if (e.target.files) addFiles(Array.from(e.target.files));
              e.target.value = '';
            }}
            aria-describedby={rejections.length ? errorId : undefined}
          />
        </label>
        {/* Always mounted so screen readers announce new errors. */}
        <div id={errorId} role="alert" className="empty:hidden px-4 pb-3 text-start text-sm text-[var(--color-error)]">
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
      </div>
    );
  },
);
Dropzone.displayName = 'FileUpload.Dropzone';

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
  const { files, removeFile } = useFileUpload();
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
              <p className="truncate text-sm font-medium text-[var(--color-on-surface)]">
                {file.name}
              </p>
              <p className="text-xs text-[var(--color-on-surface-muted)]">
                {formatFileSize(file.size, locale)}
                {uploading && ` · ${percent}%`}
              </p>
              {uploading && (
                <Progress value={percent} size="sm" className="mt-1.5" aria-label={messages.uploadProgress(file.name, percent)} />
              )}
              {error && (
                <p role="alert" className="mt-1 text-xs text-[var(--color-error)]">
                  {error}
                </p>
              )}
            </div>
            <button
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
            </button>
          </div>
        </div>
      </div>
    </li>
  );
});
Item.displayName = 'FileUpload.Item';

export const FileUpload = { Root, Dropzone, List, Item };
