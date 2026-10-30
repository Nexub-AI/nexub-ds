import * as React from 'react';
import { View } from 'react-native';
import { moneyFormatter } from '@nexub/core';
import type { NativeIconProps } from '@nexub/icons/native';
import { Button } from '../components/actions';
import { Card, ListItem, ListSection } from '../components/containers';
import { Amount, Avatar, Badge } from '../components/display';
import { RefreshControl } from '../components/mobile';
import { Pressable } from '../primitives/Pressable';
import { ScreenContainer } from '../primitives/ScreenContainer';
import { Heading, Text } from '../primitives/Text';
import { useTheme } from '../theme/ThemeProvider';
import type { Transaction } from './money';

export interface QuickAction {
  id: string;
  label: string;
  icon?: React.ComponentType<NativeIconProps>;
  onPress: () => void;
}

export interface Insight {
  id: string;
  title: string;
  body: string;
  action?: { label: string; onPress: () => void };
}

export interface HomeScreenProps {
  /** e.g. "Good morning, Mei". Leave out when the native header shows the title. */
  greeting?: string;
  balance: { value: number; currency: string; label?: string };
  /** Send, Add money, Request… Up to four fit one row. */
  quickActions?: QuickAction[];
  /** The latest few transactions. */
  recent?: Transaction[];
  onTransactionPress?: (t: Transaction) => void;
  /** Shows "See all" beside Recent activity. */
  onSeeAllActivity?: () => void;
  insights?: Insight[];
  onRefresh?: () => void;
  refreshing?: boolean;
  /** Copy overrides. */
  labels?: Partial<{ totalBalance: string; recentActivity: string; seeAll: string; insights: string }>;
}

/**
 * Money-app home (Payub): balance hero with quick actions, recent activity,
 * insights and pull-to-refresh. Web twin: `DashboardPage` in @nexub/patterns.
 */
export function HomeScreen({
  greeting,
  balance,
  quickActions = [],
  recent = [],
  onTransactionPress,
  onSeeAllActivity,
  insights = [],
  onRefresh,
  refreshing = false,
  labels,
}: HomeScreenProps) {
  const { roles, tokens, locale } = useTheme();
  const l = {
    totalBalance: 'Total balance',
    recentActivity: 'Recent activity',
    seeAll: 'See all',
    insights: 'Insights',
    ...labels,
  };
  const balanceLabel = balance.label ?? l.totalBalance;

  return (
    <ScreenContainer
      gap="6"
      refreshControl={
        onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> : undefined
      }
    >
      {greeting && <Heading variant="headline-sm">{greeting}</Heading>}

      <Card tone="surface-container" style={{ padding: tokens.spacing[5], gap: tokens.spacing[5] }}>
        <View
          accessible
          accessibilityLabel={`${balanceLabel}, ${moneyFormatter(balance.currency, locale).format(balance.value)}`}
          style={{ gap: tokens.spacing[1] }}
        >
          <Text variant="label-lg" color="on-surface-variant">
            {balanceLabel}
          </Text>
          <Amount value={balance.value} currency={balance.currency} locale={locale} size="display" />
        </View>
        {quickActions.length > 0 && (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: tokens.spacing[2] }}>
            {quickActions.slice(0, 4).map((a) => {
              const Icon = a.icon;
              return (
                <Pressable
                  key={a.id}
                  accessibilityRole="button"
                  accessibilityLabel={a.label}
                  haptic="selection"
                  onPress={a.onPress}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    gap: tokens.spacing[2],
                    paddingVertical: tokens.spacing[2],
                    borderRadius: tokens.shape.container,
                  }}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: roles['primary-container'],
                    }}
                  >
                    {Icon && <Icon size="md" color={roles['on-primary-container']} />}
                  </View>
                  <Text variant="label-md" numberOfLines={1}>
                    {a.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </Card>

      {recent.length > 0 && (
        <View style={{ gap: tokens.spacing[2] }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingStart: tokens.spacing[4],
            }}
          >
            <Text variant="title-sm" color="on-surface-variant" accessibilityRole="header">
              {l.recentActivity}
            </Text>
            {onSeeAllActivity && (
              <Button variant="text" size="sm" onPress={onSeeAllActivity}>
                {l.seeAll}
              </Button>
            )}
          </View>
          <ListSection inset={68}>
            {recent.map((t) => (
              <ListItem
                key={t.id}
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
                variant={onTransactionPress ? 'navigation' : 'static'}
                onPress={onTransactionPress && (() => onTransactionPress(t))}
              />
            ))}
          </ListSection>
        </View>
      )}

      {insights.length > 0 && (
        <View style={{ gap: tokens.spacing[3] }}>
          <Text
            variant="title-sm"
            color="on-surface-variant"
            accessibilityRole="header"
            style={{ paddingHorizontal: tokens.spacing[4] }}
          >
            {l.insights}
          </Text>
          {insights.map((i) => (
            <Card key={i.id}>
              <Text variant="title-sm">{i.title}</Text>
              <Text variant="body-sm" color="on-surface-variant">
                {i.body}
              </Text>
              {i.action && (
                <Button variant="text" size="sm" onPress={i.action.onPress} style={{ alignSelf: 'flex-start' }}>
                  {i.action.label}
                </Button>
              )}
            </Card>
          ))}
        </View>
      )}
    </ScreenContainer>
  );
}
