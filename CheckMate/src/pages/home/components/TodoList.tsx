import { Todo } from "@/src/constants/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useCallback, useRef } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import TodoItem from "./TodoItem";


const { width } = Dimensions.get("window");

type Props = {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (iid: string) => void;
};

const RenderRightActions = ({
  progress,
  onDelete,
}: {
  progress: Animated.AnimatedInterpolation<number | string>;
  onDelete: () => void;
}) => {
  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [80, 0],
  });
  
  return (
    <View style={styles.deleteWrapper}>
      <Animated.View style={[styles.deleteAction, { transform: [{ translateX }] }]}>
        <TouchableOpacity
          onPress={onDelete}
          style={styles.deleteButton}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="trash-can-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const TodoList = ({ todos, onToggle, onDelete }: Props) => {
  const swipeableRefs = useRef<Map<number, Swipeable | null>>(new Map());
  const currentlyOpenRef = useRef<number | null>(null);

  const handleSwipeOpen = useCallback((index: number) => {
    if (currentlyOpenRef.current !== null && currentlyOpenRef.current !== index) {
      swipeableRefs.current.get(currentlyOpenRef.current)?.close();
    }
    currentlyOpenRef.current = index;
  }, []);

 const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Todo>) => (
      <Swipeable
   
        renderRightActions={(progress) => (
          <RenderRightActions
            progress={progress}
            onDelete={() => onDelete(item.id)} 
          />
        )}
      >
        <TodoItem
          item={item}
          onToggle={onToggle} 
          createdAt={item.createdAt}
        />
      </Swipeable>
    ),
    [onToggle, onDelete]
  );
  if (todos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconCircle}>
          <MaterialCommunityIcons
            name="clipboard-text-outline"
            size={40}
            color="#6366F1"
          />
        </View>
        <Text style={styles.emptyTitle}>Henüz Görev Yok</Text>
        <Text style={styles.emptySubtitle}>Planlarını buraya ekleyerek başlayabilirsin.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={todos}
      keyExtractor={(item) => item.id || Math.random().toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.listContent}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default TodoList;

const styles = StyleSheet.create({
  listContent: { 
    paddingVertical: 12, 
    paddingHorizontal: 20,
    flexGrow: 1 
  },
  separator: { 
    height: 12 
  },
  deleteWrapper: {
    width: 80,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  deleteAction: {
    height: '90%', // TodoItem kart yüksekliğiyle uyumlu
    width: 70,
    backgroundColor: "#FEF2F2", // Hafif kırmızı arka plan
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  deleteButton: {
    backgroundColor: "#EF4444",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 100,
    width: '100%',
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  emptySubtitle: { 
    fontSize: 14, 
    color: "#6B7280", 
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 40
  },
});