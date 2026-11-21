# File Upload

A drop zone and file list: pick, drop or paste files, with type, size and count checks and per-file progress.

- Package: `@nexub/react` · Category: Form Controls · Status: stable
- Import: `import { FileUpload } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/file-upload

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `accept` | `string[]` |  | MIME types or extensions, e.g. `['image/*', '.pdf']`. Other files are rejected with a message. |
| `maxFiles` | `number` |  | Most files kept; extras are rejected. |
| `maxSize` | `number` |  | Largest file in bytes. |
| `onFilesChange` | `(files: File[]) => void` |  | The accepted files after every add or remove. Your app does the upload. |
| `onReject` | `(rejections: FileRejection[]) => void` |  | Files turned away, with the reason (`type`, `size`, `count` or `custom`). |
| `validate` | `(file: File) => string \| null \| undefined` |  | Your own check: return a message to reject the file. Validate again on the server. |
| `files / defaultFiles` | `File[]` |  | Controlled list: clear or set it from the page (`files={[]}` after a send) instead of remounting. |
| `transform` | `(file: File) => File \| Promise<File>` |  | Runs after the type check and before `maxSize` and `validate`, e.g. to shrink a photo. |
| `capture` | `boolean \| 'user' \| 'environment'` |  | Opens the phone camera instead of the file list. |
| `disabled / busy / progress` | `boolean / boolean / number` |  | Nothing can be added; `busy` shows an upload in progress (with `progress`, a bar). |
| `FileUpload.Trigger` | `compound` |  | An outlined button (or `iconOnly` paperclip) that opens the picker, with no drop zone: Import CSV, attach, take a photo. `asChild` takes your own Button for another look. Rejections show under it. |
| `FileUpload.Dropzone` | `compound` |  | A `<label>` around the native file input: click, Enter, Space, drop or paste. Children replace the default prompt. Rejection messages are announced. |
| `Dropzone size` | `'sm' \| 'md'` |  | `'sm'` is a compact one-line zone. |
| `FileUpload.List` | `compound` |  | Renders nothing until there are files. |
| `FileUploadItem index` | `number` |  | Which accepted file this row shows. Rows past the file count render nothing. |
| `FileUploadItem progress / onCancel` | `number / () => void` |  | Upload progress 0–100; below 100 shows a bar and, with `onCancel`, a cancel button. |
| `FileUploadItem error` | `string` |  | Why this file failed; shown under its name. |

## Example: Default

```tsx
import { FileUpload } from '@nexub/react';

export default function Example() {
  return (
    <FileUpload.Root accept={['image/*', '.pdf']} maxFiles={3} className="w-full max-w-120">
      <FileUpload.Dropzone />
      <FileUpload.List>
        {[0, 1, 2].map((i) => <FileUpload.Item key={i} index={i} />)}
      </FileUpload.List>
    </FileUpload.Root>
  );
}
```

## Example: Custom prompt and limits

```tsx
import { FileUpload, Text } from '@nexub/react';

export default function Example() {
  return (
    <FileUpload.Root
      accept={['.csv']}
      maxFiles={1}
      maxSize={5 * 1024 * 1024}
      validate={(file) => (file.name.includes(' ') ? 'Rename the file without spaces.' : null)}
      className="w-full max-w-120"
    >
      <FileUpload.Dropzone>
        <Text size="body-sm"><span className="font-semibold text-primary">Choose a CSV</span> or drop it here</Text>
        <Text size="caption" tone="muted">One file, up to 5 MB</Text>
      </FileUpload.Dropzone>
      <FileUpload.List>
        <FileUpload.Item index={0} />
      </FileUpload.List>
    </FileUpload.Root>
  );
}
```

## Example: Trigger, camera and busy

No drop zone: a button, a paperclip, the phone camera, and a busy compact zone.

```tsx
import * as React from 'react';
import { Button, FileUpload } from '@nexub/react';

export default function Example() {
  const [files, setFiles] = React.useState<File[]>([]);
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <FileUpload.Root accept={['.csv']} maxFiles={1} files={files} onFilesChange={setFiles}>
        <div className="flex items-center gap-2">
          <FileUpload.Trigger>Import CSV</FileUpload.Trigger>
          <FileUpload.Trigger iconOnly aria-label="Attach a file" />
        </div>
        <FileUpload.List>
          {files.map((f, i) => (
            <FileUpload.Item key={f.name + i} index={i} />
          ))}
        </FileUpload.List>
      </FileUpload.Root>
      <FileUpload.Root accept={['image/*']} capture="environment" maxFiles={1}>
        <FileUpload.Trigger asChild>
          <Button variant="tonal">Take a photo</Button>
        </FileUpload.Trigger>
      </FileUpload.Root>
      <FileUpload.Root busy progress={60}>
        <FileUpload.Dropzone size="sm" />
      </FileUpload.Root>
    </div>
  );
}
```

## Accessibility

- `Enter / Space`: Opens the file picker from the focused drop zone.
- Rejected files are listed in a live region (`role="alert"`) tied to the input with `aria-describedby`.

Related: [form-field](form-field.md), [progress](progress.md)
