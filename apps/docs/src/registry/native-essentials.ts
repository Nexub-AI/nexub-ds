/**
 * 11.8: the native essentials list (ROADMAP_12.x.md, decision 3).
 *
 * @nexub/react-native aims at this list, not at full parity with @nexub/react:
 * the components a phone app's screens are built from, chosen from the screens
 * in @nexub/react-native/patterns and the mobile app. A web component outside the
 * list has no twin on purpose; its page says what to use on phones instead
 * (`webOnly` in the component registry, or a mobile-only component).
 * From 12.6 the usage scanner keeps the list current.
 *
 * native-essentials.test.ts checks that every name here is exported by
 * @nexub/react-native (from native-props.generated.json).
 */
export type EssentialArea = 'Actions' | 'Inputs' | 'Selection' | 'Display' | 'Lists and data' | 'Feedback' | 'Overlays' | 'Navigation and layout' | 'Privacy';

export interface NativeEssential {
  /** Export name in @nexub/react-native. */
  name: string;
  area: EssentialArea;
  /** The version that brought it to native. Omitted for components that were there before 11.8. */
  since?: '11.8';
  /** A hook, not a component (no generated prop table). */
  hook?: boolean;
}

const e = (area: EssentialArea, names: string[], since?: '11.8'): NativeEssential[] => names.map((name) => ({ name, area, ...(since ? { since } : {}) }));

export const nativeEssentials: NativeEssential[] = [
  ...e('Actions', ['Button', 'IconButton', 'ButtonGroup', 'Link', 'FAB', 'Chip']),
  ...e('Inputs', ['TextField', 'PasswordInput', 'SearchField', 'MoneyInput', 'ExpressiveMoneyInput', 'NumericKeypad', 'Stepper', 'OTPInput', 'PhoneInput', 'DateTimeField', 'InlineEdit', 'Slider', 'Rating', 'FileList', 'QRScanner']),
  ...e('Inputs', ['FileUpload', 'CurrencySelect'], '11.8'),
  ...e('Selection', ['Checkbox', 'RadioGroup', 'Radio', 'Switch', 'SegmentedControl', 'Select', 'MultiSelect']),
  ...e('Selection', ['ComboboxField', 'SwitchField', 'CheckboxField', 'CheckboxGroupField'], '11.8'),
  ...e('Display', ['Text', 'Heading', 'Icon', 'IconChip', 'Amount', 'Badge', 'Avatar', 'AvatarGroup', 'Card', 'Divider', 'DescriptionList', 'ComparisonBar', 'StatCard', 'NumberTicker', 'QRCode', 'Countdown']),
  ...e('Lists and data', ['ListItem', 'ListSection', 'Table', 'SwipeableRow', 'RefreshControl', 'DataList', 'FilterSheet', 'TreeList', 'SortableList', 'Accordion']),
  ...e('Feedback', ['Banner', 'ToastProvider', 'Progress', 'StepProgress', 'Skeleton', 'SkeletonText', 'EmptyState', 'ErrorState', 'OfflineBanner', 'Coachmark', 'Tooltip']),
  ...e('Overlays', ['Dialog', 'BottomSheet', 'ActionSheet', 'ContextMenu']),
  { name: 'usePrompt', area: 'Overlays', since: '11.8', hook: true },
  ...e('Navigation and layout', ['Tabs', 'ScreenContainer', 'StickyFooter', 'Carousel', 'PageIndicator', 'Surface']),
  ...e('Privacy', ['SensitiveValue', 'PrivacyShield']),
];

export const essentialAreas: EssentialArea[] = [...new Set(nativeEssentials.map((x) => x.area))];
