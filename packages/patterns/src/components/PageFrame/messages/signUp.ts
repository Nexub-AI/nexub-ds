import type { PageTemplateMessages } from '../PageFrame.js';

/** 11.7: signUp strings of the page templates. */
export const signUpMessages = {
  signUp: 'Create your account',
  name: 'Name',
  haveAccount: 'Already have an account?',
  or: 'or',
  passwordHint: 'Use 8 or more characters with upper and lower case letters and a number or symbol.',
  passwordStrength: (label) => `Password strength: ${label}`,
  strengthLabels: ['Weak', 'Fair', 'Good', 'Strong'],
  enterName: 'Enter your name',
  choosePassword: 'Choose a stronger password',
  acceptTerms: 'Accept the terms to continue',
} satisfies Partial<PageTemplateMessages>;
