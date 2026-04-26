import { type SVGProps } from 'react';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'color' | 'ref'> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  strokeWidth?: number;
  tone?: 'current' | 'muted' | 'primary' | 'accent' | 'success' | 'danger' | 'warning' | 'info';
  label?: string;
}
