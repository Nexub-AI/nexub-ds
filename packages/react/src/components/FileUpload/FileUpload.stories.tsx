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
