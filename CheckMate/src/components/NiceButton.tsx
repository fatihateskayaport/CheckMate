import { ReactNode } from "react";
import { Pressable, StyleProp, Text, TextStyle, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { button } from "../components/DefaultButtons";
import { COLORS } from "../constants/theme";

export type ButtonStatus = "default" | "disabled" | "loading"| "outline";

interface NiceButtonProps {
  status?: ButtonStatus;
  onPress?: () => void;
  title: string;
  icon?: ReactNode;
  style?: ViewStyle;
  textStyle?: StyleProp<TextStyle>;
}

export default function NiceButton({
  status = "default",
  onPress,
  title,
  icon,
  style,
  textStyle,
}: NiceButtonProps) {
  const pressAnim = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressAnim.value }],
    opacity: pressAnim.value ** 4,
  }));

  const onPressIn = () => {
    pressAnim.value = withSpring(0.96);
  };
  const onPressOut = () => {
    pressAnim.value = withSpring(1);
  };

  const isPressable = status === "default";

  return (
    <Pressable
      onPressIn={isPressable ? onPressIn : undefined}
      onPressOut={isPressable ? onPressOut : undefined}
      onPress={isPressable ? onPress : undefined}
      disabled={!isPressable}
    >
      <Animated.View style={[button({ width: "auto" }), animatedStyle, style]}>
        {icon}
        <Text style={[{ color: COLORS.white, fontWeight: "600" }, textStyle]}>
          {title}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
