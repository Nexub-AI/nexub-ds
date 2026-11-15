// 9.6: the XSS corpus against every @nexub/react prop that renders a URL, a file or
// user/LLM text. After each render the DOM is audited (utils/xss-corpus.ts): no payload may
// have produced an element, an event handler, or a script-capable link or source.
import * as React from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { XSS_TEXT, XSS_URLS, auditDom } from './utils/xss-corpus.js';
import { NexubProvider } from './components/NexubProvider/index.js';
import { Avatar } from './components/Avatar/index.js';
import { MediaCard } from './components/MediaCard/index.js';
import { Card, CardLink } from './components/Card/index.js';
import { Breadcrumb } from './components/Breadcrumb/index.js';
import { Citation, SourceChip, SourceList } from './components/Citation/index.js';
import { MessageBubble } from './components/MessageBubble/index.js';
import { StreamingText } from './components/StreamingText/index.js';
import { Code } from './components/Code/index.js';
import { FileUpload } from './components/FileUpload/index.js';
import { EmptyStatePreset } from './components/EmptyState/index.js';
import { ErrorState } from './components/ErrorState/index.js';
import { Alert } from './components/Alert/index.js';
import { ThemeScript } from './components/ThemeProvider/index.js';

afterEach(cleanup);
const show = (ui: React.ReactElement) => render(<NexubProvider>{ui}</NexubProvider>);

// One entry per risky prop: name → what to render for a payload.
const URL_PROPS: Record<string, (url: string) => React.ReactElement> = {
  'Avatar src': (u) => <Avatar name="Ada" src={u} />,
  'MediaCard src': (u) => <MediaCard src={u} alt="" title="t" />,
  'MediaCard href': (u) => <MediaCard src="/a.png" alt="" title="t" href={u} />,
  'CardLink href': (u) => (
    <Card>
      <CardLink href={u}>Open</CardLink>
    </Card>
  ),
  'Breadcrumb items[].href': (u) => <Breadcrumb.Trail items={[{ label: 'Home', href: u }, { label: 'A', href: u }, { label: 'B', href: u }, { label: 'C', href: u }, { label: 'Here' }]} />,
  'Citation source.url': (u) => <Citation index={1} source={{ title: 't', url: u }} />,
  'Citation source.favicon': (u) => <Citation index={1} source={{ title: 't', url: 'https://x.test', favicon: u }} />,
  'SourceChip source.url': (u) => <SourceChip source={{ title: 't', url: u, favicon: u }} />,
  'SourceList sources[].url': (u) => <SourceList sources={[{ title: 't', url: u, favicon: u, domain: u }]} />,
};

const TEXT_PROPS: Record<string, (text: string) => React.ReactElement> = {
  'Avatar name': (t) => <Avatar name={t} />,
  'MediaCard text': (t) => <MediaCard src="/a.png" alt={t} eyebrow={t} title={t} description={t} />,
  'Breadcrumb items[].label': (t) => <Breadcrumb.Trail items={[{ label: t, href: '/' }, { label: t }]} />,
  'Citation source text': (t) => <SourceList sources={[{ title: t, url: 'https://x.test', snippet: t, domain: t }]} />,
  'MessageBubble children': (t) => <MessageBubble from="assistant">{t}</MessageBubble>,
  'StreamingText text': (t) => <StreamingText text={t} streaming />,
  'Code children': (t) => <Code>{t}</Code>,
  'Alert text': (t) => <Alert title={t}>{t}</Alert>,
  'ErrorState text': (t) => <ErrorState title={t} description={t} />,
  'EmptyStatePreset text': (t) => <EmptyStatePreset kind="noResults" title={t} description={t} />,
};

describe.each(Object.entries(URL_PROPS))('%s', (_name, ui) => {
  it.each(XSS_URLS)('renders nothing script-capable for %j', (url) => {
    show(ui(url));
    expect(auditDom()).toEqual([]);
  });
});

describe.each(Object.entries(TEXT_PROPS))('%s', (_name, ui) => {
  it.each(XSS_TEXT)('renders %j as text', (text) => {
    const { container } = show(ui(text));
    expect(auditDom()).toEqual([]);
    // It is there, as characters (an avatar shows initials only).
    if (!_name.startsWith('Avatar')) expect(container.ownerDocument.body.textContent).toContain(text);
  });
});

describe('files', () => {
  it.each(XSS_TEXT)('FileUpload shows a file named %j as text', async (name) => {
    const { container } = show(
      <FileUpload.Root>
        <FileUpload.Dropzone>Drop files</FileUpload.Dropzone>
        <FileUpload.List>
          <FileUpload.Item index={0} />
        </FileUpload.List>
      </FileUpload.Root>,
    );
    // An HTML file with a hostile name and type: listed by name, never rendered or previewed.
    const file = new File(['<script>alert(1)</script>'], name, { type: 'text/html' });
    fireEvent.change(container.querySelector('input[type="file"]')!, { target: { files: [file] } });
    expect(auditDom()).toEqual([]);
    expect(container.textContent).toContain(file.name);
  });
});

describe('ThemeScript', () => {
  it.each(['</script><script>alert(1)</script>', '"+alert(1)+"', "'-alert(1)-'", ' alert(1)'])('escapes a storage key of %j', (key) => {
    const { container } = render(<ThemeScript storageKey={key} productStorageKey={key} />);
    const scripts = container.querySelectorAll('script');
    expect(scripts).toHaveLength(1);
    const source = scripts[0]!.innerHTML;
    expect(source).not.toMatch(/<\/script/i);
    // The key only ever appears as a JSON string literal; the script still parses.
    expect(() => new Function(source)).not.toThrow();
  });
});

describe('the audit itself', () => {
  it('reports each kind of finding', () => {
    document.body.innerHTML =
      '<a href="javascript:alert(1)">a</a><img src="data:text/html,x"><b onclick="x()">b</b><iframe></iframe><form action="vbscript:x"></form><img src="data:image/png;base64,AA"><a href="/ok">ok</a>';
    expect(auditDom()).toEqual(['<a href="javascript:alert(1)">', '<img src="data:text/html,x">', '<b onclick>', '<iframe> element', '<form action="vbscript:x">']);
    document.body.innerHTML = '';
  });
});
