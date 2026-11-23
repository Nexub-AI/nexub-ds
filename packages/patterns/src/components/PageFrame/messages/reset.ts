import type { PageTemplateMessages } from '../PageFrame.js';

/** 11.7: reset strings of the page templates. */
export const resetMessages = {
  resetPassword: 'Reset your password',
  resetDescription: 'Enter your email and we will send you a link to reset it.',
  sendResetLink: 'Send reset link',
  checkEmail: 'Check your email',
  resetSent: (email) => `If an account exists for ${email}, we sent a link to reset your password.`,
  resendEmail: 'Resend email',
  resendEmailIn: 'Resend email in',
  backToSignIn: 'Back to sign in',
} satisfies Partial<PageTemplateMessages>;
