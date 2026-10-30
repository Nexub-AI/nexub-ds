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
} from './components/inputs';
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
} from './components/mobile';

// Navigation (native chrome, Nexub colours)
export {
  nexubStackOptions,
  nexubNavigationTheme,
  nexubTabsOptions,
  useNexubNavigation,
} from './theme/navigation';
