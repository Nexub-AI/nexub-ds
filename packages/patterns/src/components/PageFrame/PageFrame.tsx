import * as React from 'react';
import { Badge, Button, EmptyStatePreset, cn, useLocale, useNexubMessages } from '@nexub/react';

// Shared pieces of the page templates (ActivityPage, DashboardPage, …).
// Data types mirror @nexub/react-native/patterns so one data layer feeds the
// web page and its native screen.

// ─── Data ────────────────────────────────────────────────────────────────────

export interface Transaction {
  id: string;
  title: string;
  subtitle?: string;
  /** Negative = money out. */
  amount: number;
  currency: string;
  date: Date;
  status?: 'pending' | 'failed';
  /** Avatar image URL. */
  image?: string;
}

export interface ReviewRow {
  label: string;
  value: string;
}

export interface Quote {
  fee: number;
  /** Units of `to` per unit of `from`. */
  rate: number;
  /** e.g. "In seconds", "By Friday". */
  arrives: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  /** Still streaming in. */
  streaming?: boolean;
}

export interface Plan {
  id: string;
  name: string;
  /** Preformatted, e.g. "$9.99 / month". */
  price: string;
  features: string[];
  badge?: string;
}

export interface QuickAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onSelect: () => void;
}

export interface Insight {
  id: string;
  title: string;
  body: string;
  action?: { label: string; onSelect: () => void };
}

// ─── Strings ─────────────────────────────────────────────────────────────────

export interface PageTemplateMessages {
  activity: string;
  noActivityTitle: string;
  noActivityDescription: string;
  loadMore: string;
  refresh: string;
  pending: string;
  failed: string;
  completed: string;
  date: string;
  details: string;
  back: string;
  settings: string;
  signIn: string;
  email: string;
  password: string;
  forgotPassword: string;
  createAccount: string;
  // 10.8 getting-in templates: sign up, forgot password, verify code, onboarding, KYC.
  signUp: string;
  name: string;
  phone: string;
  haveAccount: string;
  or: string;
  passwordHint: string;
  passwordStrength: (label: string) => string;
  /** Weak, fair, good, strong: one per meter segment. */
  strengthLabels: string[];
  enterName: string;
  enterValidEmail: string;
  enterValidPhone: string;
  choosePassword: string;
  acceptTerms: string;
  resetPassword: string;
  resetDescription: string;
  sendResetLink: string;
  checkEmail: string;
  resetSent: (email: string) => string;
  resendEmail: string;
  resendEmailIn: string;
  resendCode: string;
  resendCodeIn: string;
  backToSignIn: string;
  enterCode: string;
  codeSentTo: (length: number, destination: string) => string;
  changeDestination: string;
  codeExpiresIn: string;
  otherMethods: string;
  skip: string;
  finish: string;
  stepInvalid: string;
  allSet: string;
  verifyIdentity: string;
  personalDetails: string;
  legalName: string;
  legalNameHint: string;
  dateOfBirth: string;
  country: string;
  document: string;
  documentType: string;
  passport: string;
  nationalId: string;
  drivingLicence: string;
  documentFront: string;
  documentBack: string;
  documentTips: string[];
  fileRequirements: string;
  review: string;
  submitVerification: string;
  kycSubmitted: string;
  kycUnderReview: string;
  kycApproved: string;
  kycRejected: string;
  fixAndResubmit: string;
  verificationStatus: string;
  enterLegalName: string;
  enterDateOfBirth: string;
  chooseCountry: string;
  chooseDocumentType: string;
  uploadFront: string;
  uploadBack: string;
  howMuch: string;
  amountToSend: string;
  balance: (formatted: string) => string;
  overBalance: (formatted: string) => string;
  fee: string;
  rate: string;
  recipientGets: string;
  arrives: string;
  continue: string;
  checkDetails: string;
  edit: string;
  done: string;
  stepOf: (step: number, total: number) => string;
  sent: string;
  chat: string;
  chatEmpty: string;
  restorePurchases: string;
  choosePlan: string;
  totalBalance: string;
  quickActions: string;
  recentActivity: string;
  seeAll: string;
  insights: string;
  // 10.8 daily-work templates: table, detail, booking, invoice, team, notifications, search results.
  clearFilters: string;
  rowActions: string;
  discardChangesTitle: string;
  discardChangesDescription: string;
  discard: string;
  keepEditing: string;
  bookTitle: string;
  pickDate: string;
  pickTime: string;
  pickDateFirst: string;
  noTimes: string;
  yourBooking: string;
  time: string;
  confirmBooking: string;
  heldFor: string;
  holdExpired: string;
  pickAnotherTime: string;
  bookingConfirmed: string;
  reference: string;
  invoice: string;
  receipt: string;
  issued: string;
  due: string;
  billedFrom: string;
  billedTo: string;
  taxId: (id: string) => string;
  lineItems: string;
  itemDescription: string;
  quantity: string;
  unitPrice: string;
  amount: string;
  subtotal: string;
  discount: string;
  total: string;
  notes: string;
  invoiceStatus: (status: 'draft' | 'due' | 'paid' | 'overdue' | 'void') => string;
  team: string;
  member: string;
  role: string;
  status: string;
  lastActive: string;
  you: string;
  memberStatus: (status: 'active' | 'invited' | 'suspended') => string;
  roleFor: (name: string) => string;
  removeMember: (name: string) => string;
  removeMemberTitle: (name: string) => string;
  removeMemberDescription: string;
  invitePeople: string;
  inviteDescription: string;
  emailAddresses: string;
  emailAddressesHint: string;
  invalidEmail: (email: string) => string;
  emailRequired: string;
  sendInvites: string;
  pendingInvites: string;
  inviteResend: (email: string) => string;
  inviteRevoke: (email: string) => string;
  inviteResendLabel: string;
  inviteRevokeLabel: string;
  seatsUsed: (used: number, total: number) => string;
  inbox: string;
  all: string;
  unreadOnly: string;
  markRead: (title: string) => string;
  markUnread: (title: string) => string;
  yesterday: string;
  caughtUpTitle: string;
  caughtUpDescription: string;
  searchResults: string;
  resultsFor: (count: number, query: string) => string;
  trySearching: string;
}

