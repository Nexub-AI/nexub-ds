'use client';

/**
 * ComponentLivePreview — maps (slug, exampleIndex) to a real rendered
 * component from @nexub/react or @nexub/patterns.
 *
 * 'use client' lets all Radix-based components run with hooks, refs, and events.
 */

import * as React from 'react';

// @nexub/react components used in previews
import {
  Alert,
  AlertDialog,
  Accordion,
  Autocomplete,
  Avatar,
  AvatarGroup,
  Badge,
  Banner,
  Breadcrumb,
  Button,
  ButtonGroup,
  Callout,
  Card,
  Checkbox,
  Chip,
  Code,
  Collapsible,
  Combobox,
  DataTable,
  DatePicker,
  DateRangePicker,
  Dialog,
  Drawer,
  EmptyState,
  ErrorState,
  EyebrowChip,
  Fade,
  FilterChip,
  Flex,
  GradientDivider,
  Grid,
  Heading,
  HelperText,
  HoverCard,
  IconButton,
  Input,
  Kbd,
  Label,
  Link,
  NumberInput,
  Pagination,
  PasswordInput,
  Popover,
  Progress,
  RadioGroup,
  Rating,
  Scale,
  ScrollArea,
  SearchInput,
  SegmentedControl,
  Select,
  Separator,
  Sheet,
  Skeleton,
  Slide,
  Slider,
  Spinner,
  Stack,
  StatusPill,
  Switch,
  Table,
  Tabs,
  Tag,
  Text,
  TextGradient,
  Textarea,
  Toaster,
  Toggle,
  ToggleGroup,
  Tooltip,
  TooltipProvider,
  toast,
  Collapse,
  Box,
  SplitButton,
  DropdownMenu,
  NavigationRail,
  Amount,
  MoneyInput,
  CardLink,
  RadioCardGroup,
  RadioCard,
  CheckboxCard,
  MediaCard,
  NumberTicker,
  FormError,
  type ButtonStatus,
} from '@nexub/react';
import { Bell, Building2, Shield, User, Users, Zap } from '@nexub/icons';

// @nexub/patterns used in previews
import {
  StatCard,
  UserCard,
  AuthCard,
  FilterBar,
  SettingsSection,
  InfoList,
  PlanCard,
  StepIndicator,
  NotificationItem,
  ActivityFeed,
  ListDetail,
  BentoGrid,
  BentoTile,
  ErrorSummary,
  useFormErrors,
  type FormErrorMap,
} from '@nexub/patterns';

/* ── Helpers ──────────────────────────────────────────────────────────────── */

const col = (gap = 12): React.CSSProperties => ({
  display: 'flex',
  flexDirection: 'column',
  gap,
  alignItems: 'flex-start',
});

const row = (gap = 8, wrap = true): React.CSSProperties => ({
  display: 'flex',
  flexDirection: 'row',
  gap,
  flexWrap: wrap ? 'wrap' : 'nowrap',
  alignItems: 'center',
  justifyContent: 'center',
});

// Gradient placeholder image: a data: URI keeps it inside the docs CSP (img-src 'self' data:).
const COVER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs><linearGradient id="g" x2="1" y2="1"><stop offset="0" stop-color="#0e7490"/><stop offset="1" stop-color="#f59e0b"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/></svg>',
  );

/* ── Existing component examples ──────────────────────────────────────────── */

function ButtonExamples({ idx }: { idx: number }) {
  if (idx === 0) return <Button variant="primary">Click me</Button>;
  if (idx === 1)
    return (
      <div style={row(8)}>
        <Button variant="primary">Primary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="subtle">Subtle</Button>
        <Button variant="link">Link</Button>
      </div>
    );
  if (idx === 2)
    return (
      <div style={row(8)}>
        <Button size="xs" variant="primary">XSmall</Button>
        <Button size="sm" variant="primary">Small</Button>
        <Button size="md" variant="primary">Medium</Button>
        <Button size="lg" variant="primary">Large</Button>
      </div>
    );
  if (idx === 3)
    return (
      <div style={row(8)}>
        <Button variant="primary" loading>Loading</Button>
        <Button variant="outline" disabled>Disabled</Button>
      </div>
    );
  if (idx === 4) return <AsyncButtonDemo />;
  return null;
}

const NEXT_STATUS: Record<ButtonStatus, ButtonStatus> = { idle: 'loading', loading: 'success', success: 'error', error: 'idle' };

function AsyncButtonDemo() {
  const [status, setStatus] = React.useState<ButtonStatus>('idle');
  // Clicks are ignored while loading, so loading moves on by itself.
  React.useEffect(() => {
    if (status !== 'loading') return;
    const t = setTimeout(() => setStatus('success'), 1200);
    return () => clearTimeout(t);
  }, [status]);
  return (
    <div style={col(8)}>
      <Button status={status} loadingLabel="Saving" successLabel="Saved" errorLabel="Couldn't save" onClick={() => setStatus(NEXT_STATUS[status])}>
        Save
      </Button>
      <span className="text-body-sm text-[var(--color-on-surface-variant)]">status: {status}</span>
    </div>
  );
}

function BadgeExamples({ idx }: { idx: number }) {
  if (idx === 0)
    return (
      <div style={row(8)}>
        <Badge tone="success">Active</Badge>
        <Badge tone="danger">Error</Badge>
        <Badge tone="warning">Warning</Badge>
        <Badge tone="info">Info</Badge>
        <Badge tone="neutral">Draft</Badge>
      </div>
    );
  if (idx === 1)
    return (
      <div style={row(8)}>
        <Badge variant="solid" tone="success">Solid</Badge>
        <Badge variant="soft" tone="info">Soft</Badge>
        <Badge variant="outline" tone="warning">Outline</Badge>
      </div>
    );
  if (idx === 2)
    return (
      <div style={row(8)}>
        {(['success', 'danger', 'warning'] as const).map((t) => (
          <Badge key={t} tone={t} leadingIcon={<span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />}>
            {t === 'success' ? 'Online' : t === 'danger' ? 'Offline' : 'Away'}
          </Badge>
        ))}
      </div>
    );
  return null;
}

function InputExamples({ idx }: { idx: number }) {
  if (idx === 0) return <div style={{ width: 280 }}><Input placeholder="Enter value…" /></div>;
  if (idx === 1)
    return (
      <div style={{ ...col(8), width: 280 }}>
        <Input size="sm" placeholder="Small" />
        <Input size="md" placeholder="Medium" />
        <Input size="lg" placeholder="Large" />
      </div>
    );
  if (idx === 2) return <div style={{ width: 280 }}><Input invalid placeholder="Invalid value" /></div>;
  if (idx === 3)
    return (
      <div style={{ ...col(4), width: 280 }}>
        <Label htmlFor="demo-email">Email address</Label>
        <Input id="demo-email" type="email" placeholder="you@example.com" />
        <HelperText>We&apos;ll never share your email.</HelperText>
      </div>
    );
  return null;
}

function CardExamples({ idx }: { idx: number }) {
  const [starred, setStarred] = React.useState(false);
  if (idx === 0)
    return (
      <div style={{ width: 280 }}>
        <Card>
          <div style={{ fontWeight: 600, marginBottom: 4, color: 'var(--color-on-surface)' }}>Card title</div>
          <Text size="body-sm" tone="muted">Cards group related content on a raised surface.</Text>
        </Card>
      </div>
    );
  if (idx === 1)
    return (
      <div style={{ ...col(10), width: 280 }}>
        <Card variant="flat"><Text size="body-sm">Flat</Text></Card>
        <Card variant="surface"><Text size="body-sm">Surface</Text></Card>
        <Card variant="interactive"><Text size="body-sm">Interactive</Text></Card>
      </div>
    );
  if (idx === 2)
    return (
      <div style={{ width: 280 }}>
        <Card variant="interactive" style={{ padding: 16 }}>
          <Heading level={3} size="h5">
            <CardLink href="#">Atlas</CardLink>
          </Heading>
          <Text size="body-sm" tone="muted">Updated 2 hours ago</Text>
          <Button size="sm" variant="text" className="relative z-[1]" style={{ marginTop: 8 }} onClick={() => setStarred((v) => !v)}>
            {starred ? 'Starred' : 'Star'}
          </Button>
        </Card>
      </div>
    );
  if (idx === 3)
    return (
      <div style={{ width: 280 }}>
        <Card variant="surface" effect="sheen" style={{ padding: 24 }}>
          <Heading level={3} size="h5">Pro</Heading>
          <Text size="body-sm" tone="muted">Everything in Team, plus audit logs.</Text>
        </Card>
      </div>
    );
  return null;
}

