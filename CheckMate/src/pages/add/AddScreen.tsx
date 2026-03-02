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
import { REMINDER_OPTIONS, Todo } from "@/src/constants/types";
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
        notificationId
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
  }, [todoTitle, isReminderEnabled, addTodoInStore, priority, deadline, description, navigation, reminderMinutes]);

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
  
  // Glass Grupları
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
});