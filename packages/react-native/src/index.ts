// @nexub/react-native — native chrome, Nexub content (MOBILE_PLAN.md).

// Theme
export {
  NexubNativeProvider,
  useTheme,
  useRoles,
  useHaptics,
  useNexubMessages,
} from './theme/ThemeProvider';
export type {
  NexubNativeProviderProps,
  NexubTheme,
  Roles,
  RoleName,
  Scheme,
  ElevationLevel,
} from './theme/ThemeProvider';
export { nexubFonts, fontStyle } from './theme/fonts';
export type { FontFamily, FontSource } from './theme/fonts';
export { playHaptic } from './theme/haptics';
export type { HapticToken } from './theme/haptics';
export { nxSpring, nxEnter, nxExit, nxLayout } from './theme/motion';
export type { SpringFamily, SpringSpeed, EnterKind, ExitKind } from './theme/motion';
export { useControllableState } from './hooks/useControllableState';

// Primitives
export { Text, Heading } from './primitives/Text';
export type { TextProps, HeadingProps } from './primitives/Text';
export { Pressable } from './primitives/Pressable';
export type { PressableProps } from './primitives/Pressable';
export { Surface } from './primitives/Surface';
export type { SurfaceProps, SurfaceTone, ShapeName } from './primitives/Surface';
export { Box, Stack, Inline } from './primitives/Layout';
export type { BoxProps, Space } from './primitives/Layout';
export { Icon } from './primitives/Icon';
export type { IconProps } from './primitives/Icon';
export { ScreenContainer } from './primitives/ScreenContainer';
export type { ScreenContainerProps } from './primitives/ScreenContainer';

// Shared with @nexub/react
export { defaultMessages, directionOf } from '@nexub/core';
export type {
  NexubMessages,
  Direction,
  ToneValue,
  Product,
  GlassMode,
  ContrastLevel,
  ControlSize,
} from '@nexub/core';

// Components
export { Button, IconButton, ButtonGroup, Link } from './components/actions';
export type {
  ButtonProps,
  ButtonVariant,
  IconButtonProps,
  ButtonGroupProps,
  LinkProps,
  ButtonStatus,
} from './components/actions';
export { Amount, Badge, Avatar, AvatarGroup, Divider } from './components/display';
export type {
  AmountProps,
  BadgeProps,
  AvatarProps,
  AvatarSize,
  AvatarGroupProps,
  DividerProps,
} from './components/display';
export {
  TextField,
  PasswordInput,
  SearchField,
  MoneyInput,
  Stepper,
  Checkbox,
  RadioGroup,
  Radio,
  Switch,
  SegmentedControl,
  Slider,
  Chip,
  FilterChip,
} from './components/inputs';
export type {
  TextFieldProps,
  PasswordInputProps,
  SearchFieldProps,
  MoneyInputProps,
  StepperProps,
  CheckboxProps,
  RadioGroupProps,
  RadioProps,
  SwitchProps,
  SegmentedControlProps,
  SliderProps,
  ChipProps,
  NullableStepperProps,
} from './components/inputs';
export { SwitchField, CheckboxField, CheckboxGroupField } from './components/choicefields';
export type {
  SwitchFieldProps,
  CheckboxFieldProps,
  CheckboxGroupFieldProps,
  CheckboxGroupOption,
} from './components/choicefields';
export { CurrencySelect, currencySelectOptions } from './components/currency';
export type { CurrencySelectProps } from './components/currency';
export { Card, ListItem, ListSection, Accordion } from './components/containers';
export type {
  CardProps,
  ListItemProps,
  ListItemVariant,
  ListSectionProps,
  AccordionProps,
} from './components/containers';
export {
  Banner,
  ToastProvider,
  useToast,
  Dialog,
  Progress,
  LoadingIndicator,
  Skeleton,
  SkeletonSwap,
  EmptyState,
  ErrorState,
} from './components/feedback';
export type {
  BannerProps,
  ToastOptions,
  ToastProviderProps,
  DialogProps,
  ProgressProps,
  SkeletonProps,
  SkeletonSwapProps,
  EmptyStateProps,
  ErrorStateProps,
} from './components/feedback';
export { BottomSheet, ActionSheet, ContextMenu, Select } from './components/overlays';
export type {
  BottomSheetProps,
  SheetDetent,
  SheetAction,
  ActionSheetProps,
  ContextMenuProps,
  SelectProps,
  SelectOption,
} from './components/overlays';
export {
  SwipeableRow,
  RefreshControl,
  Carousel,
  PageIndicator,
  StickyFooter,
  OTPInput,
  NumericKeypad,
  ExpressiveMoneyInput,
  SensitiveValue,
  PrivacyShield,
  OfflineBanner,
  Coachmark,
  FAB,
  DateTimeField,
} from './components/mobile';
export type {
  SwipeAction,
  SwipeableRowProps,
  CarouselProps,
  PageIndicatorProps,
  StickyFooterProps,
  OTPInputProps,
  NumericKeypadProps,
  ExpressiveMoneyInputProps,
  SensitiveValueProps,
  PrivacyShieldProps,
  CoachmarkProps,
  FABProps,
  DateTimeFieldProps,
  DateMatcher,
  DateTimeFieldChangeHandler,
  DateTimeFieldPeriodProps,
} from './components/mobile';

