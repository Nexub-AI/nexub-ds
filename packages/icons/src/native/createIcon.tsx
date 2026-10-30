import type { ComponentType } from 'react';
import type { SvgProps } from 'react-native-svg';

// Same ladder as web (and @nexub/tokens size.icon).
const SIZE_MAP = { xs: 12, sm: 16, md: 20, lg: 24, xl: 32 } as const;

export interface NativeIconProps extends Omit<SvgProps, 'color' | 'width' | 'height'> {
  size?: keyof typeof SIZE_MAP | number;
  /** Any colour. Inside @nexub/react-native use its `Icon` with `tone` instead. */
  color?: string;
  strokeWidth?: number;
  /** Accessible name. Without it the icon is decorative and hidden from screen readers. */
  label?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createIcon(Component: ComponentType<any>, displayName: string): ComponentType<NativeIconProps> {
  function NexubIcon({ size = 'md', strokeWidth = 1.75, color = '#000', label, ...rest }: NativeIconProps) {
    const px = typeof size === 'number' ? size : SIZE_MAP[size];
    const a11y = label
      ? { accessible: true, accessibilityRole: 'image' as const, accessibilityLabel: label }
      : { accessible: false, accessibilityElementsHidden: true, importantForAccessibility: 'no-hide-descendants' as const };
    return <Component size={px} strokeWidth={strokeWidth} color={color} {...a11y} {...rest} />;
  }
  NexubIcon.displayName = displayName;
  return NexubIcon;
}
