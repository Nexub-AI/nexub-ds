'use client'; // docs preview: server pages import every example

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
