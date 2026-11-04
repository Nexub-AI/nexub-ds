import * as React from 'react';
import { StreamingText, Button } from '@nexub/react';

const STREAM_DEMO_TEXT =
  'Tokens arrive a few characters at a time. Each new chunk fades in while the text before it stays put, so the eye can keep reading.';

export default function Example() {
  const [length, setLength] = React.useState(0);
  const streaming = length < STREAM_DEMO_TEXT.length;
  React.useEffect(() => {
    if (!streaming) return;
    const id = setTimeout(() => setLength((n) => Math.min(STREAM_DEMO_TEXT.length, n + 6)), 60);
    return () => clearTimeout(id);
  }, [length, streaming]);
  return (
    <div className="flex flex-col gap-3 items-start max-w-[480px]">
      <StreamingText as="p" text={STREAM_DEMO_TEXT.slice(0, length)} streaming={streaming} />
      <Button variant="outline" size="sm" onClick={() => setLength(0)}>Restart</Button>
    </div>
  );
}
