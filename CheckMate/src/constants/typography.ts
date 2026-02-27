import { Platform } from "react-native";

export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  weights: {
    regular: "400" as const,
    medium: "600" as const,
    semibold: "700" as const,
    bold: "800" as const,
  },
  fonts: {
    main: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  }
};