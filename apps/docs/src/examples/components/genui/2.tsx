'use client'; // docs preview: server pages import every example

import { GenUI } from '@nexub/genui';
import { validate } from '@nexub/genui/schema';

// A hostile answer: markup in text, a script component, escape-hatch props, an invented action.
const hostile = {
  version: '1.0',
  root: {
    type: 'Card',
    props: { title: '<img src=x onerror=alert(1)>', className: 'evil', style: { position: 'fixed' } },
    children: [
      { type: 'script', props: { text: 'alert(1)' } },
      { type: 'Badge', props: { text: 'Paid', tone: 'success', onClick: 'alert(1)' } },
      { type: 'Button', props: { label: 'Transfer funds', action: { name: 'transferAll' } } },
    ],
  },
};

// The same pure check runs on a server (no React) before it stores or forwards a document.
const { issues } = validate(hostile, { actions: ['choosePlan'] });

export default function Example() {
  return (
    <div className="flex w-full max-w-140 flex-col gap-4">
      <GenUI document={hostile} actions={['choosePlan']} />
      <ul className="m-0 flex list-none flex-col gap-1 p-0 text-body-sm text-on-surface-variant">
        {issues.map((issue) => (
          <li key={issue.path}>
            <code>{issue.path}</code> {issue.code}
          </li>
        ))}
      </ul>
    </div>
  );
}
