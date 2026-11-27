/**
 * Web ↔ mobile mapping for the docs' Web · Mobile toggle.
 *
 * Props come from source (native-props.generated.json, built by
 * scripts/native-props.mjs); this file holds what source can't say: which
 * native component pairs with which web page, how they differ, and a usage
 * snippet. `preview` is the slug of the live preview in apps/mobile.
 */
import nativeProps from './native-props.generated.json';
import previewManifest from '../../../mobile/preview-manifest.json';
import type { ComponentStatus } from './types';

/**
 * Every @nexub/react-native component is alpha (MOBILE_PLAN.md). Promote one
 * by setting `status` on its entry below, per GOVERNANCE.md's criteria.
 */
export const NATIVE_STATUS: ComponentStatus = 'alpha';

/** A live preview in apps/mobile (its preview manifest), so a typo fails tsc. */
export type PreviewSlug =
  | keyof typeof previewManifest.components
  | `pattern/${keyof typeof previewManifest.patterns & string}`;

export interface PlatformDifference {
  aspect: string;
  web: string;
  mobile: string;
}

export interface NativeTwin {
  /** Export name in @nexub/react-native. */
  name: string;
  /** Live-preview slug (apps/mobile preview manifest). */
  preview: PreviewSlug;
  differences: PlatformDifference[];
  code: string;
  notes?: string[];
  /** Defaults to NATIVE_STATUS. */
  status?: ComponentStatus;
}

export interface NativePropDef {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description: string;
}

const props = nativeProps as Record<string, { props: NativePropDef[]; extends: string[] }>;

export function nativePropsFor(name: string): NativePropDef[] {
  return props[name]?.props ?? [];
}

const touch: PlatformDifference = {
  aspect: 'Hit area',
  web: 'Visual size; xs/sm controls meet WCAG 2.5.8 (24px).',
  mobile: 'Always 44pt, extended with hitSlop when the visual is smaller.',
};
const press: PlatformDifference = {
  aspect: 'Feedback',
  web: 'Hover and focus state layers; press scales to 0.97.',
  mobile: 'Pressed state layer, 0.97 press spring, semantic haptic. No hover.',
};
const label: PlatformDifference = {
  aspect: 'Label',
  web: 'Compose Label + control + HelperText (or FormField).',
  mobile: 'One component: `label`, `helperText` and `error` are props.',
};

