import type { PageTemplateMessages } from '../PageFrame.js';

/** 11.7: search strings of the page templates. */
export const searchMessages = {
  searchResults: 'Search results',
  resultsFor: (count, query) => `${count} result${count === 1 ? '' : 's'} for “${query}”`,
  trySearching: 'Try:',
} satisfies Partial<PageTemplateMessages>;
