// One self-contained example per CATALOG title. The catalogue screens and the
// docs previews (/preview/[slug]) both render these, so a demo is written once.
import { useState } from 'react';
import { Platform, View } from 'react-native';
import { ArrowRight, Bell, Check, Copy, CreditCard, Globe, Heart, Lock, Moon, Plus, Search, Send, Trash2, Wallet } from '@nexub/icons/native';
import {
  Accordion,
  ActionSheet,
  Amount,
  Avatar,
  AvatarGroup,
  Badge,
  Banner,
  BottomSheet,
  Button,
  ButtonGroup,
  Card,
  Carousel,
  Checkbox,
  Chip,
  Coachmark,
  ContextMenu,
  DateTimeField,
  Dialog,
  Divider,
  EmptyState,
  ErrorState,
  ExpressiveMoneyInput,
  FAB,
  FilterChip,
  Heading,
  Icon,
  IconButton,
  Inline,
  Link,
  ListItem,
  ListSection,
  LoadingIndicator,
  MoneyInput,
  NumericKeypad,
  OTPInput,
  OfflineBanner,
  PageIndicator,
  PasswordInput,
  Pressable,
  PrivacyShield,
  Progress,
  Radio,
  RadioGroup,
  SearchField,
  SegmentedControl,
  Select,
  SensitiveValue,
  Skeleton,
  Slider,
  Stack,
  Stepper,
  StickyFooter,
  Surface,
  SwipeableRow,
  Switch,
  Text,
  TextField,
  useTheme,
  useToast,
  type SurfaceTone,
} from '@nexub/react-native';
import { CATALOG } from './catalog';

export type Example = () => React.JSX.Element;

// Exactly one example per title in CATALOG (same order, same count).
type OnePerTitle<T extends readonly unknown[]> = { readonly [I in keyof T]: Example };
type Examples = { [K in keyof typeof CATALOG]: OnePerTitle<(typeof CATALOG)[K]['examples']> };

const TIERS: SurfaceTone[] = [
  'surface-container-lowest',
  'surface-container-low',
  'surface-container',
  'surface-container-high',
  'surface-container-highest',
];
const SLIDES = [
  { title: 'Send money abroad', body: 'Real exchange rate, fees shown up front.' },
  { title: 'Hold 40+ currencies', body: 'Convert when the rate suits you.' },
  { title: 'Spend with your card', body: 'Freeze it in a tap if you lose it.' },
];
const PEOPLE = ['Asha Rao', 'Leo Tan', 'Mia Chen', 'Omar Ali', 'Sam Lee', 'Zoe Park'];

