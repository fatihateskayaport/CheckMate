import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";


import { RootStackParamList } from "@/App";
import { CATEGORIES, CategoryType, theme, Todo } from "@/src/constants";
import { useTodoStore } from "@/src/services/useTodoStore";


import CustomHeader from "@/src/components/CustomHeader";
import GlassCard from "@/src/components/GlassCard";
import NiceButton from "@/src/components/NiceButton";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { WeatherOverlay } from "@/src/components/WeatherOverlay";
import { globalStyles } from "@/src/constants/globalStyles";
import TodoList from "@/src/pages/home/components/TodoList";
import { getWeatherData } from "@/src/services/weatherService";
import TodoDetailSheet from "./components/TodoDeatailSheet";


type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function Home({ route, navigation }: Props) {
  const user = route.params?.user ?? "Misafir";
  const [activeFilter, setActiveFilter] = useState<CategoryType | 'All'>('All');
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const todos = useTodoStore((state) => state.todos);
  const setUsername = useTodoStore((state) => state.setUsername);
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);

  const [weatherData, setWeatherData] = useState<any>(null);
const [isWeatherLoading, setIsWeatherLoading] = useState(true);

const [hasAnimated, setHasAnimated] = useState(false);


useEffect(() => {
  const loadDashboard = async () => {
    try {
      setIsWeatherLoading(true);
      const data = await getWeatherData();
      setWeatherData(data);
    } catch (error) {
      console.error("Dashboard yükleme hatası:", error);
    } finally {
      setIsWeatherLoading(false);
    }
  };
  

  loadDashboard();
}, []);

  const shareAllTodos = async (todos: Todo[]) => {
    const pendingTodos = todos.filter(t => !t.isCompleted);
    if (pendingTodos.length === 0) {
      Alert.alert("Liste Boş", "Paylaşılacak bekleyen görev bulunamadı.");
      return;
    }

    const listText = pendingTodos
      .map((t, index) => `${index + 1}. [ ] ${t.title} (${new Date(t.deadline).toLocaleDateString()})`)
      .join('\n');

    const finalMessage = `📝 *Günün Planı:*\n\n${listText}\n\nCheckMate ile gönderildi. ✅`;

    await Share.share({ message: finalMessage });
  };


  useEffect(() => {
    setUsername(user);
  }, [user, setUsername]);

  const isEmpty = todos.length === 0;

  const filteredTodos = useMemo(() => {
    if (activeFilter === 'All') return todos;
    return todos.filter(todo => todo.category === activeFilter);
  }, [todos, activeFilter]);
  useEffect(() => {
  if (weatherData && !hasAnimated) {
    // Animasyon başladı
    setTimeout(() => setHasAnimated(true), 7000); // 7 saniye sonra bileşeni tamamen kaldır
  }
}, [hasAnimated, weatherData]);

  

  return (

    <GestureHandlerRootView style={{ flex: 1 }}>
      {!hasAnimated && weatherData && <WeatherOverlay condition={weatherData.condition} />}

      <ScreenWrapper>
        {/* HEADER BÖLÜMÜ */}
        <View style={styles.headerContainer}>
          <CustomHeader user={user} weather={weatherData}/>
        </View>

        {/* <SmartPanel 
          data={weatherData} 
          isLoading={isWeatherLoading} 
          userName={user}
        /> */}
        
        {/* FİLTRELEME BÖLÜMÜ (Scrollable Chips) */}
        <View style={{ marginVertical: 10, zIndex: 10 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            pointerEvents="box-none"
          >
            <TouchableOpacity onPress={() => setActiveFilter('All')}>
              <GlassCard
                intensity={activeFilter === 'All' ? 0.8 : 0.4}
                style={[globalStyles.chip, activeFilter === 'All' && { borderColor: '#6366F1' }]}
              >
                <Text style={{ color: activeFilter === 'All' ? '#1E293B' : '#64748B', fontWeight: '700' }}> Hepsi </Text>
              </GlassCard>
            </TouchableOpacity>

            {CATEGORIES.map(cat => (
              <TouchableOpacity key={cat.id} onPress={() => setActiveFilter(cat.id as CategoryType)}>
                <GlassCard
                  intensity={activeFilter === cat.id ? 0.8 : 0.4}
                  style={[globalStyles.chip, activeFilter === cat.id && { borderColor: cat.color }]}
                >
                  <MaterialCommunityIcons
                    name={cat.icon as any}
                    size={16}
                    color={activeFilter === cat.id ? cat.color : '#94A3B8'}
                  />
                  <Text style={{ color: activeFilter === cat.id ? '#1E293B' : '#64748B', fontWeight: '700' }}>
                    {cat.label}
                  </Text>
                </GlassCard>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ANA İÇERİK BÖLÜMÜ */}
        <View style={[styles.mainContainer, { zIndex: 1 }]}>
          {isEmpty ? (
            /* DURUM 1: LİSTE BOMBOŞSA */
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons
                name="clipboard-text-outline"
                size={80}
                color={theme.colors.border}
              />
              <Text style={styles.emptyText}>Henüz bir görev eklemedin.</Text>
              <Text style={styles.emptySubText}>Hadi, plan yapmaya başla!</Text>

              <View style={{ marginTop: 20, width: '70%' }}>
                <NiceButton
                  title="Yeni Görev Ekle"
                  status="default"
                  onPress={() => navigation.navigate("Add")}
                />
              </View>
            </View>
          ) : (
            /* DURUM 2: LİSTEDE GÖREV VARSA */
            <View style={{ flex: 1 }}>
              <TodoList
                todos={filteredTodos}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onPressItem={(todo) => {
                  setSelectedTodo(null);
                  requestAnimationFrame(() => {
                    setSelectedTodo(todo);
                  });
                }}
              />

              {/* ALT KONTROLLER (Paylaş Butonu) */}
              <View style={styles.bottomControlsContainer}>
                <TouchableOpacity
                  style={styles.glassShareButton}
                  onPress={() => shareAllTodos(filteredTodos)}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons name="export-variant" size={20} color={theme.colors.primary} />
                  <Text style={styles.shareBtnText}>Paylaş</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScreenWrapper>

      <TodoDetailSheet
        todo={selectedTodo}
        onClose={() => setSelectedTodo(null)}
      />

    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  headerContainer: {
    marginBottom: theme.layout.spacing.xs,
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
    shadowRadius: 10,
  },
});