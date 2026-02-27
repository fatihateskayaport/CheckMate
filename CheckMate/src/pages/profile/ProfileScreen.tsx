import ScreenWrapper from "@/src/components/ScreenWrapper";
import { theme } from "@/src/constants";
import { Todo } from "@/src/constants/types";
import TodoBottomSheet from "@/src/pages/profile/components/TodoBottomSheet";
import { useTodoStore } from "@/src/services/useTodoStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";



const { width } = Dimensions.get("window");

const AVATAR_COLORS = ["#6C63FF", "#FF6584", "#43D9AD", "#F7A74B", "#3B82F6"];

const StatCard = ({ icon, value, label, color, delay, onPress }: any) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useFocusEffect(
    useCallback(() => {
      fadeAnim.setValue(0);
      slideAnim.setValue(20);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 400, delay, useNativeDriver: true }),
      ]).start();
    }, [delay])
  );

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={{ flex: 1 }}>
      <Animated.View style={[styles.statCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={[styles.statIconBg, { backgroundColor: color + "20" }]}>
          <MaterialCommunityIcons name={icon} size={22} color={color} />
        </View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function ProfileScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { todos, username, setUsername } = useTodoStore();

  const handleLogout = () => {
    Alert.alert(
      "Çıkış Yap",
      "Hesabınızdan çıkış yapmak istediğinize emin misiniz?",
      [
        { text: "Vazgeç", style: "cancel" },
        {
          text: "Evet, Çık",
          style: "destructive",
          onPress: () => {
            setUsername("Misafir");
            navigation.replace("Login", { logout: true });
          }
        },
      ]
    );
  };

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.isCompleted).length;
    return {
      total,
      completed,
      pending: total - completed,
      rate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }, [todos]);

  const userDesign = useMemo(() => {
    const colorIndex = username.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % AVATAR_COLORS.length;
    const initials = username.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    return { color: AVATAR_COLORS[colorIndex], initials };
  }, [username]);

  const [sheetData, setSheetData] = useState({ visible: false, title: "", data: [] as Todo[] });
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useFocusEffect(
    useCallback(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, damping: 12, stiffness: 150, useNativeDriver: true }),
      ]).start();
    }, [])
  );

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        <View style={[styles.hero, { paddingTop: insets.top + 20 }]}>
          <View style={[styles.ring, { borderColor: userDesign.color + "25" }]} />
          <Animated.View style={[styles.avatarWrapper, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
            <View style={[styles.avatar, { backgroundColor: userDesign.color }]}>
              <Text style={styles.avatarText}>{userDesign.initials}</Text>
            </View>
          </Animated.View>
          <Text style={styles.userName}>{username}</Text>
          <View style={[styles.badge, { backgroundColor: userDesign.color + "15" }]}>
            <Text style={{ color: userDesign.color, fontWeight: "bold" }}>%{stats.rate} Başarı</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <StatCard icon="format-list-bulleted" value={stats.total} label="Toplam" color={theme.colors.primary} delay={100} onPress={() => setSheetData({ visible: true, title: "Tüm Görevler", data: todos })} />
          <StatCard icon="check-all" value={stats.completed} label="Bitti" color={theme.colors.success} delay={200} onPress={() => setSheetData({ visible: true, title: "Tamamlananlar", data: todos.filter(t => t.isCompleted) })} />
          <StatCard icon="timer-sand" value={stats.pending} label="Bekliyor" color={theme.colors.warning} delay={300} onPress={() => setSheetData({ visible: true, title: "Bekleyenler", data: todos.filter(t => !t.isCompleted) })} />
        </View>

        <View style={styles.logoutContainer}>
          <TouchableOpacity
            onPress={handleLogout}
            style={styles.logoutBtn}
            activeOpacity={0.7}
          >
            <View style={styles.logoutContent}>
              <MaterialCommunityIcons name="logout-variant" size={22} color={theme.colors.danger} />
              <Text style={styles.logoutText}>Oturumu Kapat</Text>
            </View>
          </TouchableOpacity>

          <Text style={{
            textAlign: 'center',
            marginTop: 20,
            color: theme.colors.textSecondary,
            fontSize: theme.typography.sizes.xs,
            opacity: 0.5
          }}>
            Versiyon 0.0.8
          </Text>
        </View>
      </ScrollView>
      <TodoBottomSheet
        visible={sheetData.visible}
        onClose={() => setSheetData(p => ({ ...p, visible: false }))}
        title={sheetData.title}
        todos={sheetData.data}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 40 },
  hero: { alignItems: "center", marginBottom: 30 },
  ring: { position: 'absolute', width: 200, height: 200, borderRadius: 100, borderWidth: 1, top: 10 },
  avatarWrapper: { marginBottom: 15 },
  avatar: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "white",
  },
  avatarText: { color: "white", fontSize: 32, fontWeight: "bold" },
  userName: { fontSize: 22, fontWeight: "bold", color: "#333" },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginTop: 8 },
  statsGrid: { flexDirection: "row", paddingHorizontal: 15, gap: 10 },
  statCard: { backgroundColor: "white", borderRadius: 20, padding: 15, alignItems: "center", borderWidth: 1, borderColor: "#eee" },
  statIconBg: { width: 40, height: 40, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "bold", marginTop: 5 },
  statLabel: { fontSize: 12, color: "#666" },
  logoutContainer: {
    marginTop: theme.layout.spacing.xl,
    paddingHorizontal: theme.layout.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.layout.spacing.lg,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.layout.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: theme.layout.borderRadius.md,
    ...Platform.select({
      ios: { shadowColor: theme.colors.danger, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 2 }
    })
  },
  logoutContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.layout.spacing.sm,
  },
  logoutText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.danger,
  },
});