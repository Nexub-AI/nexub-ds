// Smoke test (8.2, T1/T2): every component exported from the package renders
// with minimal props, logs no console errors or warnings, and gives its
// interactive elements an accessible name. A new export without a case (or a
// SKIP reason) fails the first test: nothing ships untested.
import * as React from 'react';
import { cleanup, render } from '@testing-library/react';
import axe from 'axe-core';
import { afterEach, describe, it, expect, vi } from 'vitest';
import * as N from '../index.js';

const noop = () => {};
const series = [{ key: 'a', label: 'Web' }];
const data = [{ month: 'Jan', a: 1 }, { month: 'Feb', a: 2 }];
const tasks = [{ id: 'a', title: 'Alpha' }];
const opts = [{ value: 'a', label: 'A' }];

const cases: Record<string, () => React.ReactElement> = {
  // AI
  PromptInput: () => <N.PromptInput />,
  ThinkingIndicator: () => <N.ThinkingIndicator />,
  StreamingText: () => <N.StreamingText text="Hello" />,
  MessageBubble: () => <N.MessageBubble from="assistant">Hi</N.MessageBubble>,
  MessageActions: () => <N.MessageActions text="Hi" onFeedback={noop} onRegenerate={noop} />,
  Citation: () => <N.Citation index={1} source={{ title: 'T', url: 'https://example.com' }} />,
  SourceChip: () => <N.SourceChip source={{ title: 'T', url: 'https://example.com' }} />,
  SourceList: () => <N.SourceList sources={[{ title: 'T', url: 'https://example.com' }]} />,
  PlanTracker: () => <N.PlanTracker steps={[{ title: 'Read', status: 'done' }]} />,
  ToolCall: () => <N.ToolCall name="search" status="done" input={{ q: 'a' }} output="1 found" />,
  DiffView: () => <N.DiffView file="a.ts" diff={'-old\n+new'} />,
  ApprovalCard: () => <N.ApprovalCard title="Send 3 invoices" onApprove={noop} />,
  NexubProvider: () => <N.NexubProvider locale="en">x</N.NexubProvider>,

  // Form & input
  Button: () => <N.Button>Save</N.Button>,
  ButtonGroup: () => <N.ButtonGroup><N.Button>A</N.Button><N.Button>B</N.Button></N.ButtonGroup>,
  SplitButton: () => <N.SplitButton menuLabel="More" menu={<N.DropdownMenu.Item>Draft</N.DropdownMenu.Item>}>Save</N.SplitButton>,
  IconButton: () => <N.IconButton label="Close"><svg aria-hidden /></N.IconButton>,
  Input: () => <N.Input aria-label="Name" />,
  Textarea: () => <N.Textarea aria-label="Bio" />,
  NumberInput: () => <N.NumberInput aria-label="Qty" showSteppers />,
  MoneyInput: () => <N.MoneyInput aria-label="Amount" currency="USD" locale="en-US" />,
  Amount: () => <N.Amount value={12} currency="USD" />,
  SearchInput: () => <N.SearchInput aria-label="Search" />,
  PasswordInput: () => <N.PasswordInput aria-label="Password" />,
  FloatingInput: () => <N.FloatingInput label="Email" />,
  Label: () => <N.Label>Name</N.Label>,
  HelperText: () => <N.HelperText>Help</N.HelperText>,
  FormError: () => <N.FormError>Required</N.FormError>,
  FormField: () => (
    <N.FormField.Root id="f" name="f">
      <N.FormField.Label>Email</N.FormField.Label>
      <N.FormField.Control><N.Input /></N.FormField.Control>
      <N.FormField.Description>We never share it.</N.FormField.Description>
      <N.FormField.Error>Required</N.FormField.Error>
    </N.FormField.Root>
  ),
  Form: () => <N.Form aria-label="f" onSubmit={noop}><N.Button type="submit">Go</N.Button></N.Form>,
  Fieldset: () => <N.Fieldset legend="Plan" description="Pick one"><N.Input aria-label="Seats" /></N.Fieldset>,
  InlineEdit: () => <N.InlineEdit value="Q3" label="Name" onSave={noop} />,
  OTPInput: () => <N.OTPInput length={4} />,
  Switch: () => <N.Switch aria-label="On" />,
  Checkbox: () => <N.Checkbox aria-label="Accept" />,
  RadioGroup: () => (
    <N.RadioGroup.Root aria-label="Plan" defaultValue="a">
      <N.RadioGroup.Item value="a" aria-label="A" />
    </N.RadioGroup.Root>
  ),
  Slider: () => <N.Slider defaultValue={[20]} aria-label="Volume" />,
  Toggle: () => <N.Toggle aria-label="Pin">P</N.Toggle>,
  ToggleGroup: () => (
    <N.ToggleGroup.Root type="single" aria-label="Align">
      <N.ToggleGroup.Item value="l" aria-label="Left">L</N.ToggleGroup.Item>
    </N.ToggleGroup.Root>
  ),
  SegmentedControl: () => (
    <N.SegmentedControl.Root aria-label="Period" defaultValue="w">
      <N.SegmentedControl.Item value="w">Week</N.SegmentedControl.Item>
    </N.SegmentedControl.Root>
  ),
  Select: () => (
    <N.Select.Root>
      <N.Select.Trigger aria-label="Currency"><N.Select.Value placeholder="Currency" /></N.Select.Trigger>
    </N.Select.Root>
  ),
  Combobox: () => (
    <N.Combobox.Root label="Country">
      <N.Combobox.Input aria-label="Country" />
      <N.Combobox.List><N.Combobox.Item>India</N.Combobox.Item></N.Combobox.List>
    </N.Combobox.Root>
  ),
  Autocomplete: () => <N.Autocomplete aria-label="Fruit" options={opts} />,
  MultiSelect: () => <N.MultiSelect aria-label="Colours" options={opts} />,
  FilterBuilder: () => <N.FilterBuilder fields={[{ id: 'n', label: 'Name', type: 'text' }]} />,
  SavedViews: () => <N.SavedViews views={[{ id: 'mine', name: 'Mine' }]} activeId="mine" onSelect={noop} />,
  FileUpload: () => (
    <N.FileUpload.Root>
      <N.FileUpload.Dropzone />
      <N.FileUpload.List />
    </N.FileUpload.Root>
  ),
  TimePicker: () => <N.TimePicker aria-label="Start" />,
  DatePicker: () => <N.DatePicker />,
  DateRangePicker: () => <N.DateRangePicker />,
  DateTimePicker: () => <N.DateTimePicker aria-label="Starts" />,
  Rating: () => <N.Rating value={3} />,
  RadioCardGroup: () => <N.RadioCardGroup aria-label="Plan" defaultValue="a"><N.RadioCard value="a" title="A" /></N.RadioCardGroup>,
  RadioCard: () => <N.RadioCardGroup aria-label="Plan"><N.RadioCard value="a" title="A" /></N.RadioCardGroup>,
  CheckboxCard: () => <N.CheckboxCard title="A" />,

  // Labels, badges, avatars
  Badge: () => <N.Badge>New</N.Badge>,
  FilterChip: () => <N.FilterChip onRemove={noop}>Open</N.FilterChip>,
  Chip: () => <N.Chip>Design</N.Chip>,
  EyebrowChip: () => <N.EyebrowChip>New</N.EyebrowChip>,
  Avatar: () => <N.Avatar name="Ada Lovelace" />,
  AvatarGroup: () => <N.AvatarGroup max={1}><N.Avatar name="A B" /><N.Avatar name="C D" /></N.AvatarGroup>,
  Flag: () => <N.Flag code="SG" />,
  CountryBadge: () => <N.CountryBadge code="SG" label="Singapore" />,
  KeyboardShortcut: () => <N.KeyboardShortcut keys={['Ctrl', 'K']} />,
  Kbd: () => <N.Kbd>K</N.Kbd>,
  Code: () => <N.Code>x</N.Code>,
  Link: () => <N.Link href="/x">Docs</N.Link>,
  Logo: () => <N.Logo />,

  // Layout, containers, typography
  Card: () => <N.Card>c</N.Card>,
  CardLink: () => <N.Card><N.CardLink href="/plan">Pro plan</N.CardLink></N.Card>,
  MediaCard: () => <N.MediaCard src="/a.jpg" alt="" title="T" href="/x" />,
  Container: () => <N.Container>x</N.Container>,
  Section: () => <N.Section>x</N.Section>,
  Stack: () => <N.Stack>x</N.Stack>,
  Flex: () => <N.Flex>x</N.Flex>,
  Grid: () => <N.Grid>x</N.Grid>,
  Box: () => <N.Box>x</N.Box>,
  AspectRatio: () => <N.AspectRatio ratio={1}>x</N.AspectRatio>,
  VisuallyHidden: () => <N.VisuallyHidden>x</N.VisuallyHidden>,
  Heading: () => <N.Heading>Title</N.Heading>,
  Text: () => <N.Text>x</N.Text>,
  TextGradient: () => <N.TextGradient>x</N.TextGradient>,
  Separator: () => <N.Separator />,
  GradientDivider: () => <N.GradientDivider />,
  CheckList: () => <N.CheckList items={['One']} />,
  CheckListItem: () => <N.CheckList><N.CheckListItem>One</N.CheckListItem></N.CheckList>,
  ScrollArea: () => <N.ScrollArea>x</N.ScrollArea>,
  ResizablePanels: () => <N.ResizablePanels><div>A</div><div>B</div></N.ResizablePanels>,
  ActionBar: () => <N.ActionBar message="Unsaved"><N.Button>Save</N.Button></N.ActionBar>,
  Aurora: () => <N.Aurora />,
  SharedElement: () => <N.SharedElement name="a"><span>x</span></N.SharedElement>,
  ScrollProgress: () => <N.ScrollProgress />,
  Celebrate: () => <N.Celebrate active={false} />,

  // Feedback & loading
  Alert: () => <N.Alert>Saved</N.Alert>,
  Skeleton: () => <N.Skeleton />,
  SkeletonText: () => <N.SkeletonText />,
  Spinner: () => <N.Spinner />,
  Progress: () => <N.Progress value={40} aria-label="Upload" />,
  NumberTicker: () => <N.NumberTicker value={1234} />,
  EmptyState: () => (
    <N.EmptyState.Root>
      <N.EmptyState.Title>No invoices</N.EmptyState.Title>
      <N.EmptyState.Description>None yet.</N.EmptyState.Description>
    </N.EmptyState.Root>
  ),
  EmptyStatePreset: () => <N.EmptyStatePreset kind="noResults" />,
  ErrorState: () => <N.ErrorState title="Something went wrong" />,
  Toast: () => (
    <N.Toast.Provider>
      <N.Toast.Root open><N.Toast.Title>Saved</N.Toast.Title></N.Toast.Root>
      <N.Toast.Viewport />
    </N.Toast.Provider>
  ),
  Toaster: () => <N.Toaster />,

  // Charts
  BarChart: () => <N.BarChart title="Revenue" data={data} index="month" series={series} />,
  LineChart: () => <N.LineChart title="Revenue" data={data} index="month" series={series} />,
  DonutChart: () => <N.DonutChart title="Plans" data={[{ label: 'Pro', value: 3 }]} />,
  Sparkline: () => <N.Sparkline values={[1, 3, 2]} label="Up" />,
  ChartLegend: () => <N.ChartLegend items={[{ label: 'Web' }]} />,
  Gauge: () => <N.Gauge title="Storage" value={30} max={120} />,
  Heatmap: () => <N.Heatmap title="Activity" rowLabels={['Mon']} data={[[1, 2]]} />,
  Funnel: () => <N.Funnel title="Signup" data={[{ label: 'Visited', value: 10 }]} />,
  KpiTile: () => <N.KpiTile label="Revenue" value="$1k" change={0.1} trend={[1, 2]} />,
  ChartToggle: () => <N.ChartToggle series={series}>{(s) => <N.LineChart title="R" data={data} index="month" series={s} />}</N.ChartToggle>,
  ChartZoom: () => <N.ChartZoom data={data} index="month">{(slice) => <N.BarChart title="R" data={slice} index="month" series={series} />}</N.ChartZoom>,

  // Overlays (open, so the portalled content renders)
  Dialog: () => (
    <N.Dialog.Root open>
      <N.Dialog.Content>
        <N.Dialog.Title>Rename</N.Dialog.Title>
        <N.Dialog.Description>New name.</N.Dialog.Description>
      </N.Dialog.Content>
    </N.Dialog.Root>
  ),
  AlertDialog: () => (
    <N.AlertDialog.Root open>
      <N.AlertDialog.Content>
        <N.AlertDialog.Title>Delete?</N.AlertDialog.Title>
        <N.AlertDialog.Description>Permanent.</N.AlertDialog.Description>
        <N.AlertDialog.Cancel>Cancel</N.AlertDialog.Cancel>
        <N.AlertDialog.Action>Delete</N.AlertDialog.Action>
      </N.AlertDialog.Content>
    </N.AlertDialog.Root>
  ),
  Drawer: () => (
    <N.Drawer.Root open>
      <N.Drawer.Content>
        <N.Drawer.Title>Filters</N.Drawer.Title>
        <N.Drawer.Description>Narrow the list.</N.Drawer.Description>
      </N.Drawer.Content>
    </N.Drawer.Root>
  ),
  Sheet: () => (
    <N.Sheet.Root open>
      <N.Sheet.Content>
        <N.Sheet.Title>Details</N.Sheet.Title>
        <N.Sheet.Description>More.</N.Sheet.Description>
      </N.Sheet.Content>
    </N.Sheet.Root>
  ),
  Popover: () => (
    <N.Popover.Root open>
      <N.Popover.Trigger>Details</N.Popover.Trigger>
      <N.Popover.Content aria-label="Fee details">Fee</N.Popover.Content>
    </N.Popover.Root>
  ),
  HoverCard: () => (
    <N.HoverCard.Root open>
      <N.HoverCard.Trigger href="/u">@ada</N.HoverCard.Trigger>
      <N.HoverCard.Content>Ada</N.HoverCard.Content>
    </N.HoverCard.Root>
  ),
  Tooltip: () => <N.TooltipProvider><N.Tooltip label="Hint"><button type="button">t</button></N.Tooltip></N.TooltipProvider>,
  TooltipProvider: () => <N.TooltipProvider>x</N.TooltipProvider>,
  DropdownMenu: () => (
    <N.DropdownMenu.Root open>
      <N.DropdownMenu.Trigger>Actions</N.DropdownMenu.Trigger>
      <N.DropdownMenu.Content><N.DropdownMenu.Item>Edit</N.DropdownMenu.Item></N.DropdownMenu.Content>
    </N.DropdownMenu.Root>
  ),
  ContextMenu: () => (
    <N.ContextMenu.Root>
      <N.ContextMenu.Trigger>Right-click</N.ContextMenu.Trigger>
      <N.ContextMenu.Content><N.ContextMenu.Item>Copy</N.ContextMenu.Item></N.ContextMenu.Content>
    </N.ContextMenu.Root>
  ),
  Menubar: () => (
    <N.Menubar.Root>
      <N.Menubar.Menu>
        <N.Menubar.Trigger>File</N.Menubar.Trigger>
        <N.Menubar.Content><N.Menubar.Item>New</N.Menubar.Item></N.Menubar.Content>
      </N.Menubar.Menu>
    </N.Menubar.Root>
  ),
  NavigationMenu: () => (
    <N.NavigationMenu.Root>
      <N.NavigationMenu.List>
        <N.NavigationMenu.Item><N.NavigationMenu.Link href="/">Home</N.NavigationMenu.Link></N.NavigationMenu.Item>
      </N.NavigationMenu.List>
    </N.NavigationMenu.Root>
  ),
  CommandPalette: () => (
    <N.CommandPalette.Root open>
      <N.CommandPalette.Input placeholder="Type a command" />
      <N.CommandPalette.List>
        <N.CommandPalette.Empty>No results.</N.CommandPalette.Empty>
        <N.CommandPalette.Item>Open</N.CommandPalette.Item>
      </N.CommandPalette.List>
    </N.CommandPalette.Root>
  ),

  // Disclosure & navigation
  Tabs: () => (
    <N.Tabs.Root defaultValue="a">
      <N.Tabs.List><N.Tabs.Trigger value="a">A</N.Tabs.Trigger></N.Tabs.List>
      <N.Tabs.Content value="a">Panel</N.Tabs.Content>
    </N.Tabs.Root>
  ),
  Accordion: () => (
    <N.Accordion.Root type="single" collapsible>
      <N.Accordion.Item value="a"><N.Accordion.Trigger>Q</N.Accordion.Trigger><N.Accordion.Content>A</N.Accordion.Content></N.Accordion.Item>
    </N.Accordion.Root>
  ),
  Collapsible: () => (
    <N.Collapsible.Root defaultOpen>
      <N.Collapsible.Trigger>Toggle</N.Collapsible.Trigger>
      <N.Collapsible.Content>Body</N.Collapsible.Content>
    </N.Collapsible.Root>
  ),
  Toolbar: () => (
    <N.Toolbar.Root aria-label="Formatting">
      <N.Toolbar.Button>Bold</N.Toolbar.Button>
      <N.Toolbar.Separator />
      <N.Toolbar.ToggleGroup type="single" aria-label="Align"><N.Toolbar.ToggleItem value="l" aria-label="Left">L</N.Toolbar.ToggleItem></N.Toolbar.ToggleGroup>
    </N.Toolbar.Root>
  ),
  TopNav: () => (
    <N.TopNav.Root>
      <N.TopNav.Menu><N.TopNav.Item href="#">Docs</N.TopNav.Item></N.TopNav.Menu>
    </N.TopNav.Root>
  ),
  Sidebar: () => <N.Sidebar.Root><N.Sidebar.Item href="#">Home</N.Sidebar.Item></N.Sidebar.Root>,
  NavigationRail: () => (
    <N.NavigationRail.Root aria-label="Workspace">
      <N.NavigationRail.Item href="/home" icon={<svg aria-hidden />} label="Home" active />
    </N.NavigationRail.Root>
  ),
  AppShell: () => (
    <N.AppShell.Root>
      <N.AppShell.Header>Top</N.AppShell.Header>
      <N.AppShell.Body><N.AppShell.Sidebar>Nav</N.AppShell.Sidebar><N.AppShell.Main>Main</N.AppShell.Main></N.AppShell.Body>
    </N.AppShell.Root>
  ),
  PageHeader: () => <N.PageHeader title="Dashboard" description="Overview" />,
  Breadcrumb: () => <N.Breadcrumb.Trail items={[{ label: 'Home', href: '/' }, { label: 'Page' }]} />,
  Pagination: () => <N.Pagination page={2} totalItems={50} onPageChange={noop} />,
  Stepper: () => <N.Stepper aria-label="Setup" steps={[{ label: 'One' }, { label: 'Two' }]} current={0} onStepChange={noop} />,

  // Data display
  Table: () => (
    <N.Table.Root>
      <N.Table.Caption>People</N.Table.Caption>
      <N.Table.Header><N.Table.Row><N.Table.Head>Name</N.Table.Head></N.Table.Row></N.Table.Header>
      <N.Table.Body><N.Table.Row><N.Table.Cell>Ada</N.Table.Cell></N.Table.Row></N.Table.Body>
    </N.Table.Root>
  ),
  DataTable: () => <N.DataTable caption="Tasks" columns={[{ accessorKey: 'title', header: 'Title' }]} data={tasks} />,
  TreeView: () => <N.TreeView aria-label="Files" nodes={[{ id: 'a', label: 'A', children: [{ id: 'b', label: 'B' }] }]} />,
  EventCalendar: () => <N.EventCalendar events={[]} defaultDate={new Date(2026, 10, 9)} />,
  Sortable: () => <N.Sortable aria-label="Tasks" items={tasks} getId={(t) => t.id} getLabel={(t) => t.title} onReorder={noop}>{(t) => t.title}</N.Sortable>,
  Kanban: () => (
    <N.Kanban columns={[{ id: 'todo', title: 'To do', items: tasks }]} getId={(t) => t.id} getLabel={(t) => t.title} onChange={noop} renderCard={(t) => t.title} />
  ),

  // Theme & motion
  ThemeProvider: () => <N.ThemeProvider>x</N.ThemeProvider>,
  Fade: () => <N.Fade in>x</N.Fade>,
  Slide: () => <N.Slide in><span>x</span></N.Slide>,
  Scale: () => <N.Scale in><span>x</span></N.Scale>,
  Collapse: () => <N.Collapse in>x</N.Collapse>,
  ListTransition: () => <N.ListTransition as="ul" itemAs="li"><span key="a">A</span></N.ListTransition>,
  SkeletonSwap: () => <N.SkeletonSwap loading skeleton={<span>…</span>}><p>content</p></N.SkeletonSwap>,
  Reveal: () => <N.Reveal>Hi</N.Reveal>,
  Float: () => <N.Float>x</N.Float>,
  Marquee: () => <N.Marquee><a href="#a">A</a></N.Marquee>,
};

