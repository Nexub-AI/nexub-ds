import * as React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { Camera, Upload } from '@nexub/icons/native';
import { useLatest } from '../hooks/useLatest';
import { useTheme } from '../theme/ThemeProvider';
import { Button } from './actions';
import { FileList, type FileListItem } from './data';
import { Progress } from './feedback';

/**
 * A file from a picker, in the shape expo-document-picker and expo-image-picker give back
 * (map `mimeType` / `fileSize` to `type` / `size`). Add your own fields; they are kept.
 */
export interface PickedFile {
  /** Where the file is on the device (`file://`, `content://`, `ph://`). */
  uri: string;
  name: string;
  /** Bytes. Needed for `maxSize`. */
  size?: number;
  /** MIME type, e.g. `image/jpeg`. Needed for MIME entries in `accept`. */
  type?: string;
}

/** A file turned away, with why (the same reasons as web). */
export interface FileRejection<F extends PickedFile = PickedFile> {
  file: F;
  reason: 'type' | 'size' | 'count' | 'custom';
  /** The message from `validate`, or from the error `transform` threw (reason `'custom'`). */
  message?: string;
}

/**
 * Whether `file` matches an `accept` list: MIME types (`image/png`), wildcards (`image/*`) and
 * extensions (`.pdf`), like web. A UX filter only: the server must still check what it receives.
 */
export function fileAccepted(file: PickedFile, accept?: readonly string[]): boolean {
  if (!accept?.length) return true;
  const name = file.name.toLowerCase();
  const type = (file.type ?? '').toLowerCase();
  return accept.some((raw) => {
    const a = raw.trim().toLowerCase();
    if (a.startsWith('.')) return name.endsWith(a);
    if (a.endsWith('/*')) return type.startsWith(a.slice(0, -1));
    return type === a;
  });
}

export interface FileUploadProps<F extends PickedFile = PickedFile> {
  /**
   * Opens your file picker and resolves to what was picked (`[]` or `null` when cancelled), e.g.
   * expo-document-picker's `getDocumentAsync` or expo-image-picker's `launchImageLibraryAsync`.
   * Gets `multiple` and `accept` so you can pass them on. No picker, no "Upload files" button.
   */
  pickFiles?: (options: { multiple: boolean; accept?: readonly string[] }) => Promise<readonly F[] | null | undefined>;
  /**
   * Takes a photo and resolves to it (`null` when cancelled), e.g. expo-image-picker's
   * `launchCameraAsync`. Adds a camera button (named by `captureLabel`).
   */
  capture?: () => Promise<F | null | undefined>;
  /** Accepted types: MIME types (`image/png`), wildcards (`image/*`) and extensions (`.pdf`). */
  accept?: string[];
  /** Let the picker return several files at once. Files still add up to `maxFiles`. @default false */
  multiple?: boolean;
  /** Most files in the list; extra ones are turned away with a message. */
  maxFiles?: number;
  /** Largest file in bytes, checked after `transform`. Bigger files are turned away with a message. */
  maxSize?: number;
  /**
   * Runs on each file after the `accept` check and before `maxSize` and `validate`, e.g. to shrink
   * a photo with expo-image-manipulator. Resolve to the file to keep. If it throws, the file is
   * turned away with the error's message.
   */
  transform?: (file: F) => F | Promise<F>;
  /** Your own check, run last: return a message to turn the file away. Validate again on the server. */
  validate?: (file: F) => string | null | undefined;
  /** Controlled list. Pass it with `onFilesChange` to clear or set the list from outside. */
  files?: F[];
  /** The starting list when uncontrolled. */
  defaultFiles?: F[];
  /** Called with the whole new list after files are added or removed. */
  onFilesChange?: (files: F[]) => void;
  /** Files turned away by `accept`, `transform`, `maxSize`, `maxFiles` or `validate`. They also show in the list with their error until removed. */
  onReject?: (rejections: FileRejection<F>[]) => void;
  /** Nothing can be picked; the buttons look disabled. */
  disabled?: boolean;
  /** Files stay listed; nothing can be picked or removed. */
  readOnly?: boolean;
  /** An upload is running: picking is blocked and a bar shows `progress`. */
  busy?: boolean;
  /** 0–100 while `busy`. */
  progress?: number;
  /** The pick button's text. @default 'Upload files' */
  addLabel?: string;
  /** The camera button's text. Shown with `capture`. @default messages.takePhoto ('Take photo') */
  captureLabel?: string;
  style?: StyleProp<ViewStyle>;
}

const formatSize = (bytes: number, locale: string) => {
  const [v, unit] =
    bytes < 1024 ? [bytes, 'byte'] : bytes < 1024 * 1024 ? [bytes / 1024, 'kilobyte'] : [bytes / (1024 * 1024), 'megabyte'];
  return new Intl.NumberFormat(locale, { style: 'unit', unit, unitDisplay: 'short', maximumFractionDigits: 1 }).format(v);
};

