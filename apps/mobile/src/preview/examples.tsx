// One self-contained example per CATALOG title. The catalogue screens and the
// docs previews (/preview/[slug]) both render these, so a demo is written once.
import { useState } from 'react';
import { Platform, View } from 'react-native';
import {
  ArrowRight,
  Bell,
  BookubMark,
  Check,
  Copy,
  CreditCard,
  FounderubMark,
  Globe,
  Heart,
  LeapMark,
  Lock,
  Moon,
  NexubMark,
  PayubMark,
  Plus,
  Search,
  Send,
  Trash2,
  Users,
  Wallet,
} from '@nexub/icons/native';
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
  ApprovalCard,
  DataList,
  DateTimeField,
  DiffReview,
  DiffView,
  ToolCall,
  Dialog,
  Divider,
  EmptyState,
  ErrorState,
  ExpressiveMoneyInput,
  FAB,
  FileList,
  InlineEdit,
  SortableList,
  StepProgress,
  TreeList,
  FilterChip,
  FilterSheet,
  countFilters,
  type FilterGroup,
  Heading,
  Icon,
  IconButton,
  IconChip,
  Inline,
  Link,
  ListItem,
  ListSection,
  LoadingIndicator,
  MoneyInput,
  MultiSelect,
  NumberTicker,
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
  Rating,
  SearchField,
  SegmentedControl,
  Select,
  SensitiveValue,
  Skeleton,
  SkeletonSwap,
  Slider,
  Stack,
  StatCard,
  Stepper,
  StickyFooter,
  Surface,
  SwipeableRow,
  Switch,
  Table,
  Tabs,
  Text,
  TextField,
  Tooltip,
  ComparisonBar,
  Countdown,
  DescriptionList,
  PhoneInput,
  QRCode,
  QRScanner,
  useTheme,
  useToast,
  type SurfaceTone,
  CheckboxField,
  CheckboxGroupField,
  ComboboxField,
  CurrencySelect,
  FileUpload,
  SwitchField,
  usePrompt,
  type PickedFile,
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
    () => {
      const { roles } = useTheme();
      const ink = roles['on-surface'];
      return (
        <Inline gap="4">
          <NexubMark variant="color" size="xl" label="Nexub" />
          <NexubMark size="xl" color={ink} label="Nexub, mono" />
          <LeapMark size="lg" color={ink} label="Leap" />
          <BookubMark size="lg" color={ink} label="Bookub" />
          <PayubMark size="lg" color={ink} label="Payub" />
          <FounderubMark size="lg" color={ink} label="Founderub" />
        </Inline>
      );
    },
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
      <ButtonGroup orientation="vertical">
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
  tooltip: [
    () => (
      <Stack gap="2">
        <Tooltip label="Copy link">
          <IconButton icon={Copy} label="Copy" variant="tonal" />
        </Tooltip>
        <Text variant="body-sm" color="on-surface-variant">
          Touch and hold the button.
        </Text>
      </Stack>
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
  'icon-chip': [
    () => (
      <Inline>
        <IconChip category="blue">
          <Wallet />
        </IconChip>
        <IconChip category="emerald">
          <Users />
        </IconChip>
        <IconChip category="amber">
          <Bell />
        </IconChip>
        <IconChip category="accent">
          <Heart />
        </IconChip>
        <IconChip>
          <Lock />
        </IconChip>
      </Inline>
    ),
    () => (
      <Inline>
        <IconChip category="violet" size="sm">
          <Globe />
        </IconChip>
        <IconChip category="violet">
          <Globe />
        </IconChip>
        <IconChip category="violet" size="lg" shape="circle" accessibilityLabel="Global account">
          <Globe />
        </IconChip>
      </Inline>
    ),
  ],
  'number-ticker': [
    function RollingTotal() {
      const [total, setTotal] = useState(1284);
      return (
        <Stack gap="3">
          <NumberTicker value={total} variant="headline-md" live />
          <Button variant="tonal" size="sm" leadingIcon={Plus} onPress={() => setTotal((t) => t + 137)}>
            Add 137
          </Button>
        </Stack>
      );
    },
  ],
  'stat-card': [
    () => (
      <StatCard
        label="Active members"
        value={2840}
        delta="+12.5%"
        deltaType="increase"
        description="vs last month"
        icon={<Users />}
        category="emerald"
        trend={[12, 14, 13, 17, 19, 18, 24]}
        trendLabel="Last 7 weeks, rising"
      />
    ),
    () => (
      <StatCard
        label="Open invoices"
        value="18"
        delta="-3"
        deltaType="decrease"
        sentiment="positive"
        icon={<CreditCard />}
        category="blue"
        onPress={() => {}}
      />
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
  tabs: [
    () => (
      <Tabs.Root defaultValue="overview">
        <Tabs.List accessibilityLabel="Project">
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
          <Tabs.Trigger value="files">Files</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="overview">
          <Text color="on-surface-variant">Three tasks are due this week.</Text>
        </Tabs.Content>
        <Tabs.Content value="activity">
          <Text color="on-surface-variant">Two comments since yesterday.</Text>
        </Tabs.Content>
        <Tabs.Content value="files">
          <Text color="on-surface-variant">Five files, updated today.</Text>
        </Tabs.Content>
      </Tabs.Root>
    ),
    () => (
      <Tabs.Root defaultValue="mon">
        <Tabs.List variant="pill" size="sm" accessibilityLabel="Day">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <Tabs.Trigger key={day} value={day.toLowerCase()}>
              {day}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </Tabs.Root>
    ),
  ],
  rating: [
    function RatingExample() {
      const [stars, setStars] = useState(3);
      return <Rating value={stars} onValueChange={setStars} />;
    },
    () => <Rating value={4} readOnly size="sm" label="Average rating" />,
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
  'multi-select': [
    function LabelsExample() {
      const [labels, setLabels] = useState(['bug', 'a11y']);
      return (
        <MultiSelect
          label="Labels"
          placeholder="Add labels"
          options={[
            { value: 'bug', label: 'Bug' },
            { value: 'design', label: 'Design' },
            { value: 'docs', label: 'Docs' },
            { value: 'perf', label: 'Performance' },
            { value: 'a11y', label: 'Accessibility' },
          ]}
          value={labels}
          onValueChange={setLabels}
        />
      );
    },
  ],
  'combobox-field': [
    function ComboboxExample() {
      const [city, setCity] = useState<string | null>('sg');
      return (
        <ComboboxField
          label="City"
          options={[
            { value: 'sg', label: 'Singapore' },
            { value: 'kl', label: 'Kuala Lumpur' },
            { value: 'bkk', label: 'Bangkok' },
            { value: 'jkt', label: 'Jakarta' },
            { value: 'mnl', label: 'Manila' },
          ]}
          value={city}
          onValueChange={setCity}
        />
      );
    },
  ],
  'currency-select': [
    function CurrencyExample() {
      const [currency, setCurrency] = useState('SGD');
      return <CurrencySelect label="Currency" value={currency} onValueChange={setCurrency} />;
    },
  ],
  'switch-field': [
    () => <SwitchField label="Round-ups" description="Save the change from every card payment." defaultChecked />,
  ],
  'checkbox-field': [() => <CheckboxField label="I agree to the terms" description="You can withdraw at any time." />],
  'checkbox-group-field': [
    () => (
      <CheckboxGroupField
        label="Notify me about"
        defaultValue={['payments']}
        options={[
          { value: 'payments', label: 'Payments' },
          { value: 'security', label: 'Security alerts' },
          { value: 'offers', label: 'Offers' },
        ]}
      />
    ),
  ],
  'file-upload': [
    function UploadExample() {
      // The preview has no file system: the picker returns a sample file.
      const pickFiles = async (): Promise<PickedFile[]> => [{ name: 'receipt.jpg', size: 182_000, type: 'image/jpeg', uri: 'file:///receipt.jpg' }];
      return <FileUpload accept={['image/*']} multiple maxSize={5_000_000} pickFiles={pickFiles} />;
    },
  ],
  'prompt-dialog': [
    function PromptExample() {
      const [prompt, element] = usePrompt();
      const [reason, setReason] = useState<string | null>(null);
      return (
        <View style={{ gap: 12 }}>
          <Button onPress={async () => setReason(await prompt({ title: 'Reject claim', label: 'Reason' }))}>Reject claim</Button>
          {reason ? <Text>Reason: {reason}</Text> : null}
          {element}
        </View>
      );
    },
  ],
  'filter-sheet': [
    function FilterExample() {
      const [open, setOpen] = useState(false);
      const [query, setQuery] = useState<FilterGroup>({
        id: 'root',
        combinator: 'and',
        rules: [{ id: 'r1', field: 'stage', operator: 'equals', value: 'proposal' }],
      });
      return (
        <View>
          <Button variant="outlined" onPress={() => setOpen(true)}>
            {`Filters (${countFilters(query)})`}
          </Button>
          <FilterSheet
            open={open}
            onOpenChange={setOpen}
            title="Filters"
            value={query}
            onValueChange={setQuery}
            fields={[
              { id: 'name', label: 'Deal name', type: 'text' },
              { id: 'amount', label: 'Amount', type: 'number' },
              {
                id: 'stage',
                label: 'Stage',
                type: 'select',
                options: [
                  { value: 'lead', label: 'Lead' },
                  { value: 'proposal', label: 'Proposal' },
                  { value: 'won', label: 'Won' },
                ],
              },
            ]}
          />
        </View>
      );
    },
  ],
  'date-time-field': [
    function DateExample() {
      const [date, setDate] = useState<Date | null>(null);
      return <DateTimeField label="Transfer date" value={date} onValueChange={setDate} minDate={new Date()} />;
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
  table: [
    () => (
      <Table.Root stickyFirstColumn dividerAfter={1} columns={[120, 88, 88, 88]}>
        <Table.Header>
          <Table.Row>
            <Table.Head>Team</Table.Head>
            <Table.Head numeric>Played</Table.Head>
            <Table.Head numeric>Won</Table.Head>
            <Table.Head numeric>Points</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {[
            ['Rovers', 12, 9, 29],
            ['United', 12, 8, 26],
            ['Athletic', 12, 6, 21],
            ['Wanderers', 12, 4, 15],
          ].map(([team, played, won, points]) => (
            <Table.Row key={team}>
              <Table.Cell>{team}</Table.Cell>
              <Table.Cell numeric>{played}</Table.Cell>
              <Table.Cell numeric>{won}</Table.Cell>
              <Table.Cell numeric>{points}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Caption>The top two go through.</Table.Caption>
      </Table.Root>
    ),
    () => (
      <Table.Root density="compact" striped columns={[160]}>
        <Table.Header>
          <Table.Row>
            <Table.Head>Item</Table.Head>
            <Table.Head numeric>Amount</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Design</Table.Cell>
            <Table.Cell numeric>1,200.00</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Build</Table.Cell>
            <Table.Cell numeric>3,450.00</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Support</Table.Cell>
            <Table.Cell numeric>600.00</Table.Cell>
          </Table.Row>
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.Cell>Total</Table.Cell>
            <Table.Cell numeric>5,250.00</Table.Cell>
          </Table.Row>
        </Table.Footer>
      </Table.Root>
    ),
  ],
  'data-list': [
    function DataListExample() {
      const [selected, setSelected] = useState<string[]>([]);
      return (
        <View style={{ height: 320 }}>
          <DataList
            data={[
              { id: '2041', customer: 'Acme', status: 'Overdue', amount: 1200 },
              { id: '2042', customer: 'Globex', status: 'Paid', amount: 860 },
              { id: '2043', customer: 'Initech', status: 'Draft', amount: 430 },
              { id: '2044', customer: 'Umbrella', status: 'Overdue', amount: 2150 },
            ]}
            keyExtractor={(i) => i.id}
            title={(i) => i.customer}
            subtitle={(i) => `INV-${i.id} · ${i.status}`}
            value={(i) => `${i.amount.toLocaleString('en-US')} USD`}
            sorts={[
              { id: 'amount', label: 'Amount', compare: (a, b) => a.amount - b.amount },
              { id: 'customer', label: 'Customer', compare: (a, b) => a.customer.localeCompare(b.customer) },
            ]}
            defaultSort={{ id: 'amount', desc: true }}
            selectable
            selected={selected}
            onSelectedChange={setSelected}
            bulkActions={(_, clear) => (
              <Button size="sm" variant="tonal" onPress={clear}>
                Remind
              </Button>
            )}
          />
        </View>
      );
    },
  ],
  'file-list': [
    () => (
      <FileList
        files={[
          { id: '1', name: 'passport.pdf', size: 482_000, progress: 100 },
          { id: '2', name: 'payslip-october.pdf', size: 1_240_000, progress: 45 },
          { id: '3', name: 'photo.heic', size: 3_100_000, error: 'Use PDF, PNG or JPG.' },
        ]}
        onAdd={() => {}}
        onRemove={() => {}}
        onCancel={() => {}}
      />
    ),
  ],
  'tree-list': [
    function TeamsExample() {
      const [picked, setPicked] = useState<string | null>('ada');
      return (
        <TreeList
          rootTitle="Teams"
          selected={picked}
          onSelect={setPicked}
          nodes={[
            { id: 'eng', title: 'Engineering', children: [{ id: 'ada', title: 'Ada Lovelace' }, { id: 'alan', title: 'Alan Turing' }] },
            { id: 'design', title: 'Design', children: [{ id: 'grace', title: 'Grace Hopper' }] },
            { id: 'ops', title: 'Operations' },
          ]}
        />
      );
    },
  ],
  'sortable-list': [
    function WidgetsExample() {
      const [items, setItems] = useState(['Revenue', 'Active users', 'Churn']);
      return <SortableList items={items} keyExtractor={(i) => i} title={(i) => i} onReorder={setItems} />;
    },
  ],
  'step-progress': [
    () => (
      <StepProgress
        current={1}
        steps={[
          { id: 'account', label: 'Account' },
          { id: 'billing', label: 'Billing' },
          { id: 'team', label: 'Team' },
          { id: 'review', label: 'Review' },
        ]}
      />
    ),
  ],
  'inline-edit': [
    function RenameExample() {
      const [name, setName] = useState('Q4 launch plan');
      return <InlineEdit label="Project name" value={name} onSave={setName} />;
    },
  ],
  'description-list': [
    () => (
      <DescriptionList.Root divided>
        <DescriptionList.Item label="You send">$250.00</DescriptionList.Item>
        <DescriptionList.Item label="Fee" helpText="Charged once">
          $1.00
        </DescriptionList.Item>
        <DescriptionList.Item label="Total" emphasis>
          $251.00
        </DescriptionList.Item>
      </DescriptionList.Root>
    ),
    () => (
      <DescriptionList.Root layout="stacked" size="sm" columns={2}>
        <DescriptionList.Item label="Reference">NX-4821-XQ</DescriptionList.Item>
        <DescriptionList.Item label="Paid on">31 October 2026</DescriptionList.Item>
      </DescriptionList.Root>
    ),
  ],
  'comparison-bar': [
    () => (
      <Stack gap="4">
        <ComparisonBar label="Orders" left={{ label: 'This week', value: 128 }} right={{ label: 'Last week', value: 96 }} showLabels={false} />
        <ComparisonBar label="Returns" left={{ label: 'This week', value: 4 }} right={{ label: 'Last week', value: 9 }} />
      </Stack>
    ),
  ],
  'qr-code': [
    () => <QRCode value="https://example.com/h/4729" />,
    () => <QRCode value="https://example.com/h/4729" size={200} logo={<Icon icon={Wallet} color="primary" />} caption="example.com/h/4729" />,
  ],
  'qr-scanner': [
    // With no camera module (or no permission) the scanner shows this fallback, which is what a preview can show.
    function ManualEntry() {
      const [code, setCode] = useState('');
      return <QRScanner onScan={setCode} fallback={<TextField label="Code" placeholder="NX-0000" value={code} onChangeText={setCode} autoCapitalize="characters" />} />;
    },
  ],
  'tool-call': [
    () => (
      <View style={{ gap: 12 }}>
        <ToolCall name="search_invoices" status="done" duration={1240} input={{ customer: 'Acme' }} output="3 invoices" />
        <ToolCall name="send_reminders" status="failed" duration={30000} error="The mail server timed out." onRetry={() => {}} />
      </View>
    ),
  ],
  'approval-card': [
    () => (
      <ApprovalCard
        title="Send 3 invoices to Acme"
        args={{ to: 'billing@acme.example', invoices: ['INV-2041', 'INV-2042', 'INV-2044'] }}
        onApprove={() => {}}
        onEdit={() => {}}
        onDeny={() => {}}
      >
        Total 4,210.00 USD, due in 14 days.
      </ApprovalCard>
    ),
  ],
  'diff-view': [
    () => (
      <DiffView
        file="src/fees.ts"
        lineNumbers
        diff={'@@ -12,4 +12,4 @@\n export function fee(amount: number) {\n-  return amount * 0.02;\n+  return Math.max(1, amount * 0.015);\n }'}
      />
    ),
  ],
  'diff-review': [
    () => (
      <DiffReview
        defaultDecisions={{ 'src/fees.ts': 'accepted' }}
        defaultOpen={false}
        files={[
          { file: 'src/fees.ts', diff: '@@ -12,1 +12,1 @@\n-  return amount * 0.02;\n+  return Math.max(1, amount * 0.015);' },
          { file: 'src/limits.ts', diff: '@@ -3,1 +3,2 @@\n const DAILY = 5000;\n+const MONTHLY = 50000;' },
        ]}
      />
    ),
  ],
  'phone-input': [() => <PhoneInput label="Mobile number" defaultCountry="SG" defaultValue="+6581234567" helperText="We’ll text you a code." />],
  countdown: [
    // A fixed clock, so the screenshot never changes: 4 minutes 32 seconds and 8 seconds left.
    () => (
      <Inline>
        <Countdown to={272_000} now={() => 0} />
        <Countdown to={8000} now={() => 0} />
        <Text color="on-surface-variant">
          Code expires in <Countdown variant="inline" to={272_000} now={() => 0} />
        </Text>
      </Inline>
    ),
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
    () => {
      // Starts loaded so the screenshot is stable; Reload shows the swap.
      const [loading, setLoading] = useState(false);
      return (
        <Stack gap="3">
          <SkeletonSwap
            loading={loading}
            skeleton={
              <Stack gap="2">
                <Skeleton width="30%" height={14} />
                <Skeleton width="55%" height={32} />
              </Stack>
            }
          >
            <Stack gap="1">
              <Text variant="label-md" color="on-surface-variant">
                Balance
              </Text>
              <Amount value={2400} currency="SGD" />
            </Stack>
          </SkeletonSwap>
          <Button
            variant="outlined"
            onPress={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 1500);
            }}
          >
            Reload
          </Button>
        </Stack>
      );
    },
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
