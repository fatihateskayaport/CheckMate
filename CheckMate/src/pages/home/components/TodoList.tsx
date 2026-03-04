import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useCallback, useRef } from "react";
import {
  Alert,
  Animated,
  FlatList,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
  Text,
  View
} from "react-native";
import { RectButton, Swipeable } from "react-native-gesture-handler";

import { theme } from "@/src/constants";
import { Todo } from "@/src/constants/types";

import * as Haptics from 'expo-haptics';

import TodoItem from "./TodoItem";

type Props = {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onPressItem: (todo: Todo) => void;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
};

const RenderRightActions = ({
  progress,
  onDelete,
}: {
  progress: Animated.AnimatedInterpolation<number | string>;
  onDelete: () => void;
}) => {

  const handleDeletePress = () => {
    // 1. Önce hafif bir uyarı titreşimi
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // 2. Onay Penceresi
    Alert.alert(
      "Görevi Sil",
      "Bu görevi silmek istediğinize emin misiniz?",
      [
        { text: "Vazgeç", style: "cancel" },
        { 
          text: "Sil", 
          style: "destructive", 
          onPress: () => {
            // Silme onaylanırsa asıl silme fonksiyonunu çağır
            onDelete();
            // Başarı titreşimi
            if (Platform.OS !== 'web') {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
          } 
        }
      ]
    );
  };

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [80, 0],
  });

  return (
    <View style={styles.deleteWrapper}>
      <Animated.View style={[styles.deleteAction, { transform: [{ translateX }] }]}>
        <RectButton
          onPress={handleDeletePress}
          style={styles.deleteButton}
        >
          <MaterialCommunityIcons name="trash-can-outline" size={24} color={theme.colors.white} />
        </RectButton>
      </Animated.View>
    </View>
  );
};

const TodoList = ({ todos, onToggle, onDelete, onPressItem, ListHeaderComponent }: Props) => {
  const swipeableRefs = useRef<Map<string, Swipeable | null>>(new Map());

  const closeOtherSwipeables = useCallback((currentId: string) => {
    swipeableRefs.current.forEach((ref, id) => {
      if (id !== currentId) ref?.close();
    });
  }, []);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Todo>) => (
      <Swipeable
        ref={(ref) => {
          if (ref) swipeableRefs.current.set(item.id, ref);
          else swipeableRefs.current.delete(item.id);
        }}
        onSwipeableWillOpen={() => closeOtherSwipeables(item.id)}
        friction={2}
        rightThreshold={40}
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
          onPress={() => onPressItem(item)}
        />
      </Swipeable>
    ),
    [onToggle, closeOtherSwipeables, onDelete, onPressItem]
  );

  
  if (todos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconCircle}>
          <MaterialCommunityIcons name="clipboard-text-outline" size={40} color={theme.colors.primary} />
        </View>
        <Text style={styles.emptyTitle}>Henüz Görev Yok</Text>
      </View>
    );
  }


  return (
    <FlatList
      data={todos}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}

      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={5}
      removeClippedSubviews={Platform.OS === 'android'}
      ListHeaderComponent={ListHeaderComponent} 
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <MaterialCommunityIcons name="clipboard-text-outline" size={40} color={theme.colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>Henüz Görev Yok</Text>
        </View>
      }
    />
  );
};

export default TodoList;

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: theme.layout.spacing.md,
    paddingBottom: 150, 
    flexGrow: 1,
  },
  deleteWrapper: {
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4, 
  },
  deleteAction: {
    height: '100%',
    width: 70,
    backgroundColor: theme.colors.danger,
    borderRadius: theme.layout.borderRadius.md,
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: theme.colors.danger, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 4 },
      android: { elevation: 4 }
    })
  },
  deleteButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
    paddingBottom: 100,
  },
  emptyIconCircle: {
    width: 80, 
    height: 80, 
    borderRadius: 40,
    backgroundColor: theme.colors.primary + "10",
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.layout.spacing.md,
  },
  emptyTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: theme.layout.spacing.xl,
  },
});