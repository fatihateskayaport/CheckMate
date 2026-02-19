import { Text, TextStyle, StyleProp } from "react-native";
import { COLORS, SIZES, ColorKeys, SizeKeys } from "../constants/theme";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  size?: SizeKeys;
  color?: ColorKeys;
  style?: StyleProp<TextStyle>;
};

export default function CustomText({
  children,
  size = "medium",
  color = "text",
  style,
}: Props) {
  return (
    <Text
      style={[
        {
          fontSize: SIZES[size],
          color: COLORS[color],
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