function RadioCardExamples({ idx }: { idx: number }) {
  const [plan, setPlan] = React.useState('team');
  if (idx === 0)
    return (
      <RadioCardGroup aria-label="Plan" columns={3} value={plan} onValueChange={setPlan} style={{ width: '100%' }}>
        <RadioCard value="solo" icon={<User />} title="Solo" description="One seat, core features.">
          <span className="text-sm font-medium">$0 / month</span>
        </RadioCard>
        <RadioCard value="team" icon={<Users />} title="Team" description="Up to 20 seats, shared workspaces.">
          <span className="text-sm font-medium">$12 / seat</span>
        </RadioCard>
        <RadioCard value="enterprise" icon={<Building2 />} title="Enterprise" description="SSO, audit logs, priority support.">
          <span className="text-sm font-medium">Contact sales</span>
        </RadioCard>
      </RadioCardGroup>
    );
  if (idx === 1)
    return (
      <RadioCardGroup aria-label="Billing" columns={2} defaultValue="yearly" style={{ width: '100%' }}>
        <RadioCard value="monthly" title="Monthly" description="Billed every month." />
        <RadioCard value="yearly" title="Yearly" description="Two months free." />
      </RadioCardGroup>
    );
  if (idx === 2)
    return (
      <RadioCardGroup aria-label="Region" columns={2} defaultValue="eu" style={{ width: '100%' }}>
        <RadioCard value="eu" title="Europe" description="Frankfurt" />
        <RadioCard value="us" title="United States" description="Virginia" />
        <RadioCard value="ap" title="Asia Pacific" description="Coming soon" disabled />
      </RadioCardGroup>
    );
  return null;
}

function CheckboxCardExamples({ idx }: { idx: number }) {
  if (idx === 0)
    return (
      <fieldset className="grid gap-3 sm:grid-cols-3" style={{ width: '100%', border: 0, padding: 0, margin: 0 }}>
        <legend className="sr-only">Add-ons</legend>
        <CheckboxCard icon={<Bell />} title="Alerts" description="Email and push notifications." defaultChecked />
        <CheckboxCard icon={<Shield />} title="Audit log" description="Keep a year of activity." />
        <CheckboxCard icon={<Zap />} title="Automations" description="Run rules on new records." />
      </fieldset>
    );
  if (idx === 1)
    return (
      <div style={{ ...col(12), width: 320, alignItems: 'stretch' }}>
        <CheckboxCard title="SSO" description="Available on Enterprise." disabled />
        <CheckboxCard title="Data residency" description="Included in your plan." defaultChecked disabled />
      </div>
    );
  return null;
}

function MediaCardExamples({ idx }: { idx: number }) {
  if (idx === 0)
    return (
      <div style={{ width: 320 }}>
        <MediaCard src={COVER} alt="" eyebrow="Guide" title="A weekend in Lisbon" description="Where to eat, walk and stay." href="#" />
      </div>
    );
  if (idx === 1)
    return (
      <div style={{ width: 320 }}>
        <MediaCard src={COVER} alt="" title="Q3 brand shoot" description="48 photos">
          <Button size="sm" variant="tonal">Open</Button>
          <Button size="sm" variant="text">Share</Button>
        </MediaCard>
      </div>
    );
  if (idx === 2)
    return (
      <div style={{ ...row(12), alignItems: 'flex-start' }}>
        {(['16/9', '4/3', '1/1', '3/4'] as const).map((r) => (
          <div key={r} style={{ width: 160 }}>
            <MediaCard ratio={r} src={COVER} alt="" title={r} />
          </div>
        ))}
      </div>
    );
  return null;
}

function NumberTickerExamples({ idx }: { idx: number }) {
  const [n, setN] = React.useState(12480);
  const [balance, setBalance] = React.useState(128450.75);
  if (idx === 0)
    return (
      <div style={{ ...col(12), alignItems: 'center' }}>
        <NumberTicker value={n} format={{ maximumFractionDigits: 0 }} className="text-title-lg" />
        <Button size="sm" variant="outlined" onClick={() => setN(Math.round(Math.random() * 100000))}>
          Change
        </Button>
      </div>
    );
  if (idx === 1)
    return (
      <div style={{ ...col(12), alignItems: 'center' }}>
        <Amount value={balance} currency="USD" size="display" animate />
        <Button size="sm" variant="outlined" onClick={() => setBalance(Math.round(Math.random() * 20000000) / 100)}>
          Change
        </Button>
      </div>
    );
  return null;
}

function DialogDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>Open Dialog</Button>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content size="sm">
            <Dialog.Title>Confirm action</Dialog.Title>
            <Dialog.Description style={{ marginTop: 8, marginBottom: 24 }}>
              Are you sure you want to continue? This action cannot be undone.
            </Dialog.Description>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <Dialog.Close asChild><Button variant="outline">Cancel</Button></Dialog.Close>
              <Button variant="primary" onClick={() => setOpen(false)}>Confirm</Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

function DialogExamples({ idx }: { idx: number }) {
  if (idx === 0) return <DialogDemo />;
  return null;
}

function TooltipExamples({ idx }: { idx: number }) {
  if (idx === 0 || idx === 1)
    return (
      <TooltipProvider>
        <Tooltip label="This is a tooltip" side="top">
          <Button variant="outline">Hover me</Button>
        </Tooltip>
      </TooltipProvider>
    );
  return null;
}

function SelectExamples({ idx }: { idx: number }) {
  if (idx === 0)
    return (
      <div style={{ width: 220 }}>
        <Select.Root>
          <Select.Trigger><Select.Value placeholder="Select an option…" /></Select.Trigger>
          <Select.Content>
            <Select.Item value="option-1">Option 1</Select.Item>
            <Select.Item value="option-2">Option 2</Select.Item>
            <Select.Item value="option-3">Option 3</Select.Item>
          </Select.Content>
        </Select.Root>
      </div>
    );
  return null;
}

function TabsExamples({ idx }: { idx: number }) {
  if (idx === 0)
    return (
      <div style={{ width: 320 }}>
        <Tabs.Root defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Overview</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Analytics</Tabs.Trigger>
            <Tabs.Trigger value="tab3">Settings</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">
            <div style={{ padding: '12px 0', color: 'var(--color-on-surface-variant)', fontSize: '0.875rem' }}>Overview content goes here.</div>
          </Tabs.Content>
          <Tabs.Content value="tab2">
            <div style={{ padding: '12px 0', color: 'var(--color-on-surface-variant)', fontSize: '0.875rem' }}>Analytics content goes here.</div>
          </Tabs.Content>
          <Tabs.Content value="tab3">
            <div style={{ padding: '12px 0', color: 'var(--color-on-surface-variant)', fontSize: '0.875rem' }}>Settings content goes here.</div>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    );
  return null;
}

function SwitchExamples({ idx }: { idx: number }) {
  if (idx === 0) return <div style={row(16)}><Switch defaultChecked /><Switch /></div>;
  if (idx === 1) return <div style={row(16)}><Switch size="sm" defaultChecked /><Switch size="md" defaultChecked /><Switch size="lg" defaultChecked /></div>;
  return null;
}

function SpinnerExamples({ idx }: { idx: number }) {
  if (idx === 0)
    return <div style={row(20)}><Spinner size="sm" /><Spinner size="md" /><Spinner size="lg" /><Spinner size="xl" /></div>;
  if (idx === 1)
    return (
      <div style={row(20)}>
        <Spinner size="md" tone="info" />
        <Spinner size="md" tone="success" />
        <Spinner size="md" tone="warning" />
        <Spinner size="md" tone="danger" />
      </div>
    );
  return null;
}

/* ── New component examples ───────────────────────────────────────────────── */

function ButtonGroupExamples({ idx }: { idx: number }) {
  if (idx === 0)
    return (
      <ButtonGroup>
        <Button variant="primary">Save</Button>
        <Button variant="outline">Cancel</Button>
      </ButtonGroup>
    );
  if (idx === 1)
    return (
      <ButtonGroup attached>
        <Button variant="outline">Left</Button>
        <Button variant="outline">Center</Button>
        <Button variant="outline">Right</Button>
      </ButtonGroup>
    );
  if (idx === 2)
    return (
      <ButtonGroup orientation="vertical">
        <Button variant="outline">Option A</Button>
        <Button variant="outline">Option B</Button>
        <Button variant="outline">Option C</Button>
      </ButtonGroup>
    );
  return null;
}

function SplitButtonExamples({ idx }: { idx: number }) {
  if (idx === 0)
    return (
      <SplitButton
        menuLabel="More save options"
        menu={
          <>
            <DropdownMenu.Item>Save as draft</DropdownMenu.Item>
            <DropdownMenu.Item>Save a copy</DropdownMenu.Item>
          </>
        }
      >
        Save
      </SplitButton>
    );
  if (idx === 1)
    return (
      <SplitButton variant="outlined" menuLabel="More export options" menu={<DropdownMenu.Item>CSV</DropdownMenu.Item>}>
        Export
      </SplitButton>
    );
  return null;
}

function NavigationRailExamples({ idx }: { idx: number }) {
  const glyph = (d: string) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
  );
  if (idx === 0)
    return (
      <NavigationRail.Root aria-label="Workspace" style={{ height: 'auto', background: 'var(--color-surface-container-low)', borderRadius: 24 }}>
        <NavigationRail.Item href="#" icon={glyph('M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z')} label="Home" active />
        <NavigationRail.Item href="#" icon={glyph('M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z')} label="Files" />
        <NavigationRail.Item href="#" icon={glyph('M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z')} label="Settings" />
      </NavigationRail.Root>
    );
  return null;
}

function AmountExamples({ idx }: { idx: number }) {
  if (idx === 0) return <Amount value={128450.75} currency="USD" size="display" />;
  if (idx === 1)
    return (
      <div style={{ display: 'flex', gap: 16 }}>
        <Amount value={312.4} currency="USD" tone="auto" signDisplay="exceptZero" />
        <Amount value={-89.99} currency="USD" tone="auto" />
      </div>
    );
  return null;
}

function MoneyInputExamples({ idx }: { idx: number }) {
  if (idx === 0) return <MoneyInput aria-label="Amount to send" currency="USD" defaultValue={1250} />;
  if (idx === 1) return <MoneyInput aria-label="Betrag" currency="EUR" locale="de-DE" defaultValue={1234.5} />;
  return null;
}

