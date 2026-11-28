'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { DiffReview, type DiffDecision } from '@nexub/react';

const files = [
  {
    file: 'templates/reminder.ts',
    diff: `@@ -3,4 +3,4 @@
 export const reminder = {
-  subject: 'Invoice overdue',
+  subject: 'A friendly reminder about your invoice',
   tone: 'polite',
 };`,
  },
  {
    file: 'jobs/schedule.ts',
    diff: `@@ -10,3 +10,4 @@
 export const schedule = {
-  cadence: 'daily',
+  cadence: 'weekly',
+  skipWeekends: true,
 };`,
  },
];

export default function Example() {
  const [decisions, setDecisions] = React.useState<Record<string, DiffDecision>>({});
  return <DiffReview className="w-full" files={files} decisions={decisions} onDecisionsChange={setDecisions} />;
}
