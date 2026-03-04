import { CATEGORIES, theme, Todo } from "@/src/constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

type Props = {
  todo: Todo | null;
  onClose: () => void;
};

const TodoDetailSheet = ({ todo, onClose }: Props) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["65%", "90%"], []);

  useEffect(() => {
    if (todo) {
      bottomSheetRef.current?.expand();
    }
  }, [todo]);

  // Durum Mantığı (Status Logic)
  const statusInfo = useMemo(() => {
    if (!todo) return null;
    if (todo.isCompleted) return { label: "Tamamlandı", color: "#22C55E", icon: "check-circle" };
    
    // Süresi geçmiş mi kontrolü (Deadline varsa)
    const isOverdue = todo.deadline && new Date(todo.deadline) < new Date();
    if (isOverdue) return { label: "Süresi Geçti", color: "#EF4444", icon: "alert-circle" };
    
    return { label: "Devam Ediyor", color: theme.colors.primary, icon: "clock-fast" };
  }, [todo]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={1}
        pressBehavior="close"
        style={[props.style, { backgroundColor: 'transparent' }]}
      >
        <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.05)' }]} />
      </BottomSheetBackdrop>
    ),
    []
  );

  if (!todo) return null;

  const category = CATEGORIES.find((c) => c.id === todo.category);
  const targetDateInfo = todo.targetDate 
    ? new Date(todo.targetDate).toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', weekday: 'long' })
    : "Süresiz (Her Zaman)";

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0} 
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onClose={onClose}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: "#CBD5E1", width: 50, height: 4 }}
      backgroundStyle={styles.sheetBackground}
      enableDynamicSizing={false} 
    >
      <BottomSheetView style={styles.content}>
        {/* ÜST BÖLÜM */}
        <View style={styles.header}>
          <View style={[styles.categoryBadge, { backgroundColor: (category?.color || theme.colors.primary) + "15" }]}>
            <MaterialCommunityIcons name={category?.icon as any} size={16} color={category?.color} />
            <Text style={[styles.categoryText, { color: category?.color }]}>{category?.label}</Text>
          </View>
          
          <View style={[styles.statusBadge, { backgroundColor: statusInfo?.color + "15" }]}>
            <MaterialCommunityIcons name={statusInfo?.icon as any} size={14} color={statusInfo?.color} />
            <Text style={[styles.statusText, { color: statusInfo?.color }]}>{statusInfo?.label}</Text>
          </View>
        </View>

        {/* GÖVDE */}
        <View style={styles.body}>
          <Text style={styles.title}>{todo.title}</Text>
          <View style={styles.descriptionBox}>
            <Text style={styles.description}>{todo.description || "Açıklama eklenmemiş."}</Text>
          </View>
        </View>

        {/* HEDEF ZAMAN KARTI */}
        <View style={styles.targetDateCard}>
          <View style={[styles.iconCircle, { backgroundColor: theme.colors.primary + "10" }]}>
            <MaterialCommunityIcons 
              name={todo.targetDate ? "calendar-star" : "infinity"} 
              size={24} 
              color={theme.colors.primary} 
            />
          </View>
          <View>
            <Text style={styles.targetLabel}>HEDEF ZAMAN</Text>
            <Text style={styles.targetValue}>{targetDateInfo}</Text>
          </View>
        </View>

        {/* AYRINTILAR ROW */}
        <View style={styles.footerRow}>
          <View style={styles.metaBox}>
            <MaterialCommunityIcons name="clock-outline" size={20} color="#64748B" />
            <Text style={styles.metaLabel}>Saat</Text>
            <Text style={styles.metaValue}>
              {todo.deadline ? new Date(todo.deadline).toLocaleTimeString("tr-TR", {hour: '2-digit', minute:'2-digit'}) : "--:--"}
            </Text>
          </View>

          <View style={styles.metaBox}>
            <MaterialCommunityIcons name="flag-variant-outline" size={20} color="#64748B" />
            <Text style={styles.metaLabel}>Öncelik</Text>
            <Text style={[styles.metaValue, { color: todo.priority === 'High' ? '#EF4444' : '#1E293B' }]}>
              {todo.priority}
            </Text>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  sheetBackground: { 
    backgroundColor: theme.colors.white, // Theme'den çekildi
    borderRadius: 35,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.1, shadowRadius: 10 },
      android: { elevation: 20 }
    })
  },
  content: { padding: 26, gap: 24 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: 'center' },
  categoryBadge: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, gap: 6 },
  categoryText: { fontSize: 13, fontWeight: "800", textTransform: 'uppercase' },
  
  statusBadge: { flexDirection: "row", alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, gap: 5 },
  statusText: { fontSize: 11, fontWeight: "800", textTransform: 'uppercase' },

  body: { gap: 12 },
  title: { fontSize: 26, fontWeight: "800", color: "#1E293B", letterSpacing: -0.5 },
  descriptionBox: { padding: 15, backgroundColor: "#F8FAFC", borderRadius: 16, borderLeftWidth: 4, borderLeftColor: theme.colors.primary },
  description: { fontSize: 16, color: "#475569", lineHeight: 24 },

  targetDateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#F1F5F9",
    padding: 16,
    borderRadius: 20,
    gap: 15,
  },
  iconCircle: { width: 48, height: 48, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  targetLabel: { fontSize: 10, fontWeight: "800", color: "#94A3B8", letterSpacing: 1.5 },
  targetValue: { fontSize: 15, fontWeight: "700", color: "#1E293B", marginTop: 2 },

  footerRow: { flexDirection: 'row', gap: 12 },
  metaBox: { flex: 1, backgroundColor: "#F8FAFC", padding: 12, borderRadius: 18, alignItems: 'center', gap: 4, borderWidth: 1, borderColor: "#F1F5F9" },
  metaLabel: { fontSize: 11, color: "#94A3B8", fontWeight: "600" },
  metaValue: { fontSize: 14, color: "#1E293B", fontWeight: "700" },
});

export default TodoDetailSheet;