function ListDetailExamples({ idx }: { idx: number }) {
  const [selected, setSelected] = React.useState<number | null>(0);
  const items = ['Quarterly report', 'Design review', 'Invoice #4821'];
  if (idx === 0)
    return (
      <div style={{ width: '100%', height: 240, border: '1px solid var(--color-outline-variant)', borderRadius: 16, overflow: 'hidden' }}>
        <ListDetail
          showDetail={selected !== null}
          onBack={() => setSelected(null)}
          list={
            <ul style={{ padding: 8, margin: 0, listStyle: 'none' }}>
              {items.map((m, i) => (
                <li key={m}>
                  <button type="button" onClick={() => setSelected(i)} className="nx-state-layer relative w-full rounded-shape-container px-3 py-2 text-left text-body-sm">
                    {m}
                  </button>
                </li>
              ))}
            </ul>
          }
          detail={<div style={{ padding: 20 }} className="text-title-md">{selected === null ? 'Nothing selected' : items[selected]}</div>}
        />
      </div>
    );
  return null;
}

function IconButtonExamples({ idx }: { idx: number }) {
  const icon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>;
  if (idx === 0) return <IconButton variant="ghost" label="Add item">{icon}</IconButton>;
  if (idx === 1)
    return (
      <div style={row(8)}>
        <IconButton variant="ghost" label="Ghost">{icon}</IconButton>
        <IconButton variant="solid" label="Solid">{icon}</IconButton>
        <IconButton variant="outline" label="Outline">{icon}</IconButton>
        <IconButton variant="subtle" label="Subtle">{icon}</IconButton>
      </div>
    );
  return null;
}

function TextareaExamples({ idx }: { idx: number }) {
  if (idx === 0) return <div style={{ width: 280 }}><Textarea placeholder="Enter your message…" /></div>;
  if (idx === 1)
    return (
      <div style={{ ...col(8), width: 280 }}>
        <Textarea size="sm" placeholder="Small" rows={2} />
        <Textarea size="md" placeholder="Medium" rows={3} />
        <Textarea size="lg" placeholder="Large" rows={4} />
      </div>
    );
  if (idx === 2) return <div style={{ width: 280 }}><Textarea invalid placeholder="This field has an error" /></div>;
  return null;
}

function NumberInputExamples({ idx }: { idx: number }) {
  if (idx === 0) return <div style={{ width: 180 }}><NumberInput defaultValue={0} /></div>;
  if (idx === 1) return <div style={{ width: 180 }}><NumberInput defaultValue={5} min={0} max={10} /></div>;
  return null;
}

function SearchInputExamples({ idx }: { idx: number }) {
  if (idx === 0) return <div style={{ width: 280 }}><SearchInput placeholder="Search…" /></div>;
  return null;
}

function PasswordInputExamples({ idx }: { idx: number }) {
  if (idx === 0) return <div style={{ width: 280 }}><PasswordInput placeholder="Enter password…" /></div>;
  if (idx === 1) return <div style={{ width: 280 }}><PasswordInput invalid placeholder="Password is too short" /></div>;
  return null;
}

function LabelExamples({ idx }: { idx: number }) {
  if (idx === 0) return <Label htmlFor="demo">Full name</Label>;
  if (idx === 1) return <Label required>Email address</Label>;
  if (idx === 2)
    return (
      <div style={{ ...col(4), width: 280 }}>
        <Label htmlFor="email-ex">Email</Label>
        <Input id="email-ex" type="email" placeholder="you@example.com" />
      </div>
    );
  return null;
}

function HelperTextExamples({ idx }: { idx: number }) {
  if (idx === 0) return <HelperText>We will never share your email with anyone else.</HelperText>;
  if (idx === 1)
    return (
      <div style={col(6)}>
        <HelperText tone="info">Sync runs every 10 minutes.</HelperText>
        <HelperText tone="success">Your account is verified.</HelperText>
        <HelperText tone="warning">This action cannot be reversed.</HelperText>
        <HelperText tone="danger">Required field is missing.</HelperText>
      </div>
    );
  return null;
}

function FormFieldExamples({ idx }: { idx: number }) {
  if (idx === 0)
    return (
      <div style={{ ...col(4), width: 280 }}>
        <Label htmlFor="field-name" required>Full name</Label>
        <Input id="field-name" placeholder="Jane Smith" />
        <HelperText>Enter your legal name.</HelperText>
      </div>
    );
  return null;
}

function StatusPillExamples({ idx }: { idx: number }) {
  if (idx === 0)
    return (
      <div style={row(8)}>
        <StatusPill tone="success" label="Active" />
        <StatusPill tone="warning" label="Pending" />
        <StatusPill tone="danger" label="Error" />
        <StatusPill tone="neutral" label="Draft" />
        <StatusPill tone="info" label="Syncing" />
      </div>
    );
  if (idx === 1) return <StatusPill tone="success" dot label="Live" />;
  return null;
}

function FilterChipExamples({ idx }: { idx: number }) {
  if (idx === 0)
    return (
      <div style={row(8)}>
        <FilterChip>All</FilterChip>
        <FilterChip selected>Active</FilterChip>
        <FilterChip>Archived</FilterChip>
        <FilterChip>Draft</FilterChip>
      </div>
    );
  return null;
}

function ChipExamples({ idx }: { idx: number }) {
  const [chips, setChips] = React.useState(['Design', 'Engineering', 'Product']);
  if (idx === 0)
    return (
      <div style={row(8)}>
        {chips.map((c) => <Chip key={c}>{c}</Chip>)}
      </div>
    );
  if (idx === 1)
    return (
      <div style={row(8)}>
        {chips.map((c) => (
          <Chip key={c} onRemove={() => setChips((prev) => prev.filter((x) => x !== c))}>{c}</Chip>
        ))}
      </div>
    );
  return null;
}

function TagExamples({ idx }: { idx: number }) {
  if (idx === 0)
    return (
      <div style={row(8)}>
        <Tag>Frontend</Tag>
        <Tag tone="info">Backend</Tag>
        <Tag tone="success">Deployed</Tag>
        <Tag tone="warning">Review</Tag>
        <Tag tone="danger">Blocked</Tag>
      </div>
    );
  return null;
}

function EyebrowChipExamples({ idx }: { idx: number }) {
  if (idx === 0) return <EyebrowChip>New release</EyebrowChip>;
  if (idx === 1)
    return (
      <div style={col(8)}>
        <EyebrowChip>Now available</EyebrowChip>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-on-surface)' }}>Version 2.0</h2>
      </div>
    );
  return null;
}

function AvatarExamples({ idx }: { idx: number }) {
  if (idx === 0) return <Avatar name="Alex Johnson" />;
  if (idx === 1)
    return (
      <div style={row(12)}>
        {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) => (
          <Avatar key={s} name="Alex J" size={s} />
        ))}
      </div>
    );
  if (idx === 2) return <Avatar src="https://i.pravatar.cc/150?img=3" name="Alex Johnson" />;
  if (idx === 3)
    return (
      <div style={row(12)}>
        <Avatar name="Online" badge badgeColor="var(--color-success)" />
        <Avatar name="Away" badge badgeColor="var(--color-warning)" />
      </div>
    );
  return null;
}

function AvatarGroupExamples({ idx }: { idx: number }) {
  if (idx === 0)
    return (
      <AvatarGroup max={3}>
        <Avatar name="Alice B" />
        <Avatar name="Bob C" />
        <Avatar name="Carol D" />
        <Avatar name="Dave E" />
        <Avatar name="Eve F" />
      </AvatarGroup>
    );
  return null;
}

function AlertExamples({ idx }: { idx: number }) {
  if (idx === 0) return <Alert tone="info" title="Heads up">Your trial expires in 3 days.</Alert>;
  if (idx === 1)
    return (
      <div style={{ ...col(8), width: '100%', maxWidth: 480 }}>
        <Alert tone="info" title="Info">Informational message.</Alert>
        <Alert tone="success" title="Success">Operation completed successfully.</Alert>
        <Alert tone="warning" title="Warning">Something needs your attention.</Alert>
        <Alert tone="danger" title="Error">Something went wrong.</Alert>
      </div>
    );
  if (idx === 2)
    return (
      <div style={{ width: '100%', maxWidth: 480 }}>
        <Alert tone="success" title="Saved" onClose={() => {}}>Your changes have been saved.</Alert>
      </div>
    );
  return null;
}

function BannerExamples({ idx }: { idx: number }) {
  if (idx === 0) return <Banner tone="info">New features available — <strong>see what&apos;s new</strong></Banner>;
  if (idx === 1)
    return (
      <Banner
        tone="warning"
        action={<Button variant="outline" size="sm">Review now</Button>}
        onClose={() => {}}
      >
        Your payment method is expiring soon.
      </Banner>
    );
  return null;
}

function CalloutExamples({ idx }: { idx: number }) {
  if (idx === 0) return <Callout tone="warning" title="Before you continue">Deleting this record is permanent and cannot be undone.</Callout>;
  if (idx === 1) return <Callout tone="info">Use token names instead of raw hex values for consistent theming.</Callout>;
  return null;
}

