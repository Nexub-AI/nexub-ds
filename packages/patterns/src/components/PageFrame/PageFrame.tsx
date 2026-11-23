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

/** The strings a template shows: a subset of {@link PageTemplateMessages}. */
export type PageStrings<K extends keyof PageTemplateMessages> = Pick<PageTemplateMessages, K>;

/**
 * Defaults ← NexubProvider `messages` ← the template's own `messages` prop. 11.7: each template
 * passes only the defaults it shows (`messages/*.ts`), so a page no longer ships every template's
 * strings (about 2 kB gzip each).
 */
export function usePageStrings<K extends keyof PageTemplateMessages>(
  overrides: Partial<PageTemplateMessages> | undefined,
  defaults: PageStrings<K>,
): PageStrings<K> {
  const provided = useNexubMessages() as unknown as Partial<PageTemplateMessages>;
  const out = { ...defaults };
  for (const key of Object.keys(out) as K[]) {
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

export function StatusBadge({ status, m, dot }: { status?: Transaction['status']; m: PageStrings<'pending' | 'failed'>; dot?: boolean }) {
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
