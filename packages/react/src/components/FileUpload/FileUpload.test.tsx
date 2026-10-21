import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FileUpload, formatFileSize } from './FileUpload.js';

describe('FileUpload', () => {
  it('renders dropzone', () => {
    render(
      <FileUpload.Root>
        <FileUpload.Dropzone />
      </FileUpload.Root>,
    );
    // A native file input, named by its visible label text (no role="button" wrapper).
    expect(screen.getByLabelText(/click to upload/i)).toHaveAttribute('type', 'file');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('names the file input with the visible drop-zone text', () => {
    render(
      <FileUpload.Root>
        <FileUpload.Dropzone />
      </FileUpload.Root>,
    );
    expect(screen.getByLabelText(/click to upload or drag and drop/i)).toBeInTheDocument();
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

describe('formatFileSize', () => {
  it('formats bytes, kilobytes and megabytes with Intl units', () => {
    const nf = (locale: string, unit: string, v: number) =>
      new Intl.NumberFormat(locale, { style: 'unit', unit, unitDisplay: 'short', maximumFractionDigits: 1 }).format(v);
    expect(formatFileSize(512, 'en')).toBe(nf('en', 'byte', 512));
    expect(formatFileSize(1536, 'en')).toBe(nf('en', 'kilobyte', 1.5));
    expect(formatFileSize(1536, 'en')).toMatch(/1\.5\s?kB/);
    expect(formatFileSize(5 * 1024 * 1024 + 300 * 1024, 'en')).toBe(nf('en', 'megabyte', 5.3));
  });

  it('follows the locale', () => {
    expect(formatFileSize(1536, 'de')).toMatch(/^1,5/);
  });
});
