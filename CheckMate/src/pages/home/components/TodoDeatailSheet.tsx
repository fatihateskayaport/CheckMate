import { CATEGORIES, theme, Todo } from "@/src/constants"; // theme eklendi
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import React, { useCallback, useEffect, useMemo, useRef } from "react"; // useCallback eklendi
import { Platform, StyleSheet, Text, View } from "react-native";

type Props = {
  todo: Todo | null;
  onClose: () => void;
};

const TodoDetailSheet = ({ todo, onClose }: Props) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  
  // 1. SNAP POINTS: Eğer hala kısa geliyorsa ["90%"] olarak tek değer dene.
  // Bu, çekmeceyi direkt tavana yapıştırır.
  const snapPoints = useMemo(() => ["70%", "90%"], []);

  useEffect(() => {
    if (todo) {
      // snapToIndex(0) yerine expand() kullanarak en yüksek noktaya zorlayabiliriz
      bottomSheetRef.current?.expand();
    }
  }, [todo]);

  // 2. BACKDROP: useCallback kullanımı şarttır, yoksa her render'da titreme yapar
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
        <BlurView intensity={50} tint="light" style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.05)' }]} />
      </BottomSheetBackdrop>
    ),
    []
  );

  if (!todo) return null;

  const category = CATEGORIES.find((c) => c.id === todo.category);

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
      // 3. KRİTİK: Klavye veya içerik yüzünden kısalmasını engellemek için
      enableDynamicSizing={false} 
    >
      <BottomSheetView style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.categoryBadge, { backgroundColor: (category?.color || '#000') + "15" }]}>
            <MaterialCommunityIcons name={category?.icon as any} size={16} color={category?.color} />
            <Text style={[styles.categoryText, { color: category?.color }]}>{category?.label}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.title}>{todo.title}</Text>
          <Text style={styles.description}>{todo.description || "Açıklama yok."}</Text>
        </View>

        {/* Footer'ı da buraya ekleyelim ki boş kalmasın */}
        <View style={styles.footer}>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="calendar-clock" size={22} color="#64748B" />
            <Text style={styles.metaText}>
              {new Date(todo.deadline).toLocaleDateString("tr-TR")}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="flag-variant" size={22} color={theme.colors.primary} />
            <Text style={styles.metaText}>{todo.priority} Öncelik</Text>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};
const styles = StyleSheet.create({
  sheetBackground: { 
    backgroundColor: "#FFFFFF",
    borderRadius: 35,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.1, shadowRadius: 10 },
      android: { elevation: 20 }
    })
  },
  content: { padding: 26, gap: 24, paddingBottom: 80 },
  header: { flexDirection: "row", justifyContent: "flex-start" },
  categoryBadge: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14, gap: 8 },
  categoryText: { fontSize: 14, fontWeight: "700" },
  body: { gap: 12 },
  title: { fontSize: 26, fontWeight: "800", color: "#1E293B", letterSpacing: -0.5 },
  description: { fontSize: 17, color: "#475569", lineHeight: 26 },
  footer: { flexDirection: "column", borderTopWidth: 1, borderTopColor: "#F1F5F9", paddingTop: 25, gap: 18 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 12 },
  metaText: { fontSize: 15, fontWeight: "600", color: "#334155" },
});

export default TodoDetailSheet;