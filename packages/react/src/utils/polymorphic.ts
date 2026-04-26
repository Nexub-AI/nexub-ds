import type { ComponentPropsWithRef, ElementType } from 'react';

export type AsProp<C extends ElementType> = { as?: C };

export type PolymorphicRef<C extends ElementType> = ComponentPropsWithRef<C>['ref'];

export type PolymorphicComponentProps<C extends ElementType, Props = object> = Props &
  AsProp<C> &
  Omit<ComponentPropsWithRef<C>, keyof Props | 'as'>;
