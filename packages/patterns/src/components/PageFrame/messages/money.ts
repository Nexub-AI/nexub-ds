import type { PageTemplateMessages } from '../PageFrame.js';

/** 11.7: money strings of the page templates. */
export const moneyMessages = {
  howMuch: 'How much?',
  amountToSend: 'Amount to send',
  balance: (b) => `Balance ${b}`,
  overBalance: (b) => `More than your balance (${b})`,
  fee: 'Fee',
  rate: 'Rate',
  recipientGets: 'Recipient gets',
  arrives: 'Arrives',
  checkDetails: 'Check the details',
  sent: 'Sent',
} satisfies Partial<PageTemplateMessages>;
