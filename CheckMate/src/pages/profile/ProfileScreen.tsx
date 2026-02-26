import ScreenWrapper from "@/src/components/ScreenWrapper";
import TodoBottomSheet from "@/src/pages/profile/components/TodoBottomSheet";
import { useTodoStore } from "@/src/services/useTodoStore";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Todo } from "../../constants/types";

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
  onPress,
}: {
  icon: string;
  value: number;
  label: string;
  color: string;
  delay: number;
  onPress?: () => void;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useFocusEffect(() => {
    fadeAnim.setValue(0)
    slideAnim.setValue(20)
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
  },);
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={{ flex: 1 }}>
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
    </TouchableOpacity>
  );
};

export default function ProfileScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  const allTodos = useTodoStore((state) => state.todos);

  const user = useTodoStore((state) => state.username);

  const setUsername = useTodoStore((state) => state.setUsername); // gerek yok ama ekleyek

  const clearTodos = useTodoStore((state) => state.clearTodos); // gerek yok ama ekleyek

  const completedCount = allTodos.filter((t) => t.isCompleted).length;

  const totalCount = allTodos.length;

  const pendingCount = totalCount - completedCount;

  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;



  const stats = {
    total: totalCount,
    completed: completedCount,
    pending: pendingCount,
    completionRate: completionRate,
  };

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;


  useFocusEffect(
    useCallback(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, damping: 12, stiffness: 150, useNativeDriver: true }),
      ]).start();

    }, [fadeAnim, scaleAnim])
  );


  const handleLogout = async () => {
    setUsername("Misafir");
    navigation?.replace("Login", { logout: true });
  };

  const [sheetData, setSheetData] = useState<{
    visible: boolean;
    title: string;
    todos: Todo[];
  }>({ visible: false, title: "", todos: [] });

  const handleStatPress = (type: "total" | "completed" | "pending") => {
    const filtered =
      type === "total"
        ? allTodos
        : type === "completed"
          ? allTodos.filter((t) => t.isCompleted)
          : allTodos.filter((t) => !t.isCompleted);

    setSheetData({
      visible: true,
      title:
        type === "total"
          ? "Tüm Görevler"
          : type === "completed"
            ? "Tamamlananlar"
            : "Bekleyenler",
      todos: filtered,
    });
  };

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


  return (
    <ScreenWrapper>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={true}
      >
        {/* Hero Section */}
        <View style={[styles.hero, { paddingTop: Platform.OS === 'ios' ? 20 : insets.top + 20 }]}>
          <View style={[styles.ring, { borderColor: avatarColor + "30" }]} />
          <View style={[styles.ringOuter, { borderColor: avatarColor + "15" }]} />

          <Animated.View style={[styles.avatarWrapper, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
            <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={[styles.onlineDot, { borderColor: "#F9FAFB", backgroundColor: "#22C55E" }]} />
          </Animated.View>

          <Animated.View style={{ opacity: fadeAnim, alignItems: "center", marginTop: 16 }}>
            <Text style={styles.userName}>{user}</Text>
            <View style={styles.badgeRow}>
              <View style={[styles.badge, { backgroundColor: avatarColor + "20" }]}>
                <Ionicons name="checkmark-circle" size={12} color={avatarColor} />
                <Text style={[styles.badgeText, { color: avatarColor }]}>%{stats.completionRate} başarı</Text>
              </View>
            </View>
          </Animated.View>
        </View>

        <View style={styles.statsContainer}>
          <StatCard icon="format-list-bulleted" value={stats.total} label="Toplam" color="#6366F1" delay={100} onPress={() => handleStatPress("total")} />
          <StatCard icon="check-circle-outline" value={stats.completed} label="Bitti" color="#22C55E" delay={200} onPress={() => handleStatPress("completed")} />
          <StatCard icon="clock-outline" value={stats.pending} label="Bekliyor" color="#F59E0B" delay={300} onPress={() => handleStatPress("pending")} />
        </View>


        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Genel İlerleme</Text>
            <Text style={styles.progressPercent}>%{stats.completionRate}</Text>
          </View>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${stats.completionRate}%` }]} />
          </View>
        </View>


        <View style={styles.logoutContainer}>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton} activeOpacity={0.8}>
            <MaterialCommunityIcons name="exit-to-app" size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Çıkış Yap</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TodoBottomSheet
        visible={sheetData.visible}
        onClose={() => setSheetData((prev) => ({ ...prev, visible: false }))}
        title={sheetData.title}
        todos={sheetData.todos}
      />
    </ScreenWrapper>
  );
}
const styles = StyleSheet.create({

  scrollContent: {

    flexGrow: 1,
    width: width,
    paddingBottom: 40,
    paddingTop: 40,
  },


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
    backgroundColor: "#fff",
    borderRadius: 35,
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
    borderRadius: 35,
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
    borderRadius: 18,
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
