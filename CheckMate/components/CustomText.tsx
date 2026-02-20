import { ReactNode } from "react";
import { StyleProp, Text, TextStyle } from "react-native";
import { ColorKeys, COLORS, SizeKeys, SIZES } from "../constants/theme";

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
