import GlassCard from "@/src/components/GlassCard";
import { CATEGORIES, CategoryType, theme } from "@/src/constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  isVisible: boolean;
  onClose: () => void;
  activeFilter: CategoryType | 'All';
  setActiveFilter: (filter: CategoryType | 'All') => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  weekDays: any[];
};

const FilterSheet = ({ 
  isVisible, 
  onClose, 
  activeFilter, 
  setActiveFilter, 
  selectedDate, 
  setSelectedDate, 
  weekDays 
}: Props) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["60%", "70%"], []);

  // Açılma/Kapanma Kontrolü
  useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible]);

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

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1} // Başlangıçta kapalı
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onClose={onClose}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: "#CBD5E1", width: 50, height: 4 }}
      backgroundStyle={styles.sheetBackground}
      enableDynamicSizing={false}
    >
      <BottomSheetView style={styles.content}>
        <Text style={styles.title}>Filtrele & Düzenle</Text>

        {/* TARİH SEÇİMİ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tarih Seçimi</Text>
          <BottomSheetScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.scrollPadding}
          >
            <TouchableOpacity onPress={() => setSelectedDate('All')} activeOpacity={0.7}>
              <GlassCard intensity={selectedDate === 'All' ? 0.8 : 0.2} style={[styles.dateCard, selectedDate === 'All' && styles.activeCard]}>
                <MaterialCommunityIcons name="infinity" size={20} color={selectedDate === 'All' ? theme.colors.primary : "#94A3B8"} />
                <Text style={styles.cardText}>Hepsi</Text>
              </GlassCard>
            </TouchableOpacity>

            {weekDays.map((item) => (
              <TouchableOpacity key={item.fullDate} onPress={() => setSelectedDate(item.fullDate)} activeOpacity={0.7}>
                <GlassCard intensity={selectedDate === item.fullDate ? 0.8 : 0.2} style={[styles.dateCard, selectedDate === item.fullDate && styles.activeCard]}>
                  <Text style={styles.cardText}>{item.dayName}</Text>
                  <Text style={styles.dayNum}>{item.dayNumber}</Text>
                </GlassCard>
              </TouchableOpacity>
            ))}
          </BottomSheetScrollView>
        </View>

        {/* KATEGORİ SEÇİMİ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kategoriler</Text>
          <View style={styles.categoryGrid}>
            <TouchableOpacity onPress={() => setActiveFilter('All')} style={styles.categoryItem}>
              <GlassCard intensity={activeFilter === 'All' ? 0.8 : 0.2} style={[styles.catChip, activeFilter === 'All' && styles.activeCard]}>
                <Text style={styles.cardText}>Tümü</Text>
              </GlassCard>
            </TouchableOpacity>

            {CATEGORIES.map((cat) => (
              <TouchableOpacity key={cat.id} onPress={() => setActiveFilter(cat.id as CategoryType)} style={styles.categoryItem}>
                <GlassCard intensity={activeFilter === cat.id ? 0.8 : 0.2} style={[styles.catChip, activeFilter === cat.id && { borderColor: cat.color, borderWidth: 1.5 }]}>
                  <MaterialCommunityIcons name={cat.icon as any} size={16} color={cat.color} />
                  <Text style={styles.cardText}>{cat.label}</Text>
                </GlassCard>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* UYGULA BUTONU */}
        <TouchableOpacity style={styles.applyButton} onPress={onClose}>
          <Text style={styles.applyButtonText}>Filtreleri Uygula</Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  sheetBackground: { 
    backgroundColor: theme.colors.white,
    borderRadius: 35,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.1, shadowRadius: 10 },
      android: { elevation: 20 }
    })
  },
  content: { padding: 26, gap: 20 },
  title: { fontSize: 22, fontWeight: "800", color: "#1E293B", textAlign: 'center', marginBottom: 10 },
  section: { gap: 12 },
  sectionTitle: { fontSize: 11, fontWeight: "800", color: "#94A3B8", textTransform: 'uppercase', letterSpacing: 1 },
  
  scrollPadding: { paddingBottom: 10, gap: 12 },
  dateCard: { width: 65, height: 75, justifyContent: 'center', alignItems: 'center', borderRadius: 18 },
  activeCard: { borderColor: theme.colors.primary, borderWidth: 2 },
  cardText: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  dayNum: { fontSize: 18, fontWeight: '800', color: '#1E293B' },

  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  categoryItem: { minWidth: '30%' },
  catChip: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 16, gap: 8 },

  applyButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4
  },
  applyButtonText: { color: 'white', fontWeight: '800', fontSize: 16 }
});

export default FilterSheet;