export const defaultPageTemplateMessages: PageTemplateMessages = {
  activity: 'Activity',
  noActivityTitle: 'No activity yet',
  noActivityDescription: 'Your payments and transfers will show up here.',
  loadMore: 'Load more',
  refresh: 'Refresh',
  pending: 'Pending',
  failed: 'Failed',
  completed: 'Completed',
  date: 'Date',
  details: 'Details',
  back: 'Back',
  settings: 'Settings',
  signIn: 'Sign in',
  email: 'Email',
  password: 'Password',
  forgotPassword: 'Forgot password?',
  createAccount: 'Create an account',
  signUp: 'Create your account',
  name: 'Name',
  phone: 'Phone number',
  haveAccount: 'Already have an account?',
  or: 'or',
  passwordHint: 'Use 8 or more characters with upper and lower case letters and a number or symbol.',
  passwordStrength: (label) => `Password strength: ${label}`,
  strengthLabels: ['Weak', 'Fair', 'Good', 'Strong'],
  enterName: 'Enter your name',
  enterValidEmail: 'Enter a valid email address',
  enterValidPhone: 'Enter a valid phone number',
  choosePassword: 'Choose a stronger password',
  acceptTerms: 'Accept the terms to continue',
  resetPassword: 'Reset your password',
  resetDescription: 'Enter your email and we will send you a link to reset it.',
  sendResetLink: 'Send reset link',
  checkEmail: 'Check your email',
  resetSent: (email) => `If an account exists for ${email}, we sent a link to reset your password.`,
  resendEmail: 'Resend email',
  resendEmailIn: 'Resend email in',
  resendCode: 'Resend code',
  resendCodeIn: 'Resend code in',
  backToSignIn: 'Back to sign in',
  enterCode: 'Enter the code',
  codeSentTo: (length, destination) => `We sent a ${length}-digit code to ${destination}.`,
  changeDestination: 'Use a different number',
  codeExpiresIn: 'Code expires in',
  otherMethods: 'Other ways to verify',
  skip: 'Skip',
  finish: 'Finish',
  stepInvalid: 'Check this step before you continue.',
  allSet: 'You are all set',
  verifyIdentity: 'Verify your identity',
  personalDetails: 'Personal details',
  legalName: 'Full legal name',
  legalNameHint: 'As it appears on your document.',
  dateOfBirth: 'Date of birth',
  country: 'Country of residence',
  document: 'Document',
  documentType: 'Document type',
  passport: 'Passport',
  nationalId: 'National ID',
  drivingLicence: 'Driving licence',
  documentFront: 'Front of the document',
  documentBack: 'Back of the document',
  documentTips: [
    'Use the original document, not a copy or a screenshot.',
    'Make sure all four corners are in the photo.',
    'Check the text is sharp and there is no glare.',
  ],
  fileRequirements: 'JPG, PNG or PDF, up to 10 MB each.',
  review: 'Review',
  submitVerification: 'Submit for verification',
  kycSubmitted: 'Submitted',
  kycUnderReview: 'Under review',
  kycApproved: 'Approved',
  kycRejected: 'We could not verify your identity',
  fixAndResubmit: 'Fix and resubmit',
  verificationStatus: 'Verification status',
  enterLegalName: 'Enter your full legal name',
  enterDateOfBirth: 'Enter your date of birth',
  chooseCountry: 'Choose your country of residence',
  chooseDocumentType: 'Choose a document type',
  uploadFront: 'Upload the front of the document',
  uploadBack: 'Upload the back of the document',
  howMuch: 'How much?',
  amountToSend: 'Amount to send',
  balance: (b) => `Balance ${b}`,
  overBalance: (b) => `More than your balance (${b})`,
  fee: 'Fee',
  rate: 'Rate',
  recipientGets: 'Recipient gets',
  arrives: 'Arrives',
  continue: 'Continue',
  checkDetails: 'Check the details',
  edit: 'Edit',
  done: 'Done',
  stepOf: (s, t) => `Step ${s} of ${t}`,
  sent: 'Sent',
  chat: 'Chat',
  chatEmpty: 'Ask anything to get started.',
  restorePurchases: 'Restore purchases',
  choosePlan: 'Choose a plan',
  totalBalance: 'Total balance',
  quickActions: 'Quick actions',
  recentActivity: 'Recent activity',
  seeAll: 'See all',
  insights: 'Insights',
  clearFilters: 'Clear filters',
  rowActions: 'Actions',
  discardChangesTitle: 'Discard your changes?',
  discardChangesDescription: 'The edits you made have not been saved.',
  discard: 'Discard',
  keepEditing: 'Keep editing',
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
  invoice: 'Invoice',
  receipt: 'Receipt',
  issued: 'Issued',
  due: 'Due',
  billedFrom: 'From',
  billedTo: 'Billed to',
  taxId: (id) => `Tax ID ${id}`,
  lineItems: 'Line items',
  itemDescription: 'Description',
  quantity: 'Qty',
  unitPrice: 'Unit price',
  amount: 'Amount',
  subtotal: 'Subtotal',
  discount: 'Discount',
  total: 'Total',
  notes: 'Notes',
  invoiceStatus: (s) => ({ draft: 'Draft', due: 'Due', paid: 'Paid', overdue: 'Overdue', void: 'Void' })[s],
  team: 'Team',
  member: 'Member',
  role: 'Role',
  status: 'Status',
  lastActive: 'Last active',
  you: 'You',
  memberStatus: (s) => ({ active: 'Active', invited: 'Invited', suspended: 'Suspended' })[s],
  roleFor: (name) => `Role for ${name}`,
  removeMember: (name) => `Remove ${name}`,
  removeMemberTitle: (name) => `Remove ${name} from the team?`,
  removeMemberDescription: 'They lose access straight away. You can invite them again later.',
  invitePeople: 'Invite people',
  inviteDescription: 'Everyone you add gets an email with a link to join.',
  emailAddresses: 'Email addresses',
  emailAddressesHint: 'Separate addresses with a comma, a space or Enter.',
  invalidEmail: (email) => `${email} is not a valid email address`,
  emailRequired: 'Add at least one email address',
  sendInvites: 'Send invites',
  pendingInvites: 'Pending invites',
  inviteResend: (email) => `Resend the invite to ${email}`,
  inviteRevoke: (email) => `Revoke the invite to ${email}`,
  inviteResendLabel: 'Resend',
  inviteRevokeLabel: 'Revoke',
  seatsUsed: (used, total) => `${used} of ${total} seats used`,
  inbox: 'Notifications',
  all: 'All',
  unreadOnly: 'Unread',
  markRead: (title) => `Mark as read: ${title}`,
  markUnread: (title) => `Mark as unread: ${title}`,
  yesterday: 'Yesterday',
  caughtUpTitle: 'You are all caught up',
  caughtUpDescription: 'New notifications will show up here.',
  searchResults: 'Search results',
  resultsFor: (count, query) => `${count} result${count === 1 ? '' : 's'} for “${query}”`,
  trySearching: 'Try:',
};