/** Keyed by the web component's docs slug. */
export const nativeTwins: Record<string, NativeTwin> = {
  button: {
    name: 'Button',
    preview: 'button',
    differences: [
      { aspect: 'Variants', web: 'filled, tonal, outlined, text, glass, plus subtle, link, destructive, accent.', mobile: 'filled, tonal, outlined, text, glass. Use `tone="danger"` for destructive.' },
      { aspect: 'Icons', web: 'Icon elements as children or `leadingIcon`.', mobile: '`leadingIcon` / `trailingIcon` take an icon component from @nexub/icons/native.' },
      { aspect: 'Primary action size', web: '`md` (40px) by default.', mobile: 'Use `lg` (48pt) for the main action on a screen.' },
      press,
      touch,
    ],
    code: `import { Button } from '@nexub/react-native';
import { Send } from '@nexub/icons/native';

<Button size="lg" leadingIcon={Send} onPress={send} loading={sending}>
  Send money
</Button>`,
  },
  'icon-button': {
    name: 'IconButton',
    preview: 'icon-button',
    differences: [
      { aspect: 'Icon', web: 'Icon element as children.', mobile: '`icon` prop takes an icon component.' },
      { aspect: 'Toggle', web: 'Use Toggle for a pressed state.', mobile: '`selected` gives a toggle with the selected container.' },
      touch,
    ],
    code: `<IconButton icon={Heart} label="Save" selected={saved} onPress={toggle} />`,
  },
  'button-group': {
    name: 'ButtonGroup',
    preview: 'button-group',
    differences: [
      { aspect: 'Layout', web: 'Connected segments in a row.', mobile: '`orientation="horizontal"` or `"vertical"`: full-width buttons stacked, primary on top, as Apple and Material lay out sheet actions.' },
    ],
    code: `<ButtonGroup orientation="vertical">
  <Button size="lg">Continue</Button>
  <Button variant="text">Not now</Button>
</ButtonGroup>`,
  },
  'split-button': {
    name: 'Button + ActionSheet',
    preview: 'action-sheet',
    differences: [
      { aspect: 'Pattern', web: 'Main action plus a chevron menu in one control.', mobile: 'No split control on phones. Show the main Button; put related actions in an ActionSheet (system sheet on iOS) or a ContextMenu on long-press.' },
    ],
    code: `<Button onPress={save}>Save</Button>
<IconButton icon={MoreHorizontal} label="More save options" onPress={() => setOpen(true)} />
<ActionSheet open={open} onOpenChange={setOpen} actions={[
  { label: 'Save as draft', onPress: saveDraft },
  { label: 'Save a copy', onPress: saveCopy },
]} />`,
  },
  link: {
    name: 'Link',
    preview: 'link',
    differences: [
      { aspect: 'Navigation', web: 'An anchor; works with your router via `asChild`.', mobile: 'A pressable text with `onPress`; navigate with your router.' },
      touch,
    ],
    code: `<Link onPress={() => router.push('/terms')}>Terms of service</Link>`,
  },
  amount: {
    name: 'Amount',
    preview: 'amount',
    differences: [
      { aspect: 'Sizes', web: 'Inline, sized by context.', mobile: '`size` sm–lg plus `display` for the hero balance.' },
      { aspect: 'Formatting', web: 'Intl.NumberFormat.', mobile: 'Same output on Hermes, which lacks formatToParts (handled by @nexub/core).' },
    ],
    code: `<Amount value={-42.5} currency="SGD" tone="auto" size="display" />`,
  },
  badge: {
    name: 'Badge',
    preview: 'badge',
    differences: [
      { aspect: 'Sizes', web: 'sm, md, lg.', mobile: 'sm, md.' },
    ],
    code: `<Badge tone="success" variant="soft" dot>Paid</Badge>`,
  },
  avatar: {
    name: 'Avatar',
    preview: 'avatar',
    differences: [],
    code: `<Avatar src={user.photo} name={user.name} size="lg" status="online" />`,
  },
  'avatar-group': {
    name: 'AvatarGroup',
    preview: 'avatar-group',
    differences: [],
    code: `<AvatarGroup max={3}>{people.map((p) => <Avatar key={p.id} name={p.name} />)}</AvatarGroup>`,
  },
  'icon-chip': {
    name: 'IconChip',
    preview: 'icon-chip',
    differences: [
      { aspect: 'Icon', web: 'Any child; an SVG is sized by the chip.', mobile: 'One icon element; it takes the chip\'s colour and size unless it sets its own.' },
      { aspect: 'Accessible name', web: '`aria-label`.', mobile: '`accessibilityLabel`. Without it the chip is hidden from screen readers.' },
    ],
    code: `<IconChip category="emerald"><Wallet /></IconChip>`,
  },
  'number-ticker': {
    name: 'NumberTicker',
    preview: 'number-ticker',
    differences: [
      { aspect: 'Value', web: 'A number, a string or styled parts.', mobile: 'A number or a string.' },
      { aspect: 'Type', web: 'Inherits the text style around it.', mobile: '`variant` and `color` (type and colour roles).' },
      { aspect: 'Announcing changes', web: '`aria-live="polite"`.', mobile: '`live`.' },
      { aspect: 'Count on view', web: '`countOnView` counts up when scrolled into view.', mobile: 'Not available.' },
    ],
    code: `<NumberTicker value={balance} format={{ style: 'currency', currency: 'USD' }} variant="headline-md" live />`,
  },
  separator: {
    name: 'Divider',
    preview: 'divider',
    differences: [{ aspect: 'Name and inset', web: '`Separator`.', mobile: '`Divider` with `inset` to align with list text.' }],
    code: `<Divider inset={56} />`,
  },
  card: {
    name: 'Card',
    preview: 'card',
    differences: [
      { aspect: 'Interaction', web: '`variant="interactive"` lifts on hover; CardLink makes it one link.', mobile: '`onPress` makes the whole card one pressable with an accessibility label.' },
      { aspect: 'Surface', web: 'flat, surface, interactive; glass.', mobile: 'Tonal Surface tiers and elevation; glass on iOS 26+.' },
    ],
    code: `<Card onPress={open} accessibilityLabel="Savings, 2,400 dollars">…</Card>`,
  },
  accordion: {
    name: 'Accordion',
    preview: 'accordion',
    differences: [{ aspect: 'API', web: 'Compound (Root, Item, Trigger, Content), single or multiple.', mobile: 'One Accordion per section with `title`; stack them.' }],
    code: `<Accordion title="Fees">…</Accordion>`,
  },
  input: {
    name: 'TextField',
    preview: 'text-field',
    differences: [label, { aspect: 'Keyboard', web: 'Browser keyboard.', mobile: 'Pass TextInput props: `keyboardType`, `textContentType`, `autoComplete` for autofill.' }],
    code: `<TextField label="Email" keyboardType="email-address" autoComplete="email" error={errors.email} />`,
  },
  'form-field': {
    name: 'TextField',
    preview: 'text-field',
    differences: [label],
    code: `<TextField label="Full name" helperText="As on your NRIC" />`,
  },
  'password-input': {
    name: 'PasswordInput',
    preview: 'password-input',
    differences: [{ aspect: 'Autofill', web: '`autocomplete="current-password"`.', mobile: 'Sets the platform password autofill hints (iOS Keychain, Android Autofill).' }],
    code: `<PasswordInput label="Password" />`,
  },
  'search-input': {
    name: 'SearchField',
    preview: 'search-field',
    differences: [{ aspect: 'Name', web: '`SearchInput`.', mobile: '`SearchField`, with the platform search keyboard and clear button.' }],
    code: `<SearchField label="Search transactions" onChangeText={setQuery} />`,
  },
  'money-input': {
    name: 'MoneyInput',
    preview: 'money-input',
    differences: [{ aspect: 'Large entry', web: 'MoneyInput only.', mobile: 'Also ExpressiveMoneyInput + NumericKeypad for full-screen amount entry.' }],
    code: `<MoneyInput currency="SGD" value={amount} onValueChange={setAmount} />`,
  },
  'number-input': {
    name: 'Stepper',
    preview: 'stepper',
    differences: [{ aspect: 'Control', web: 'A field with steppers; type a number.', mobile: '`Stepper`: − / + buttons with the value between; no keyboard.' }],
    code: `<Stepper label="Guests" min={1} max={8} defaultValue={2} />`,
  },
  checkbox: {
    name: 'Checkbox',
    preview: 'checkbox',
    differences: [label, { aspect: 'In lists', web: 'Checkbox + label.', mobile: 'Prefer `ListItem variant="checkbox"`: one row, one target.' }],
    code: `<Checkbox label="Remember this device" defaultChecked />`,
  },
  'radio-group': {
    name: 'RadioGroup',
    preview: 'radio-group',
    differences: [label],
    code: `<RadioGroup label="Speed" defaultValue="standard">
  <Radio value="standard" label="Standard" description="1–2 days" />
  <Radio value="instant" label="Instant" description="S$0.50" />
</RadioGroup>`,
  },
  switch: {
    name: 'Switch',
    preview: 'switch',
    differences: [{ aspect: 'Look', web: 'Nexub switch.', mobile: 'The platform switch (UISwitch / Material) in Nexub colours.' }, label],
    code: `<Switch label="Face ID" checked={on} onCheckedChange={setOn} />`,
  },
  'segmented-control': {
    name: 'SegmentedControl',
    preview: 'segmented-control',
    differences: [{ aspect: 'API', web: 'Compound Root + Item.', mobile: '`options` array and a required `label` for screen readers.' }],
    code: `<SegmentedControl label="Period" options={[{ value: 'w', label: 'Week' }, { value: 'm', label: 'Month' }]} defaultValue="w" />`,
  },
  slider: { name: 'Slider', preview: 'slider', differences: [label], code: `<Slider label="Volume" defaultValue={40} formatValue={(v) => \`\${v}%\`} />` },
  chip: { name: 'Chip', preview: 'chip', differences: [touch], code: `<Chip label="Food" selected={on} onPress={toggle} />` },
  'filter-chip': { name: 'FilterChip', preview: 'chip', differences: [touch], code: `<FilterChip label="This month" selected onPress={toggle} />` },
  'multi-select': {
    name: 'MultiSelect',
    preview: 'multi-select',
    differences: [
      { aspect: 'Menu', web: 'A popover list with chips in the field.', mobile: 'A sheet of checkbox rows (search above 8 options); the field summarises the picks.' },
      label,
    ],
    code: `<MultiSelect label="Labels" options={labels} value={picked} onValueChange={setPicked} />`,
  },
  'navigation-rail': {
    name: 'NavigationRail',
    preview: 'tabs',
    differences: [
      { aspect: 'Orientation', web: '`vertical` (default) or `bottom`, chosen by you.', mobile: '`auto` (default): a rail at the start edge on medium and expanded windows (≥ 600dp), a bottom bar on compact ones. `vertical` and `bottom` fix it.' },
      { aspect: 'Icon', web: 'Any icon element.', mobile: 'An icon component from @nexub/icons/native (`icon={Home}`).' },
      { aspect: 'Navigation', web: 'Links (`href`, or your router link with `asChild`).', mobile: '`onPress` on each item; your navigator changes the screen.' },
      { aspect: 'Screen readers', web: 'A nav landmark; the active link is `aria-current="page"`.', mobile: 'A tab list; the active item is selected. Badges are read after the label, as on web.' },
    ],
    code: `<NavigationRail.Root>
  <NavigationRail.Item icon={Home} label="Home" active onPress={goHome} />
  <NavigationRail.Item icon={Bell} label="Inbox" badge={3} onPress={goInbox} />
</NavigationRail.Root>`,
    notes: ['12.5. Safe-area insets are applied: the bottom bar clears the home indicator, the rail clears the status bar and a landscape notch.'],
  },
  'app-shell': {
    name: 'AppShell',
    preview: 'pattern/home',
    differences: [
      { aspect: 'Structure', web: 'Compound: AppShell.Root, Header, Body, Sidebar, Main and NavTrigger.', mobile: 'One component with `navigation`, `header` and the content as children.' },
      { aspect: 'Narrow screens', web: 'The sidebar moves into a drawer opened by NavTrigger (`open`, `onOpenChange`).', mobile: 'The navigation becomes a bottom bar under the content; no drawer.' },
      { aspect: 'Breakpoint', web: 'The sidebar shows from the lg breakpoint.', mobile: 'The rail shows from the medium window size class (600dp); `railFrom="expanded"` waits for 840dp.' },
    ],
    code: `<AppShell
  header={topBar}
  navigation={
    <NavigationRail.Root>
      <NavigationRail.Item icon={Home} label="Home" active onPress={goHome} />
      <NavigationRail.Item icon={Bell} label="Inbox" onPress={goInbox} />
    </NavigationRail.Root>
  }
>
  <ListDetail list={list} detail={detail} showDetail={!!selected} onBack={clear} />
</AppShell>`,
    notes: [
      '12.5. Layout follows `useWindowSizeClass()` (compact < 600, medium < 840, expanded), which updates on rotation, split view and folding.',
      'Foldables are handled by window size: React Native exposes no hinge or posture without a native module, so an unfolded foldable is a medium or expanded window like a tablet.',
    ],
  },
  tabs: {
    name: 'Tabs',
    preview: 'tabs',
    differences: [
      { aspect: 'Overflow', web: 'The list scrolls with edge fades; arrow keys move between tabs.', mobile: 'The list scrolls sideways and centres the active tab; no edge fades.' },
      { aspect: 'Orientation', web: 'Horizontal or vertical.', mobile: 'Horizontal only.' },
      { aspect: 'Panels', web: 'Crossfade in; swipe is not built in.', mobile: 'Swap without a transition; no swipe between panels.' },
      { aspect: 'Hit area', web: 'The trigger height.', mobile: '`sm` tabs extend to 44pt up and down with hitSlop.' },
    ],
    code: `<Tabs.Root defaultValue="overview">
  <Tabs.List accessibilityLabel="Project">
    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
    <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="overview">…</Tabs.Content>
  <Tabs.Content value="activity">…</Tabs.Content>
</Tabs.Root>`,
  },
  table: {
    name: 'Table',
    preview: 'table',
    differences: [
      { aspect: 'Column widths', web: 'Table layout: columns size to their content.', mobile: 'Set per column with `columns` on Root (128pt when unset); the last column fills what is left.' },
      { aspect: 'Sticky', web: '`stickyHeader` with `maxHeight`.', mobile: '`stickyFirstColumn`; rows are then one line high. No sticky header: the screen scrolls.' },
      { aspect: 'Screen readers', web: 'Native table semantics.', mobile: 'Each row is one element read as "Header: value" pairs; `accessible={false}` on a Row frees its controls.' },
      { aspect: 'States', web: '`Body` can show loading, empty and error states.', mobile: 'Not built in; use Skeleton, EmptyState and ErrorState around the table.' },
      { aspect: 'Extra', web: 'No divider prop.', mobile: '`dividerAfter` draws a heavier line under a row (the cut in a ranked list).' },
    ],
    code: `<Table.Root stickyFirstColumn columns={[120, 88, 88]}>
  <Table.Header>
    <Table.Row>
      <Table.Head>Team</Table.Head>
      <Table.Head numeric>Played</Table.Head>
      <Table.Head numeric>Points</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Rovers</Table.Cell>
      <Table.Cell numeric>12</Table.Cell>
      <Table.Cell numeric>29</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table.Root>`,
  },
  rating: {
    name: 'Rating',
    preview: 'rating',
    differences: [
      { aspect: 'Screen readers', web: 'A radio group: one radio per star, arrow keys move.', mobile: 'One adjustable control: swipe up or down to change the value; it can go down to 0.' },
      { aspect: 'Feedback', web: 'Stars preview on hover.', mobile: 'No hover; a selection haptic when the value changes.' },
      { aspect: 'Hit area', web: 'The star.', mobile: '44pt tall with hitSlop; sideways each star keeps its own width so neighbours do not overlap.' },
      { aspect: 'Props', web: '`value` only; `aria-label` names it.', mobile: 'Adds `defaultValue` and `label`.' },
    ],
    code: `<Rating value={stars} onValueChange={setStars} />`,
  },
  tooltip: {
    name: 'Tooltip',
    preview: 'tooltip',
    differences: [
      { aspect: 'Trigger', web: 'Hover or keyboard focus, after `delayDuration`.', mobile: 'Long-press; `delayDuration` is how long to hold.' },
      { aspect: 'Hiding', web: 'When the pointer or focus leaves.', mobile: 'After `duration` (2.5s) or a tap anywhere.' },
      { aspect: 'Screen readers', web: 'The tip describes the trigger.', mobile: 'The tip is the child’s `accessibilityHint`; the popover is hidden from VoiceOver and TalkBack.' },
      { aspect: 'Content', web: '`label` can be any node, with `description`, `shortcut` and `arrow`.', mobile: 'A text `label` only.' },
    ],
    code: `<Tooltip label="Copy link">
  <IconButton icon={Copy} label="Copy" />
</Tooltip>`,
  },
  'data-table': {
    name: 'DataList',
    preview: 'data-list',
    differences: [
      { aspect: 'Layout', web: 'Columns: resize, reorder, pin, virtualize.', mobile: 'One row per record with its key fields: no horizontal scrolling.' },
      { aspect: 'Sort', web: 'Click headers; Shift+click for more.', mobile: 'A Sort button opens a sheet: one sort and a direction.' },
      { aspect: 'Selection', web: 'Checkbox column and a floating bulk bar.', mobile: 'Checkbox rows; the bar above the list shows the count and your actions.' },
    ],
    code: `<DataList data={invoices} keyExtractor={(i) => i.id} title={(i) => i.customer} value={(i) => i.total} sorts={sorts} selectable />`,
  },
  // 11.8
  combobox: {
    name: 'ComboboxField',
    preview: 'combobox-field',
    differences: [
      { aspect: 'Menu', web: 'A popover listbox under the field; type to filter.', mobile: 'Opens a BottomSheet with a search box and the results list.' },
      { aspect: 'Async search', web: '`onSearch` and `loading`; you debounce.', mobile: '`onSearch` may return a promise; the field debounces (`searchDebounce`), ignores stale answers and shows loading, error and empty rows.' },
    ],
    code: `<ComboboxField label="City" options={cities} value={city} onValueChange={setCity} onSearch={searchCities} />`,
  },
  'currency-select': {
    name: 'CurrencySelect',
    preview: 'currency-select',
    differences: [{ aspect: 'List', web: 'Every currency Intl knows, with search.', mobile: 'The 40 most traded currencies in a sheet; pass `currencies` for others.' }],
    code: `<CurrencySelect label="Currency" value={currency} onValueChange={setCurrency} />`,
  },
  'switch-field': {
    name: 'SwitchField',
    preview: 'switch-field',
    differences: [label],
    code: `<SwitchField label="Round-ups" description="Save the change from every card payment." checked={on} onCheckedChange={setOn} />`,
  },
  'checkbox-field': {
    name: 'CheckboxField',
    preview: 'checkbox-field',
    differences: [{ aspect: 'Groups', web: 'CheckboxGroupField.', mobile: 'CheckboxGroupField too, with `options`.' }],
    code: `<CheckboxField label="I agree to the terms" checked={agreed} onCheckedChange={setAgreed} />`,
  },
  'file-upload': {
    name: 'FileUpload',
    preview: 'file-upload',
    differences: [
      { aspect: 'Picking', web: 'Click or drop files.', mobile: 'Bring your picker: `pickFiles` (expo-document-picker) and `capture` (expo-image-picker or expo-camera) for a camera button.' },
      { aspect: 'Checks', web: 'accept, transform, maxSize, validate, maxFiles.', mobile: 'The same checks in the same order; rejected files stay in the list with their error.' },
    ],
    code: `<FileUpload accept={['image/*']} multiple maxSize={5_000_000} pickFiles={pickImages} capture={takePhoto} transform={resize} />`,
  },
  'filter-builder': {
    name: 'FilterSheet',
    preview: 'filter-sheet',
    differences: [
      { aspect: 'Groups', web: 'Nested AND/OR groups.', mobile: 'One flat AND/OR list; nested groups from the web are kept, not edited.' },
      { aspect: 'Query', web: 'FilterGroup JSON.', mobile: 'The same FilterGroup JSON (from @nexub/core), so views move between platforms.' },
    ],
    code: `<FilterSheet open={open} onOpenChange={setOpen} fields={fields} value={query} onValueChange={setQuery} />`,
  },
  'otp-input': {
    name: 'OTPInput',
    preview: 'otp-input',
    differences: [
      { aspect: 'Fields', web: 'One input per digit; the first takes one-time-code autofill.', mobile: 'One field drawn as cells, so SMS autofill works on iOS and Android.' },
      label,
    ],
    code: `<OTPInput label="Verification code" length={6} onComplete={verify} />`,
  },
  select: {
    name: 'Select',
    preview: 'select',
    differences: [{ aspect: 'Menu', web: 'A popover listbox.', mobile: 'Opens a BottomSheet of options; `options` array.' }, label],
    code: `<Select label="Country" options={countries} value={country} onValueChange={setCountry} />`,
  },
  'date-picker': {
    name: 'DateTimeField',
    preview: 'date-time-field',
    differences: [{ aspect: 'Picker', web: 'Nexub calendar popover.', mobile: 'The platform date/time picker (needs @react-native-community/datetimepicker).' }],
    code: `<DateTimeField label="Date of birth" value={dob} onValueChange={setDob} mode="date" />`,
  },
  'time-picker': {
    name: 'DateTimeField',
    preview: 'date-time-field',
    differences: [{ aspect: 'Picker', web: 'Native time input.', mobile: 'The platform time picker: `mode="time"`.' }],
    code: `<DateTimeField label="Remind me at" mode="time" value={at} onValueChange={setAt} />`,
  },
  'date-time-picker': {
    name: 'DateTimeField',
    preview: 'date-time-field',
    differences: [{ aspect: 'Fields', web: 'One group: date button and time input.', mobile: 'Two DateTimeFields, `mode="date"` and `mode="time"`, on the same Date.' }],
    code: `<DateTimeField label="Date" mode="date" value={start} onValueChange={setStart} />\n<DateTimeField label="Time" mode="time" value={start} onValueChange={setStart} />`,
  },
  'tree-view': {
    name: 'TreeList',
    preview: 'tree-list',
    differences: [{ aspect: 'Layout', web: 'An indented tree; Arrow keys open and close.', mobile: 'Drill-down lists with a back row: one level at a time.' }],
    code: `<TreeList rootTitle="Teams" nodes={teams} selected={picked} onSelect={setPicked} />`,
  },
  sortable: {
    name: 'SortableList',
    preview: 'sortable-list',
    differences: [{ aspect: 'Moving', web: 'Drag, or Alt+Arrow on a handle.', mobile: 'Move up / down buttons, and the same moves as VoiceOver and TalkBack actions.' }],
    code: `<SortableList items={widgets} keyExtractor={(w) => w.id} title={(w) => w.name} onReorder={setWidgets} />`,
  },
  stepper: {
    name: 'StepProgress',
    preview: 'step-progress',
    differences: [{ aspect: 'Steps', web: 'Every step with its label; reachable steps are buttons.', mobile: 'Segments and "Step 2 of 4: Billing"; move with your screen’s Back and Continue.' }],
    code: `<StepProgress steps={steps} current={1} />`,
  },
  'inline-edit': {
    name: 'InlineEdit',
    preview: 'inline-edit',
    differences: [{ aspect: 'Saving', web: 'Enter or blur saves; Escape reverts.', mobile: 'Return or leaving the field saves.' }],
    code: `<InlineEdit label="Project name" value={name} onSave={setName} />`,
  },
  'qr-code': {
    name: 'QRCode',
    preview: 'qr-code',
    differences: [
      { aspect: 'Drawing', web: 'An inline SVG; `size` takes pixels or any CSS length.', mobile: 'react-native-svg; `size` is in points.' },
      { aspect: 'Colours', web: 'Dark on light in every theme (the light roles are pinned).', mobile: 'The same: the light scheme’s colours, also in dark mode.' },
      { aspect: 'Reading one', web: 'Not in the browser.', mobile: '`QRScanner` reads codes with the camera.' },
    ],
    code: `<QRCode value="https://example.com/h/4729" size={200} />`,
  },
  'description-list': {
    name: 'DescriptionList',
    preview: 'description-list',
    differences: [
      { aspect: 'Columns', web: 'Up to three, by the width of the list itself.', mobile: 'One on phones; two from 600pt of window width.' },
      { aspect: 'Screen readers', web: '`<dl>`, `<dt>` and `<dd>`.', mobile: 'A row of plain text reads as one element: "Fee, $1.00".' },
    ],
    code: `<DescriptionList.Root divided>
  <DescriptionList.Item label="Fee">$1.00</DescriptionList.Item>
  <DescriptionList.Item label="Total" emphasis>$251.00</DescriptionList.Item>
</DescriptionList.Root>`,
  },
  'comparison-bar': {
    name: 'ComparisonBar',
    preview: 'comparison-bar',
    differences: [
      { aspect: 'Text alternative', web: 'The bar is an image; `aria-label` replaces its name.', mobile: 'The whole component is one image; `accessibilityLabel` replaces its name.' },
      { aspect: 'Motion', web: 'The split moves with a CSS transition.', mobile: 'The split glides on the spatial spring (Reanimated); Reduce Motion is honoured.' },
    ],
    code: `<ComparisonBar label="Orders" left={{ label: 'This week', value: 128 }} right={{ label: 'Last week', value: 96 }} />`,
  },
  'phone-input': {
    name: 'PhoneInput',
    preview: 'phone-input',
    differences: [
      { aspect: 'Country list', web: 'A searchable select, or a sheet on phones with `sheet`.', mobile: 'Always a bottom sheet with search.' },
      { aspect: 'Label and errors', web: 'Bring your own Label and FormError; `invalid` turns the outline red.', mobile: '`label` is required; `error` shows the message and the red outline.' },
      { aspect: 'Keyboard', web: '`type="tel"`.', mobile: 'The phone pad, with the platform’s phone-number autofill.' },
    ],
    code: `<PhoneInput label="Mobile number" defaultCountry="SG" value={phone} onValueChange={(e164, { valid }) => setPhone(e164)} />`,
  },
  countdown: {
    name: 'Countdown',
    preview: 'countdown',
    differences: [
      { aspect: 'In the background', web: 'Reads the clock again when the tab is visible.', mobile: 'Reads the clock again when the app returns to the foreground.' },
      { aspect: 'Announcements', web: 'A polite live region.', mobile: 'VoiceOver and TalkBack announcements at the same moments: each minute, 30, 10 and 5 seconds, and the end.' },
      { aspect: 'Sizes', web: 'sm, md and lg chips.', mobile: 'sm and md chips.' },
    ],
    code: `<Countdown to={expiresAt} onExpire={resend} />`,
  },
  alert: { name: 'Banner', preview: 'banner', differences: [{ aspect: 'Name', web: 'Alert.', mobile: 'Banner.' }], code: `<Banner tone="info">Transfers over S$5,000 take one working day.</Banner>` },
  toast: {
    name: 'ToastProvider + useToast',
    preview: 'toast',
    differences: [
      { aspect: 'Stack', web: 'A stack you can expand.', mobile: 'One at a time, above the tab bar; announced to screen readers.' },
      { aspect: 'Timing', web: 'Configurable.', mobile: "'short' 4 s; 'long' 10 s, the default when it has an action (WCAG 2.2.1)." },
    ],
    code: `const toast = useToast();
toast({ message: 'Payment sent', action: { label: 'Undo', onPress: undo } });`,
  },
  dialog: {
    name: 'Dialog',
    preview: 'dialog',
    differences: [{ aspect: 'Use', web: 'Forms and long content.', mobile: 'Short confirmations only: put forms in a BottomSheet or a screen.' }],
    code: `<Dialog
  open={open}
  onOpenChange={setOpen}
  title="Remove card?"
  actions={
    <>
      <Button variant="text" onPress={() => setOpen(false)}>Cancel</Button>
      <Button tone="danger" onPress={remove}>Remove</Button>
    </>
  }
/>`,
  },
  'alert-dialog': {
    name: 'Dialog',
    preview: 'dialog',
    differences: [{ aspect: 'Dismiss', web: 'AlertDialog never closes on outside click.', mobile: '`dismissible={false}` gives the same.' }],
    code: `<Dialog dismissible={false} open={open} onOpenChange={setOpen} title="Sign out?" actions={<Button onPress={signOut}>Sign out</Button>} />`,
  },
  drawer: {
    name: 'BottomSheet',
    preview: 'bottom-sheet',
    differences: [{ aspect: 'Edge', web: 'Any side.', mobile: 'From the bottom with detents (content height or a 0–1 screen fraction) and a grabber; keyboard-aware.' }],
    code: `<BottomSheet open={open} onOpenChange={setOpen} title="Filters" detents={[0.5, 0.9]}>…</BottomSheet>`,
  },
  sheet: {
    name: 'BottomSheet',
    preview: 'bottom-sheet',
    differences: [{ aspect: 'Edge', web: 'Any side.', mobile: 'Bottom only, with detents.' }],
    code: `<BottomSheet open={open} onOpenChange={setOpen} title="Details">…</BottomSheet>`,
  },
  progress: { name: 'Progress', preview: 'progress', differences: [{ aspect: 'Label', web: 'Optional.', mobile: '`label` is required (screen readers).' }], code: `<Progress value={0.6} label="Uploading" />` },
  spinner: { name: 'LoadingIndicator', preview: 'loading-indicator', differences: [{ aspect: 'Name', web: 'Spinner.', mobile: 'LoadingIndicator: the platform activity indicator in the primary colour.' }], code: `<LoadingIndicator />` },
  skeleton: {
    name: 'Skeleton',
    preview: 'skeleton',
    differences: [],
    code: `<Skeleton width="60%" height={16} />`,
    notes: ['`SkeletonSwap` crossfades from the skeleton to the loaded content in place, like the web `SkeletonSwap`: `<SkeletonSwap loading={loading} skeleton={<Skeleton height={32} />}>…</SkeletonSwap>`.'],
  },
  'empty-state': { name: 'EmptyState', preview: 'empty-state', differences: [], code: `<EmptyState title="No transactions yet" action={<Button onPress={topUp}>Add money</Button>} />` },
  'error-state': { name: 'ErrorState', preview: 'error-state', differences: [], code: `<ErrorState onRetry={refetch} />` },
  illustration: {
    name: 'Illustration',
    preview: 'empty-state',
    differences: [
      { aspect: 'Colour', web: 'CSS colour roles; system colours under forced colours.', mobile: 'Theme roles via react-native-svg; follows scheme, contrast (high contrast) and the product accent.' },
      { aspect: 'Decorative', web: '`aria-hidden` without a `title`.', mobile: 'Hidden from VoiceOver and TalkBack without a `title`; with one it is an image.' },
    ],
    code: `<EmptyState title="All done" illustration={<Illustration kind="success" />} />`,
    notes: ['`EmptyState`, `ErrorState` and `ResultScreen` take the art through their `illustration` prop (12.3); without it they keep the icon disc.'],
  },
  'dropdown-menu': {
    name: 'ContextMenu / ActionSheet',
    preview: 'context-menu',
    differences: [{ aspect: 'Trigger', web: 'Click a button.', mobile: 'Long-press for ContextMenu; a button opens an ActionSheet.' }],
    code: `<ContextMenu actions={[{ label: 'Copy', onPress: copy }, { label: 'Delete', destructive: true, onPress: del }]}>…</ContextMenu>`,
  },
};

