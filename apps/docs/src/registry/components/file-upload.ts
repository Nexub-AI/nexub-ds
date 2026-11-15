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
    related: ['form-field', 'progress'],
  },
  props: [
    { name: 'accept', type: 'string[]', description: "MIME types or extensions, e.g. `['image/*', '.pdf']`. Other files are rejected with a message." },
    { name: 'maxFiles', type: 'number', description: 'Most files kept; extras are rejected.' },
    { name: 'maxSize', type: 'number', description: 'Largest file in bytes.' },
    { name: 'onFilesChange', type: '(files: File[]) => void', description: 'The accepted files after every add or remove. Your app does the upload.' },
    { name: 'onReject', type: '(rejections: FileRejection[]) => void', description: 'Files turned away, with the reason (`type`, `size`, `count` or `custom`).' },
    { name: 'validate', type: '(file: File) => string | null | undefined', description: 'Your own check: return a message to reject the file. Validate again on the server.' },
    { name: 'FileUpload.Dropzone', type: 'compound', required: false, description: 'A `<label>` around the native file input: click, Enter, Space, drop or paste. Children replace the default prompt. Rejection messages are announced.' },
    { name: 'FileUpload.List', type: 'compound', required: false, description: 'Renders nothing until there are files.' },
    { name: 'FileUploadItem index', type: 'number', description: 'Which accepted file this row shows. Rows past the file count render nothing.' },
    { name: 'FileUploadItem progress / onCancel', type: 'number / () => void', description: 'Upload progress 0–100; below 100 shows a bar and, with `onCancel`, a cancel button.' },
    { name: 'FileUploadItem error', type: 'string', description: 'Why this file failed; shown under its name.' },
  ],
  examples: [{ title: 'Default' }, { title: 'Custom prompt and limits' }],
  a11y: {
    keyboard: [{ key: 'Enter / Space', description: 'Opens the file picker from the focused drop zone.' }],
    screenReader: ['Rejected files are listed in a live region (`role="alert"`) tied to the input with `aria-describedby`.'],
  },
};

export default entry;
