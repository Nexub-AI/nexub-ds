/**
 * Web ↔ mobile mapping for the docs' Web · Mobile toggle.
 *
 * Props come from source (native-props.generated.json, built by
 * scripts/native-props.mjs); this file holds what source can't say: which
 * native component pairs with which web page, how they differ, and a usage
 * snippet. `preview` is the slug of the live preview in apps/mobile.
 */
import nativeProps from './native-props.generated.json';

export interface PlatformDifference {
  aspect: string;
  web: string;
  mobile: string;
}

export interface NativeTwin {
  /** Export name in @nexub/react-native. */
  name: string;
  /** Live-preview slug (apps/mobile preview manifest). */
  preview: string;
  differences: PlatformDifference[];
  code: string;
  notes?: string[];
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
      { aspect: 'Layout', web: 'Connected segments in a row.', mobile: '`direction="row"` or `"stack"`: full-width buttons stacked, primary on top, as Apple and Material lay out sheet actions.' },
    ],
    code: `<ButtonGroup direction="stack">
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
      { aspect: 'Dot', web: 'Use `leadingIcon` for a dot.', mobile: '`dot` renders a status dot; covers web’s deprecated Tag and StatusPill.' },
      { aspect: 'Sizes', web: 'sm, md, lg.', mobile: 'sm, md.' },
    ],
    code: `<Badge tone="success" variant="soft" dot>Paid</Badge>`,
  },
  avatar: {
    name: 'Avatar',
    preview: 'avatar',
    differences: [{ aspect: 'Status', web: 'Compose a Badge.', mobile: '`badge` adds the presence dot.' }],
    code: `<Avatar src={user.photo} name={user.name} size="lg" badge />`,
  },
  'avatar-group': {
    name: 'AvatarGroup',
    preview: 'avatar-group',
    differences: [],
    code: `<AvatarGroup max={3}>{people.map((p) => <Avatar key={p.id} name={p.name} />)}</AvatarGroup>`,
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
  banner: {
    name: 'Banner',
    preview: 'banner',
    differences: [{ aspect: 'Scope', web: 'Banner, Alert and Callout.', mobile: 'Banner covers all three.' }],
    code: `<Banner tone="warning" title="Verify your identity" action={<Button variant="text" onPress={verify}>Start</Button>} />`,
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
    differences: [{ aspect: 'Dismiss', web: 'AlertDialog never closes on outside click.', mobile: '`dismissable={false}` gives the same.' }],
    code: `<Dialog dismissable={false} open={open} onOpenChange={setOpen} title="Sign out?" actions={<Button onPress={signOut}>Sign out</Button>} />`,
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
  skeleton: { name: 'Skeleton', preview: 'skeleton', differences: [], code: `<Skeleton width="60%" height={16} />` },
  'empty-state': { name: 'EmptyState', preview: 'empty-state', differences: [], code: `<EmptyState title="No transactions yet" action={<Button onPress={topUp}>Add money</Button>} />` },
  'error-state': { name: 'ErrorState', preview: 'error-state', differences: [], code: `<ErrorState onRetry={refetch} />` },
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
  preview: string;
  code: string;
  webAlternative?: string;
}

/** Components that exist only in @nexub/react-native. */
export const mobileOnly: MobileOnlyEntry[] = [
  { slug: 'list-item', name: 'ListItem', title: 'List Item', category: 'Containers', preview: 'list-item', description: 'One row, one target: navigation, switch, checkbox, radio, button and value rows, read as one element.', code: `<ListSection header="Security">\n  <ListItem title="Face ID" variant="switch" checked={on} onCheckedChange={setOn} />\n  <ListItem title="Change PIN" variant="navigation" onPress={go} />\n</ListSection>`, webAlternative: 'InfoList or SettingsSection' },
  { slug: 'list-section', name: 'ListSection', title: 'List Section', category: 'Containers', preview: 'list-item', description: 'Inset-grouped list with a header and footer, like iOS Settings.', code: `<ListSection header="Account" footer="Used for receipts.">…</ListSection>`, webAlternative: 'SettingsSection' },
  { slug: 'bottom-sheet', name: 'BottomSheet', title: 'Bottom Sheet', category: 'Overlays', preview: 'bottom-sheet', description: 'A sheet from the bottom with detents, a grabber and keyboard handling. Works in Expo Go; no native dependency.', code: `<BottomSheet open={open} onOpenChange={setOpen} detents={[0.5, 0.9]} title="Filters">…</BottomSheet>`, webAlternative: 'Sheet / Drawer' },
  { slug: 'action-sheet', name: 'ActionSheet', title: 'Action Sheet', category: 'Overlays', preview: 'action-sheet', description: 'A list of actions from the bottom: the system sheet on iOS, a Nexub sheet on Android.', code: `<ActionSheet open={open} onOpenChange={setOpen} title="Photo" actions={[{ label: 'Take photo', onPress: shoot }, { label: 'Remove', destructive: true, onPress: remove }]} />`, webAlternative: 'DropdownMenu' },
  { slug: 'context-menu', name: 'ContextMenu', title: 'Context Menu', category: 'Overlays', preview: 'context-menu', description: 'Long-press menu with the actions also exposed as accessibility actions.', code: `<ContextMenu actions={actions}><ListItem title="Amazon" value="−S$42.50" /></ContextMenu>`, webAlternative: 'ContextMenu' },
  { slug: 'swipeable-row', name: 'SwipeableRow', title: 'Swipeable Row', category: 'Lists', preview: 'swipeable-row', description: 'Swipe a row to reveal actions; every swipe action is also an accessibility action.', code: `<SwipeableRow label="Amazon" actions={[{ label: 'Archive', onPress: archive }, { label: 'Delete', tone: 'danger', onPress: del }]}>…</SwipeableRow>` },
  { slug: 'refresh-control', name: 'RefreshControl', title: 'Refresh Control', category: 'Lists', preview: 'refresh-control', description: 'Pull to refresh in Nexub colours.', code: `<ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}>…</ScrollView>` },
  { slug: 'otp-input', name: 'OTPInput', title: 'OTP Input', category: 'Inputs', preview: 'otp-input', description: 'One field drawn as cells, so SMS one-time-code autofill works on iOS and Android.', code: `<OTPInput label="Verification code" length={6} onComplete={verify} />` },
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
];

export function getMobileOnly(slug: string) {
  return mobileOnly.find((m) => m.slug === slug);
}
