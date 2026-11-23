import type { PageTemplateMessages } from '../PageFrame.js';

/** 11.7: verify strings of the page templates. */
export const verifyMessages = {
  resendCode: 'Resend code',
  resendCodeIn: 'Resend code in',
  enterCode: 'Enter the code',
  codeSentTo: (length, destination) => `We sent a ${length}-digit code to ${destination}.`,
  changeDestination: 'Use a different number',
  codeExpiresIn: 'Code expires in',
  otherMethods: 'Other ways to verify',
} satisfies Partial<PageTemplateMessages>;
