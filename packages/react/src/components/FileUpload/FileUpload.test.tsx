import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FileUpload, fileAccepted, formatFileSize } from './FileUpload.js';

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

  it('fileAccepted matches MIME types, wildcards and extensions', () => {
    const png = new File(['x'], 'a.PNG', { type: 'image/png' });
    expect(fileAccepted(png)).toBe(true);
    expect(fileAccepted(png, ['image/*'])).toBe(true);
    expect(fileAccepted(png, ['.png'])).toBe(true);
    expect(fileAccepted(png, ['image/png'])).toBe(true);
    expect(fileAccepted(png, ['application/pdf', '.pdf'])).toBe(false);
  });

  it('filters dropped files by accept, maxSize and maxFiles, and says why', () => {
    const onFilesChange = vi.fn();
    const onReject = vi.fn();
    render(
      <FileUpload.Root accept={['image/*']} maxSize={10} maxFiles={1} onFilesChange={onFilesChange} onReject={onReject}>
        <FileUpload.Dropzone data-testid="zone" />
      </FileUpload.Root>,
    );
    const ok = new File(['12345'], 'ok.png', { type: 'image/png' });
    const exe = new File(['x'], 'evil.exe', { type: 'application/octet-stream' });
    const big = new File(['x'.repeat(20)], 'big.png', { type: 'image/png' });
    const extra = new File(['1'], 'extra.png', { type: 'image/png' });
    fireEvent.drop(screen.getByTestId('zone'), { dataTransfer: { files: [ok, exe, big, extra] } });

    expect(onFilesChange).toHaveBeenCalledWith([ok]);
    expect(onReject.mock.calls[0]![0].map((r: { reason: string }) => r.reason)).toEqual(['type', 'size', 'count']);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('evil.exe isn’t an accepted file type');
    expect(alert).toHaveTextContent('big.png is larger than');
    expect(alert).toHaveTextContent('You can add up to 1 file');
  });

  it('rejects files that fail validate, with its message', () => {
    const onReject = vi.fn();
    render(
      <FileUpload.Root validate={(f) => (f.name.startsWith('.') ? 'Hidden files can’t be uploaded' : null)} onReject={onReject}>
        <FileUpload.Dropzone data-testid="zone" />
      </FileUpload.Root>,
    );
    const ok = new File(['1'], 'a.txt');
    const hidden = new File(['1'], '.env');
    fireEvent.drop(screen.getByTestId('zone'), { dataTransfer: { files: [ok, hidden] } });
    expect(onReject.mock.calls[0]![0]).toEqual([{ file: hidden, reason: 'custom', message: 'Hidden files can’t be uploaded' }]);
    expect(screen.getByRole('alert')).toHaveTextContent('Hidden files can’t be uploaded');
  });
});

describe('FileUpload.Item progress', () => {
  it('shows progress and cancels while uploading, then removes when done', async () => {
    const onCancel = vi.fn();
    const file = new File(['x'], 'report.pdf', { type: 'application/pdf' });
    function Harness({ progress }: { progress?: number }) {
      return (
        <FileUpload.Root>
          <FileUpload.Dropzone data-testid="zone" />
          <FileUpload.List>
            <FileUpload.Item index={0} progress={progress} onCancel={onCancel} />
          </FileUpload.List>
        </FileUpload.Root>
      );
    }
    const { rerender } = render(<Harness progress={40} />);
    fireEvent.drop(screen.getByTestId('zone'), { dataTransfer: { files: [file] } });
    expect(screen.getByRole('progressbar', { name: 'report.pdf, 40% uploaded' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel upload of report.pdf' }));
    expect(onCancel).toHaveBeenCalled();
    rerender(<Harness progress={100} />);
    expect(screen.queryByRole('progressbar')).toBeNull();
    expect(screen.getByRole('button', { name: 'Remove report.pdf' })).toBeInTheDocument();
  });
});

describe('FileUpload previews, paste and list motion', () => {
  function Harness(props: React.ComponentProps<typeof FileUpload.Root>) {
    return (
      <FileUpload.Root {...props}>
        <FileUpload.Dropzone data-testid="zone" />
        <FileUpload.List>
          {[0, 1].map((i) => (
            <FileUpload.Item key={i} index={i} />
          ))}
        </FileUpload.List>
      </FileUpload.Root>
    );
  }

  it('previews images and revokes the URL on remove', async () => {
    const create = vi.fn(() => 'blob:x');
    const revoke = vi.fn();
    Object.assign(URL, { createObjectURL: create, revokeObjectURL: revoke });
    const { container } = render(<Harness />);
    const img = new File(['x'], 'a.png', { type: 'image/png' });
    const doc = new File(['x'], 'b.pdf', { type: 'application/pdf' });
    fireEvent.drop(screen.getByTestId('zone'), { dataTransfer: { files: [img, doc] } });
    expect(container.querySelectorAll('img')).toHaveLength(1);
    expect(container.querySelector('img')).toHaveAttribute('alt', '');
    expect(create).toHaveBeenCalledWith(img);
    fireEvent.click(screen.getByRole('button', { name: 'Remove a.png' }));
    expect(screen.getByRole('button', { name: 'Remove a.png' }).closest('li')).toHaveAttribute('data-state', 'exit');
    await waitFor(() => expect(screen.queryByText('a.png')).toBeNull());
    expect(revoke).toHaveBeenCalledWith('blob:x');
    expect(screen.getByText('b.pdf').closest('li')).not.toHaveAttribute('data-state', 'exit');
  });

  it('adds pasted files through the same filters', () => {
    const onFilesChange = vi.fn();
    const onReject = vi.fn();
    render(<Harness accept={['.txt']} onFilesChange={onFilesChange} onReject={onReject} />);
    const ok = new File(['1'], 'a.txt');
    const bad = new File(['1'], 'b.exe');
    fireEvent.paste(screen.getByTestId('zone'), { clipboardData: { files: [ok, bad] } });
    expect(onFilesChange).toHaveBeenCalledWith([ok]);
    expect(onReject.mock.calls[0]![0][0].reason).toBe('type');
  });
});