// Exports that can't be rendered on their own, with why. Keep this short.
const SKIP: Record<string, string> = {
  // An inline <script> for the server-rendered <head>; React warns when one is
  // rendered on the client. ThemeProvider.test.tsx renders it to a string.
  ThemeScript: 'server-only <head> script',
};

// Components: PascalCase exports that are functions, exotic components
// (forwardRef/memo), or namespaces of them (Dialog.Root, ...).
const isComponent = (v: unknown): boolean =>
  typeof v === 'function' || (typeof v === 'object' && v !== null && '$$typeof' in v);
const components = Object.entries(N)
  .filter(([k, v]) => /^[A-Z]/.test(k) && (isComponent(v) || (typeof v === 'object' && v !== null && Object.values(v).some(isComponent))))
  .map(([k]) => k);

// Interactive elements must have an accessible name.
const NAME_RULES = [
  'button-name', 'link-name', 'label', 'select-name', 'input-button-name', 'aria-input-field-name',
  'aria-toggle-field-name', 'aria-command-name', 'aria-meter-name', 'aria-progressbar-name',
  'aria-tooltip-name', 'aria-treeitem-name', 'aria-dialog-name', 'image-alt', 'svg-img-alt',
];

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('smoke: every exported component', () => {
  it('has a case or a SKIP reason (and no stale entries)', () => {
    const covered = new Set([...Object.keys(cases), ...Object.keys(SKIP)]);
    expect(components.filter((c) => !covered.has(c)), 'exports with no smoke case').toEqual([]);
    expect([...covered].filter((c) => !components.includes(c)), 'smoke entries that are not exports').toEqual([]);
  });

  it.each(Object.entries(cases))('%s renders cleanly with named controls', async (_name, el) => {
    const error = vi.spyOn(console, 'error');
    const warn = vi.spyOn(console, 'warn');
    const { baseElement } = render(el());
    expect([...error.mock.calls, ...warn.mock.calls].map((c) => c.join(' '))).toEqual([]);
    // baseElement, so portalled overlay content is checked too.
    const { violations } = await axe.run(baseElement, { runOnly: { type: 'rule', values: NAME_RULES } });
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.html).join(' | ')}`)).toEqual([]);
  });
});
