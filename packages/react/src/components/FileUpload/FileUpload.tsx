import * as React from 'react';
import { Upload, X } from '@nexub/icons';
import { cn } from '../../utils/cn.js';

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
    const inputRef = React.useRef<HTMLInputElement>(null);

    function handleDrop(e: React.DragEvent) {
      e.preventDefault();
      setIsDragging(false);
      const dropped = Array.from(e.dataTransfer.files);
      addFiles(dropped);
    }

    return (
      <div
        ref={ref}
        role="button"
        tabIndex={0}
        aria-label="Upload files"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition-colors',
          isDragging
            ? 'border-[var(--color-brand-primary-500)] bg-[var(--color-brand-primary-500)]/5'
            : 'border-[var(--color-border-default)] hover:border-[var(--color-brand-primary-500)] hover:bg-[var(--color-bg-subtle)]',
          className,
        )}
        {...props}
      >
        <Upload size="lg" className="text-[var(--color-text-muted)]" aria-hidden="true" />
        {children ?? (
          <p className="text-sm text-[var(--color-text-muted)]">
            <span className="font-semibold text-[var(--color-brand-primary-500)]">
              Click to upload
            </span>{' '}
            or drag and drop
          </p>
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
  const file = files[index];
  if (!file) return null;
  return (
    <li
      ref={ref}
      className={cn(
        'flex items-center justify-between gap-3 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-default)] p-3',
        className,
      )}
      {...props}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[var(--color-text-primary)]">
          {file.name}
        </p>
        <p className="text-xs text-[var(--color-text-muted)]">
          {(file.size / 1024).toFixed(1)} KB
        </p>
      </div>
      <button
        onClick={() => removeFile(index)}
        aria-label={`Remove ${file.name}`}
        className="shrink-0 rounded p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
      >
        <X size="sm" aria-hidden="true" />
      </button>
    </li>
  );
});
Item.displayName = 'FileUpload.Item';

export const FileUpload = { Root, Dropzone, List, Item };
