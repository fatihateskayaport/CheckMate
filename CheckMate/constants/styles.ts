// themeStyles.js
import { COLORS, SPACING } from "./theme";
import { StyleSheet, ViewStyle, TextStyle } from "react-native";

type ContainerProps = {
  flex?: number;
  justify?: ViewStyle["justifyContent"];
  align?: ViewStyle["alignItems"];
  padding?: number;
  margin?: number;
  bg?: keyof typeof COLORS;
};

type TextProps = {
  color?: keyof typeof COLORS;
  size?: number;
  weight?: TextStyle["fontWeight"];
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.medium,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
});

export const container = ({
  flex = 1,
  justify = "flex-start",
  align = "stretch",
  margin = 0,
  bg = "background",
}: ContainerProps) => ({
  flex,
  justifyContent: justify,
  alignItems: align,
  margin,
  backgroundColor: COLORS[bg],
});

export const screenContainer = {
  flex: 1,
  justifyContent: "flex-start" as const,
  alignItems: "stretch" as const,
  backgroundColor: COLORS["background"],
};

export const centerContainer = {
  justifyContent: "center" as const,
  alignItems: "center" as const,
};

export const textStyle = ({
  color = "text",
  size = 18,
  weight = "bold",
}: TextProps) => ({
  color: COLORS[color],
  fontSize: size,
  fontWeight: weight,
});
