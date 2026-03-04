import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, Share, StyleSheet, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";


import { RootStackParamList } from "@/App";
import { CategoryType, theme, Todo } from "@/src/constants";
import { useTodoStore } from "@/src/services/useTodoStore";


import CustomHeader from "@/src/components/CustomHeader";
import GlassCard from "@/src/components/GlassCard";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { WeatherOverlay } from "@/src/components/WeatherOverlay";
import TodoList from "@/src/pages/home/components/TodoList";
import { getWeatherData } from "@/src/services/weatherService";
import FilterSheet from "./components/FilterSheet";
import TodoDetailSheet from "./components/TodoDeatailSheet";

interface DayOption {
  fullDate: string;
  dayName: string;
  dayNumber: number;
}


type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function Home({ route, navigation }: Props) {
  const user = route.params?.user ?? "Misafir";
  const [activeFilter, setActiveFilter] = useState<CategoryType | 'All'>('All');
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const todos = useTodoStore((state) => state.todos);
  const setUsername = useTodoStore((state) => state.setUsername);
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);
  const { selectedDate, setSelectedDate } = useTodoStore();
  const [weatherData, setWeatherData] = useState<any>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  useEffect(() => {
    getWeatherData().then(setWeatherData).catch(console.error);
    setUsername(user);
  }, [setUsername, user]);

  const filteredTodos = useMemo(() => {
  return todos.filter(todo => {
    // 1. Tarih Eşleşmesi
    // Eğer selectedDate 'All' ise tarih önemli değil, değilse todo'nun tarihi seçili tarihe eşit olmalı
    const dateMatch = selectedDate === 'All' || todo.targetDate === selectedDate;

    // 2. Kategori Eşleşmesi
    // Eğer activeFilter 'All' ise kategori önemli değil, değilse todo'nun kategorisi seçili kategoriye eşit olmalı
    const categoryMatch = activeFilter === 'All' || todo.category === activeFilter;

    // İKİSİ DE TRUE ise bu görevi göster
    return dateMatch && categoryMatch;
  });
}, [todos, selectedDate, activeFilter]);

  const weekDays = useMemo<DayOption[]>(() => {
    const days: DayOption[] = [];
    for (let i = -3; i < 11; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push({
        fullDate: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('tr-TR', { weekday: 'short' }),
        dayNumber: date.getDate(),
      });
    }
    return days;
  }, []);

  const shareAllTodos = async (todos: Todo[]) => {
    const pendingTodos = todos.filter(t => !t.isCompleted);
    if (pendingTodos.length === 0) return Alert.alert("Liste Boş", "Görev bulunamadı.");
    const listText = pendingTodos.map((t, i) => `${i + 1}. [ ] ${t.title}`).join('\n');
    await Share.share({ message: `📝 *Planım:*\n\n${listText}` });
  };
  const ListHeader = () => (
    <View>

      {/* <View style={styles.calendarWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.calendarScroll}>
          <TouchableOpacity onPress={() => setSelectedDate('All')}>
            <GlassCard intensity={selectedDate === 'All' ? 0.8 : 0.3} style={[styles.dateCard, selectedDate === 'All' && styles.dateCardActive]}>
              <MaterialCommunityIcons name="infinity" size={18} color={selectedDate === 'All' ? theme.colors.primary : "#94A3B8"} />
              <Text style={[styles.dayName, selectedDate === 'All' && styles.textActive]}>Hepsi</Text>
            </GlassCard>
          </TouchableOpacity>
          {weekDays.map((item) => (
            <TouchableOpacity key={item.fullDate} onPress={() => setSelectedDate(item.fullDate)}>
              <GlassCard intensity={selectedDate === item.fullDate ? 0.8 : 0.2} style={[styles.dateCard, selectedDate === item.fullDate && styles.dateCardActive]}>
                <Text style={[styles.dayName, selectedDate === item.fullDate && styles.textActive]}>{item.dayName}</Text>
                <Text style={[styles.dayNumber, selectedDate === item.fullDate && styles.textActive]}>{item.dayNumber}</Text>
              </GlassCard>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={{ marginBottom: 15 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity key={cat.id} onPress={() => setActiveFilter(cat.id as CategoryType)}>
              <GlassCard intensity={activeFilter === cat.id ? 0.8 : 0.4} style={[globalStyles.chip, activeFilter === cat.id && { borderColor: cat.color }]}>
                <Text style={{ color: activeFilter === cat.id ? theme.colors.textPrimary : '#64748B' }}>{cat.label}</Text>
              </GlassCard>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View> */}
    </View>
  );

