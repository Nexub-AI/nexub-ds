import type { PageTemplateMessages } from '../PageFrame.js';

/** 11.7: shared strings of the page templates. */
export const sharedMessages = {
  back: 'Back',
  continue: 'Continue',
  edit: 'Edit',
  done: 'Done',
  stepOf: (s, t) => `Step ${s} of ${t}`,
  stepInvalid: 'Check this step before you continue.',
  date: 'Date',
  pending: 'Pending',
  failed: 'Failed',
  completed: 'Completed',
  details: 'Details',
  loadMore: 'Load more',
  refresh: 'Refresh',
  settings: 'Settings',
  email: 'Email',
  password: 'Password',
  phone: 'Phone number',
  signIn: 'Sign in',
  createAccount: 'Create an account',
  enterValidEmail: 'Enter a valid email address',
  enterValidPhone: 'Enter a valid phone number',
  rowActions: 'Actions',
  forgotPassword: 'Forgot password?',
} satisfies Partial<PageTemplateMessages>;
