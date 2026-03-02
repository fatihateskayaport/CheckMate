import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import CustomHeader from "@/src/components/CustomHeader";
import NiceButton from "@/src/components/NiceButton";
import ScreenWrapper from "@/src/components/ScreenWrapper";

import GlassCard from "@/src/components/GlassCard";
import { theme } from "@/src/constants";
import { CATEGORIES, CategoryType, REMINDER_OPTIONS, Todo } from "@/src/constants/types";
import { notificationService } from "@/src/services/notificationService";
import { useTodoStore } from "@/src/services/useTodoStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeIn } from 'react-native-reanimated';
import Toast from "react-native-toast-message";
import CustomInputDetail from "./components/CustomDetailInputText ";
import CustomInput from "./components/CustomInputText";
import FormDatePicker from "./components/FormDatePicker";
import PrioritySelector from "./components/PrioritySelector";

export default function AddScreen() {
  const navigation = useNavigation<any>();
  const username = useTodoStore((state) => state.username);
  const addTodoInStore = useTodoStore((state) => state.addTodo);


  const [todoTitle, setTodoTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Todo['priority']>('Medium');
  const [deadline, setDeadline] = useState(new Date());
  const [reminderMinutes, setReminderMinutes] = useState(0);

  const [category, setCategory] = useState<CategoryType | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [isReminderEnabled, setIsReminderEnabled] = useState(false);
  const handleDateChange = (selectedDate: Date) => {
    setDeadline(selectedDate);
  };

  const handleAddTodo = useCallback(async () => {
    const trimmedTitle = todoTitle.trim();

    if (!trimmedTitle) {
      Toast.show({
        type: 'error',
        text1: 'Başlık Gerekli ⚠️',
        text2: 'Lütfen görev için kısa bir başlık girin.',
        position: 'bottom',
      });
      return;
    }
    if (!category) {
      Toast.show({
        type: 'error',
        text1: 'Kategori Seçilmedi! 📂',
        text2: 'Lütfen devam etmek için bir kategori belirleyin.',
        position: 'bottom',
      });
      return; 
    }

    try {
      let notificationId: string | undefined = undefined;
      const baseDate = new Date(deadline.getTime() - (reminderMinutes * 60000))

      if (isReminderEnabled) {
        const triggerDate = new Date(baseDate);
        const hasPermission = await notificationService.requestPermissions();
        triggerDate.setSeconds(0);
        triggerDate.setMilliseconds(0);

        if (hasPermission) {
          const id = await notificationService.scheduleTodoNotification(
            todoTitle.trim(),
            triggerDate
          );
          if (id) notificationId = id;
        }
      }

      addTodoInStore(
        trimmedTitle,
        priority,
        deadline.toISOString(),
        description.trim(),
        notificationId,
        category
      );

      Toast.show({
        type: 'success',
        text1: 'Başarılı! ✨',
        text2: notificationId ? 'Hatırlatıcı kuruldu.' : 'Görev eklendi (Bildirimsiz).',
      });

      navigation.goBack();
    } catch (error) {
      console.error("Kritik Hata:", error);
      Toast.show({
        type: 'error',
        text1: 'Sistemsel Hata',
        text2: 'İşlem tamamlanamadı.',
      });
    }
  }, [todoTitle, deadline, reminderMinutes, isReminderEnabled, addTodoInStore, priority, description, category, navigation]);

  return (
    <ScreenWrapper>
      <CustomHeader user={username} title="Yeni Görev" isHome={false} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex1}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>

            <CustomInput
              placeholder="Görev Başlığı"
              value={todoTitle}
              onChangeText={setTodoTitle}
              maxLength={30}
            />
            <View style={styles.divider} />
            <CustomInputDetail
              placeholder="Açıklama (Opsiyonel)"
              value={description}
              onChangeText={setDescription}
              maxLength={200}
            />
            <GlassCard intensity={0.7} style={styles.glassSection}>
          <Text style={styles.sectionLabel}>Kategori (Zorunlu)</Text>
          
          <TouchableOpacity 
            onPress={() => setIsDropdownOpen(!isDropdownOpen)}
            style={[
                styles.dropdownTrigger,
                !category && { borderColor: '#EF444450' } // Seçilmediyse hafif kırmızı kenarlık
            ]}
          >
            <View style={styles.dropdownValueWrapper}>
              {category ? (
                <>
                  <MaterialCommunityIcons 
                    name={CATEGORIES.find(c => c.id === category)?.icon as any} 
                    size={22} 
                    color={CATEGORIES.find(c => c.id === category)?.color} 
                  />
                  <Text style={styles.dropdownSelectedText}>
                    {CATEGORIES.find(c => c.id === category)?.label}
                  </Text>
                </>
              ) : (
                <Text style={styles.placeholderText}>Bir kategori seçin...</Text>
              )}
            </View>
            <MaterialCommunityIcons 
              name={isDropdownOpen ? "chevron-up" : "chevron-down"} 
              size={24} 
              color="#64748B" 
            />
          </TouchableOpacity>

          {isDropdownOpen && (
            <Animated.View entering={FadeIn} style={styles.dropdownMenu}>
              {CATEGORIES.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setCategory(item.id as CategoryType);
                    setIsDropdownOpen(false);
                  }}
                >
                  <View style={[styles.miniIconBg, { backgroundColor: item.color + '15' }]}>
                    <MaterialCommunityIcons name={item.icon as any} size={18} color={item.color} />
                  </View>
                  <Text style={styles.dropdownItemText}>{item.label}</Text>
                  {category === item.id && (
                    <MaterialCommunityIcons name="check" size={20} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </Animated.View>
          )}
        </GlassCard>

            <View style={styles.selectorsContainer}>
              <GlassCard intensity={0.7} style={styles.glassSelector}>
                <PrioritySelector selected={priority} onSelect={setPriority} />
              </GlassCard>

              <GlassCard intensity={0.7} style={styles.glassSelector}>
                <FormDatePicker
                  date={deadline}
                  onDateChange={handleDateChange}
                />
              </GlassCard>
            </View>

            <GlassCard intensity={0.6} style={styles.reminderGlass}>
              <View style={styles.reminderHeader}>
                <View style={styles.reminderTitleWrapper}>
                  <MaterialCommunityIcons
                    name={isReminderEnabled ? "bell-ring-outline" : "bell-off-outline"}
                    size={20}
                    color={isReminderEnabled ? theme.colors.primary : "#9CA3AF"}
                  />
                  <Text style={styles.sectionTitle}>Hatırlatıcı Kur</Text>
                </View>
                <Switch
                  value={isReminderEnabled}
                  onValueChange={setIsReminderEnabled}
                  trackColor={{ false: "#D1D5DB", true: theme.colors.primary + "60" }}
                  thumbColor={isReminderEnabled ? theme.colors.primary : "#F3F4F6"}
                />
              </View>

              {isReminderEnabled && (
                <Animated.View entering={FadeIn} style={styles.optionsRow}>
                  {REMINDER_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      activeOpacity={0.7}
                      onPress={() => setReminderMinutes(option.value)}
                      style={[
                        styles.optionBadge,
                        reminderMinutes === option.value && styles.activeOptionBadge
                      ]}
                    >
                      <Text style={[
                        styles.optionText,
                        reminderMinutes === option.value && styles.activeOptionText
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </Animated.View>
              )}
            </GlassCard>
          </View>

          <View style={styles.buttonWrapper}>
            <NiceButton
              title="Görevi Oluştur"
              status="default"
              onPress={handleAddTodo}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  scrollContent: { paddingBottom: 60 },
  formContainer: { paddingHorizontal: 20, paddingTop: 15, gap: 20 },

  glassGroup: {
    padding: 15,
    gap: 5,
  },
  glassSelector: {
    padding: 15,
    flex: 1,
  },
  reminderGlass: {
    padding: 18,
  },

  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginHorizontal: 5
  },

  selectorsContainer: {
    flexDirection: 'column',
    gap: 15
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: "#1F2937",
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 15,
  },
  optionBadge: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  activeOptionBadge: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  optionText: {
    fontSize: 12,
    color: "#4B5563",
  },
  activeOptionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonWrapper: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reminderTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
glassSection: {
    padding: 16,
    borderRadius: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  dropdownValueWrapper: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dropdownSelectedText: { fontSize: 15, fontWeight: '600', color: '#1E293B' },
  placeholderText: { color: '#94A3B8', fontSize: 15 },
  dropdownMenu: {
    marginTop: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.03)',
  },
  dropdownItemText: { flex: 1, fontSize: 14, color: '#475569', fontWeight: '500' },
  miniIconBg: { 
    width: 34, 
    height: 34, 
    borderRadius: 10, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
});