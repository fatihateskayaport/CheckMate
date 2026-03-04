import GlassCard from "@/src/components/GlassCard";
import { theme } from "@/src/constants";
import { CATEGORIES, Todo } from "@/src/constants/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';
import React, { useEffect, useMemo, useRef } from "react";
import {
  Alert,
  Animated,
  Platform,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

type Props = {
  item: Todo;
  onToggle: (id: string) => void;
  onPress: () => void;
};

const TodoItem = ({ item, onToggle, onPress }: Props) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const checkAnim = useRef(new Animated.Value(item.isCompleted ? 1 : 0)).current;
  const categoryData = useMemo(() => {
    return CATEGORIES.find(c => c.id === item.category);
  }, [item.category]);

  const formattedDate = useMemo(() => {
    const d = new Date(item.createdAt);
    return isNaN(d.getTime()) ? "" : d.toLocaleDateString("tr-TR", { day: "2-digit", month: "short" });
  }, [item.createdAt]);

  const deadlineInfo = useMemo(() => {
    if (!item.deadline) return null;
    const d = new Date(item.deadline);
    if (isNaN(d.getTime())) return null;

    const now = new Date();
    const isPast = d < now && !item.isCompleted;

    return {
      text: d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }) + " - " +
        d.toLocaleDateString("tr-TR", { day: "2-digit", month: "short" }),
      isOverdue: isPast
    };
  }, [item.deadline, item.isCompleted]);

  const priorityColor = useMemo(() => {
    switch (item.priority) {
      case "High": return theme.colors.highRisk;
      case "Medium": return theme.colors.mediumRisk;
      case "Low": return theme.colors.lowRisk;
      default: return theme.colors.border;
    }
  }, [item.priority]);

  useEffect(() => {
    Animated.spring(checkAnim, {
      toValue: item.isCompleted ? 1 : 0,
      useNativeDriver: true,
      damping: 15,
      stiffness: 150,
    }).start();
  }, [checkAnim, item.isCompleted]);

  const handleToggle = () => {

    if (Platform.OS !== 'web') {

      if (!item.isCompleted) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }


    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.94, duration: 80, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();

    onToggle(item.id);
  };

  const onShare = async (todo: Todo) => {
    try {
      const message = `🎯 CheckMate Görevi\n📌 Başlık: ${todo.title}\n📝 Açıklama: ${todo.description || 'Yok'}\n📅 Teslim: ${new Date(todo.deadline!).toLocaleString('tr-TR')}\nCheckMate ile planlandı. ✨`;
      await Share.share({ message });
    } catch (error) {
      Alert.alert('Hata', 'Paylaşım yapılamadı.');
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <GlassCard
        intensity={item.isCompleted ? 0.3 : 0.7}
        style={[
          styles.cardContainer,
          item.isCompleted && { opacity: 0.8 }
        ]}
      >
        <View style={styles.inner}>


          <TouchableOpacity
            onPress={handleToggle}
            activeOpacity={0.8}
            style={styles.checkboxContainer}
          >
            <View style={[
              styles.checkbox,
              item.isCompleted && {
                backgroundColor: theme.colors.primary,
                borderColor: theme.colors.primary,
                shadowColor: theme.colors.primary,
                shadowOpacity: 0.3,
                shadowRadius: 5,
                elevation: 5
              }
            ]}>
              <Animated.View style={{
                transform: [{
                  scale: checkAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 1.4, 1] 
                  })
                }]
              }}>
                <MaterialCommunityIcons name="check-bold" size={12} color={theme.colors.white} />
              </Animated.View>
            </View>
          </TouchableOpacity>

          {/* 2. ALAN: Metinler ve Detay (Detay Çekmecesini Açar) */}
          <TouchableOpacity
            onPress={onPress} 
            activeOpacity={0.7}
            style={styles.textWrapper}
          >
            <Text style={[styles.title, item.isCompleted && styles.completedText]} numberOfLines={1}>
              {item.title}
            </Text>

            <View style={styles.metaRow}>
              {deadlineInfo && (
                <View style={styles.deadlineBadge}>
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={10}
                    color={deadlineInfo.isOverdue ? theme.colors.danger : theme.colors.primary}
                  />
                  <Text style={[
                    styles.deadlineText,
                    deadlineInfo.isOverdue && { color: theme.colors.danger, fontWeight: '700' }
                  ]}>
                    {deadlineInfo.text}
                  </Text>
                </View>
              )}
              <Text style={styles.dateText}>{formattedDate}</Text>
            </View>
          </TouchableOpacity>

          {/* 3. SAĞ: Kategori Badge ve Paylaş (EKSİKTİ, EKLENDİ) */}
          <View style={styles.rightActions}>
            {categoryData && (
              <View style={[styles.categoryBadge, { backgroundColor: categoryData.color + '15' }]}>
                <MaterialCommunityIcons
                  name={categoryData.icon as any}
                  size={12}
                  color={categoryData.color}
                />
                <Text style={[styles.categoryBadgeText, { color: categoryData.color }]}>
                  {categoryData.label}
                </Text>
              </View>
            )}
            <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />

            <TouchableOpacity onPress={() => onShare(item)} style={styles.glassShareButton}>
              <MaterialCommunityIcons name="share-variant" size={16} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

        </View>
      </GlassCard>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 16,
    marginVertical: 6,

  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.1)',
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  textWrapper: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#9CA3AF",
  },
  deadlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  deadlineText: {
    fontSize: 10,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 10,
    color: "#9CA3AF",
  },
  rightActions: {
    alignItems: "center",
    gap: 10,
    flexDirection: 'row',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  glassShareButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.15)',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  checkboxContainer: {
    paddingVertical: 10,
    paddingRight: 5,
  },
});

export default TodoItem;