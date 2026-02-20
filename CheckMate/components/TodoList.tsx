import { Todo } from "@/app/Screens/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useCallback, useRef } from "react";
import {
  Animated,
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import TodoItem from "./TodoItem";

type Props = {
  todos: Todo[];
  onToggle: (index: number) => void;
  onDelete: (index: number) => void;
};

const RenderRightActions = ({
  progress,
  onDelete,
}: {
  progress: Animated.AnimatedInterpolation<number>;
  onDelete: () => void;
}) => {
  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [80, 0],
  });
  const opacity = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.5, 1],
  });

  return (
    <Animated.View
      style={[styles.deleteContainer, { opacity, transform: [{ translateX }] }]}
    >
      <TouchableOpacity
        onPress={onDelete}
        style={styles.deleteButton}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons
          name="trash-can-outline"
          size={22}
          color="#fff"
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const TodoList = ({ todos, onToggle, onDelete }: Props) => {
  const swipeableRefs = useRef<Map<number, Swipeable | null>>(new Map());
  const currentlyOpenRef = useRef<number | null>(null);

  const handleSwipeOpen = useCallback((index: number) => {
    if (
      currentlyOpenRef.current !== null &&
      currentlyOpenRef.current !== index
    ) {
      swipeableRefs.current.get(currentlyOpenRef.current)?.close();
    }
    currentlyOpenRef.current = index;
  }, []);

  const handleSwipeClose = useCallback((index: number) => {
    if (currentlyOpenRef.current === index) currentlyOpenRef.current = null;
  }, []);

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<Todo>) => (
      <Swipeable
        ref={(ref) => {
          if (ref) {
            swipeableRefs.current.set(index, ref);
          } else {
            swipeableRefs.current.delete(index);
          }
        }}
        friction={2}
        overshootRight={false}
        rightThreshold={40}
        renderRightActions={(progress) => (
          <RenderRightActions
            progress={progress}
            onDelete={() => {
              swipeableRefs.current.get(index)?.close();
              onDelete(index);
            }}
          />
        )}
        onSwipeableOpen={() => handleSwipeOpen(index)}
        onSwipeableClose={() => handleSwipeClose(index)}
      >
        <TodoItem
          item={item}
          index={index}
          onToggle={onToggle}
          onDelete={onDelete}
          createdAt={item.createdAt}
        />
      </Swipeable>
    ),
    [onToggle, onDelete, handleSwipeOpen, handleSwipeClose],
  );

  if (todos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons
          name="check-circle-outline"
          size={48}
          color="#D1D5DB"
        />
        <Text style={styles.emptyTitle}>Görev yok</Text>
        <Text style={styles.emptySubtitle}>Yeni bir görev ekleyerek başla</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={todos}
      keyExtractor={(_, index) => index.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.listContent}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default TodoList;

const styles = StyleSheet.create({
  listContent: { paddingVertical: 8, paddingHorizontal: 16 },
  separator: { height: 8 },
  deleteContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: "100%",
    borderRadius: 35,
    alignSelf: "stretch",
    gap: 2,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#9CA3AF",
    marginTop: 4,
  },
  emptySubtitle: { fontSize: 13, color: "#C4C9D4", fontWeight: "400" },
});
