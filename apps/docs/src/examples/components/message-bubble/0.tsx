import { MessageBubble, Avatar, MessageActions, toast } from '@nexub/react';
import { Sparkles } from '@nexub/icons';

export default function Example() {
  return (
    <div className="flex flex-col gap-4 items-stretch w-full max-w-[560px]">
      <MessageBubble from="user">How do I cancel my subscription?</MessageBubble>
      <MessageBubble from="assistant" avatar={<Avatar size="sm" fallback={<Sparkles />} />}>
        <p>Open Settings, then Billing, and choose Cancel plan. You keep access until the end of the billing period.</p>
        <MessageActions
          text="Open Settings, then Billing, and choose Cancel plan."
          onFeedback={() => {}}
          onRegenerate={() => toast.info('Regenerating…')}
        />
      </MessageBubble>
      <MessageBubble from="system">Conversation moved to Billing support</MessageBubble>
    </div>
  );
}
