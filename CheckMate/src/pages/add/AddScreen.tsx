import CustomHeader from "@/src/components/CustomHeader";
import NiceButton from "@/src/components/NiceButton";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { STORAGE_KEYS } from "@/src/constants/storageKeys";
import { Todo } from "@/src/constants/types";
import CustomInput from "@/src/pages/add/components/CustomInputText";
import { todoService } from "@/src/services/todoService";

import AsyncStorage from "@react-native-async-storage/async-storage";


import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";
import CustomInputDetail from "./components/CustomDetailInputText ";
import FormDatePicker from "./components/FormDatePicker";
import PrioritySelector from "./components/PrioritySelector";


export default function AddScreen() {
  const [userName, setUserName] = useState<string>("");
  const [todo, setTodo] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Todo['priority']>('Medium');
  const [deadline, setDeadline] = useState(new Date());
  const navigation = useNavigation();
  
  const { width } = Dimensions.get("window");
  const COMPONENT_WIDTH = width * 0.82; 

  const getUserName = async () => {
    const name = await AsyncStorage.getItem(STORAGE_KEYS.USERNAME);
    setUserName(name ?? "Misafir");
  };

  useEffect(() => { getUserName(); }, []);

  const addTodo = async () => {
    if (!todo.trim()){
      Toast.show({
              type: 'error',
              text1: 'Hata',
              text2: 'Lütfen bir görev başlığı girin ⚠️'
            });
      return;
    } 

    const newTodo: Todo = {
      id: Date.now().toString(), 
      title: todo,
      description: description,
      priority: priority,
      deadline: deadline.toISOString(),
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };

    await todoService.add(userName, newTodo);

    Toast.show({
      type: 'success',
      text1: 'Başarılı! ✨',
      text2: 'Görevin listeye eklendi.',
      position: 'top',
      visibilityTime: 3000,
    });
    
    setTodo("");
    setDescription("");
    setPriority('Medium');
    setDeadline(new Date());

    
      navigation.goBack();
    ;
  };

  return (
    <ScreenWrapper>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <CustomHeader text="Yeni Görev" user={userName} showLogout={false} />

        <View style={{ width: COMPONENT_WIDTH, gap: 10 }}>
          <CustomInput 
            placeholder="Görev Başlığı" 
            value={todo} 
            onChangeText={setTodo} 
            maxLength={20}
          />
          
          <CustomInputDetail 
            placeholder="Açıklama" 
            value={description} 
            onChangeText={setDescription}  
          />

          <PrioritySelector selected={priority} onSelect={setPriority} />

          <FormDatePicker date={deadline} onDateChange={setDeadline}/>
        </View>

        <View style={[styles.buttonContainer, { width: COMPONENT_WIDTH }]}>
          <NiceButton title="Görevi Kaydet" status="default" onPress={addTodo} />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1, 
    alignItems: 'center',
    paddingBottom: 40, 
    paddingTop: 10,
  },
  buttonContainer: {
    marginTop: 25, 
    marginBottom: 20
  }
});