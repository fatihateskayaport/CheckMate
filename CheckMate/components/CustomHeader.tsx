import React, { useEffect, useRef } from "react";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type CustomHeaderProps = {
  user?: string;
  onLogout?: () => void;
  text?: string;
  showLogout?: boolean;
  showAvatar?: boolean;
};

const CustomHeader = ({
  user = "Misafir",
  onLogout,
  text,
  showLogout = true,
  showAvatar = true,
}: CustomHeaderProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const initials = user
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const colors = ["#6C63FF", "#FF6584", "#43D9AD", "#F7A74B", "#3B82F6"];
  const colorIndex =
    user.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;
  const avatarColor = colors[colorIndex];

  return (
    <Animated.View
      style={[
        styles.header,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      {showLogout && (
        <TouchableOpacity
          onPress={onLogout}
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <View style={styles.iconBg}>
            <MaterialCommunityIcons
              name="exit-to-app"
              size={20}
              color="#6B7280"
            />
          </View>
        </TouchableOpacity>
      )}

      <View style={styles.center} pointerEvents="none">
        {text ? (
          <Text style={styles.username}>{text}</Text>
        ) : (
          <>
            <Text style={styles.greeting}>Merhaba 👋</Text>
            <Text
              style={styles.username}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {user}
            </Text>
          </>
        )}
      </View>
      {showAvatar && (
        <View style={styles.avatarWrapper}>
          <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={[styles.onlineDot, { borderColor: "#F9FAFB" }]} />
        </View>
      )}
      <View style={styles.bottomLine} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 68,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundBlendMode: "#111827",
    paddingHorizontal: 16,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  iconButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  greeting: {
    fontSize: 11,
    fontWeight: "500",
    color: "#9CA3AF",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    lineHeight: 14,
  },
  username: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.2,
    lineHeight: 20,
    maxWidth: 180,
  },

  avatarWrapper: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 14,
    letterSpacing: 0.5,
  },
  onlineDot: {
    position: "absolute",
    bottom: -1,
    right: -1,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#22C55E",
    borderWidth: 2,
  },
  bottomLine: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
});

export default CustomHeader;
