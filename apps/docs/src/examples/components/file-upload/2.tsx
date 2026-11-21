'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { FileUpload } from '@nexub/react';

export default function Example() {
  const [files, setFiles] = React.useState<File[]>([]);
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <FileUpload.Root accept={['.csv']} maxFiles={1} files={files} onFilesChange={setFiles}>
        <div className="flex items-center gap-2">
          <FileUpload.Trigger>Import CSV</FileUpload.Trigger>
          <FileUpload.Trigger iconOnly aria-label="Attach a file" variant="text" />
        </div>
        <FileUpload.List>
          {files.map((f, i) => (
            <FileUpload.Item key={f.name + i} index={i} />
          ))}
        </FileUpload.List>
      </FileUpload.Root>
      <FileUpload.Root accept={['image/*']} capture="environment" maxFiles={1}>
        <FileUpload.Trigger variant="tonal">Take a photo</FileUpload.Trigger>
      </FileUpload.Root>
      <FileUpload.Root busy progress={60}>
        <FileUpload.Dropzone size="sm" />
      </FileUpload.Root>
    </div>
  );
}
