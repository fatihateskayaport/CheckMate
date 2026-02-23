import ScreenWrapper from "@/components/ScreenWrapper";
import { todoService, userService } from "@/src/services/todoService";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useRef, useState } from "react";
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

type Props = {
  route?: any;
  navigation?: any;
};
const AVATAR_COLORS = ["#6C63FF", "#FF6584", "#43D9AD", "#F7A74B", "#3B82F6"];

const StatCard = ({
  icon,
  value,
  label,
  color,
  delay,
}: {
  icon: string;
  value: number;
  label: string;
  color: string;
  delay: number;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  return (
    <Animated.View
      style={[
        styles.statCard,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={[styles.statIconBg, { backgroundColor: color + "20" }]}>
        <MaterialCommunityIcons name={icon as any} size={22} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
};

export default function ProfileScreen({ route, navigation }: Props) {
  const user = route?.params?.user ?? "Misafir";
  const insets = useSafeAreaInsets();
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    completionRate: 0,
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const avatarColor =
    AVATAR_COLORS[
      user
        .split("")
        .reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) %
        AVATAR_COLORS.length
    ];

  const initials = user
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  useFocusEffect(
    useCallback(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          damping: 12,
          stiffness: 150,
          useNativeDriver: true,
        }),
      ]).start();

      todoService.getAll(user).then((todos) => {
        const completed = todos.filter((t) => t.completed).length;
        const total = todos.length;
        const pending = total - completed;
        const completionRate =
          total > 0 ? Math.round((completed / total) * 100) : 0;
        setStats({ total, completed, pending, completionRate });
      });
    }, [user]),
  );

  const handleLogout = async () => {
    await userService.clear();
    navigation?.replace("Login", { logout: true });
  };

  return (
    <ScreenWrapper>
      <View style={[styles.hero, { paddingTop: insets.top + 20 }]}>
        <View style={[styles.ring, { borderColor: avatarColor + "30" }]} />
        <View style={[styles.ringOuter, { borderColor: avatarColor + "15" }]} />

        <Animated.View
          style={[
            styles.avatarWrapper,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View
            style={[
              styles.onlineDot,
              { borderColor: "#F9FAFB", backgroundColor: "#22C55E" },
            ]}
          />
        </Animated.View>

        <Animated.View
          style={{ opacity: fadeAnim, alignItems: "center", marginTop: 16 }}
        >
          <Text style={styles.userName}>{user}</Text>
          <View style={styles.badgeRow}>
            <View
              style={[styles.badge, { backgroundColor: avatarColor + "20" }]}
            >
              <Ionicons name="checkmark-circle" size={12} color={avatarColor} />
              <Text style={[styles.badgeText, { color: avatarColor }]}>
                %{stats.completionRate} tamamlandı
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>

      <View style={styles.statsContainer}>
        <StatCard
          icon="format-list-bulleted"
          value={stats.total}
          label="Toplam"
          color="#6366F1"
          delay={100}
        />
        <StatCard
          icon="check-circle-outline"
          value={stats.completed}
          label="Tamamlanan"
          color="#22C55E"
          delay={400}
        />
        <StatCard
          icon="clock-outline"
          value={stats.pending}
          label="Bekleyen"
          color="#F59E0B"
          delay={600}
        />
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Genel İlerleme</Text>
          <Text style={styles.progressPercent}>%{stats.completionRate}</Text>
        </View>
        <View style={styles.progressBg}>
          <Animated.View
            style={[styles.progressFill, { width: `${stats.completionRate}%` }]}
          />
        </View>
      </View>

      <View style={styles.logoutContainer}>
        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutButton}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="exit-to-app"
            size={20}
            color="#EF4444"
          />
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}
const styles = StyleSheet.create({
  hero: {
    alignItems: "center",
    paddingBottom: 32,
    position: "relative",
  },
  ring: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    top: "10%",
    alignSelf: "center",
  },
  ringOuter: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    top: "7%",
    alignSelf: "center",
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: width * 0.28,
    height: width * 0.28,
    borderRadius: width * 0.1,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 4,
    borderColor: "#fff",
  },
  avatarText: {
    color: "#fff",
    fontSize: width * 0.1,
    fontWeight: "800",
    letterSpacing: 1,
  },
  onlineDot: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
  },
  userName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.5,
  },
  badgeRow: {
    flexDirection: "row",
    marginTop: 8,
    gap: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },

  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    gap: 6,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  statIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "500",
    color: "#9CA3AF",
    letterSpacing: 0.3,
  },

  progressContainer: {
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6366F1",
  },
  progressBg: {
    height: 8,
    backgroundColor: "#EEF2FF",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#6366F1",
    borderRadius: 4,
  },

  logoutContainer: {
    paddingHorizontal: 20,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FEF2F2",
    borderRadius: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#EF4444",
  },
});
