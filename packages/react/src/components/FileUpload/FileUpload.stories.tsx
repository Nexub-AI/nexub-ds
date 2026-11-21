import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { FileUpload } from './FileUpload.js';

const meta: Meta = {
  title: 'Forms/FileUpload',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: '480px' }}>
      <FileUpload.Root accept={['image/*', '.pdf']} maxFiles={5}>
        <FileUpload.Dropzone>
          <p style={{ fontSize: '14px', color: 'var(--color-on-surface-muted)' }}>
            <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
              Click to upload
            </span>{' '}
            or drag and drop
          </p>
          <p style={{ fontSize: '12px', color: 'var(--color-on-surface-muted)', marginTop: '4px' }}>
            PNG, JPG, PDF up to 10 MB (max 5 files)
          </p>
        </FileUpload.Dropzone>
        <FileUpload.List>
          {[0, 1, 2, 3, 4].map((i) => (
            <FileUpload.Item key={i} index={i} />
          ))}
        </FileUpload.List>
      </FileUpload.Root>
    </div>
  ),
};

/** 10.4: invalid and read-only drop zones. */
export const ConsistentControls: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <FileUpload.Root invalid className="min-w-0 flex-1 basis-56">
        <FileUpload.Dropzone />
      </FileUpload.Root>
      <FileUpload.Root readOnly className="min-w-0 flex-1 basis-56">
        <FileUpload.Dropzone />
      </FileUpload.Root>
    </div>
  ),
};

/** 11.1: a button with no drop zone, an icon-only paperclip, the phone camera, a compact zone and a busy state. */
export const TriggerAndStates: Story = {
  render: () => {
    const [files, setFiles] = React.useState<File[]>([]);
    return (
      <div style={{ display: 'grid', gap: 16, maxWidth: 420 }}>
        <FileUpload.Root accept={['.csv']} files={files} onFilesChange={setFiles}>
          <FileUpload.Trigger>Import CSV</FileUpload.Trigger>
          <FileUpload.List>{files.map((f, i) => <FileUpload.Item key={f.name + i} index={i} />)}</FileUpload.List>
        </FileUpload.Root>
        <FileUpload.Root>
          <FileUpload.Trigger iconOnly aria-label="Attach a file" />
        </FileUpload.Root>
        <FileUpload.Root accept={['image/*']} capture="environment" maxFiles={1}>
          <FileUpload.Trigger variant="tonal">Take a photo</FileUpload.Trigger>
        </FileUpload.Root>
        <FileUpload.Root>
          <FileUpload.Dropzone size="sm" />
        </FileUpload.Root>
        <FileUpload.Root busy progress={60}>
          <FileUpload.Dropzone size="sm" />
        </FileUpload.Root>
      </div>
    );
  },
};