/** Defaults ← NexubProvider `messages` ← the template's own `messages` prop. */
export function usePageMessages(overrides?: Partial<PageTemplateMessages>): PageTemplateMessages {
  const provided = useNexubMessages() as unknown as Partial<PageTemplateMessages>;
  const out = { ...defaultPageTemplateMessages };
  for (const key of Object.keys(out) as (keyof PageTemplateMessages)[]) {
    const v = overrides?.[key] ?? provided[key];
    // Provider messages hold other components' strings too; only take matching kinds.
    if (v !== undefined && typeof v === typeof out[key]) (out as Record<string, unknown>)[key] = v;
  }
  return out;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function formatMoney(value: number, currency: string, locale: string, opts?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat(locale, { style: 'currency', currency, ...opts }).format(value);
}

/** Newest first, grouped under a medium date heading ("30 Oct 2026"). */
export function groupByDay(transactions: Transaction[], locale: string) {
  const day = new Intl.DateTimeFormat(locale, { dateStyle: 'medium' });
  const map = new Map<string, Transaction[]>();
  for (const t of [...transactions].sort((a, b) => +b.date - +a.date)) {
    const key = day.format(t.date);
    map.set(key, [...(map.get(key) ?? []), t]);
  }
  return [...map].map(([title, data]) => ({ title, data }));
}

export function useTemplateLocale() {
  return useLocale().locale;
}

export function StatusBadge({ status, m, dot }: { status?: Transaction['status']; m: PageTemplateMessages; dot?: boolean }) {
  if (!status) return null;
  return (
    <Badge tone={status === 'failed' ? 'danger' : 'warning'} size="sm">
      {dot && <span aria-hidden="true" className="me-1 inline-block h-1.5 w-1.5 rounded-full bg-current" />}
      {status === 'failed' ? m.failed : m.pending}
    </Badge>
  );
}

// ─── Error boundary ──────────────────────────────────────────────────────────

export interface ContentBoundaryProps {
  /** Shown in place of content that threw while rendering. Default: the "Something went wrong" state with Retry. */
  errorFallback?: React.ReactNode | ((state: { error: unknown; reset: () => void }) => React.ReactNode);
  /** Called with the error, for reporting (Sentry, Datadog). */
  onError?: (error: unknown, info: React.ErrorInfo) => void;
}

function DefaultFallback({ reset }: { reset: () => void }) {
  const m = useNexubMessages();
  return (
    <EmptyStatePreset
      kind="serverError"
      actions={
        <Button variant="tonal" onClick={reset}>
          {m.retry}
        </Button>
      }
    />
  );
}

/**
 * Catches a render error in a pattern's content (9.5): the frame around it (header, list,
 * navigation) stays up and the content shows a fallback with Retry, which renders it again.
 */
class ContentBoundary extends React.Component<
  ContentBoundaryProps & { children?: React.ReactNode },
  { failed: boolean; error: unknown }
> {
  override state = { failed: false, error: undefined as unknown };
  static getDerivedStateFromError(error: unknown) {
    return { failed: true, error };
  }
  override componentDidCatch(error: unknown, info: React.ErrorInfo) {
    this.props.onError?.(error, info);
  }
  reset = () => this.setState({ failed: false, error: undefined });
  override render() {
    if (!this.state.failed) return this.props.children;
    const { errorFallback } = this.props;
    if (typeof errorFallback === 'function') return errorFallback({ error: this.state.error, reset: this.reset });
    return errorFallback ?? <DefaultFallback reset={this.reset} />;
  }
}

// ─── Frame ───────────────────────────────────────────────────────────────────

export interface PageFrameProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'onError'>, ContentBoundaryProps {
  /** Landmark element. Use `div` inside an app shell that already renders `<main>`. @default 'main' */
  as?: 'main' | 'div' | 'section';
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Top-right of the header: buttons, filters. */
  actions?: React.ReactNode;
  /** Above the title, e.g. a back link. */
  eyebrow?: React.ReactNode;
  /** Content width. @default 'md' */
  width?: 'sm' | 'md' | 'lg';
}

const widths = { sm: 'max-w-[30rem]', md: 'max-w-3xl', lg: 'max-w-6xl' };

/** Page frame shared by the templates: centred column, h1 header, responsive padding. */
export const PageFrame = React.forwardRef<HTMLElement, PageFrameProps>(function PageFrame(
  { as: Tag = 'main', title, description, actions, eyebrow, width = 'md', className, children, errorFallback, onError, ...props },
  ref,
) {
  const headingId = React.useId();
  return (
    // 10.6: the frame and the templates inside it follow the room the page is given (this
    // full-width block is their query container), not the viewport.
    <div className="@container w-full">
    <Tag
      ref={ref as React.Ref<HTMLElement & HTMLDivElement>}
      aria-labelledby={title ? headingId : undefined}
      className={cn('mx-auto flex w-full flex-col gap-6 px-4 py-6 @xl:px-6 @[60rem]:py-10', widths[width], className)}
      {...props}
    >
      {(title || actions || eyebrow) && (
        <header data-nx="page-header" className="flex flex-col gap-2">
          {eyebrow}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {title && (
              <h1 id={headingId} className="text-headline-sm ![font-weight:var(--page-title-weight,var(--type-headline-sm-weight))] text-[var(--color-on-surface)]">
                {title}
              </h1>
            )}
            {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
          </div>
          {description && <p className="text-body-md text-[var(--color-on-surface-muted)]">{description}</p>}
        </header>
      )}
      <ContentBoundary errorFallback={errorFallback} onError={onError}>
        {children}
      </ContentBoundary>
    </Tag>
    </div>
  );
});
