export const COLORS = {
  primary: "#4CAF50",
  background: "#F5F5F5",
  text: "#222",
  white: "#fff",
  danger: "#ff4444",
} as const;

export const SIZES = {
  small: 14,
  medium: 18,
  large: 24,
} as const;

export const SPACING = {
  small: 8,
  medium: 16,
  large: 24,
} as const;

export type ColorKeys = keyof typeof COLORS;
export type SizeKeys = keyof typeof SIZES;
