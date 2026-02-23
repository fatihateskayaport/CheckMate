import { Todo } from "@/app/screens/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  item: Todo;
  index: number;
  onToggle: (index: number) => void;
  onDelete?: (index: number) => void;
  createdAt: number;
};
const formatDate = (ts: number) => {
  const d = new Date(ts);
  return `${d.getDate().toString().padStart(2, "0")}.${(d.getMonth() + 1).toString().padStart(2, "0")}.${d.getFullYear()}`;
};

const TodoItem = ({ item, index, onToggle, onDelete }: Props) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const checkAnim = useRef(new Animated.Value(item.completed ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(checkAnim, {
      toValue: item.completed ? 1 : 0,
      useNativeDriver: true,
      damping: 12,
      stiffness: 180,
    }).start();
  }, [item.completed, checkAnim]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.97,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
    onToggle(index);
  };

  const checkScale = checkAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.5, 1.2, 1],
  });

  return (
    <Animated.View
      style={[styles.container, { transform: [{ scale: scaleAnim }] }]}
    >
      <View style={styles.inner}>
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.7}
          style={[styles.checkbox, item.completed && styles.checkboxDone]}
        >
          {item.completed && (
            <Animated.View style={{ transform: [{ scale: checkScale }] }}>
              <MaterialCommunityIcons name="check" size={14} color="#fff" />
            </Animated.View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.85}
          style={styles.textWrapper}
        >
          <Text
            style={[styles.text, item.completed && styles.completedText]}
            numberOfLines={2}
          >
            {item.text}
          </Text>
        </TouchableOpacity>

        <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
      </View>
    </Animated.View>
  );
};

export default TodoItem;

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("screen").width * 0.9,
    backgroundColor: "#fff",
    borderRadius: 35,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  checkboxDone: { backgroundColor: "#4f6cff", borderColor: "#4f6cff" },
  textWrapper: { flex: 1 },
  text: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1F2937",
    letterSpacing: -0.1,
    lineHeight: 22,
  },
  completedText: {
    color: "#C4C9D4",
    textDecorationLine: "line-through",
    fontWeight: "400",
  },
  dateText: {
    fontSize: 11,
    color: "#C4C9D4",
    fontWeight: "400",
  },
});