function ToastExamples({ idx }: { idx: number }) {
  return (
    <>
      <Toaster />
      <div style={row(8)}>
        {idx === 0 && (
          <Button variant="outline" onClick={() => toast.custom('Changes saved', { description: 'Your profile has been updated.' })}>
            Show toast
          </Button>
        )}
        {idx === 1 && (
          <div style={row(8)}>
            <Button variant="outline" size="sm" onClick={() => toast.success('Saved successfully!')}>Success</Button>
            <Button variant="outline" size="sm" onClick={() => toast.error('Something went wrong.')}>Error</Button>
            <Button variant="outline" size="sm" onClick={() => toast.warning('Review required.')}>Warning</Button>
            <Button variant="outline" size="sm" onClick={() => toast.info('New update available.')}>Info</Button>
          </div>
        )}
        {idx === 2 && (
          <Button
            variant="outline"
            onClick={() =>
              toast.custom('File deleted', {
                description: 'The file was moved to trash.',
                action: { label: 'Undo', onClick: () => {} },
              })
            }
          >
            Delete with undo
          </Button>
        )}
        {idx === 3 && <UndoableDeleteDemo />}
      </div>
    </>
  );
}

function UndoableDeleteDemo() {
  const [hidden, setHidden] = React.useState(false);
  const remove = () => {
    setHidden(true);
    toast.undoable('Invoice deleted', {
      description: 'INV-2041',
      onUndo: () => setHidden(false),
      onCommit: () => {},
    });
  };
  return hidden ? (
    <Button variant="text" onClick={() => setHidden(false)}>Restore demo</Button>
  ) : (
    <Button variant="outline" tone="danger" onClick={remove}>Delete INV-2041</Button>
  );
}

function SkeletonExamples({ idx }: { idx: number }) {
  if (idx === 0)
    return (
      <div style={{ ...col(8), width: 280 }}>
        <Skeleton shape="line" width="60%" />
        <Skeleton shape="line" width="100%" />
        <Skeleton shape="line" width="80%" />
        <div style={row(8, false)}>
          <Skeleton shape="circle" width={40} height={40} />
          <div style={{ ...col(6), flex: 1 }}>
            <Skeleton shape="line" width="70%" />
            <Skeleton shape="line" width="50%" />
          </div>
        </div>
      </div>
    );
  if (idx === 1)
    return (
      <div style={row(16)}>
        <Skeleton shape="line" width={80} />
        <Skeleton shape="rect" width={80} height={40} />
        <Skeleton shape="circle" width={40} height={40} />
      </div>
    );
  return null;
}

function ProgressExamples({ idx }: { idx: number }) {
  if (idx === 0) return <div style={{ width: 280 }}><Progress value={65} /></div>;
  if (idx === 1)
    return (
      <div style={{ ...col(10), width: 280 }}>
        <Progress value={80} tone="success" />
        <Progress value={55} tone="info" />
        <Progress value={30} tone="warning" />
        <Progress value={20} tone="danger" />
      </div>
    );
  if (idx === 2) return <div style={{ width: 280 }}><Progress value={40} animated tone="info" /></div>;
  return null;
}

function SeparatorExamples({ idx }: { idx: number }) {
  if (idx === 0) return <div style={{ width: 280 }}><Separator /></div>;
  if (idx === 1)
    return (
      <div style={{ display: 'flex', height: 32, alignItems: 'center', gap: 16 }}>
        <span style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.875rem' }}>Left</span>
        <Separator orientation="vertical" />
        <span style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.875rem' }}>Right</span>
      </div>
    );
  return null;
}

function GradientDividerExamples({ idx }: { idx: number }) {
  if (idx === 0) return <div style={{ width: 280 }}><GradientDivider /></div>;
  return null;
}

function RatingExamples({ idx }: { idx: number }) {
  const [val, setVal] = React.useState(3);
  if (idx === 0) return <Rating value={val} onValueChange={setVal} />;
  if (idx === 1) return <Rating value={4} readOnly />;
  if (idx === 2)
    return (
      <div style={col(8)}>
        <Rating size="sm" value={4} readOnly />
        <Rating size="md" value={4} readOnly />
        <Rating size="lg" value={4} readOnly />
      </div>
    );
  return null;
}

function SliderExamples({ idx }: { idx: number }) {
  if (idx === 0) return <div style={{ width: 240 }}><Slider defaultValue={[50]} min={0} max={100} /></div>;
  if (idx === 1) return <div style={{ width: 240 }}><Slider defaultValue={[20, 80]} min={0} max={100} /></div>;
  return null;
}

function ToggleExamples({ idx }: { idx: number }) {
  if (idx === 0) return <Toggle>Bold</Toggle>;
  if (idx === 1)
    return (
      <div style={row(8)}>
        <Toggle variant="outline">Italic</Toggle>
        <Toggle variant="outline" defaultPressed>Bold</Toggle>
      </div>
    );
  return null;
}

function ToggleGroupExamples({ idx }: { idx: number }) {
  if (idx === 0)
    return (
      <ToggleGroup.Root type="single" defaultValue="left">
        <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
        <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
        <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
      </ToggleGroup.Root>
    );
  if (idx === 1)
    return (
      <ToggleGroup.Root type="multiple" defaultValue={['bold', 'italic']}>
        <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
        <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
        <ToggleGroup.Item value="underline">Underline</ToggleGroup.Item>
      </ToggleGroup.Root>
    );
  return null;
}

function SegmentedControlExamples({ idx }: { idx: number }) {
  if (idx === 0)
    return (
      <SegmentedControl.Root defaultValue="month">
        <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
        <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
        <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
      </SegmentedControl.Root>
    );
  if (idx === 1)
    return (
      <div style={col(12)}>
        {(['sm', 'md', 'lg'] as const).map((s) => (
          <SegmentedControl.Root key={s} size={s} defaultValue="a">
            <SegmentedControl.Item value="a">A</SegmentedControl.Item>
            <SegmentedControl.Item value="b">B</SegmentedControl.Item>
            <SegmentedControl.Item value="c">C</SegmentedControl.Item>
          </SegmentedControl.Root>
        ))}
      </div>
    );
  return null;
}

function HeadingExamples({ idx }: { idx: number }) {
  if (idx === 0) return <Heading>The quick brown fox</Heading>;
  if (idx === 1)
    return (
      <div style={col(8)}>
        <Heading size="h1">Heading 1</Heading>
        <Heading size="h2">Heading 2</Heading>
        <Heading size="h3">Heading 3</Heading>
        <Heading size="h4">Heading 4</Heading>
        <Heading size="h5">Heading 5</Heading>
      </div>
    );
  if (idx === 2)
    return (
      <div style={col(8)}>
        <Heading tone="info">Info tone</Heading>
        <Heading tone="success">Success tone</Heading>
        <Heading tone="warning">Warning tone</Heading>
        <Heading tone="danger">Danger tone</Heading>
      </div>
    );
  return null;
}

function TextExamples({ idx }: { idx: number }) {
  if (idx === 0) return <Text>The Nexub design system provides accessible, token-driven components.</Text>;
  if (idx === 1)
    return (
      <div style={col(6)}>
        <Text size="body-lg">Body Large — spacious reading.</Text>
        <Text size="body">Body — default paragraph.</Text>
        <Text size="body-sm">Body Small — compact content.</Text>
        <Text size="caption">Caption — supporting info.</Text>
      </div>
    );
  if (idx === 2)
    return (
      <div style={col(6)}>
        <Text tone="default">Default</Text>
        <Text tone="secondary">Secondary</Text>
        <Text tone="muted">Muted</Text>
        <Text tone="subtle">Subtle</Text>
      </div>
    );
  return null;
}

function CodeInlineExamples({ idx }: { idx: number }) {
  if (idx === 0)
    return (
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Code>npm install</Code>
        <Code>useTheme()</Code>
        <Code>@nexub/react</Code>
      </div>
    );
  if (idx === 1)
    return (
      <Text>
        Use the <Code>useTheme()</Code> hook to access the current theme from any component.
      </Text>
    );
  return null;
}

function KbdExamples({ idx }: { idx: number }) {
  if (idx === 0)
    return (
      <div style={row(4)}>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </div>
    );
  if (idx === 1)
    return (
      <div style={col(8)}>
        <div style={row(4)}><Kbd>⌘</Kbd><Kbd>K</Kbd><Text size="body-sm" tone="secondary">— Open search</Text></div>
        <div style={row(4)}><Kbd>⌃</Kbd><Kbd>C</Kbd><Text size="body-sm" tone="secondary">— Copy</Text></div>
        <div style={row(4)}><Kbd>⇧</Kbd><Kbd>⌘</Kbd><Kbd>P</Kbd><Text size="body-sm" tone="secondary">— Command palette</Text></div>
      </div>
    );
  return null;
}

function LinkExamples({ idx }: { idx: number }) {
  if (idx === 0) return <Link href="#">View documentation</Link>;
  if (idx === 1)
    return (
      <div style={row(16)}>
        <Link href="#" variant="default">Default</Link>
        <Link href="#" variant="muted">Muted</Link>
        <Link href="#" variant="underlined">Underline</Link>
      </div>
    );
  if (idx === 2) return <Link href="#" external>Open in new tab</Link>;
  return null;
}

function TextGradientExamples({ idx }: { idx: number }) {
  if (idx === 0) return <TextGradient style={{ fontSize: '1.5rem', fontWeight: 700 }}>Design system for ambitious teams</TextGradient>;
  if (idx === 1)
    return (
      <Heading size="h2">
        <TextGradient>Build faster, ship consistently</TextGradient>
      </Heading>
    );
  return null;
}

