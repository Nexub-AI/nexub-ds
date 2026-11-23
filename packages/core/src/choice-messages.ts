import type { NexubMessages } from './messages.js';

/** 11.9: the list and phone field strings on their own, for `@nexub/elements` (as date-messages.ts). */
export const choiceFieldMessages = {
  selectPlaceholder: 'Select…',
  noResults: 'No results found.',
  searching: 'Searching…',
  searchFailed: 'Search failed. Try again.',
  countryCode: (country: string, code: string) => `Country code, ${country} +${code}`,
  invalidPhone: 'Enter a valid phone number.',
} satisfies Partial<NexubMessages>;
