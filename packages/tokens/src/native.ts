// @nexub/tokens/native — tokens for React Native: dp numbers, hex roles per
// contrast level × scheme, per-scheme boxShadow strings, Reanimated springs.
export { native } from './generated/native.js';
import type { native } from './generated/native.js';

export type NativeTokens = typeof native;
export type NativeRoles = NativeTokens['color']['roles']['standard']['light'];
export type NativeRole = keyof NativeRoles;
export type NativeTypeRole = keyof NativeTokens['type'];
