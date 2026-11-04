import * as React from 'react';
import { type PromptInputStatus, PromptInput } from '@nexub/react';

export default function Example() {
  const [status, setStatus] = React.useState<PromptInputStatus>('idle');
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  React.useEffect(() => () => clearTimeout(timer.current), []);
  const send = () => {
    setStatus('streaming');
    timer.current = setTimeout(() => setStatus('idle'), 3000);
  };
  const stop = () => {
    clearTimeout(timer.current);
    setStatus('idle');
  };
  return (
    <div className="w-full max-w-[520px]">
      <PromptInput placeholder="Ask anything" status={status} onSubmit={send} onStop={stop} />
    </div>
  );
}
