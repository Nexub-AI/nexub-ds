import * as React from 'react';
import { Upload, X } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { useLocale, useNexubMessages } from '../NexubProvider/NexubProvider.js';

/** Localised file size ("12.3 kB", "1,5 Mo"), 1024-based as before. */
export function formatFileSize(bytes: number, locale: string): string {
  const [value, unit] =
    bytes < 1024 ? [bytes, 'byte'] : bytes < 1024 * 1024 ? [bytes / 1024, 'kilobyte'] : [bytes / (1024 * 1024), 'megabyte'];
  return new Intl.NumberFormat(locale, { style: 'unit', unit, unitDisplay: 'short', maximumFractionDigits: 1 }).format(value);
}

interface FileUploadContextValue {
  accept?: string[];
  maxFiles?: number;
  onFilesChange?: (files: File[]) => void;
  files: File[];
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
  onFilesChange?: (files: File[]) => void;
}

const Root = React.forwardRef<HTMLDivElement, FileUploadRootProps>(
  ({ className, accept, maxFiles, onFilesChange, children, ...props }, ref) => {
    const [files, setFiles] = React.useState<File[]>([]);
    const [isDragging, setIsDragging] = React.useState(false);

    const addFiles = React.useCallback(
      (newFiles: File[]) => {
        setFiles((prev) => {
          const next = [...prev, ...newFiles].slice(0, maxFiles);
          onFilesChange?.(next);
          return next;
        });
      },
      [maxFiles, onFilesChange],
    );

    const removeFile = React.useCallback(
      (index: number) => {
        setFiles((prev) => {
          const next = prev.filter((_, i) => i !== index);
          onFilesChange?.(next);
          return next;
        });
      },
      [onFilesChange],
    );

    // Memoize the context value so that consumers only re-render when one of
    // the tracked values actually changes — not on every parent render cycle.
    const contextValue = React.useMemo(
      () => ({ accept, maxFiles, onFilesChange, files, addFiles, removeFile, isDragging, setIsDragging }),
      [accept, maxFiles, onFilesChange, files, addFiles, removeFile, isDragging, setIsDragging],
    );

    return (
      <FileUploadContext.Provider value={contextValue}>
        <div ref={ref} className={cn('flex flex-col gap-4', className)} {...props}>
          {children}
        </div>
      </FileUploadContext.Provider>
    );
  },
);
Root.displayName = 'FileUpload.Root';

const Dropzone = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { accept, addFiles, isDragging, setIsDragging } = useFileUpload();
    const messages = useNexubMessages();
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
          />
        </label>
      </div>
    );
  },
);
Dropzone.displayName = 'FileUpload.Dropzone';

const List = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => {
    const { files } = useFileUpload();
    if (files.length === 0) return null;
    return <ul ref={ref} className={cn('flex flex-col gap-2', className)} {...props} />;
  },
);
List.displayName = 'FileUpload.List';

const Item = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement> & { index: number }
>(({ className, index, ...props }, ref) => {
  const { files, removeFile } = useFileUpload();
  const messages = useNexubMessages();
  const { locale } = useLocale();
  const file = files[index];
  if (!file) return null;
  return (
    <li
      ref={ref}
      className={cn(
        'flex items-center justify-between gap-3 rounded-shape-container border border-[var(--color-outline-variant)] bg-[var(--color-surface)] p-3',
        className,
      )}
      {...props}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[var(--color-on-surface)]">
          {file.name}
        </p>
        <p className="text-xs text-[var(--color-on-surface-muted)]">
          {formatFileSize(file.size, locale)}
        </p>
      </div>
      <button
        onClick={() => removeFile(index)}
        aria-label={messages.removeFile(file.name)}
        className="nx-state-layer shrink-0 rounded-full p-1 text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)] transition-colors"
      >
        <X size="sm" aria-hidden="true" />
      </button>
    </li>
  );
});
Item.displayName = 'FileUpload.Item';

export const FileUpload = { Root, Dropzone, List, Item };
