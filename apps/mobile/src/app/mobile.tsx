import { useState } from 'react';
import { View } from 'react-native';
import { Stack as Screen } from 'expo-router';
import { Copy, Plus, Trash2 } from '@nexub/icons/native';
import {
  ActionSheet,
  Amount,
  Avatar,
  BottomSheet,
  Button,
  Carousel,
  Coachmark,
  ContextMenu,
  DateTimeField,
  ExpressiveMoneyInput,
  FAB,
  Heading,
  Inline,
  ListItem,
  ListSection,
  OTPInput,
  OfflineBanner,
  ScreenContainer,
  Select,
  SensitiveValue,
  Stack,
  Surface,
  SwipeableRow,
  Text,
  useToast,
} from '@nexub/react-native';

const SLIDES = [
  { title: 'Send money abroad', body: 'Real exchange rate, fees shown up front.' },
  { title: 'Hold 40+ currencies', body: 'Convert when the rate suits you.' },
  { title: 'Spend with your card', body: 'Freeze it in a tap if you lose it.' },
];

export default function MobileScreen() {
  const toast = useToast();
  const [sheet, setSheet] = useState(false);
  const [actions, setActions] = useState(false);
  const [money, setMoney] = useState(false);
  const [amount, setAmount] = useState<number | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [hint, setHint] = useState(true);
  const [offline, setOffline] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <OfflineBanner offline={offline} />
      <ScreenContainer>
        <Screen.Screen options={{ title: 'Mobile patterns' }} />

        <Stack>
          <Heading variant="title-lg">Sheets and menus</Heading>
          <Inline>
            <Button variant="tonal" onPress={() => setSheet(true)}>
              Open sheet
            </Button>
            <Button variant="outlined" onPress={() => setActions(true)}>
              Card actions
            </Button>
            <Button variant="text" onPress={() => setOffline(!offline)}>
              {offline ? 'Go online' : 'Go offline'}
            </Button>
          </Inline>
          <Select
            label="Currency"
            placeholder="Choose a currency"
            options={[
              { value: 'USD', label: 'US dollar', description: 'USD' },
              { value: 'EUR', label: 'Euro', description: 'EUR' },
              { value: 'INR', label: 'Indian rupee', description: 'INR' },
              { value: 'SGD', label: 'Singapore dollar', description: 'SGD' },
            ]}
          />
          <DateTimeField label="Transfer date" value={date} onValueChange={setDate} minimumDate={new Date()} />
        </Stack>

        <Stack>
          <Heading variant="title-lg">Money</Heading>
          <Surface tone="surface-container-low" radius="container" style={{ padding: 16, gap: 4 }}>
            <Text variant="label-lg" color="on-surface-variant">
              Balance
            </Text>
            <SensitiveValue label="Balance" variant="headline-md">
              $12,480.50
            </SensitiveValue>
          </Surface>
          <Button size="lg" fullWidth onPress={() => setMoney(true)}>
            {amount ? `Send $${amount}` : 'Enter an amount'}
          </Button>
        </Stack>

        <Stack>
          <Heading variant="title-lg">Swipe and long-press</Heading>
          <ListSection footer="Swipe a row left, or long-press the IBAN.">
            {[
              { name: 'Amazon', amount: -42.5 },
              { name: 'Netflix', amount: -15.99 },
            ].map((t) => (
              <SwipeableRow
                key={t.name}
                label={`${t.name}, ${t.amount} dollars`}
                actions={[
                  { label: 'Copy', icon: Copy, onPress: () => toast({ message: `${t.name} copied` }) },
                  { label: 'Delete', icon: Trash2, tone: 'danger', onPress: () => toast({ message: `${t.name} deleted`, action: { label: 'Undo', onPress: () => {} } }) },
                ]}
              >
                <ListItem title={t.name} leading={<Avatar name={t.name} />} trailing={<Amount value={t.amount} currency="USD" locale="en-US" />} />
              </SwipeableRow>
            ))}
          </ListSection>
          <ContextMenu
            accessibilityLabel="IBAN GB33 BUKB 2020 1555 5555 55"
            title="IBAN"
            actions={[
              { label: 'Copy', onPress: () => toast({ message: 'IBAN copied' }) },
              { label: 'Share', onPress: () => {} },
            ]}
          >
            <Surface tone="surface-container-low" radius="container" style={{ padding: 16 }}>
              <Text variant="label-md" color="on-surface-variant">
                IBAN
              </Text>
              <Text family="mono">GB33 BUKB 2020 1555 5555 55</Text>
            </Surface>
          </ContextMenu>
        </Stack>

        <Stack>
          <Heading variant="title-lg">Verify</Heading>
          <OTPInput label="Verification code" onComplete={(c) => toast({ message: `Code ${c} entered`, tone: 'success' })} />
        </Stack>

        <Stack>
          <Heading variant="title-lg">Onboarding</Heading>
          <Carousel
            data={SLIDES}
            width={350}
            renderItem={({ item }) => (
              <Surface tone="surface-container" radius="container" style={{ marginEnd: 12, padding: 20, gap: 6, minHeight: 120 }}>
                <Text variant="title-lg">{item.title}</Text>
                <Text color="on-surface-variant">{item.body}</Text>
              </Surface>
            )}
          />
          {hint && (
            <Coachmark title="New: scheduled transfers" onDismiss={() => setHint(false)}>
              Pick a date above to send money later.
            </Coachmark>
          )}
        </Stack>
      </ScreenContainer>

      <FAB icon={Plus} label="New transfer" extended onPress={() => setMoney(true)} />

      <BottomSheet open={sheet} onOpenChange={setSheet} title="Transfer details" detents={['content', 0.9]}>
        <ListSection>
          <ListItem variant="value" title="You send" value="$250.00" />
          <ListItem variant="value" title="Fee" value="$1.00" />
          <ListItem variant="value" title="Recipient gets" value="€229.12" />
          <ListItem variant="value" title="Arrives" value="In seconds" />
        </ListSection>
        <Button size="lg" fullWidth onPress={() => setSheet(false)}>
          Confirm and send
        </Button>
      </BottomSheet>

      <ActionSheet
        open={actions}
        onOpenChange={setActions}
        title="Card ending 4242"
        actions={[
          { label: 'Freeze card', onPress: () => toast({ message: 'Card frozen' }) },
          { label: 'Show PIN', onPress: () => {} },
          { label: 'Cancel card', destructive: true, onPress: () => {} },
        ]}
      />

      <BottomSheet open={money} onOpenChange={setMoney} title="Amount to send">
        <ExpressiveMoneyInput label="Amount to send" currency="USD" value={amount} onValueChange={setAmount} caption="Balance $12,480.50" />
        <Button size="lg" fullWidth disabled={!amount} onPress={() => setMoney(false)}>
          Continue
        </Button>
      </BottomSheet>
    </View>
  );
}
