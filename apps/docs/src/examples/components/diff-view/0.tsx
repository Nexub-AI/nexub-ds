import { DiffView } from '@nexub/react';

const diff = `@@ -3,4 +3,4 @@
 export const reminder = {
-  subject: 'Invoice overdue',
+  subject: 'A friendly reminder about your invoice',
   tone: 'polite',
 };`;

export default function Example() {
  return <DiffView className="w-full" file="templates/reminder.ts" diff={diff} />;
}
