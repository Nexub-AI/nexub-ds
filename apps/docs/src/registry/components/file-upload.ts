import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'file-upload',
    title: 'File Upload',
    description: 'A drop zone and file list: pick, drop or paste files, with type, size and count checks and per-file progress.',
    category: 'Form Controls',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
    updatedIn: '11.1.0',
    related: ['form-field', 'progress'],
  },
  props: [
    { name: 'accept', type: 'string[]', description: "MIME types or extensions, e.g. `['image/*', '.pdf']`. Other files are rejected with a message." },
    { name: 'maxFiles', type: 'number', description: 'Most files kept; extras are rejected.' },
    { name: 'maxSize', type: 'number', description: 'Largest file in bytes.' },
    { name: 'onFilesChange', type: '(files: File[]) => void', description: 'The accepted files after every add or remove. Your app does the upload.' },
    { name: 'onReject', type: '(rejections: FileRejection[]) => void', description: 'Files turned away, with the reason (`type`, `size`, `count` or `custom`).' },
    { name: 'validate', type: '(file: File) => string | null | undefined', description: 'Your own check: return a message to reject the file. Validate again on the server.' },
    { name: 'files / defaultFiles', type: 'File[]', description: 'Controlled list: clear or set it from the page (`files={[]}` after a send) instead of remounting.' },
    { name: 'transform', type: '(file: File) => File | Promise<File>', description: 'Runs after the type check and before `maxSize` and `validate`, e.g. to shrink a photo.' },
    { name: 'capture', type: "boolean | 'user' | 'environment'", description: 'Opens the phone camera instead of the file list.' },
    { name: 'disabled / busy / progress', type: 'boolean / boolean / number', description: 'Nothing can be added; `busy` shows an upload in progress (with `progress`, a bar).' },
    { name: 'FileUpload.Trigger', type: 'compound', required: false, description: 'A button (or `iconOnly` paperclip) that opens the picker, with no drop zone: Import CSV, attach, take a photo. Rejections show under it.' },
    { name: 'FileUpload.Dropzone', type: 'compound', required: false, description: 'A `<label>` around the native file input: click, Enter, Space, drop or paste. Children replace the default prompt. Rejection messages are announced.' },
    { name: 'Dropzone size', type: "'sm' | 'md'", description: "`'sm'` is a compact one-line zone." },
    { name: 'FileUpload.List', type: 'compound', required: false, description: 'Renders nothing until there are files.' },
    { name: 'FileUploadItem index', type: 'number', description: 'Which accepted file this row shows. Rows past the file count render nothing.' },
    { name: 'FileUploadItem progress / onCancel', type: 'number / () => void', description: 'Upload progress 0–100; below 100 shows a bar and, with `onCancel`, a cancel button.' },
    { name: 'FileUploadItem error', type: 'string', description: 'Why this file failed; shown under its name.' },
  ],
  examples: [{ title: 'Default' }, { title: 'Custom prompt and limits' }, { title: 'Trigger, camera and busy', description: 'No drop zone: a button, a paperclip, the phone camera, and a busy compact zone.' }],
  a11y: {
    keyboard: [{ key: 'Enter / Space', description: 'Opens the file picker from the focused drop zone.' }],
    screenReader: ['Rejected files are listed in a live region (`role="alert"`) tied to the input with `aria-describedby`.'],
  },
};

export default entry;