return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {!hasAnimated && weatherData && <WeatherOverlay condition={weatherData.condition} />}
      
      
        

      <ScreenWrapper>
        <CustomHeader user={user} weather={weatherData} />
        <TodoList
          todos={filteredTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onPressItem={setSelectedTodo}
        />

    <View style={styles.combinedActionsContainer}>
  {filteredTodos.length > 0 && (
    <TouchableOpacity 
      style={styles.mergedShareBtn} 
      onPress={() => shareAllTodos(filteredTodos)}
      activeOpacity={0.8}
    >
      <GlassCard intensity={0.6} style={styles.mergedShareInner}>
        <MaterialCommunityIcons name="export-variant" size={20} color={theme.colors.primary} />
        {/* <Text style={styles.mergedShareText}>Paylaş</Text> */}
      </GlassCard>
    </TouchableOpacity>
  )}

  <TouchableOpacity 
    style={styles.mergedFilterBtn} 
    onPress={() => setIsFilterVisible(true)}
    activeOpacity={0.8}
  >
    <GlassCard intensity={0.6} style={styles.mergedFilterInner}>
      <MaterialCommunityIcons name="filter-variant" size={26} color="white" />
      {(activeFilter !== 'All' || selectedDate !== 'All') && (
         <View style={styles.activeFilterBadge} /> 
      )}
    </GlassCard>
  </TouchableOpacity>
</View>

      </ScreenWrapper>
      <FilterSheet 
        isVisible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        weekDays={weekDays}
      />

      <TodoDetailSheet todo={selectedTodo} onClose={() => setSelectedTodo(null)} />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: theme.layout.spacing.xs,
    backgroundColor: 'transparent',
  },
  mainContainer: {
    flex: 1,
    width: "100%",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.layout.spacing.xl,
  },
  emptyText: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.textPrimary,
    marginTop: theme.layout.spacing.md,
  },
  emptySubText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.layout.spacing.xs,
    textAlign: "center",
  },
  fullShareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    gap: 10,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginVertical: 10,
    bottom: theme.layout.spacing.xl,
  },
  shareBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  fabContainer: {
    position: "absolute",
    bottom: theme.layout.spacing.lg,
    left: theme.layout.spacing.lg,
    right: theme.layout.spacing.lg,
  },
  emptyButtonWrapper: {
    marginTop: 30,
    width: '100%',
    paddingHorizontal: 40,
  },
  bottomControlsContainer: {
    position: "absolute",
    bottom: 25,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
  },
  glassShareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
    gap: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 102,
  },

  calendarWrapper: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  calendarScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  dateCard: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 55,
    height: 75,
    borderRadius: 18,
    borderWidth: 1,
  },
  dateCardActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderColor: theme.colors.primary,
    borderWidth: 1,
  },
  dayName: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  dayNumber: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  textActive: {
    color: theme.colors.textPrimary,
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    marginTop: 4,
  },
  activeIndicator: { 
    width: 14,
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.colors.primary,
    position: 'absolute',
    bottom: 6,
  },

  fabFilter: {
    position: 'absolute',
    bottom: 100, 
    right: 20,
    zIndex: 999,
  },
  fabInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary, 
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  combinedActionsContainer: {
    position: 'absolute',
    bottom: 30, // Ekranın en altından yükseklik
    right: 20,  // Sağdan boşluk
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,    // İki buton arasındaki boşluk
    zIndex: 999,
  },
  mergedShareBtn: {
    height: 56,
  },
  mergedShareInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: '100%',
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
    gap: 8,
  },
  mergedShareText: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  mergedFilterBtn: {
    width: 60,
    height: 60,
  },
  mergedFilterInner: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  activeFilterBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFD700',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
});