export interface MobileOnlyEntry {
  slug: string;
  name: string;
  title: string;
  category: string;
  description: string;
  preview: PreviewSlug;
  code: string;
  webAlternative?: string;
  /** Defaults to NATIVE_STATUS. */
  status?: ComponentStatus;
}

/** Components that exist only in @nexub/react-native. */
export const mobileOnly: MobileOnlyEntry[] = [
  { slug: 'list-item', name: 'ListItem', title: 'List Item', category: 'Containers', preview: 'list-item', description: 'One row, one target: navigation, switch, checkbox, radio, button and value rows, read as one element.', code: `<ListSection header="Security">\n  <ListItem title="Face ID" variant="switch" checked={on} onCheckedChange={setOn} />\n  <ListItem title="Change PIN" variant="navigation" onPress={go} />\n</ListSection>`, webAlternative: 'InfoList or SettingsSection' },
  { slug: 'list-section', name: 'ListSection', title: 'List Section', category: 'Containers', preview: 'list-item', description: 'Inset-grouped list with a header and footer, like iOS Settings.', code: `<ListSection header="Account" footer="Used for receipts.">…</ListSection>`, webAlternative: 'SettingsSection' },
  { slug: 'bottom-sheet', name: 'BottomSheet', title: 'Bottom Sheet', category: 'Overlays', preview: 'bottom-sheet', description: 'A sheet from the bottom with detents, a grabber and keyboard handling. Works in Expo Go; no native dependency.', code: `<BottomSheet open={open} onOpenChange={setOpen} detents={[0.5, 0.9]} title="Filters">…</BottomSheet>`, webAlternative: 'Sheet / Drawer' },
  { slug: 'action-sheet', name: 'ActionSheet', title: 'Action Sheet', category: 'Overlays', preview: 'action-sheet', description: 'A list of actions from the bottom: the system sheet on iOS, a Nexub sheet on Android.', code: `<ActionSheet open={open} onOpenChange={setOpen} title="Photo" actions={[{ label: 'Take photo', onPress: shoot }, { label: 'Remove', destructive: true, onPress: remove }]} />`, webAlternative: 'DropdownMenu' },
  { slug: 'context-menu', name: 'ContextMenu', title: 'Context Menu', category: 'Overlays', preview: 'context-menu', description: 'Long-press menu with the actions also exposed as accessibility actions.', code: `<ContextMenu actions={actions}><ListItem title="Amazon" value="−S$42.50" /></ContextMenu>`, webAlternative: 'ContextMenu' },
  { slug: 'swipeable-row', name: 'SwipeableRow', title: 'Swipeable Row', category: 'Lists', preview: 'swipeable-row', description: 'Swipe a row to reveal actions; every swipe action is also an accessibility action.', code: `<SwipeableRow label="Amazon" actions={[{ label: 'Archive', onPress: archive }, { label: 'Delete', tone: 'danger', onPress: del }]}>…</SwipeableRow>` },
  { slug: 'refresh-control', name: 'RefreshControl', title: 'Refresh Control', category: 'Lists', preview: 'pattern/activity', description: 'Pull to refresh in Nexub colours.', code: `<ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}>…</ScrollView>` },
  { slug: 'file-list', name: 'FileList', title: 'File List', category: 'Inputs', preview: 'file-list', description: 'Files picked for upload with progress, errors and remove or cancel. Bring your own picker (expo-document-picker).', code: `<FileList files={files} onAdd={pick} onRemove={remove} onCancel={cancel} />`, webAlternative: 'FileUpload' },
  { slug: 'numeric-keypad', name: 'NumericKeypad', title: 'Numeric Keypad', category: 'Inputs', preview: 'numeric-keypad', description: 'An on-screen keypad for amounts and PINs, with the locale’s decimal key.', code: `<NumericKeypad decimal onKey={press} />` },
  { slug: 'expressive-money-input', name: 'ExpressiveMoneyInput', title: 'Expressive Money Input', category: 'Inputs', preview: 'expressive-money-input', description: 'The big amount on a send-money screen; pair with NumericKeypad.', code: `<ExpressiveMoneyInput label="Amount" currency="SGD" value={v} onValueChange={setV} caption="Balance S$2,400" />`, webAlternative: 'MoneyInput' },
  { slug: 'date-time-field', name: 'DateTimeField', title: 'Date Time Field', category: 'Inputs', preview: 'date-time-field', description: 'Opens the platform date or time picker.', code: `<DateTimeField label="Date" mode="date" value={d} onValueChange={setD} />`, webAlternative: 'DatePicker' },
  { slug: 'sensitive-value', name: 'SensitiveValue', title: 'Sensitive Value', category: 'Privacy', preview: 'sensitive-value', description: 'Masks a balance or card number until revealed; re-masks when the app goes to the background and reads as "hidden".', code: `<SensitiveValue label="Balance"><Amount value={2400} currency="SGD" /></SensitiveValue>` },
  { slug: 'privacy-shield', name: 'PrivacyShield', title: 'Privacy Shield', category: 'Privacy', preview: 'privacy-shield', description: 'Covers the app in the app switcher and can block screenshots (expo-screen-capture).', code: `<PrivacyShield preventCapture>{children}</PrivacyShield>` },
  { slug: 'carousel', name: 'Carousel', title: 'Carousel', category: 'Layout', preview: 'carousel', description: 'Paged horizontal list with snapping; pair with PageIndicator.', code: `<Carousel data={cards} renderItem={({ item }) => <Card>…</Card>} onIndexChange={setI} />` },
  { slug: 'page-indicator', name: 'PageIndicator', title: 'Page Indicator', category: 'Layout', preview: 'carousel', description: 'Dots for a carousel or onboarding pages.', code: `<PageIndicator count={3} index={i} />` },
  { slug: 'sticky-footer', name: 'StickyFooter', title: 'Sticky Footer', category: 'Layout', preview: 'sticky-footer', description: 'Keeps the primary action above the keyboard and home indicator.', code: `<StickyFooter footer={<Button size="lg">Continue</Button>}>…</StickyFooter>` },
  { slug: 'offline-banner', name: 'OfflineBanner', title: 'Offline Banner', category: 'Feedback', preview: 'offline-banner', description: 'A slim banner while the device is offline.', code: `<OfflineBanner />` },
  { slug: 'coachmark', name: 'Coachmark', title: 'Coachmark', category: 'Feedback', preview: 'coachmark', description: 'A one-time hint pointing at a control, dismissed by the user.', code: `<Coachmark title="New: split bills" onDismiss={seen}>Tap here to split.</Coachmark>` },
  { slug: 'fab', name: 'FAB', title: 'FAB', category: 'Actions', preview: 'fab', description: 'Floating action button. Android only by default (`platforms`), since it reads as Material.', code: `<FAB icon={Plus} label="New transfer" onPress={create} extended />` },
  { slug: 'qr-scanner', name: 'QRScanner', title: 'QR Scanner', category: 'Inputs', preview: 'qr-scanner', description: 'Scans QR codes with the camera (optional peer expo-camera): permission flow, torch, a haptic and an announcement on each code, and manual entry always one tap away. The preview has no camera, so it shows the manual-entry fallback.', code: `<QRScanner onScan={redeem} fallback={<TextField label="Code" value={code} onChangeText={setCode} />} />`, webAlternative: 'QRCode shows a code; reading one needs the device camera' },
];

