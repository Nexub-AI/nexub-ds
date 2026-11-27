'use client'; // docs preview: server pages import every example

import { MessageBubble, Avatar } from '@nexub/react';
import { Sparkles } from '@nexub/icons';

const OUTLINE =
  'Here is the outline. 1. Revenue summary: totals by region, with the quarter-on-quarter change. 2. Costs against the budget. 3. Churn: the rates, the reasons customers gave and what we changed. 4. Hiring plan: open roles by team and the budget impact. 5. Risks and asks for the board.';

export default function Example() {
  return (
    <div className="flex flex-col gap-4 items-stretch w-full max-w-140">
      <MessageBubble from="user" avatar={<Avatar size="sm" fallback="SL" />}>
        Can you outline the quarterly report for me?
      </MessageBubble>
      <MessageBubble from="assistant" avatar={<Avatar size="sm" fallback={<Sparkles />} />} collapse={3}>
        <p className="m-0">{OUTLINE}</p>
      </MessageBubble>
    </div>
  );
}
