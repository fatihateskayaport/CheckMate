import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import Toast from "react-native-toast-message";

import { theme } from "@/src/constants";
import { Todo } from "@/src/constants/types";
import { useTodoStore } from "@/src/services/useTodoStore";

import CustomHeader from "@/src/components/CustomHeader";
import NiceButton from "@/src/components/NiceButton";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import CustomInput from "@/src/pages/add/components/CustomInputText";
import CustomInputDetail from "./components/CustomDetailInputText ";
import FormDatePicker from "./components/FormDatePicker";
import PrioritySelector from "./components/PrioritySelector";

export default function AddScreen() {

  const username = useTodoStore((state) => state.username);
  const addTodoInStore = useTodoStore((state) => state.addTodo);

  const [todoTitle, setTodoTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Todo['priority']>('Medium');
  const [deadline, setDeadline] = useState(new Date());
  
  const navigation = useNavigation();

  
  const handleAddTodo = useCallback(() => {
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
      addTodoInStore(
        trimmedTitle,
        priority,
        deadline.toISOString(),
        description.trim()
      );

      Toast.show({
        type: 'success',
        text1: 'Başarılı! ✨',
        text2: 'Göreviniz planlandı.',
      });

      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Sistemsel Hata',
        text2: 'Görev kaydedilemedi, tekrar deneyin.',
      });
    }
  }, [todoTitle, description, priority, deadline, addTodoInStore, navigation]);

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex1}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <CustomHeader text="Yeni Görev" user={username} showLogout={false} />

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <CustomInput 
                placeholder="Görev Başlığı" 
                value={todoTitle} 
                onChangeText={setTodoTitle} 
                maxLength={30}
              />
              
              <CustomInputDetail 
                placeholder="Açıklama (Opsiyonel)" 
                value={description} 
                onChangeText={setDescription}
                maxLength={200}  
              />
            </View>
            <View style={styles.selectorsContainer}>
              <PrioritySelector selected={priority} onSelect={setPriority} />
              <FormDatePicker date={deadline} onDateChange={setDeadline}/>
            </View>
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
  flex1: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1, 
    alignItems: 'center',
    paddingBottom: theme.layout.spacing.xl,
    paddingTop: theme.layout.spacing.sm,
  },
  formContainer: {
    width: theme.layout.window.width * 0.88, 
    gap: theme.layout.spacing.lg,
  },
  inputGroup: {
    gap: theme.layout.spacing.md,
  },
  selectorsContainer: {
    gap: theme.layout.spacing.md,
    backgroundColor: theme.colors.white,
    padding: theme.layout.spacing.md,
    borderRadius: theme.layout.borderRadius.lg,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
      android: { elevation: 2 }
    })
  },
  buttonWrapper: {
    position:"absolute",
    bottom: theme.layout.spacing.lg,
    width: theme.layout.window.width * 0.88,
    marginTop: theme.layout.spacing.xl,
  }
});