export function getMobileOnly(slug: string) {
  return mobileOnly.find((m) => m.slug === slug);
}

/** Web pattern (docs slug) → the native screen that does the same job. */
export const nativePatternTwins: Record<string, NativeTwin> = {
  'status-steps': {
    name: 'StatusSteps',
    preview: 'pattern/status',
    differences: [
      { aspect: 'Screen readers', web: 'An ordered list; each title is prefixed with its status.', mobile: 'Each step is one element: "completed: Application sent, Mon 10:30". Its action stays a separate element.' },
      { aspect: 'Name', web: '`aria-label` or `aria-labelledby`.', mobile: '`accessibilityLabel` (required).' },
    ],
    code: `import { StatusSteps } from '@nexub/react-native/patterns';

<StatusSteps accessibilityLabel="Application status" steps={steps} />`,
  },
  'activity-feed': {
    name: 'ActivityList',
    preview: 'pattern/activity',
    differences: [
      { aspect: 'Row actions', web: 'Buttons or a menu on each row.', mobile: 'Swipe actions (also accessibility actions) via `actions`.' },
      { aspect: 'Loading more', web: 'Pagination or a "Load more" button.', mobile: 'Pull to refresh (`onRefresh`) and `onEndReached` for infinite scroll.' },
    ],
    code: `import { ActivityList } from '@nexub/react-native/patterns';

<ActivityList transactions={txs} onPress={openTx} onRefresh={refetch} refreshing={loading} />`,
  },
  'auth-card': {
    name: 'SignInScreen',
    preview: 'pattern/signin',
    differences: [
      { aspect: 'Layout', web: 'A centred card on a page.', mobile: 'A full screen with the action pinned above the keyboard.' },
      { aspect: 'Biometrics', web: 'Passkeys through the browser.', mobile: '`onBiometric` + `biometricLabel` for Face ID or fingerprint.' },
    ],
    code: `import { SignInScreen } from '@nexub/react-native/patterns';

<SignInScreen onSubmit={signIn} onBiometric={unlock} biometricLabel="Sign in with Face ID" error={error} />`,
  },
  conversation: {
    name: 'ChatScreen',
    preview: 'pattern/chat',
    differences: [{ aspect: 'Composer', web: 'PromptInput with attachments and shortcuts.', mobile: 'Composer pinned above the keyboard; send on the return key.' }],
    code: `import { ChatScreen } from '@nexub/react-native/patterns';

<ChatScreen messages={messages} onSend={send} thinking={streaming} />`,
  },
  'plan-card': {
    name: 'PaywallScreen',
    preview: 'pattern/paywall',
    differences: [{ aspect: 'Scope', web: 'One PlanCard per plan, laid out by you.', mobile: 'The whole paywall: plans, subscribe, restore purchases, terms (App Store rules).' }],
    code: `import { PaywallScreen } from '@nexub/react-native/patterns';

<PaywallScreen title="Payub Plus" plans={plans} onSubscribe={buy} onRestore={restore} />`,
  },
  'settings-section': {
    name: 'SettingsScreen',
    preview: 'pattern/settings',
    differences: [{ aspect: 'Rows', web: 'SettingsSection rows with controls.', mobile: 'Inset-grouped ListSections of ListItems, like iOS Settings.' }],
    code: `import { SettingsScreen } from '@nexub/react-native/patterns';

<SettingsScreen groups={[{ header: 'Security', items: [{ title: 'Face ID', variant: 'switch', checked: faceId, onCheckedChange: setFaceId }] }]} />`,
  },
  'list-detail': {
    name: 'ListDetail',
    preview: 'pattern/detail',
    differences: [
      { aspect: 'When it splits', web: 'At 720px of its own width (a container query).', mobile: 'From the medium window size class (600dp): tablets, unfolded foldables, phones in landscape.' },
      { aspect: 'Pane width', web: '`listWidth` (sm, md, lg).', mobile: '`listWidth`, or `splitRatio` (0.2–0.8) for a share of the width.' },
      { aspect: 'Back', web: 'The back button when narrow.', mobile: 'The back button and Android’s back gesture, on compact windows while the detail shows.' },
      { aspect: 'Scrolling', web: 'Each pane scrolls.', mobile: 'Each pane fills its height; bring a FlatList (e.g. ActivityList) or ScrollView.' },
    ],
    code: `import { ListDetail, ActivityList, TransactionDetail } from '@nexub/react-native/patterns';

<ListDetail
  list={<ActivityList transactions={txs} onPress={(t) => setSelected(t)} />}
  detail={selected ? <TransactionDetail transaction={selected} /> : <EmptyState title="Pick a payment" />}
  showDetail={!!selected}
  onBack={() => setSelected(null)}
  splitRatio={0.4}
/>`,
    notes: ['12.5. On a phone in portrait it shows one pane, as before; you can still push TransactionDetail onto your stack instead.'],
  },
  'notification-item': {
    name: 'NotificationsInbox',
    preview: 'pattern/inbox',
    differences: [{ aspect: 'Scope', web: 'One NotificationItem; lay out the list yourself.', mobile: 'The whole inbox with "Mark all read".' }],
    code: `import { NotificationsInbox } from '@nexub/react-native/patterns';

<NotificationsInbox notifications={items} onPress={open} onMarkAllRead={markAll} />`,
  },
  'stat-card': {
    name: 'StatCard',
    preview: 'stat-card',
    differences: [
      { aspect: 'Import', web: '`@nexub/patterns`.', mobile: '`@nexub/react-native` (the main entry).' },
      { aspect: 'Icon', web: 'Any node.', mobile: 'One icon element, e.g. `<Wallet />`.' },
      { aspect: 'Pressable', web: 'Wrap it in a link.', mobile: '`onPress` makes the card one button.' },
      { aspect: 'Vivid', web: 'Lifts on hover.', mobile: 'Lifts while pressed (pressable cards).' },
    ],
    code: `<StatCard label="Active members" value={2840} delta="+12.5%" deltaType="increase" icon={<Users />} category="emerald" trend={weekly} />`,
  },
  'user-card': {
    name: 'ProfileHeader',
    preview: 'pattern/settings',
    differences: [{ aspect: 'Use', web: 'A card in a grid or list.', mobile: 'The header row at the top of Settings or a profile screen.' }],
    code: `import { ProfileHeader } from '@nexub/react-native/patterns';

<ProfileHeader name="Sasi" detail="sasi@nexub.ai" onPress={editProfile} />`,
  },
};
