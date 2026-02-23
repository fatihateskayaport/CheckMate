import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React, { useRef } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");
const scale = width / 390;

const ICONS: Record<
  string,
  {
    outline: keyof typeof Ionicons.glyphMap;
    filled: keyof typeof Ionicons.glyphMap;
    label: string;
  }
> = {
  Home: { outline: "home-outline", filled: "home", label: "Ana Sayfa" },
  Add: { outline: "add-circle-outline", filled: "add-circle", label: "Ekle" },
  Profile: { outline: "person-outline", filled: "person", label: "Profil" },
};

const TabItem = ({
  route,
  isFocused,
  onPress,
}: {
  route: { name: string };
  isFocused: boolean;
  onPress: () => void;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const icon = ICONS[route.name] ?? {
    outline: "ellipse-outline",
    filled: "ellipse",
    label: route.name,
  };

  const handlePress = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.85,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: -4,
          duration: 80,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          damping: 10,
          stiffness: 200,
        }),
        Animated.spring(translateYAnim, {
          toValue: 0,
          useNativeDriver: true,
          damping: 10,
          stiffness: 200,
        }),
      ]),
    ]).start();
    onPress();
  };

  if (route.name === "Add") {
    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.9}
        style={styles.addWrapper}
      >
        <Animated.View
          style={[
            styles.addButton,
            {
              transform: [{ scale: scaleAnim }, { translateY: translateYAnim }],
            },
          ]}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </Animated.View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      style={styles.tabItem}
    >
      <Animated.View
        style={[
          styles.tabInner,
          { transform: [{ scale: scaleAnim }, { translateY: translateYAnim }] },
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            isFocused && styles.iconContainerActive,
          ]}
        >
          <Ionicons
            name={isFocused ? icon.filled : icon.outline}
            size={22}
            color={isFocused ? "#6366F1" : "#9CA3AF"}
          />
        </View>
        <Text style={[styles.label, isFocused && styles.labelActive]}>
          {icon.label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const CustomTabBar = ({ state, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, { paddingBottom: insets.bottom || 16 }]}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
          return (
            <TabItem
              key={route.key}
              route={route}
              isFocused={isFocused}
              onPress={onPress}
            />
          );
        })}
      </View>
    </View>
  );
};

export default CustomTabBar;

const styles = StyleSheet.create({
  wrapper: {
    left: 0,
    right: 0,
    backgroundColor: "transparent",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.012,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 12,
  },
  tabItem: { flex: 1, alignItems: "center" },
  tabInner: { alignItems: "center", gap: 4 },
  iconContainer: {
    width: width * 0.11,
    height: width * 0.11,
    borderRadius: width * 0.035,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F3FF",
    borderWidth: 1,
    borderColor: "#E8E4FF",
  },
  iconContainerActive: {
    backgroundColor: "#EEF2FF",
    borderColor: "#C7D2FE",
  },
  label: {
    fontSize: Math.round(10 * scale),
    fontWeight: "500",
    color: "#9CA3AF",
    letterSpacing: 0.2,
  },
  labelActive: { color: "#6366F1", fontWeight: "700" },
  addWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -(height * 0.01),
  },
  addButton: {
    width: width * 0.17,
    height: width * 0.17,
    borderRadius: width * 0.05,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 16,
    borderWidth: 4,
    borderColor: "#fff",
  },
});
