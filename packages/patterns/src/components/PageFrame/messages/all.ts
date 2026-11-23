import { usePageStrings, type PageTemplateMessages } from '../PageFrame.js';
import { sharedMessages } from './shared.js';
import { activityMessages } from './activity.js';
import { signUpMessages } from './signUp.js';
import { resetMessages } from './reset.js';
import { verifyMessages } from './verify.js';
import { onboardingMessages } from './onboarding.js';
import { kycMessages } from './kyc.js';
import { moneyMessages } from './money.js';
import { dashboardMessages } from './dashboard.js';
import { chatMessages } from './chat.js';
import { paywallMessages } from './paywall.js';
import { tableMessages } from './table.js';
import { detailMessages } from './detail.js';
import { bookingMessages } from './booking.js';
import { invoiceMessages } from './invoice.js';
import { teamMessages } from './team.js';
import { notificationsMessages } from './notifications.js';
import { searchMessages } from './search.js';

/** Every page template string, in English. Each template ships only its own (11.7). */
export const defaultPageTemplateMessages: PageTemplateMessages = { ...sharedMessages, ...activityMessages, ...signUpMessages, ...resetMessages, ...verifyMessages, ...onboardingMessages, ...kycMessages, ...moneyMessages, ...dashboardMessages, ...chatMessages, ...paywallMessages, ...tableMessages, ...detailMessages, ...bookingMessages, ...invoiceMessages, ...teamMessages, ...notificationsMessages, ...searchMessages };

/** Defaults ← NexubProvider `messages` ← the template's own `messages` prop, for every key. */
export function usePageMessages(overrides?: Partial<PageTemplateMessages>): PageTemplateMessages {
  return usePageStrings(overrides, defaultPageTemplateMessages);
}