export const EXAMPLES: Examples = {
  text: [
    () => (
      <Stack gap="2">
        <Text variant="display-sm">Display</Text>
        <Text variant="headline-sm">Headline</Text>
        <Text variant="title-md">Title</Text>
        <Text variant="body-md">Body text reads at 16 and scales with Dynamic Type.</Text>
        <Text variant="label-md" color="on-surface-variant">
          Label
        </Text>
      </Stack>
    ),
    () => (
      <Text variant="title-lg" tabular>
        $12,480.50
      </Text>
    ),
  ],
  heading: [
    () => (
      <Stack gap="2">
        <Heading variant="headline-md">Send money</Heading>
        <Heading variant="title-lg">Recent activity</Heading>
        <Heading variant="title-md">This week</Heading>
      </Stack>
    ),
  ],
  surface: [
    () => (
      <Inline>
        {TIERS.map((tone) => (
          <Surface key={tone} tone={tone} radius="field" style={{ width: 56, height: 56 }} />
        ))}
      </Inline>
    ),
    () => (
      <Stack gap="2">
        <Surface tone="surface-container-lowest" elevation={2} radius="container" style={{ padding: 16 }}>
          <Text>Elevation 2</Text>
        </Surface>
        <Surface material="glass" radius="control" style={{ padding: 16 }}>
          <Text>Glass (control layer)</Text>
        </Surface>
      </Stack>
    ),
  ],
  pressable: [
    function PressExample() {
      const { roles } = useTheme();
      return (
        <Pressable
          haptic="confirm"
          accessibilityLabel="Press me"
          style={{ borderRadius: 9999, backgroundColor: roles.primary, paddingVertical: 14, alignItems: 'center' }}
          stateLayer="on-primary"
        >
          <Text color="on-primary" variant="label-lg">
            Press me
          </Text>
        </Pressable>
      );
    },
  ],
  icon: [
    () => (
      <Inline gap="4">
        <Icon icon={Search} />
        <Icon icon={Bell} color="tertiary" />
        <Icon icon={Check} color="success" size="lg" label="Done" />
      </Inline>
    ),
  ],

  button: [
    () => (
      <Inline>
        <Button>Continue</Button>
        <Button variant="tonal" leadingIcon={Plus}>
          Add money
        </Button>
        <Button variant="outlined">Details</Button>
        <Button variant="text">Skip</Button>
      </Inline>
    ),
    () => (
      <Inline>
        <Button tone="payub" leadingIcon={Wallet}>
          Payub
        </Button>
        <Button tone="danger">Delete</Button>
        <Button loading loadingLabel="Sending">
          Send
        </Button>
        <Button disabled>Disabled</Button>
      </Inline>
    ),
    () => (
      <Button size="lg" fullWidth trailingIcon={ArrowRight}>
        Continue
      </Button>
    ),
  ],
  'button-group': [
    () => (
      <ButtonGroup direction="stack">
        <Button size="lg">Confirm transfer</Button>
        <Button size="lg" variant="text">
          Cancel
        </Button>
      </ButtonGroup>
    ),
    () => (
      <ButtonGroup>
        <Button variant="outlined">Decline</Button>
        <Button>Accept</Button>
      </ButtonGroup>
    ),
  ],
  'icon-button': [
    function IconButtons() {
      const [fav, setFav] = useState(false);
      return (
        <Inline gap="4">
          <IconButton icon={Heart} label="Favourite" selected={fav} haptic="toggleOn" onPress={() => setFav(!fav)} />
          <IconButton icon={Send} label="Send" variant="tonal" />
          <IconButton icon={Plus} label="Add" variant="filled" />
          <IconButton icon={Plus} label="Add (outlined)" variant="outlined" size="sm" />
        </Inline>
      );
    },
  ],
  link: [() => <Link onPress={() => {}}>View all contacts</Link>],
  chip: [() => <Chip label="EUR" onRemove={() => {}} />],
  'filter-chip': [
    function FilterChips() {
      const [filters, setFilters] = useState<string[]>(['Card']);
      const toggle = (f: string) => setFilters((all) => (all.includes(f) ? all.filter((x) => x !== f) : [...all, f]));
      return (
        <Inline>
          {['Card', 'Bank', 'Cash'].map((f) => (
            <FilterChip key={f} label={f} selected={filters.includes(f)} onPress={() => toggle(f)} />
          ))}
        </Inline>
      );
    },
  ],
  badge: [
    () => (
      <Inline>
        <Badge tone="success" dot>
          Paid
        </Badge>
        <Badge tone="warning">Pending</Badge>
        <Badge tone="payub">Payub</Badge>
      </Inline>
    ),
    () => (
      <Inline>
        <Badge tone="danger" variant="solid">
          3
        </Badge>
        <Badge tone="info">Soft</Badge>
        <Badge variant="outline">v2.1</Badge>
      </Inline>
    ),
  ],
  avatar: [
    () => (
      <Inline gap="4">
        <Avatar name="Asha Rao" size="lg" badge />
        <Avatar name="Leo Tan" />
        <Avatar name="Mia Chen" size="sm" />
      </Inline>
    ),
  ],
  'avatar-group': [
    () => (
      <AvatarGroup>
        {PEOPLE.map((n) => (
          <Avatar key={n} name={n} />
        ))}
      </AvatarGroup>
    ),
  ],

  'text-field': [
    () => <TextField label="Full name" placeholder="As on your ID" textContentType="name" autoComplete="name" />,
    () => <TextField label="Email" keyboardType="email-address" autoCapitalize="none" error="Enter a valid email address" defaultValue="asha@" />,
  ],
  'password-input': [() => <PasswordInput label="Password" helperText="At least 12 characters" />],
  'search-field': [() => <SearchField placeholder="Search transactions" />],
  'money-input': [
    function MoneyExample() {
      const [amount, setAmount] = useState<number | null>(250);
      return (
        <MoneyInput
          label="You send"
          currency="USD"
          value={amount}
          onValueChange={setAmount}
          helperText={amount == null ? undefined : `Fee included: $${(amount * 0.004).toFixed(2)}`}
        />
      );
    },
  ],
  stepper: [() => <Stepper label="Guests" defaultValue={2} min={1} max={8} />],
  checkbox: [() => <Checkbox label="Save this recipient" description="Find them faster next time" defaultChecked />],
  'radio-group': [
    () => (
      <RadioGroup label="Delivery speed" defaultValue="standard">
        <Radio value="standard" label="Standard" description="1–2 business days · Free" />
        <Radio value="instant" label="Instant" description="Seconds · $1.50" />
      </RadioGroup>
    ),
  ],
  switch: [() => <Switch label="Notifications" defaultChecked />],
  'segmented-control': [
    () => (
      <SegmentedControl
        label="Period"
        options={[
          { value: 'week', label: 'Week' },
          { value: 'month', label: 'Month' },
          { value: 'year', label: 'Year' },
        ]}
      />
    ),
  ],
  slider: [
    function SliderExample() {
      const [volume, setVolume] = useState(40);
      return <Slider label="Volume" value={volume} onValueChange={setVolume} formatValue={(v) => `${v}%`} />;
    },
  ],
  select: [
    () => (
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
    ),
  ],
  'date-time-field': [
    function DateExample() {
      const [date, setDate] = useState<Date | null>(null);
      return <DateTimeField label="Transfer date" value={date} onValueChange={setDate} minimumDate={new Date()} />;
    },
  ],

  card: [
    () => (
      <Card>
        <Text variant="label-lg" color="on-surface-variant">
          Total balance
        </Text>
        <Amount value={12480.5} currency="USD" locale="en-US" size="display" />
        <Inline>
          <Badge tone="success" dot>
            +2.4% this month
          </Badge>
        </Inline>
      </Card>
    ),
  ],
  'list-item': [
    () => (
      <ListSection header="Recent activity">
        <ListItem
          title="Amazon"
          subtitle="Today · Card"
          leading={<Avatar name="Amazon" size="md" />}
          trailing={<Amount value={-42.5} currency="USD" locale="en-US" tone="auto" />}
          onPress={() => {}}
          variant="navigation"
        />
        <ListItem title="Cards" value="2 active" leading={<Icon icon={CreditCard} />} onPress={() => {}} />
      </ListSection>
    ),
    function ListControls() {
      const [dark, setDark] = useState(false);
      const [speed, setSpeed] = useState('standard');
      return (
        <ListSection header="Delivery speed">
          <ListItem variant="switch" title="Dark mode" leading={<Icon icon={Moon} />} checked={dark} onCheckedChange={setDark} />
          <ListItem variant="radio" title="Standard" subtitle="1–2 business days" checked={speed === 'standard'} onCheckedChange={() => setSpeed('standard')} />
          <ListItem variant="radio" title="Instant" subtitle="Seconds · $1.50" checked={speed === 'instant'} onCheckedChange={() => setSpeed('instant')} />
        </ListSection>
      );
    },
  ],
  'list-section': [
    function Security() {
      const [faceId, setFaceId] = useState(true);
      return (
        <Stack gap="4">
          <ListSection header="Security" footer="Face ID is used to approve payments over $500." inset={56}>
            <ListItem variant="switch" title="Face ID" leading={<Icon icon={Lock} />} checked={faceId} onCheckedChange={setFaceId} />
            <ListItem title="Language" value="English" leading={<Icon icon={Globe} />} onPress={() => {}} />
            <ListItem title="Notifications" leading={<Icon icon={Bell} />} onPress={() => {}} />
          </ListSection>
          <ListSection>
            <ListItem variant="button" title="Sign out" destructive onPress={() => {}} />
          </ListSection>
        </Stack>
      );
    },
  ],
  accordion: [
    () => (
      <Stack gap="0">
        <Accordion title="How long does a transfer take?">
          <Text color="on-surface-variant">Most transfers arrive in seconds. Bank transfers can take 1–2 business days.</Text>
        </Accordion>
        <Accordion title="Is there a fee?">
          <Text color="on-surface-variant">We show the fee before you confirm. No hidden markup on the exchange rate.</Text>
        </Accordion>
      </Stack>
    ),
  ],
  amount: [
    () => <Amount value={12480.5} currency="USD" locale="en-US" size="display" />,
    () => (
      <Stack gap="1">
        <Amount value={-42.5} currency="USD" locale="en-US" tone="auto" />
        <Amount value={4200} currency="USD" locale="en-US" tone="auto" signDisplay="exceptZero" />
      </Stack>
    ),
  ],
  divider: [
    () => (
      <Stack gap="2">
        <Text>Above</Text>
        <Divider inset={16} />
        <Text>Below</Text>
      </Stack>
    ),
  ],

  banner: [
    () => (
      <Stack gap="2">
        <Banner tone="info" title="Verify your identity">
          We need a photo ID before your first transfer over $1,000.
        </Banner>
        <Banner tone="success">Transfer sent. It should arrive in seconds.</Banner>
      </Stack>
    ),
    () => (
      <Banner tone="warning" action={<Button variant="text" size="sm">Review</Button>} onDismiss={() => {}}>
        Your card expires next month.
      </Banner>
    ),
  ],
  toast: [
    function ToastExample() {
      const toast = useToast();
      return (
        <Button variant="tonal" onPress={() => toast({ message: 'Recipient saved', action: { label: 'Undo', onPress: () => {} } })}>
          Show toast
        </Button>
      );
    },
  ],
  dialog: [
    function DialogExample() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button variant="outlined" onPress={() => setOpen(true)}>
            Open dialog
          </Button>
          <Dialog
            open={open}
            onOpenChange={setOpen}
            title="Cancel this transfer?"
            description="The money goes back to your balance. This can’t be undone."
            actions={
              <>
                <Button variant="text" onPress={() => setOpen(false)}>
                  Keep it
                </Button>
                <Button tone="danger" onPress={() => setOpen(false)}>
                  Cancel transfer
                </Button>
              </>
            }
          />
        </>
      );
    },
  ],
  progress: [
    () => (
      <Stack gap="4">
        <Progress value={0.62} label="Verification" />
        <Progress value={0.62} label="Upload" variant="circular" />
      </Stack>
    ),
  ],
  'loading-indicator': [() => <LoadingIndicator />],
  skeleton: [
    () => (
      <Stack gap="2">
        <Skeleton width="60%" height={20} />
        <Skeleton height={14} />
        <Skeleton width="80%" height={14} />
      </Stack>
    ),
  ],
  'empty-state': [
    () => (
      <EmptyState
        icon={Wallet}
        tone="payub"
        title="No transactions yet"
        description="Add money to your balance to get started."
        action={<Button>Add money</Button>}
      />
    ),
  ],
  'error-state': [() => <ErrorState title="Couldn’t load your activity" description="Check your connection and try again." onRetry={() => {}} />],

  'bottom-sheet': [
    function SheetExample() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button variant="tonal" onPress={() => setOpen(true)}>
            Open sheet
          </Button>
          <BottomSheet open={open} onOpenChange={setOpen} title="Transfer details" detents={['content', 0.9]}>
            <ListSection>
              <ListItem variant="value" title="You send" value="$250.00" />
              <ListItem variant="value" title="Fee" value="$1.00" />
              <ListItem variant="value" title="Recipient gets" value="€229.12" />
              <ListItem variant="value" title="Arrives" value="In seconds" />
            </ListSection>
            <Button size="lg" fullWidth onPress={() => setOpen(false)}>
              Confirm and send
            </Button>
          </BottomSheet>
        </>
      );
    },
  ],
  'action-sheet': [
    function ActionsExample() {
      const toast = useToast();
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button variant="outlined" onPress={() => setOpen(true)}>
            Card actions
          </Button>
          <ActionSheet
            open={open}
            onOpenChange={setOpen}
            title="Card ending 4242"
            actions={[
              { label: 'Freeze card', onPress: () => toast({ message: 'Card frozen' }) },
              { label: 'Show PIN', onPress: () => {} },
              { label: 'Cancel card', destructive: true, onPress: () => {} },
            ]}
          />
        </>
      );
    },
  ],
  'context-menu': [
    function ContextExample() {
      const toast = useToast();
      return (
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
      );
    },
  ],
  'swipeable-row': [
    function SwipeExample() {
      const toast = useToast();
      return (
        <ListSection footer="Swipe a row left.">
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
      );
    },
  ],
  'otp-input': [
    function OtpExample() {
      const toast = useToast();
      return <OTPInput label="Verification code" onComplete={(c) => toast({ message: `Code ${c} entered`, tone: 'success' })} />;
    },
  ],
  'numeric-keypad': [
    function KeypadExample() {
      const [value, setValue] = useState('');
      return (
        <Stack gap="2">
          <Text variant="headline-md" tabular style={{ textAlign: 'center' }}>
            {value || '0'}
          </Text>
          <NumericKeypad decimal onKey={(k) => setValue((v) => (k === 'delete' ? v.slice(0, -1) : v + k))} />
        </Stack>
      );
    },
  ],
  'expressive-money-input': [
    function ExpressiveExample() {
      const [amount, setAmount] = useState<number | null>(null);
      return <ExpressiveMoneyInput label="Amount to send" currency="USD" value={amount} onValueChange={setAmount} caption="Balance $12,480.50" />;
    },
  ],
  'sensitive-value': [
    () => (
      <Surface tone="surface-container-low" radius="container" style={{ padding: 16, gap: 4 }}>
        <Text variant="label-lg" color="on-surface-variant">
          Balance
        </Text>
        <SensitiveValue label="Balance" variant="headline-md">
          $12,480.50
        </SensitiveValue>
      </Surface>
    ),
  ],
  'privacy-shield': [
    () => (
      <PrivacyShield cover={<Icon icon={Wallet} size="xl" color="tertiary" />}>
        <Surface tone="surface-container-low" radius="container" style={{ padding: 16 }}>
          <Text color="on-surface-variant">Covered in the app switcher.</Text>
          <Amount value={12480.5} currency="USD" locale="en-US" size="display" />
        </Surface>
      </PrivacyShield>
    ),
  ],
  'offline-banner': [
    function OfflineExample() {
      const [offline, setOffline] = useState(true);
      return (
        <Stack gap="2">
          <OfflineBanner offline={offline} />
          <Button variant="text" onPress={() => setOffline(!offline)}>
            {offline ? 'Go online' : 'Go offline'}
          </Button>
        </Stack>
      );
    },
  ],
  coachmark: [
    function CoachmarkExample() {
      const [hint, setHint] = useState(true);
      return hint ? (
        <Coachmark title="New: scheduled transfers" onDismiss={() => setHint(false)}>
          Pick a date to send money later.
        </Coachmark>
      ) : (
        <Button variant="text" onPress={() => setHint(true)}>
          Show hint again
        </Button>
      );
    },
  ],
  carousel: [
    () => (
      <Carousel
        data={SLIDES}
        width={320}
        renderItem={({ item }) => (
          <Surface tone="surface-container" radius="container" style={{ marginEnd: 12, padding: 20, gap: 6, minHeight: 120 }}>
            <Text variant="title-lg">{item.title}</Text>
            <Text color="on-surface-variant">{item.body}</Text>
          </Surface>
        )}
      />
    ),
  ],
  'page-indicator': [() => <PageIndicator count={3} index={1} />],
  'sticky-footer': [
    () => (
      <View style={{ height: 220 }}>
        <StickyFooter footer={<Button size="lg" fullWidth>Continue</Button>}>
          <Text color="on-surface-variant">Content scrolls; the action stays above the keyboard and home indicator.</Text>
        </StickyFooter>
      </View>
    ),
  ],
  fab: [
    // FAB is Android-only by default (D7); the preview shows it on whatever
    // platform renders it, including the docs' web preview.
    () => (
      <View style={{ height: 120 }}>
        <FAB icon={Plus} label="New transfer" extended onPress={() => {}} platforms={[Platform.OS as 'android']} />
      </View>
    ),
  ],
};