export { MultiSelect, DataList, FileList, FilterSheet } from './components/data';
export { TreeList, StepProgress, SortableList, InlineEdit } from './components/workflow';
export type { TreeListNode, TreeListProps, StepProgressProps, SortableListProps, InlineEditProps, InlineEditSize } from './components/workflow';
/**
 * `StepIndicator` is `StepProgress` under the name RFC #302 asks for: the twin
 * of web `Stepper`. On native, `Stepper` is the − / + number control.
 */
export { StepProgress as StepIndicator } from './components/workflow';
export type { StepProgressProps as StepIndicatorProps } from './components/workflow';
export { Tabs } from './components/tabs';
export type { TabsRootProps, TabsListProps, TabsTriggerProps, TabsContentProps } from './components/tabs';
export { Table } from './components/table';
export type { TableRootProps, TableSectionProps, TableRowProps, TableCellProps, TableCaptionProps } from './components/table';
export { Rating } from './components/rating';
export type { RatingProps } from './components/rating';
export { Tooltip } from './components/tooltip';
export type { TooltipProps } from './components/tooltip';
export type {
  MultiSelectOption,
  MultiSelectProps,
  DataListProps,
  DataListSort,
  FileListItem,
  FileListProps,
  FilterSheetProps,
} from './components/data';
// 11.8: native catch-up I (fields)
export { ComboboxField } from './components/combobox';
export type { ComboboxFieldProps, ComboboxOption } from './components/combobox';
export { FileUpload, fileAccepted } from './components/fileupload';
export type { FileUploadProps, PickedFile, FileRejection } from './components/fileupload';
export { PromptDialog, usePrompt } from './components/prompt';
export type { PromptDialogProps, PromptOptions } from './components/prompt';
export type { AsyncSearch } from './hooks/useAsyncSearch';
export { filterOperators, isFilterGroup, emptyFilter, newFilterRule, countFilters } from '@nexub/core';
export type { FilterField, FilterFieldType, FilterGroup, FilterOperator, FilterRule } from '@nexub/core';

// Navigation (native chrome, Nexub colours)
export {
  nexubStackOptions,
  nexubNavigationTheme,
  nexubTabsOptions,
  useNexubNavigation,
} from './theme/navigation';
export { SkeletonText } from './components/feedback';
export type { SkeletonTextProps } from './components/feedback';
export type { AvatarStatus } from './components/display';

// 10.9: lively surfaces (expression, spot accent, category colours, stats, breakpoints)
export { dynamicPrimary, DENSE_MAX_FONT_SCALE } from './theme/ThemeProvider';
export type { Expression, ThemeColors } from './theme/ThemeProvider';
export { useBreakpoint, useResponsive, TABLET_MIN } from './theme/layout';
export type { Breakpoint } from './theme/layout';
export { IconChip, categoryPalette, autoCategory } from './components/display';
export type { IconChipProps, CategoryPalette } from './components/display';
export { NumberTicker, StatCard } from './components/stats';
export type { NumberTickerProps, StatCardProps } from './components/stats';
export { CATEGORY_COLORS, DIVISIONS, PRODUCT_KEYS } from '@nexub/core';
export type { CategoryColor, ProductKey, DivisionKey } from '@nexub/core';

// 10.9: QR codes, and the native twins of the 10.7/10.8 web components
export { QRCode, QRScanner } from './components/qr';
export type { QRCodeProps, QRScannerProps } from './components/qr';
export { DescriptionList, ComparisonBar } from './components/datadisplay';
export type {
  DescriptionListProps,
  DescriptionListRootProps,
  DescriptionListItemProps,
  ComparisonBarProps,
  ComparisonBarSide,
} from './components/datadisplay';
export { PhoneInput } from './components/phone';
export type { PhoneInputProps } from './components/phone';
export { Countdown, useCountdown } from './components/countdown';
export type { CountdownProps, CountdownState, UseCountdownOptions } from './components/countdown';
export { encodeQR, qrPath, COUNTRIES, callingCode, formatNational, formatPhone, toE164, parsePhone, isValidPhone } from '@nexub/core';
export type { QRErrorCorrection, QRMatrix, CountryCode, ParsedPhone } from '@nexub/core';
