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
