import { Todo } from "@/src/constants/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo, useRef } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  todos: Todo[];
  emptyMessage?: string;
};

const TodoBottomSheet = ({
  visible,
  onClose,
  title,
  todos,
  emptyMessage = "Görev bulunamadı",
}: Props) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["50%", "85%"], []);

  React.useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={onClose}
      />
    ),
    [onClose],
  );

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return `${d.getDate().toString().padStart(2, "0")}.${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}.${d.getFullYear()}`;
  };

  const renderItem = ({ item }: { item: Todo }) => (
    <View style={styles.todoItem}>
      <View style={[styles.checkbox, item.completed && styles.checkboxDone]}>
        {item.completed && (
          <MaterialCommunityIcons name="check" size={14} color="#fff" />
        )}
      </View>
      <View style={styles.todoContent}>
        <Text
          style={[styles.todoText, item.completed && styles.todoTextDone]}
          numberOfLines={2}
        >
          {item.text}
        </Text>
        <Text style={styles.todoDate}>{formatDate(item.createdAt)}</Text>
      </View>
      {item.completed && (
        <View style={styles.completedBadge}>
          <Text style={styles.completedBadgeText}>Tamamlandı</Text>
        </View>
      )}
    </View>
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      enableDynamicSizing={false}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={styles.handle}
      backgroundStyle={styles.background}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{todos.length} görev</Text>
        </View>
        {/* <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <MaterialCommunityIcons name="close" size={20} color="#6B7280" />
        </TouchableOpacity> */}
      </View>

      {todos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="check-circle-outline"
            size={48}
            color="#D1D5DB"
          />
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        </View>
      ) : (
        <BottomSheetFlatList
          data={todos}
          keyExtractor={(_: Todo, index: number) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </BottomSheet>
  );
};

export default TodoBottomSheet;

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#FAFAFA",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  handle: {
    backgroundColor: "#D1D5DB",
    width: 40,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
    marginTop: 2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },

  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  separator: {
    height: 8,
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
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
  checkboxDone: {
    backgroundColor: "#6366F1",
    borderColor: "#6366F1",
  },
  todoContent: {
    flex: 1,
  },
  todoText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    lineHeight: 20,
  },
  todoTextDone: {
    color: "#C4C9D4",
    textDecorationLine: "line-through",
    fontWeight: "400",
  },
  todoDate: {
    fontSize: 11,
    color: "#C4C9D4",
    marginTop: 2,
  },
  completedBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  completedBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#16A34A",
  },

  // Empty
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    paddingBottom: 60,
  },
  emptyText: {
    fontSize: 15,
    color: "#9CA3AF",
    fontWeight: "500",
  },
});
