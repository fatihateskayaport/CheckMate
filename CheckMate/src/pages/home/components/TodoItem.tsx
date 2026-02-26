import { Todo } from "@/src/constants/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  item: Todo;

  onToggle: (id: string) => void; 
  createdAt: string | number;
};

const formatDate = (dateValue: string | number) => {
  const d = new Date(dateValue);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' });
};


const TodoItem = ({ item, onToggle }: Props) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const checkAnim = useRef(new Animated.Value(item.isCompleted ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(checkAnim, {
      toValue: item.isCompleted ? 1 : 0,
      useNativeDriver: true,
      damping: 15,
      stiffness: 150,
    }).start();
  }, [checkAnim, item.isCompleted]);

  const handleToggle = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.96, duration: 100, useNativeDriver: true }),
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
        activeOpacity={0.8} 
        style={styles.inner}
      >
        <View style={[styles.checkbox, item.isCompleted && styles.checkboxDone]}>
          <Animated.View style={{ transform: [{ scale: checkScale }] }}>
            <MaterialCommunityIcons name="check-bold" size={14} color="#fff" />
          </Animated.View>
        </View>

        <View style={styles.textWrapper}>
          <Text 
            style={[styles.title, item.isCompleted && styles.completedText]} 
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text style={styles.description} numberOfLines={1}>
            {item.description || "Açıklama yok"}
          </Text>
        </View>

        <View style={styles.rightInfo}>
          <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
          <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(item.priority) }]} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const getPriorityColor = (p?: string) => {
  switch (p) {
    case 'High': return '#EF4444';
    case 'Medium': return '#F59E0B';
    default: return '#22C55E';
  }
};

export default TodoItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    marginVertical: 4,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB", 
  },
  checkboxDone: { 
    backgroundColor: "#6366F1", 
    borderColor: "#6366F1" 
  },
  textWrapper: { flex: 1 },
  title: { fontSize: 15, fontWeight: "700", color: "#111827" },
  description: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  completedText: { color: "#9CA3AF", textDecorationLine: "line-through" },
  rightInfo: { alignItems: 'flex-end', gap: 6 },
  dateText: { fontSize: 10, color: "#9CA3AF", fontWeight: "600" },
  priorityDot: { width: 30, height: 6, borderRadius: 3 }
});