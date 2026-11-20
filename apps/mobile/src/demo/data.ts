// Sample data for the demo app (/demo). Fixed dates, so screens look the same every day.
import type { Insight, Transaction } from '@nexub/react-native/patterns';

const day = (d: number) => new Date(2026, 9, 31 - d, 10, 30);

export const USER = { name: 'Asha Rao', phone: '+65 •••• 4821' };

export const BALANCE = { value: 12840.5, currency: 'USD' };

export const TRANSACTIONS: Transaction[] = [
  { id: '1', title: 'Amazon', subtitle: 'Card · Shopping', amount: -42.5, currency: 'USD', date: day(0) },
  { id: '2', title: 'Salary', subtitle: 'Acme Corp', amount: 4200, currency: 'USD', date: day(1) },
  { id: '3', title: 'Netflix', subtitle: 'Card · Subscriptions', amount: -15.99, currency: 'USD', date: day(1), status: 'pending' },
  { id: '4', title: 'Asha Rao', subtitle: 'Transfer', amount: -250, currency: 'USD', date: day(3) },
  { id: '5', title: 'Refund', subtitle: 'Airline', amount: 120, currency: 'USD', date: day(4), status: 'failed' },
  { id: '6', title: 'Grab', subtitle: 'Card · Transport', amount: -18.2, currency: 'USD', date: day(5) },
];

export const REFERENCES: Record<string, string> = {
  '1': 'NX-4821-XQ',
  '2': 'NX-4790-PA',
  '3': 'NX-4788-SB',
  '4': 'NX-4702-TR',
  '5': 'NX-4655-RF',
  '6': 'NX-4610-TP',
};

export const INSIGHTS: Insight[] = [
  { id: 'spend', title: 'Spending is down 12%', body: 'You spent $420 less on shopping than last month.' },
  { id: 'bill', title: 'Netflix renews tomorrow', body: '$15.99 from your USD balance.' },
];
