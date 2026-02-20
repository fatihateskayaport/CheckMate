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

const { width } = Dimensions.get("window");

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
    <View style={[styles.wrapper, { paddingBottom: insets.bottom || 16 }]}>
      <View style={styles.container}>
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

    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  tabItem: { flex: 1, alignItems: "center" },
  tabInner: { alignItems: "center", gap: 3 },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainerActive: { backgroundColor: "#EEF2FF" },
  label: {
    fontSize: 10,
    fontWeight: "500",
    color: "#9CA3AF",
    letterSpacing: 0.2,
  },
  labelActive: { color: "#6366F1", fontWeight: "700" },
  addWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -24,
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});
