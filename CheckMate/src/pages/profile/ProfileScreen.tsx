import GlassCard from "@/src/components/GlassCard";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { theme } from "@/src/constants";
import { Todo } from "@/src/constants/types";
import { useTodoStore } from "@/src/services/useTodoStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WeeklyChart } from "./components/WeeklyChart";

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
    }, [delay, fadeAnim, slideAnim])
  );


  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={{ flex: 1 }}>
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <GlassCard intensity={0.6} style={styles.statCardGlass}>
          <View style={[styles.statIconBg, { backgroundColor: color + "15" }]}>
            <MaterialCommunityIcons name={icon} size={20} color={color} />
          </View>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statLabel}>{label}</Text>
        </GlassCard>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function ProfileScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { todos, username, setUsername, userImage, setUserImage } = useTodoStore();

  const getWeeklyStats = () => {
    const stats = [0, 0, 0, 0, 0, 0, 0];
    const now = new Date();

    todos.forEach(todo => {
      if (todo.isCompleted) {
        const completedDate = new Date(todo.deadline);
        const diffInDays = Math.floor((now.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffInDays < 7) {
          const dayIndex = (completedDate.getDay() + 6) % 7;
          stats[dayIndex]++;
        }
      }
    });
    return stats;
  };

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

  const handleImageAction = () => {
    const buttons = [
      { text: "Kamera ile Çek", onPress: takePhoto },
      { text: "Galeriden Seç", onPress: pickImage },
      userImage ? { text: "Fotoğrafı Kaldır", onPress: () => setUserImage(null), style: 'destructive' as const } : null,
      { text: "Vazgeç", style: "cancel" as const },
    ];
    const filteredButtons = buttons.filter((btn): btn is any => btn !== null);
    Alert.alert(
      "Profil Fotoğrafı",
      "Bir seçenek belirleyin",
      filteredButtons
    );
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("İzin Gerekli", "Galeriye erişmek için izin vermelisiniz.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setUserImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("İzin Gerekli", "Kamera kullanımı için izin vermelisiniz.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setUserImage(result.assets[0].uri);
    }
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

  const analytics = useMemo(() => {
    const completedTodos = todos.filter(t => t.isCompleted);

    // En Verimli Gün (Tamamlananlar üzerinden)
    const dayCounts: Record<string, number> = {};
    completedTodos.forEach(todo => {
      const day = new Date(todo.createdAt).toLocaleDateString('tr-TR', { weekday: 'long' });
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    });
    const topDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Henüz veri yok";

    // KRİTİK DÜZELTME: Sadece bekleyen (yapılmamış) yüksek öncelikli görevler
    const activeHighPriority = todos.filter(t => !t.isCompleted && t.priority === 'High').length;

    return { topDay, activeHighPriority };
  }, [todos]);


  useFocusEffect(
    useCallback(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, damping: 12, stiffness: 150, useNativeDriver: true }),
      ]).start();
    }, [fadeAnim, scaleAnim])
  );

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        <View style={[styles.hero, { paddingTop: insets.top + 20 }]}>
          <View style={[styles.ring, { borderColor: userDesign.color + "15" }]} />

          <TouchableOpacity onPress={handleImageAction} activeOpacity={0.9}>
            <Animated.View style={[styles.avatarWrapper, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
              <View style={[styles.avatar, { backgroundColor: userImage ? 'transparent' : userDesign.color }]}>
                {userImage ? (
                  <Image source={{ uri: userImage }} style={styles.profileImage} />
                ) : (
                  <Text style={styles.avatarText}>{userDesign.initials}</Text>
                )}
              </View>
              <View style={[styles.cameraBadge, { backgroundColor: theme.colors.primary }]}>
                <MaterialCommunityIcons name="camera" size={14} color="white" />
              </View>
            </Animated.View>
          </TouchableOpacity>

          <Text style={styles.userName}>{username}</Text>
          <GlassCard intensity={0.4} style={styles.badgeGlass}>
            <Text style={{ color: userDesign.color, fontWeight: "bold", fontSize: 12 }}>
              %{stats.rate} Başarı
            </Text>
          </GlassCard>
        </View>

        <View style={styles.statsGrid}>
          <StatCard icon="format-list-bulleted" value={stats.total} label="Toplam" color={theme.colors.primary} delay={100} onPress={() => setSheetData({ visible: true, title: "Tüm Görevler", data: todos })} />
          <StatCard icon="check-all" value={stats.completed} label="Bitti" color={theme.colors.success} delay={200} onPress={() => setSheetData({ visible: true, title: "Tamamlananlar", data: todos.filter(t => t.isCompleted) })} />
          <StatCard icon="timer-sand" value={stats.pending} label="Bekliyor" color={theme.colors.warning} delay={300} onPress={() => setSheetData({ visible: true, title: "Bekleyenler", data: todos.filter(t => !t.isCompleted) })} />
        </View>

        <View style={styles.chartWrapper}>
          <WeeklyChart data={getWeeklyStats()} />
        </View>

        <View style={styles.insightContainer}>
          <GlassCard intensity={0.5} style={styles.insightCard}>
            <View style={[styles.iconCircle, { backgroundColor: '#F59E0B20' }]}>
              <MaterialCommunityIcons name="trophy-outline" size={22} color="#F59E0B" />
            </View>
            <View style={styles.insightTextContainer}>
              <Text style={styles.insightTitle}>En Verimli Günün</Text>
              <Text style={styles.insightValue}>{analytics.topDay}</Text>
            </View>
          </GlassCard>

          <GlassCard 
            intensity={0.5} 
            style={[
              styles.insightCard, 
              analytics.activeHighPriority === 0 && { borderColor: theme.colors.success + '30' } 
            ]}
          >
            <View style={[
              styles.iconCircle, 
              { backgroundColor: analytics.activeHighPriority > 0 ? '#EF444420' : theme.colors.success + '20' }
            ]}>
              <MaterialCommunityIcons 
                name={analytics.activeHighPriority > 0 ? "fire" : "check-decagram"} 
                size={22} 
                color={analytics.activeHighPriority > 0 ? "#EF4444" : theme.colors.success} 
              />
            </View>
            <View style={styles.insightTextContainer}>
              <Text style={styles.insightTitle}>Kritik Durum</Text>
              <Text style={[
                styles.insightValue,
                analytics.activeHighPriority === 0 && { color: theme.colors.success }
              ]}>
                {analytics.activeHighPriority > 0 
                  ? `${analytics.activeHighPriority} Bekleyen Görev` 
                  : "Tüm Kritik İşler Bitti! 🎉"}
              </Text>
            </View>
          </GlassCard>
        </View>

        <View style={styles.logoutContainer}>
          <TouchableOpacity onPress={handleLogout} activeOpacity={0.7}>
            <GlassCard intensity={0.5} style={styles.logoutGlass}>
              <MaterialCommunityIcons name="logout-variant" size={20} color={theme.colors.danger} />
              <Text style={styles.logoutText}>Oturumu Kapat</Text>
            </GlassCard>
          </TouchableOpacity>
          <Text style={styles.versionText}>Versiyon 0.1.1</Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 40 },
  hero: { alignItems: "center", marginBottom: 30 },
  ring: { position: 'absolute', width: 220, height: 220, borderRadius: 110, borderWidth: 1, top: 0 },
  avatarWrapper: { marginBottom: 15, position: "relative" },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "white",
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 4 }
    })
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    zIndex: 10,
    borderColor: 'white',
  },
  avatarText: { color: "white", fontSize: 32, fontWeight: "bold" },
  userName: { fontSize: 22, fontWeight: "bold", color: "#333" },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginTop: 8 },
  statsGrid: { flexDirection: "row", paddingHorizontal: 15, gap: 10 },

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
  logoutText: { fontSize: theme.typography.sizes.md, fontWeight: theme.typography.weights.semibold, color: theme.colors.danger },
  versionText: { textAlign: 'center', marginTop: 20, color: theme.colors.textSecondary, fontSize: 10, opacity: 0.5 },

  statCardGlass: {
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 110,
  },
  badgeGlass: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 8,
    borderRadius: 12,
  },
  chartWrapper: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  logoutGlass: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    gap: 10,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  insightRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 15,
    gap: 10,
  },
  miniInsightCard: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  insightContainer: {
    paddingHorizontal: 16,
    marginTop: 20,
    gap: 12,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 15,
    borderRadius: 24, 
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightTextContainer: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8', 
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  insightValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B', 
  },
});