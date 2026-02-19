import { ViewStyle } from "react-native";
import { COLORS } from "../constants/theme";

type ButtonProps = {
  width?: number | "auto" | `${number}%`;
  paddingVertical?: number;
  paddingHorizontal?: number;
  borderRadius?: number;
  bg?: keyof typeof COLORS;
  direction?: "row" | "column";
  justify?: ViewStyle["justifyContent"];
  align?: ViewStyle["alignItems"];
  gap?: number;
};

export const button = ({
  width = "auto",
  paddingVertical = 14,
  paddingHorizontal = 28,
  borderRadius = 35,
  bg = "primary",
  direction = "row",
  justify = "center",
  align = "center",
  gap = 12,
}: ButtonProps) => ({
  width,
  paddingVertical,
  paddingHorizontal,
  borderRadius,
  backgroundColor: COLORS[bg],
  flexDirection: direction,
  justifyContent: justify,
  alignItems: align,
  gap,
});