function StackExamples({ idx }: { idx: number }) {
  if (idx === 0)
    return (
      <Stack gap="md">
        <Button variant="outline">Item 1</Button>
        <Button variant="outline">Item 2</Button>
        <Button variant="outline">Item 3</Button>
      </Stack>
    );
  if (idx === 1)
    return (
      <Stack gap="md" divider={<Separator />} style={{ width: 220 }}>
        <Text size="body-sm">First item</Text>
        <Text size="body-sm">Second item</Text>
        <Text size="body-sm">Third item</Text>
      </Stack>
    );
  return null;
}

function FlexExamples({ idx }: { idx: number }) {
  if (idx === 0)
    return (
      <Flex gap="md" align="center">
        <Button variant="primary">Action</Button>
        <Button variant="outline">Cancel</Button>
      </Flex>
    );
  if (idx === 1)
    return (
      <Flex justify="between" style={{ width: '100%', maxWidth: 320 }}>
        <Badge tone="success">Active</Badge>
        <Badge tone="neutral">Draft</Badge>
      </Flex>
    );
  if (idx === 2)
    return (
      <Flex gap="sm" wrap style={{ maxWidth: 260 }}>
        {['React', 'TypeScript', 'Tailwind', 'Radix UI', 'Storybook'].map((t) => (
          <Badge key={t} tone="info">{t}</Badge>
        ))}
      </Flex>
    );
  return null;
}

function GridExamples({ idx }: { idx: number }) {
  if (idx === 0)
    return (
      <Grid cols={2} gap="md" style={{ width: '100%', maxWidth: 400 }}>
        {[1, 2, 3, 4].map((n) => (
          <Card key={n}><Text size="body-sm" tone="muted">Card {n}</Text></Card>
        ))}
      </Grid>
    );
  if (idx === 1)
    return (
      <Grid cols={3} gap="sm" style={{ width: '100%', maxWidth: 480 }}>
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <Card key={n}><Text size="caption" tone="muted">Item {n}</Text></Card>
        ))}
      </Grid>
    );
  return null;
}

function BoxExamples({ idx }: { idx: number }) {
  if (idx === 0)
    return (
      <Box style={{ padding: 'var(--spacing-4)', background: 'var(--color-surface-container-low)', borderRadius: 'var(--shape-field)' }}>
        <Text size="body-sm">Content inside a Box</Text>
      </Box>
    );
  if (idx === 1)
    return (
      <Box style={{ padding: 'var(--spacing-6)', background: 'var(--color-surface-container-low)', borderRadius: 'var(--shape-container)' }}>
        <Heading size="h4">Section title</Heading>
        <Box style={{ padding: 'var(--spacing-3)', background: 'var(--color-surface)', borderRadius: 'var(--shape-field)', marginTop: 8 }}>
          <Text size="body-sm">Nested box content</Text>
        </Box>
      </Box>
    );
  return null;
}

function AccordionExamples({ idx }: { idx: number }) {
  if (idx === 0)
    return (
      <div style={{ width: '100%', maxWidth: 480 }}>
        <Accordion.Root type="single" collapsible>
          <Accordion.Item value="a">
            <Accordion.Trigger>What is Nexub?</Accordion.Trigger>
            <Accordion.Content>A design system for ambitious SaaS teams, built on tokens and accessibility.</Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="b">
            <Accordion.Trigger>How do I install?</Accordion.Trigger>
            <Accordion.Content>Run: <Code>pnpm add @nexub/react</Code></Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="c">
            <Accordion.Trigger>Is it open source?</Accordion.Trigger>
            <Accordion.Content>Yes — MIT licensed and free to use.</Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </div>
    );
  if (idx === 1)
    return (
      <div style={{ width: '100%', maxWidth: 480 }}>
        <Accordion.Root type="multiple">
          <Accordion.Item value="x">
            <Accordion.Trigger>Section A</Accordion.Trigger>
            <Accordion.Content>Content for section A — stays open when B is opened.</Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="y">
            <Accordion.Trigger>Section B</Accordion.Trigger>
            <Accordion.Content>Content for section B — multiple can be open at once.</Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </div>
    );
  return null;
}

function CollapsibleExamples({ idx }: { idx: number }) {
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  if (idx === 0)
    return (
      <Collapsible.Root open={open} onOpenChange={setOpen}>
        <Collapsible.Trigger asChild>
          <Button variant="outline">{open ? 'Hide details' : 'Show details'}</Button>
        </Collapsible.Trigger>
        <Collapsible.Content>
          <div style={{ paddingTop: 12, color: 'var(--color-on-surface-variant)', fontSize: '0.875rem' }}>
            Hidden content revealed on toggle. This section can hold any content.
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    );
  if (idx === 1)
    return (
      <Collapsible.Root open={open2} onOpenChange={setOpen2}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 500, color: 'var(--color-on-surface)', fontSize: '0.875rem' }}>Advanced settings</span>
          <Collapsible.Trigger asChild>
            <Button variant="ghost" size="sm">{open2 ? 'Collapse' : 'Expand'}</Button>
          </Collapsible.Trigger>
        </div>
        <Collapsible.Content>
          <div style={{ paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { id: 'notif', label: 'Enable notifications' },
              { id: 'autosave', label: 'Auto-save drafts' },
              { id: 'tooltips', label: 'Show tooltips' },
            ].map(({ id, label }) => (
              <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Switch id={id} />
                <Label htmlFor={id}>{label}</Label>
              </div>
            ))}
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    );
  return null;
}

function ScrollAreaExamples({ idx }: { idx: number }) {
  if (idx === 0)
    return (
      <ScrollArea style={{ height: 200, width: 280, border: '1px solid var(--color-outline-variant)', borderRadius: 'var(--shape-field)', padding: 12 }}>
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} style={{ padding: '4px 0', fontSize: '0.875rem', color: 'var(--color-on-surface-variant)' }}>
            List item {i + 1}
          </div>
        ))}
      </ScrollArea>
    );
  if (idx === 1)
    return (
      <ScrollArea orientation="horizontal" style={{ width: 320, border: '1px solid var(--color-outline-variant)', borderRadius: 'var(--shape-field)', padding: 12 }}>
        <div style={{ display: 'flex', gap: 8, width: 'max-content' }}>
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              style={{
                width: 80,
                height: 80,
                background: 'var(--color-surface-container-low)',
                borderRadius: 'var(--shape-tooltip)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                color: 'var(--color-on-surface-variant)',
                flexShrink: 0,
              }}
            >
              Card {i + 1}
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  return null;
}

function CheckboxExamples({ idx }: { idx: number }) {
  if (idx === 0) return <Checkbox defaultChecked />;
  if (idx === 1)
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Checkbox id="terms" />
        <Label htmlFor="terms">I agree to the terms and conditions</Label>
      </div>
    );
  if (idx === 2)
    return (
      <div style={col(12)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Checkbox defaultChecked /><Label>Checked</Label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Checkbox /><Label>Unchecked</Label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Checkbox disabled /><Label>Disabled</Label>
        </div>
      </div>
    );
  return null;
}

function RadioGroupExamples({ idx }: { idx: number }) {
  if (idx === 0)
    return (
      <RadioGroup.Root defaultValue="monthly">
        <div style={col(8)}>
          {['Monthly', 'Yearly', 'Lifetime'].map((opt) => (
            <div key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <RadioGroup.Item value={opt.toLowerCase()} id={`rg-${opt}`} />
              <Label htmlFor={`rg-${opt}`}>{opt}</Label>
            </div>
          ))}
        </div>
      </RadioGroup.Root>
    );
  if (idx === 1)
    return (
      <RadioGroup.Root defaultValue="monthly" orientation="horizontal">
        <div style={{ display: 'flex', gap: 16 }}>
          {[{ value: 'monthly', label: 'Monthly' }, { value: 'annual', label: 'Annual' }].map(({ value, label }) => (
            <div key={value} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <RadioGroup.Item value={value} id={`rgh-${value}`} />
              <Label htmlFor={`rgh-${value}`}>{label}</Label>
            </div>
          ))}
        </div>
      </RadioGroup.Root>
    );
  return null;
}

function ComboboxExamples({ idx }: { idx: number }) {
  if (idx === 0)
    return (
      <Combobox.Root style={{ width: 260 }}>
        <Combobox.Input placeholder="Search…" />
        <Combobox.List>
          <Combobox.Empty>No results found.</Combobox.Empty>
          <Combobox.Group heading="Frameworks">
            <Combobox.Item value="react">React</Combobox.Item>
            <Combobox.Item value="vue">Vue</Combobox.Item>
            <Combobox.Item value="angular">Angular</Combobox.Item>
            <Combobox.Item value="svelte">Svelte</Combobox.Item>
          </Combobox.Group>
        </Combobox.List>
      </Combobox.Root>
    );
  return null;
}

function AutocompleteExamples({ idx }: { idx: number }) {
  if (idx === 0)
    return (
      <div style={{ width: 260 }}>
        <Autocomplete
          options={[
            { value: 'react', label: 'React' },
            { value: 'vue', label: 'Vue' },
            { value: 'angular', label: 'Angular' },
            { value: 'svelte', label: 'Svelte' },
          ]}
          placeholder="Search framework…"
        />
      </div>
    );
  if (idx === 1)
    return (
      <div style={{ width: 260 }}>
        <Autocomplete options={[]} loading placeholder="Loading options…" />
      </div>
    );
  if (idx === 2)
    return (
      <div style={{ width: 260 }}>
        <Autocomplete
          options={[
            { value: 'nexub', label: 'Nexub' },
            { value: 'acme', label: 'Acme Corp' },
          ]}
          placeholder="Search company…"
          emptyText="No companies found. Try a different search."
        />
      </div>
    );
  return null;
}

function AlertDialogDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>Delete account</Button>
      <AlertDialog.Root open={open} onOpenChange={setOpen}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay />
          <AlertDialog.Content>
            <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
            <AlertDialog.Description>
              This action cannot be undone. This will permanently delete your account and remove all your data.
            </AlertDialog.Description>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 24 }}>
              <AlertDialog.Cancel asChild><Button variant="outline">Cancel</Button></AlertDialog.Cancel>
              <AlertDialog.Action asChild><Button variant="destructive">Yes, delete</Button></AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </>
  );
}

function AlertDialogExamples({ idx }: { idx: number }) {
  if (idx === 0) return <AlertDialogDemo />;
  return null;
}

function PopoverExamples({ idx }: { idx: number }) {
  if (idx === 0)
    return (
      <Popover.Root>
        <Popover.Trigger asChild>
          <Button variant="outline">Open popover</Button>
        </Popover.Trigger>
        <Popover.Content>
          <Text size="body-sm">This is popover content. You can put anything here.</Text>
        </Popover.Content>
      </Popover.Root>
    );
  if (idx === 1)
    return (
      <div style={row(12)}>
        {(['top', 'right', 'bottom', 'left'] as const).map((s) => (
          <Popover.Root key={s}>
            <Popover.Trigger asChild>
              <Button variant="ghost" size="sm">{s}</Button>
            </Popover.Trigger>
            <Popover.Content side={s}>
              <Text size="body-sm">Opens {s}</Text>
            </Popover.Content>
          </Popover.Root>
        ))}
      </div>
    );
  return null;
}

function HoverCardExamples({ idx }: { idx: number }) {
  if (idx === 0)
    return (
      <HoverCard.Root>
        <HoverCard.Trigger asChild>
          <Link href="#">@alex_johnson</Link>
        </HoverCard.Trigger>
        <HoverCard.Content>
          <div style={col(8)}>
            <Avatar name="Alex Johnson" size="lg" />
            <div>
              <Text weight="semibold">Alex Johnson</Text>
              <Text size="body-sm" tone="muted">Product Designer</Text>
            </div>
            <Text size="body-sm" tone="secondary">Building design systems and making developers happy.</Text>
          </div>
        </HoverCard.Content>
      </HoverCard.Root>
    );
  return null;
}

function DrawerDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>Open Drawer</Button>
      <Drawer.Root open={open} onOpenChange={setOpen}>
        <Drawer.Portal>
          <Drawer.Overlay />
          <Drawer.Content side="right">
            <Drawer.Header>
              <Drawer.Title>Edit profile</Drawer.Title>
              <Drawer.Description>Update your profile details.</Drawer.Description>
            </Drawer.Header>
            <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
              <div style={col(12)}>
                <div style={col(4)}>
                  <Label htmlFor="d-name">Name</Label>
                  <Input id="d-name" placeholder="Jane Smith" />
                </div>
                <div style={col(4)}>
                  <Label htmlFor="d-email">Email</Label>
                  <Input id="d-email" type="email" placeholder="jane@example.com" />
                </div>
              </div>
            </div>
            <Drawer.Footer>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <Drawer.Close asChild><Button variant="outline">Cancel</Button></Drawer.Close>
                <Button variant="primary">Save changes</Button>
              </div>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}

function DrawerExamples({ idx }: { idx: number }) {
  const [open, setOpen] = React.useState(false);
  if (idx === 0) return <DrawerDemo />;
  if (idx === 1)
    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>Open Bottom Sheet</Button>
        <Drawer.Root open={open} onOpenChange={setOpen}>
          <Drawer.Portal>
            <Drawer.Overlay />
            <Drawer.Content side="bottom">
              <Drawer.Header>
                <Drawer.Title>Share to</Drawer.Title>
              </Drawer.Header>
              <div style={{ padding: '16px', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {['Twitter', 'LinkedIn', 'Slack', 'Email'].map((s) => (
                  <Button key={s} variant="outline" size="sm">{s}</Button>
                ))}
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </>
    );
  return null;
}

function SheetExamples({ idx }: { idx: number }) {
  const [open, setOpen] = React.useState(false);
  if (idx === 0)
    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>Open Sheet</Button>
        <Sheet.Root open={open} onOpenChange={setOpen}>
          <Sheet.Portal>
            <Sheet.Overlay />
            <Sheet.Content side="right">
              <Sheet.Header>
                <Sheet.Title>Notifications</Sheet.Title>
                <Sheet.Description>Your recent activity</Sheet.Description>
              </Sheet.Header>
              <div style={{ padding: '16px', flex: 1 }}>
                <Text size="body-sm" tone="muted">No new notifications.</Text>
              </div>
            </Sheet.Content>
          </Sheet.Portal>
        </Sheet.Root>
      </>
    );
  return null;
}

function BreadcrumbExamples({ idx }: { idx: number }) {
  if (idx === 0)
    return (
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item><Breadcrumb.Link href="/">Home</Breadcrumb.Link></Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item><Breadcrumb.Link href="/components">Components</Breadcrumb.Link></Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item><Breadcrumb.Page>Button</Breadcrumb.Page></Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
    );
  if (idx === 1)
    return (
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item><Breadcrumb.Link href="/">Home</Breadcrumb.Link></Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item><Breadcrumb.Ellipsis /></Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item><Breadcrumb.Link href="/components/navigation">Navigation</Breadcrumb.Link></Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item><Breadcrumb.Page>Breadcrumb</Breadcrumb.Page></Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
    );
  return null;
}

function PaginationExamples({ idx }: { idx: number }) {
  const [page, setPage] = React.useState(3);
  if (idx === 0)
    return <Pagination page={page} totalItems={100} pageSize={10} onPageChange={setPage} />;
  if (idx === 1)
    return <Pagination page={page} totalItems={500} pageSize={20} siblingCount={2} onPageChange={setPage} />;
  return null;
}

function TableExamples({ idx }: { idx: number }) {
  const rows = [
    { name: 'Alice Brown', status: 'Active', date: 'Jan 15, 2026' },
    { name: 'Bob Carter', status: 'Pending', date: 'Jan 14, 2026' },
    { name: 'Carol Davis', status: 'Inactive', date: 'Jan 10, 2026' },
  ];
  if (idx === 0)
    return (
      <Table.Root style={{ width: '100%', maxWidth: 480 }}>
        <Table.Header>
          <Table.Row>
            <Table.Head>Name</Table.Head>
            <Table.Head>Status</Table.Head>
            <Table.Head>Date</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map((r) => (
            <Table.Row key={r.name}>
              <Table.Cell>{r.name}</Table.Cell>
              <Table.Cell><Badge tone={r.status === 'Active' ? 'success' : r.status === 'Pending' ? 'warning' : 'neutral'} size="sm">{r.status}</Badge></Table.Cell>
              <Table.Cell>{r.date}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    );
  if (idx === 1)
    return (
      <Table.Root style={{ width: '100%', maxWidth: 480 }}>
        <Table.Caption>Recent user activity — last 30 days</Table.Caption>
        <Table.Header>
          <Table.Row>
            <Table.Head>Name</Table.Head>
            <Table.Head>Status</Table.Head>
            <Table.Head>Date</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map((r) => (
            <Table.Row key={r.name}>
              <Table.Cell>{r.name}</Table.Cell>
              <Table.Cell><StatusPill tone={r.status === 'Active' ? 'success' : r.status === 'Pending' ? 'warning' : 'neutral'} label={r.status} /></Table.Cell>
              <Table.Cell>{r.date}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.Cell colSpan={3} style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.875rem' }}>
              Showing {rows.length} of {rows.length} users
            </Table.Cell>
          </Table.Row>
        </Table.Footer>
      </Table.Root>
    );
  return null;
}

function DataTableExamples({ idx }: { idx: number }) {
  const data = [
    { name: 'Alice Brown', email: 'alice@example.com', plan: 'Pro', status: 'Active' },
    { name: 'Bob Carter', email: 'bob@example.com', plan: 'Free', status: 'Pending' },
    { name: 'Carol Davis', email: 'carol@example.com', plan: 'Pro', status: 'Inactive' },
    { name: 'Dave Evans', email: 'dave@example.com', plan: 'Enterprise', status: 'Active' },
  ];
  const columns = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'plan', header: 'Plan' },
    { accessorKey: 'status', header: 'Status' },
  ];
  if (idx === 0)
    return (
      <div style={{ width: '100%', maxWidth: 600 }}>
        <DataTable columns={columns} data={data} />
      </div>
    );
  if (idx === 1)
    return (
      <div style={{ width: '100%', maxWidth: 600 }}>
        <DataTable columns={columns} data={data} enableSorting />
      </div>
    );
  return null;
}

function EmptyStateExamples({ idx }: { idx: number }) {
  if (idx === 0)
    return (
      <EmptyState.Root>
        <EmptyState.Illustration>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect x="8" y="8" width="32" height="32" rx="4" stroke="var(--color-outline-variant)" strokeWidth="2" />
            <path d="M18 24h12M24 18v12" stroke="var(--color-on-surface-muted)" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </EmptyState.Illustration>
        <EmptyState.Title>No results found</EmptyState.Title>
        <EmptyState.Description>Try adjusting your search or filters to find what you&apos;re looking for.</EmptyState.Description>
        <EmptyState.Actions>
          <Button variant="primary" size="sm">Clear filters</Button>
        </EmptyState.Actions>
      </EmptyState.Root>
    );
  if (idx === 1)
    return (
      <EmptyState.Root>
        <EmptyState.Illustration>
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
            <rect width="80" height="80" rx="40" fill="var(--color-surface-container-low)" />
            <rect x="24" y="28" width="32" height="24" rx="4" stroke="var(--color-outline)" strokeWidth="2" />
            <path d="M24 36h32" stroke="var(--color-outline)" strokeWidth="2" />
            <circle cx="40" cy="48" r="4" fill="color-mix(in srgb, var(--color-on-surface) 38%, transparent)" />
          </svg>
        </EmptyState.Illustration>
        <EmptyState.Title>No documents yet</EmptyState.Title>
        <EmptyState.Description>Upload your first document to get started.</EmptyState.Description>
        <EmptyState.Actions>
          <Button variant="primary">Upload document</Button>
        </EmptyState.Actions>
      </EmptyState.Root>
    );
  return null;
}

function ErrorStateExamples({ idx }: { idx: number }) {
  if (idx === 0)
    return (
      <ErrorState
        title="Something went wrong"
        description="We could not load the data. Please try again."
        onRetry={() => {}}
      />
    );
  if (idx === 1)
    return (
      <ErrorState
        tone="warning"
        title="Connection issue"
        description="Check your network and try again."
      />
    );
  return null;
}

function DatePickerExamples({ idx }: { idx: number }) {
  if (idx === 0) return <DatePicker placeholder="Select a date…" />;
  if (idx === 1) return <DatePicker value={new Date('2026-01-15')} onChange={() => {}} />;
  if (idx === 2)
    return (
      <DatePicker
        aria-label="Schedule for"
        placeholder="Select a future date…"
        minDate={new Date()}
        maxDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)}
      />
    );
  return null;
}

