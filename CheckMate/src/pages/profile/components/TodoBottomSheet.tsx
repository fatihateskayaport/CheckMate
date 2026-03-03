import { Todo } from "@/src/constants/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
} from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import React, { useCallback, useMemo, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";

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
  
  const snapPoints = useMemo(() => ["65%", "80%"], []);

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
        opacity={1}
        onPress={onClose}
        style={[props.style, { backgroundColor: 'transparent' }]}
      >
        <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.05)' }]} />
      </BottomSheetBackdrop>
    ),
    [onClose],
  );

  //BUNU KULLANIRSIN DATE FORMATINDA
  const formatDate = (dateValue: any) => {
    if (!dateValue) return "-";
    const d = new Date(dateValue);
    return `${d.getDate().toString().padStart(2, "0")}.${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}.${d.getFullYear()}`;
  };

  const renderItem = ({ item }: { item: Todo }) => (
    <View style={styles.todoItem}>
      <View style={[styles.checkbox, item.isCompleted && styles.checkboxDone]}>
        {item.isCompleted && (
          <MaterialCommunityIcons name="check" size={14} color="#fff" />
        )}
      </View>
      <View style={styles.todoContent}>
        <Text
          style={[styles.todoText, item.isCompleted && styles.todoTextDone]}
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text style={styles.todoDate}>
            Oluşturulma: {formatDate(item.createdAt)}
        </Text>
      </View>
      {item.isCompleted && (
        <View style={styles.completedBadge}>
          <MaterialCommunityIcons name="check-decagram" size={14} color="#16A34A" />
          <Text style={styles.completedBadgeText}>Bitti</Text>
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
          <View style={styles.subtitleRow}>
            <View style={styles.dot} />
            <Text style={styles.subtitle}>{todos.length} Görev Listeleniyor</Text>
          </View>
        </View>
      </View>

      {todos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <MaterialCommunityIcons name="text-box-remove-outline" size={40} color="#6366F1" />
          </View>
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        </View>
      ) : (
        <BottomSheetFlatList
          data={todos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </BottomSheet>
  );
};

export default TodoBottomSheet;

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  },
  handle: {
    backgroundColor: "#CBD5E1",
    width: 45,
    height: 4,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1E293B",
    letterSpacing: -0.5,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#6366F1",
  },
  subtitle: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  separator: {
    height: 12,
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#CBD5E1",
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
    fontSize: 15,
    fontWeight: "700",
    color: "#334155",
  },
  todoTextDone: {
    color: "#94A3B8",
    textDecorationLine: "line-through",
    fontWeight: "500",
  },
  todoDate: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
    marginTop: 4,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  completedBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#16A34A",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 80,
    gap: 16,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#EEF2FF",
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: "#64748B",
    fontWeight: "600",
  },
});