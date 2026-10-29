import * as React from 'react';
import { SectionList, View } from 'react-native';
import { moneyFormatter } from '@nexub/core';
import { CheckCircle2, ShieldCheck, type NativeIconProps } from '@nexub/icons/native';
import { Button } from '../components/actions';
import { ListItem, ListSection } from '../components/containers';
import { Amount, Avatar, Badge } from '../components/display';
import { EmptyState, Progress } from '../components/feedback';
import {
  ExpressiveMoneyInput,
  RefreshControl,
  StickyFooter,
  SwipeableRow,
  type SwipeAction,
} from '../components/mobile';
import { ScreenContainer } from '../primitives/ScreenContainer';
import { Heading, Text } from '../primitives/Text';
import { useTheme } from '../theme/ThemeProvider';

// ─── Flow step frame ─────────────────────────────────────────────────────────

export interface FlowStepProps {
  /** 1-based. */
  step: number;
  total: number;
  title: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

/** One step of a multi-step flow: progress, title, content, sticky primary action. */
export function FlowStep({ step, total, title, children, footer }: FlowStepProps) {
  const { tokens, messages } = useTheme();
  return (
    <StickyFooter footer={footer}>
      <ScreenContainer gap="5">
        <View style={{ gap: tokens.spacing[2] }}>
          <Progress value={step / total} label={messages.pageOf(step, total)} />
          <Text variant="label-md" color="on-surface-variant">
            {messages.pageOf(step, total)}
          </Text>
          <Heading variant="headline-sm">{title}</Heading>
        </View>
        {children}
      </ScreenContainer>
    </StickyFooter>
  );
}

// ─── Send money ──────────────────────────────────────────────────────────────

export interface Quote {
  fee: number;
  /** Units of `to` per unit of `from`. */
  rate: number;
  /** e.g. "In seconds", "By Friday". */
  arrives: string;
}

export interface AmountStepProps {
  from: string;
  to: string;
  /** Available balance in `from`. */
  balance: number;
  /** Quote for an amount (fees and rate shown before anything else, like Wise). */
  quote: (amount: number) => Quote;
  onContinue: (amount: number) => void;
  step?: number;
  total?: number;
}

/** Amount entry with the fee, rate and arrival shown live. */
export function AmountStep({
  from,
  to,
  balance,
  quote,
  onContinue,
  step = 1,
  total = 3,
}: AmountStepProps) {
  const { locale } = useTheme();
  const [amount, setAmount] = React.useState<number | null>(null);
  const fmt = (n: number, c: string) => moneyFormatter(c, locale).format(n);
  const over = amount != null && amount > balance;
  const q = amount ? quote(amount) : undefined;
  return (
    <FlowStep
      step={step}
      total={total}
      title="How much?"
      footer={
        <Button
          size="lg"
          fullWidth
          disabled={!amount || over}
          onPress={() => amount && onContinue(amount)}
        >
          Continue
        </Button>
      }
    >
      <ExpressiveMoneyInput
        label="Amount to send"
        currency={from}
        value={amount}
        onValueChange={setAmount}
        error={over}
        caption={
          over ? `More than your balance (${fmt(balance, from)})` : `Balance ${fmt(balance, from)}`
        }
      />
      {q && amount && !over && (
        <ListSection>
          <ListItem variant="value" title="Fee" value={fmt(q.fee, from)} />
          <ListItem variant="value" title="Rate" value={`1 ${from} = ${q.rate} ${to}`} />
          <ListItem
            variant="value"
            title="Recipient gets"
            value={fmt((amount - q.fee) * q.rate, to)}
          />
          <ListItem variant="value" title="Arrives" value={q.arrives} />
        </ListSection>
      )}
    </FlowStep>
  );
}

export interface ReviewRow {
  label: string;
  value: string;
}

export interface ReviewStepProps {
  rows: ReviewRow[];
  /** "Confirm and send". */
  confirmLabel: string;
  onConfirm: () => void;
  /** Biometric confirmation, named: "Confirm with Face ID". Shown as the hint under the button. */
  confirmHint?: string;
  loading?: boolean;
  step?: number;
  total?: number;
}

/** Summary before money moves: every number visible, one confirming action. */
export function ReviewStep({
  rows,
  confirmLabel,
  onConfirm,
  confirmHint,
  loading,
  step = 2,
  total = 3,
}: ReviewStepProps) {
  return (
    <FlowStep
      step={step}
      total={total}
      title="Check the details"
      footer={
        <>
          <Button
            size="lg"
            fullWidth
            loading={loading}
            leadingIcon={confirmHint ? ShieldCheck : undefined}
            onPress={onConfirm}
          >
            {confirmLabel}
          </Button>
          {confirmHint && (
            <Text variant="body-sm" color="on-surface-variant" style={{ textAlign: 'center' }}>
              {confirmHint}
            </Text>
          )}
        </>
      }
    >
      <ListSection>
        {rows.map((r) => (
          <ListItem key={r.label} variant="value" title={r.label} value={r.value} />
        ))}
      </ListSection>
    </FlowStep>
  );
}

// ─── Activity ────────────────────────────────────────────────────────────────

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

export interface ActivityListProps {
  transactions: Transaction[];
  onPress?: (t: Transaction) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  onEndReached?: () => void;
  /** Swipe actions per row (also accessibility actions). */
  actions?: (t: Transaction) => SwipeAction[];
  header?: React.ReactElement;
  empty?: React.ReactElement;
}

/** Transactions grouped by day, with pull-to-refresh, paging and swipe actions (web ActivityFeed). */
export function ActivityList({
  transactions,
  onPress,
  onRefresh,
  refreshing = false,
  onEndReached,
  actions,
  header,
  empty,
}: ActivityListProps) {
  const { roles, tokens, locale } = useTheme();
  const day = new Intl.DateTimeFormat(locale, { dateStyle: 'medium' });
  const sections = React.useMemo(() => {
    const map = new Map<string, Transaction[]>();
    for (const t of [...transactions].sort((a, b) => +b.date - +a.date)) {
      const key = day.format(t.date);
      map.set(key, [...(map.get(key) ?? []), t]);
    }
    return [...map].map(([title, data]) => ({ title, data }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions, locale]);

  const row = (t: Transaction) => {
    const label = `${t.title}, ${moneyFormatter(t.currency, locale, { signDisplay: 'exceptZero' }).format(t.amount)}${t.status ? `, ${t.status}` : ''}`;
    const item = (
      <ListItem
        title={t.title}
        subtitle={t.subtitle}
        leading={<Avatar name={t.title} src={t.image} />}
        trailing={
          <View style={{ alignItems: 'flex-end', gap: 2 }}>
            <Amount
              value={t.amount}
              currency={t.currency}
              locale={locale}
              tone="auto"
              signDisplay="exceptZero"
            />
            {t.status && (
              <Badge tone={t.status === 'failed' ? 'danger' : 'warning'} size="sm">
                {t.status === 'failed' ? 'Failed' : 'Pending'}
              </Badge>
            )}
          </View>
        }
        variant={onPress ? 'navigation' : 'static'}
        onPress={onPress && (() => onPress(t))}
      />
    );
    return actions ? (
      <SwipeableRow label={label} onPress={onPress && (() => onPress(t))} actions={actions(t)}>
        {item}
      </SwipeableRow>
    ) : (
      item
    );
  };

  return (
    <SectionList
      sections={sections}
      keyExtractor={(t) => t.id}
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: roles.surface }}
      contentContainerStyle={{ padding: tokens.spacing[4], gap: 0 }}
      ListHeaderComponent={header}
      ListEmptyComponent={
        empty ?? (
          <EmptyState
            title="No activity yet"
            description="Your payments and transfers will show up here."
          />
        )
      }
      renderSectionHeader={({ section }) => (
        <Text
          variant="title-sm"
          color="on-surface-variant"
          accessibilityRole="header"
          style={{
            paddingTop: tokens.spacing[4],
            paddingBottom: tokens.spacing[2],
            paddingHorizontal: tokens.spacing[4],
            backgroundColor: roles.surface,
          }}
        >
          {section.title}
        </Text>
      )}
      renderItem={({ item, index, section }) => (
        <View
          style={{
            backgroundColor: roles['surface-container-lowest'],
            borderTopStartRadius: index === 0 ? tokens.shape.container : 0,
            borderTopEndRadius: index === 0 ? tokens.shape.container : 0,
            borderBottomStartRadius: index === section.data.length - 1 ? tokens.shape.container : 0,
            borderBottomEndRadius: index === section.data.length - 1 ? tokens.shape.container : 0,
            overflow: 'hidden',
          }}
        >
          {row(item)}
        </View>
      )}
      refreshControl={
        onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> : undefined
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      stickySectionHeadersEnabled={false}
    />
  );
}

export interface TransactionDetailProps {
  transaction: Transaction;
  /** Extra rows: reference, account, category… */
  rows?: ReviewRow[];
  actions?: React.ReactNode;
}

/** One transaction: hero amount, status, summary rows (web InfoList). */
export function TransactionDetail({ transaction: t, rows = [], actions }: TransactionDetailProps) {
  const { tokens, locale } = useTheme();
  const when = new Intl.DateTimeFormat(locale, { dateStyle: 'full', timeStyle: 'short' }).format(
    t.date,
  );
  return (
    <ScreenContainer gap="5">
      <View
        style={{ alignItems: 'center', gap: tokens.spacing[2], paddingVertical: tokens.spacing[4] }}
      >
        <Avatar name={t.title} src={t.image} size="xl" />
        <Text variant="title-md">{t.title}</Text>
        <Amount
          value={t.amount}
          currency={t.currency}
          locale={locale}
          size="display"
          tone="auto"
          signDisplay="exceptZero"
        />
        {t.status ? (
          <Badge tone={t.status === 'failed' ? 'danger' : 'warning'} dot>
            {t.status === 'failed' ? 'Failed' : 'Pending'}
          </Badge>
        ) : (
          <Badge tone="success" dot>
            Completed
          </Badge>
        )}
      </View>
      <ListSection>
        <ListItem variant="value" title="Date" value={when} />
        {t.subtitle && <ListItem variant="value" title="Details" value={t.subtitle} />}
        {rows.map((r) => (
          <ListItem key={r.label} variant="value" title={r.label} value={r.value} />
        ))}
      </ListSection>
      {actions}
    </ScreenContainer>
  );
}

// ─── Result screens ──────────────────────────────────────────────────────────

export interface ResultScreenProps {
  /** @default 'success' */
  kind?: 'success' | 'error' | 'offline' | 'maintenance' | 'update';
  title: string;
  description?: string;
  /** Hero figure (e.g. the amount sent). */
  amount?: { value: number; currency: string };
  primary: { label: string; onPress: () => void };
  secondary?: { label: string; onPress: () => void };
  icon?: React.ComponentType<NativeIconProps>;
}

/** Full-screen outcome: success, error, offline, maintenance, or "update required". */
export function ResultScreen({
  kind = 'success',
  title,
  description,
  amount,
  primary,
  secondary,
  icon,
}: ResultScreenProps) {
  const { roles, tokens, locale } = useTheme();
  const tone = kind === 'success' ? 'success' : kind === 'error' ? 'error' : 'primary';
  const Glyph = icon ?? CheckCircle2;
  return (
    <StickyFooter
      footer={
        <>
          <Button size="lg" fullWidth onPress={primary.onPress}>
            {primary.label}
          </Button>
          {secondary && (
            <Button size="lg" fullWidth variant="text" onPress={secondary.onPress}>
              {secondary.label}
            </Button>
          )}
        </>
      }
    >
      <View
        accessibilityLiveRegion="polite"
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          gap: tokens.spacing[4],
          padding: tokens.spacing[6],
        }}
      >
        <View
          style={{
            width: 88,
            height: 88,
            borderRadius: 44,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: roles[`${tone}-container`],
          }}
        >
          <Glyph size={44} color={roles[tone]} />
        </View>
        <Heading variant="headline-md" style={{ textAlign: 'center' }}>
          {title}
        </Heading>
        {amount && (
          <Amount value={amount.value} currency={amount.currency} locale={locale} size="display" />
        )}
        {description && (
          <Text variant="body-md" color="on-surface-variant" style={{ textAlign: 'center' }}>
            {description}
          </Text>
        )}
      </View>
    </StickyFooter>
  );
}
