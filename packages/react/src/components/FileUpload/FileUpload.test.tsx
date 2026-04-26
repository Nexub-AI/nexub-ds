import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FileUpload } from './FileUpload.js';

describe('FileUpload', () => {
  it('renders dropzone', () => {
    render(
      <FileUpload.Root>
        <FileUpload.Dropzone />
      </FileUpload.Root>,
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders dropzone with aria-label "Upload files"', () => {
    render(
      <FileUpload.Root>
        <FileUpload.Dropzone />
      </FileUpload.Root>,
    );
    expect(screen.getByRole('button', { name: /upload files/i })).toBeInTheDocument();
  });

  it('files list is empty initially (List renders nothing)', () => {
    const { container } = render(
      <FileUpload.Root>
        <FileUpload.Dropzone />
        <FileUpload.List data-testid="list" />
      </FileUpload.Root>,
    );
    // List returns null when files array is empty
    expect(container.querySelector('ul')).toBeNull();
  });

  it('forwards className on Root', () => {
    render(
      <FileUpload.Root className="custom-class" data-testid="root">
        <FileUpload.Dropzone />
      </FileUpload.Root>,
    );
    expect(screen.getByTestId('root')).toHaveClass('custom-class');
  });

  it('forwards ref on Root', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <FileUpload.Root ref={ref}>
        <FileUpload.Dropzone />
      </FileUpload.Root>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