function DateRangePickerExamples({ idx }: { idx: number }) {
  const [range, setRange] = React.useState<{ from: Date | undefined; to: Date | undefined }>({
    from: new Date('2026-04-01'),
    to: new Date('2026-04-14'),
  });
  if (idx === 0) return <DateRangePicker placeholder="Select date range…" />;
  if (idx === 1)
    return (
      <DateRangePicker
        value={range}
        onChange={(r) => setRange({ from: r?.from, to: r?.to })}
        placeholder="Select date range…"
      />
    );
  return null;
}

function MotionFadeExamples({ idx }: { idx: number }) {
  const [visible, setVisible] = React.useState(true);
  if (idx === 0) return <Fade in><Card style={{ width: 200 }}><Text size="body-sm">Faded in content</Text></Card></Fade>;
  if (idx === 1)
    return (
      <div style={col(12)}>
        <Button variant="outline" onClick={() => setVisible((v) => !v)}>
          {visible ? 'Hide' : 'Show'}
        </Button>
        <Fade in={visible} unmountOnExit>
          <Card style={{ width: 200 }}><Text size="body-sm">Animated content</Text></Card>
        </Fade>
      </div>
    );
  if (idx === 2)
    return (
      <div style={col(12)}>
        <Button variant="outline" onClick={() => setVisible((v) => !v)}>Toggle</Button>
        <Fade in={visible} duration="slow" easing="spring">
          <Card style={{ width: 200 }}><Text size="body-sm">Slow spring fade animation.</Text></Card>
        </Fade>
      </div>
    );
  return null;
}

function MotionSlideExamples({ idx }: { idx: number }) {
  const [visible, setVisible] = React.useState(true);
  if (idx === 0)
    return <Slide in direction="up"><Card style={{ width: 200 }}><Text size="body-sm">Slid in from bottom</Text></Card></Slide>;
  if (idx === 1)
    return (
      <div style={col(12)}>
        <Button variant="outline" onClick={() => setVisible((v) => !v)}>Toggle</Button>
        <Slide in={visible} direction="up" unmountOnExit>
          <Card style={{ width: 200 }}><Text size="body-sm">Sliding content</Text></Card>
        </Slide>
      </div>
    );
  return null;
}

function MotionScaleExamples({ idx }: { idx: number }) {
  const [visible, setVisible] = React.useState(true);
  if (idx === 0)
    return <Scale in><Card style={{ width: 200 }}><Text size="body-sm">Scaled content</Text></Card></Scale>;
  if (idx === 1)
    return (
      <div style={col(12)}>
        <Button variant="outline" onClick={() => setVisible((v) => !v)}>Toggle</Button>
        <Scale in={visible} unmountOnExit>
          <Card style={{ width: 200 }}><Text size="body-sm">Scaling content</Text></Card>
        </Scale>
      </div>
    );
  return null;
}

function MotionCollapseExamples({ idx }: { idx: number }) {
  const [visible, setVisible] = React.useState(true);
  if (idx === 0)
    return (
      <Collapse in>
        <div style={{ padding: 16, background: 'var(--color-surface-container-low)', borderRadius: 'var(--shape-field)' }}>
          <Text size="body-sm">Collapsed content goes here.</Text>
        </div>
      </Collapse>
    );
  if (idx === 1)
    return (
      <div style={col(12)}>
        <Button variant="outline" onClick={() => setVisible((v) => !v)}>
          {visible ? 'Collapse' : 'Expand'}
        </Button>
        <Collapse in={visible}>
          <div style={{ padding: 16, background: 'var(--color-surface-container-low)', borderRadius: 'var(--shape-field)' }}>
            <Text size="body-sm">This content collapses and expands smoothly.</Text>
          </div>
        </Collapse>
      </div>
    );
  return null;
}

/* ── Pattern examples ─────────────────────────────────────────────────────── */

function StatCardExamples({ idx }: { idx: number }) {
  const [orders, setOrders] = React.useState(1284);
  if (idx === 0)
    return (
      <div style={{ width: 240 }}>
        <StatCard label="Total Revenue" value="$48,295" delta="+12.5%" deltaType="increase" description="vs last month" />
      </div>
    );
  if (idx === 1)
    return (
      <div style={row(12)}>
        <StatCard label="Users" value="2,841" delta="+8.3%" deltaType="increase" />
        <StatCard label="Churn" value="3.2%" delta="-0.4%" deltaType="decrease" />
      </div>
    );
  if (idx === 2)
    return (
      <div style={{ ...col(12), width: 240, alignItems: 'stretch' }}>
        <StatCard label="Orders today" value={orders.toLocaleString('en-US')} animate />
        <Button size="sm" variant="outlined" onClick={() => setOrders((o) => o + Math.ceil(Math.random() * 40))}>
          New orders
        </Button>
      </div>
    );
  return null;
}

function BentoStat({ label, value }: { label: string; value: string }) {
  return (
    <BentoTile className="flex flex-col justify-between">
      <span className="text-label-md text-[var(--color-on-surface-variant)]">{label}</span>
      <span className="text-title-lg text-[var(--color-on-surface)]">{value}</span>
    </BentoTile>
  );
}

function BentoGridExamples({ idx }: { idx: number }) {
  const bars = ['40%', '65%', '50%', '80%', '72%', '90%', '60%'];
  if (idx === 0)
    return (
      <BentoGrid style={{ width: '100%' }}>
        <BentoTile size="2x2" className="flex flex-col gap-3">
          <h3 className="text-title-sm text-[var(--color-on-surface)]">Revenue, last 7 days</h3>
          <div role="img" aria-label={`Bar chart: ${bars.join(', ')}`} style={{ display: 'flex', flex: 1, alignItems: 'flex-end', gap: 8 }}>
            {bars.map((h, i) => (
              <div key={i} className="rounded-shape-min bg-[var(--color-primary-container)]" style={{ flex: 1, height: h }} />
            ))}
          </div>
        </BentoTile>
        <BentoStat label="Active users" value="12,480" />
        <BentoStat label="Conversion" value="3.2%" />
        <BentoTile size="2x1" className="flex items-center text-body-md text-[var(--color-on-surface-variant)]">
          3 invoices awaiting approval.
        </BentoTile>
        <BentoStat label="Churn" value="0.8%" />
        <BentoStat label="NPS" value="61" />
      </BentoGrid>
    );
  return null;
}

function ErrorSummaryExamples({ idx }: { idx: number }) {
  if (idx === 0) return <ErrorSummaryDemo />;
  return null;
}

function ErrorSummaryDemo() {
  const [submitted, setSubmitted] = React.useState<FormErrorMap>({});
  const { errors, fieldProps, errorProps } = useFormErrors(submitted);
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setSubmitted({
      'es-name': String(data.get('name')).trim() ? undefined : 'Enter your name',
      'es-email': /^\S+@\S+\.\S+$/.test(String(data.get('email'))) ? undefined : 'Enter an email address, like name@example.com',
    });
  };
  return (
    <form noValidate onSubmit={submit} style={{ ...col(12), alignItems: 'stretch', width: 340 }}>
      <ErrorSummary errors={errors} />
      <div style={{ ...col(4), alignItems: 'stretch' }}>
        <Label htmlFor="es-name">Name</Label>
        <Input name="name" {...fieldProps('es-name')} invalid={Boolean(submitted['es-name'])} />
        {submitted['es-name'] && <FormError {...errorProps('es-name')}>{submitted['es-name']}</FormError>}
      </div>
      <div style={{ ...col(4), alignItems: 'stretch' }}>
        <Label htmlFor="es-email">Email</Label>
        <Input name="email" type="email" {...fieldProps('es-email')} invalid={Boolean(submitted['es-email'])} />
        {submitted['es-email'] && <FormError {...errorProps('es-email')}>{submitted['es-email']}</FormError>}
      </div>
      <Button type="submit">Create account</Button>
    </form>
  );
}

