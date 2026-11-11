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
| `FileUpload.Dropzone` | `compound` |  | A `<label>` around the native file input: click, Enter, Space, drop or paste. Children replace the default prompt. Rejection messages are announced. |
| `FileUpload.List` | `compound` |  | Renders nothing until there are files. |
| `FileUploadItem index` | `number` |  | Which accepted file this row shows. Rows past the file count render nothing. |
| `FileUploadItem progress / onCancel` | `number / () => void` |  | Upload progress 0–100; below 100 shows a bar and, with `onCancel`, a cancel button. |
| `FileUploadItem error` | `string` |  | Why this file failed; shown under its name. |

## Example: Default

```tsx
import { FileUpload } from '@nexub/react';

export default function Example() {
  return (
    <FileUpload.Root accept={['image/*', '.pdf']} maxFiles={3} className="w-full max-w-[480px]">
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
      className="w-full max-w-[480px]"
    >
      <FileUpload.Dropzone>
        <Text size="body-sm"><span className="font-semibold text-[var(--color-primary)]">Choose a CSV</span> or drop it here</Text>
        <Text size="caption" tone="muted">One file, up to 5 MB</Text>
      </FileUpload.Dropzone>
      <FileUpload.List>
        <FileUpload.Item index={0} />
      </FileUpload.List>
    </FileUpload.Root>
  );
}
```

## Accessibility

- `Enter / Space`: Opens the file picker from the focused drop zone.
- Rejected files are listed in a live region (`role="alert"`) tied to the input with `aria-describedby`.

Related: [form-field](form-field.md), [progress](progress.md)