let nextId = 0;

/**
 * Pick files or take a photo, check them, and list them (web FileUpload on mobile). Bring your
 * own pickers through `pickFiles` and `capture`, so the package adds no native modules. Turned
 * away files show in the list with their reason until removed.
 */
export function FileUpload<F extends PickedFile = PickedFile>({
  pickFiles,
  capture,
  accept,
  multiple = false,
  maxFiles,
  maxSize,
  transform,
  validate,
  files: filesProp,
  defaultFiles,
  onFilesChange,
  onReject,
  disabled,
  readOnly,
  busy,
  progress,
  addLabel,
  captureLabel,
  style,
}: FileUploadProps<F>) {
  const { messages, locale, tokens } = useTheme();
  const [inner, setInner] = React.useState<F[]>(defaultFiles ?? []);
  const controlled = filesProp !== undefined;
  const files = controlled ? filesProp : inner;
  const [rejections, setRejections] = React.useState<{ id: string; rejection: FileRejection<F> }[]>([]);
  const [working, setWorking] = React.useState(false);
  // The latest list, so files picked while a transform runs append instead of replacing.
  const latest = useLatest(files);
  // Stable ids for FileList rows: one per file object.
  const ids = React.useRef(new WeakMap<object, string>());
  const idOf = (f: object) => {
    let id = ids.current.get(f);
    if (!id) ids.current.set(f, (id = `nx-file-${++nextId}`));
    return id;
  };
  const blocked = !!(disabled || readOnly || busy || working);

  const setFiles = (next: F[]) => {
    latest.current = next;
    if (!controlled) setInner(next);
    onFilesChange?.(next);
  };

  const add = async (picked: readonly F[]) => {
    const rejected: FileRejection<F>[] = [];
    const kept: F[] = [];
    for (const original of picked) {
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
      let custom: string | null | undefined;
      if (maxSize !== undefined && file.size !== undefined && file.size > maxSize) rejected.push({ file, reason: 'size' });
      else if ((custom = validate?.(file))) rejected.push({ file, reason: 'custom', message: custom });
      else kept.push(file);
    }
    const next = [...latest.current];
    for (const file of kept) {
      if (maxFiles !== undefined && next.length >= maxFiles) rejected.push({ file, reason: 'count' });
      else next.push(file);
    }
    setRejections(rejected.map((rejection) => ({ id: idOf(rejection.file), rejection })));
    if (next.length !== latest.current.length) setFiles(next);
    if (rejected.length) onReject?.(rejected);
  };

  const run = async (source: () => Promise<readonly F[]>) => {
    if (blocked) return;
    setWorking(true);
    try {
      const picked = await source();
      if (picked.length) await add(picked);
    } finally {
      setWorking(false);
    }
  };

  const reason = ({ file, reason: why, message }: FileRejection<F>) =>
    why === 'type'
      ? messages.fileTypeRejected(file.name)
      : why === 'size'
        ? messages.fileTooLarge(file.name, formatSize(maxSize ?? 0, locale))
        : why === 'count'
          ? messages.tooManyFiles(maxFiles ?? 0)
          : (message ?? '');

  const items: FileListItem[] = [
    ...files.map((f) => ({ id: idOf(f), name: f.name, size: f.size })),
    ...rejections.map(({ id, rejection }) => ({ id, name: rejection.file.name, size: rejection.file.size, error: reason(rejection) })),
  ];

  return (
    <View style={[{ gap: tokens.spacing[3] }, style]}>
      {(pickFiles || capture) && !readOnly && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing[2] }}>
          {pickFiles && (
            <Button
              variant="outlined"
              leadingIcon={Upload}
              disabled={disabled || busy}
              loading={working}
              onPress={() => run(async () => ((await pickFiles({ multiple, accept })) ?? []).slice(0, multiple ? undefined : 1))}
            >
              {addLabel ?? messages.uploadFiles}
            </Button>
          )}
          {capture && (
            <Button
              variant="outlined"
              leadingIcon={Camera}
              disabled={disabled || busy || working}
              onPress={() =>
                run(async () => {
                  const photo = await capture();
                  return photo ? [photo] : [];
                })
              }
            >
              {captureLabel ?? messages.takePhoto}
            </Button>
          )}
        </View>
      )}
      {busy && <Progress value={Math.max(0, Math.min(100, progress ?? 0)) / 100} label={messages.uploading} />}
      {items.length > 0 && (
        <FileList
          files={items}
          onRemove={
            readOnly
              ? undefined
              : (id) => {
                  if (rejections.some((r) => r.id === id)) setRejections(rejections.filter((r) => r.id !== id));
                  else setFiles(latest.current.filter((f) => idOf(f) !== id));
                }
          }
        />
      )}
    </View>
  );
}