function UserCardExamples({ idx }: { idx: number }) {
  if (idx === 0)
    return (
      <div style={{ width: 300 }}>
        <UserCard name="Alex Johnson" email="alex@example.com" role="Admin" avatarFallback="AJ" />
      </div>
    );
  return null;
}

function AuthCardExamples({ idx }: { idx: number }) {
  if (idx === 0)
    return (
      <div style={{ width: 360 }}>
        <AuthCard title="Sign in" description="Welcome back — enter your credentials to continue.">
          <div style={col(12)}>
            <div style={col(4)}>
              <Label htmlFor="auth-email">Email</Label>
              <Input id="auth-email" type="email" placeholder="you@company.com" />
            </div>
            <div style={col(4)}>
              <Label htmlFor="auth-pass">Password</Label>
              <Input id="auth-pass" type="password" placeholder="••••••••" />
            </div>
            <Button variant="primary" style={{ width: '100%' }}>Sign in</Button>
          </div>
        </AuthCard>
      </div>
    );
  return null;
}

function FilterBarExamples({ idx }: { idx: number }) {
  if (idx === 0)
    return (
      <div style={{ width: '100%', maxWidth: 480 }}>
        <FilterBar
          searchPlaceholder="Search users…"
          filters={
            <div style={row(8)}>
              <Badge tone="neutral">Status: All</Badge>
              <Badge tone="neutral">Plan: All</Badge>
            </div>
          }
        />
      </div>
    );
  return null;
}

function SettingsSectionExamples({ idx }: { idx: number }) {
  if (idx === 0)
    return (
      <div style={{ width: '100%', maxWidth: 560 }}>
        <SettingsSection title="Notifications" description="Control how and when you receive notifications.">
          <div style={col(12)}>
            {['Email alerts', 'Push notifications'].map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-on-surface)' }}>{item}</span>
                <Switch defaultChecked />
              </div>
            ))}
          </div>
        </SettingsSection>
      </div>
    );
  return null;
}

function InfoListExamples({ idx }: { idx: number }) {
  if (idx === 0)
    return (
      <div style={{ width: 280 }}>
        <InfoList.Root>
          <InfoList.Item label="Plan" value="Pro" />
          <InfoList.Item label="Seats" value="12 / 50" />
          <InfoList.Item label="Renewal" value="Jan 15, 2026" />
          <InfoList.Item label="Status" value={<Badge tone="success" size="sm">Active</Badge>} />
        </InfoList.Root>
      </div>
    );
  return null;
}

function PlanCardExamples({ idx }: { idx: number }) {
  if (idx === 0)
    return (
      <div style={{ width: 280 }}>
        <PlanCard
          name="Pro"
          price="$49"
          period="/ month"
          description="For growing teams that need more power."
          features={['Unlimited seats', 'Advanced analytics', 'Priority support']}
          cta="Get started"
          onSelect={() => {}}
        />
      </div>
    );
  return null;
}

function StepIndicatorExamples({ idx }: { idx: number }) {
  if (idx === 0)
    return (
      <StepIndicator
        currentStep={1}
        steps={[{ label: 'Account' }, { label: 'Profile' }, { label: 'Billing' }, { label: 'Done' }]}
      />
    );
  return null;
}

function NotificationItemExamples({ idx }: { idx: number }) {
  if (idx === 0)
    return (
      <div style={{ width: 340 }}>
        <NotificationItem title="New team member" description="Sarah joined your workspace." timestamp="2 min ago" read={false} />
        <NotificationItem title="Invoice paid" description="Invoice #1042 was paid successfully." timestamp="1 hr ago" read />
      </div>
    );
  return null;
}

function ActivityFeedExamples({ idx }: { idx: number }) {
  if (idx === 0)
    return (
      <div style={{ width: 340 }}>
        <ActivityFeed.Root>
          <ActivityFeed.Item title="Sarah K. created an invoice" description="Invoice #1042 for Acme Corp" timestamp="2 min ago" />
          <ActivityFeed.Item title="James L. approved a request" description="Budget increase for Q2" timestamp="15 min ago" />
          <ActivityFeed.Item title="Maria R. added a comment" description="On the design review document" timestamp="1 hr ago" />
        </ActivityFeed.Root>
      </div>
    );
  return null;
}

/* ── Render maps ──────────────────────────────────────────────────────────── */

const COMPONENT_MAP: Record<string, React.ComponentType<{ idx: number }>> = {
  // Actions
  button: ButtonExamples,
  'button-group': ButtonGroupExamples,
  'split-button': SplitButtonExamples,
  'navigation-rail': NavigationRailExamples,
  amount: AmountExamples,
  'money-input': MoneyInputExamples,
  'icon-button': IconButtonExamples,
  // Form & Input
  input: InputExamples,
  textarea: TextareaExamples,
  'number-input': NumberInputExamples,
  'search-input': SearchInputExamples,
  'password-input': PasswordInputExamples,
  label: LabelExamples,
  'helper-text': HelperTextExamples,
  'form-field': FormFieldExamples,
  'date-picker': DatePickerExamples,
  'date-range-picker': DateRangePickerExamples,
  // Labels & Badges
  badge: BadgeExamples,
  'status-pill': StatusPillExamples,
  'filter-chip': FilterChipExamples,
  chip: ChipExamples,
  tag: TagExamples,
  'eyebrow-chip': EyebrowChipExamples,
  // Avatar
  avatar: AvatarExamples,
  'avatar-group': AvatarGroupExamples,
  // Feedback
  alert: AlertExamples,
  banner: BannerExamples,
  callout: CalloutExamples,
  toast: ToastExamples,
  // Loading
  skeleton: SkeletonExamples,
  spinner: SpinnerExamples,
  progress: ProgressExamples,
  // Disclosure
  accordion: AccordionExamples,
  collapsible: CollapsibleExamples,
  tabs: TabsExamples,
  'scroll-area': ScrollAreaExamples,
  // Interactive
  rating: RatingExamples,
  slider: SliderExamples,
  toggle: ToggleExamples,
  'toggle-group': ToggleGroupExamples,
  'segmented-control': SegmentedControlExamples,
  // Form Controls
  select: SelectExamples,
  checkbox: CheckboxExamples,
  'radio-group': RadioGroupExamples,
  'radio-card': RadioCardExamples,
  'checkbox-card': CheckboxCardExamples,
  switch: SwitchExamples,
  combobox: ComboboxExamples,
  autocomplete: AutocompleteExamples,
  // Overlays
  dialog: DialogExamples,
  'alert-dialog': AlertDialogExamples,
  popover: PopoverExamples,
  tooltip: TooltipExamples,
  'hover-card': HoverCardExamples,
  drawer: DrawerExamples,
  sheet: SheetExamples,
  // Navigation
  breadcrumb: BreadcrumbExamples,
  pagination: PaginationExamples,
  // Data Display
  table: TableExamples,
  'data-table': DataTableExamples,
  'empty-state': EmptyStateExamples,
  'error-state': ErrorStateExamples,
  card: CardExamples,
  'media-card': MediaCardExamples,
  'number-ticker': NumberTickerExamples,
  // Dividers
  separator: SeparatorExamples,
  'gradient-divider': GradientDividerExamples,
  // Typography
  heading: HeadingExamples,
  text: TextExamples,
  // Inline Primitives
  'code-inline': CodeInlineExamples,
  kbd: KbdExamples,
  link: LinkExamples,
  'text-gradient': TextGradientExamples,
  // Layout
  stack: StackExamples,
  flex: FlexExamples,
  grid: GridExamples,
  box: BoxExamples,
  // Motion
  'motion-fade': MotionFadeExamples,
  'motion-slide': MotionSlideExamples,
  'motion-scale': MotionScaleExamples,
  'motion-collapse': MotionCollapseExamples,
};

const PATTERN_MAP: Record<string, React.ComponentType<{ idx: number }>> = {
  'stat-card': StatCardExamples,
  'user-card': UserCardExamples,
  'auth-card': AuthCardExamples,
  'filter-bar': FilterBarExamples,
  'settings-section': SettingsSectionExamples,
  'info-list': InfoListExamples,
  'list-detail': ListDetailExamples,
  'bento-grid': BentoGridExamples,
  'error-summary': ErrorSummaryExamples,
  'plan-card': PlanCardExamples,
  'step-indicator': StepIndicatorExamples,
  'notification-item': NotificationItemExamples,
  'activity-feed': ActivityFeedExamples,
};

export interface ComponentLivePreviewProps {
  slug: string;
  idx: number;
  isPattern?: boolean;
}

export function ComponentLivePreview({ slug, idx, isPattern = false }: ComponentLivePreviewProps) {
  const map = isPattern ? PATTERN_MAP : COMPONENT_MAP;
  const Examples = map[slug];
  if (!Examples) return null;
  return <Examples idx={idx} />;
}
