import { theme } from "@/src/constants";
import { Todo } from "@/src/constants/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  item: Todo;
  onToggle: (id: string) => void; 
};

const TodoItem = ({ item, onToggle }: Props) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const checkAnim = useRef(new Animated.Value(item.isCompleted ? 1 : 0)).current;

  const formattedDate = useMemo(() => {
    const d = new Date(item.createdAt);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "short" });
  }, [item.createdAt]);

  
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
  }, [item.isCompleted]);

  const handleToggle = () => {
    // Dokunma animasyonu
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    
    onToggle(item.id);
  };

  const checkScale = checkAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1.2, 1],
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity 
        onPress={handleToggle} 
        activeOpacity={0.7} 
        style={styles.inner}
      >
        {/* Checkbox Bölümü */}
        <View style={[
          styles.checkbox, 
          item.isCompleted && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }
        ]}>
          <Animated.View style={{ transform: [{ scale: checkScale }] }}>
            <MaterialCommunityIcons name="check-bold" size={14} color={theme.colors.white} />
          </Animated.View>
        </View>

        {/* Metin İçeriği */}
        <View style={styles.textWrapper}>
          <Text 
            style={[
              styles.title, 
              item.isCompleted && styles.completedText
            ]} 
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text style={styles.description} numberOfLines={1}>
            {item.description || "Açıklama eklenmemiş"}
          </Text>
        </View>


        <View style={styles.rightInfo}>
          <Text style={styles.dateText}>{formattedDate}</Text>
          <View style={[styles.priorityIndicator, { backgroundColor: priorityColor }]} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default TodoItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.layout.borderRadius.md,
    marginVertical: theme.layout.spacing.xs,
    marginHorizontal: theme.layout.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    // Modern Gölge
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.layout.spacing.md,
    gap: theme.layout.spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  textWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.textPrimary,
  },
  description: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  completedText: {
    color: theme.colors.textSecondary,
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
  rightInfo: {
    alignItems: "flex-end",
    gap: 6,
  },
  dateText: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.weights.medium,
  },
  priorityIndicator: {
    width: 24,
    height: 4,
    borderRadius: theme.layout.borderRadius.full,
  },
});