import type { PageTemplateMessages } from '../PageFrame.js';

/** 11.7: booking strings of the page templates. */
export const bookingMessages = {
  bookTitle: 'Book a time',
  pickDate: 'Pick a date',
  pickTime: 'Pick a time',
  pickDateFirst: 'Pick a date to see the times.',
  noTimes: 'No times are free on this day.',
  yourBooking: 'Your booking',
  time: 'Time',
  confirmBooking: 'Confirm booking',
  heldFor: 'Held for',
  holdExpired: 'We are no longer holding this time.',
  pickAnotherTime: 'Pick another time',
  bookingConfirmed: 'Booking confirmed',
  reference: 'Reference',
} satisfies Partial<PageTemplateMessages>;
