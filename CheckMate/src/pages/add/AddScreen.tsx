import CustomHeader from "@/src/components/CustomHeader";
import NiceButton from "@/src/components/NiceButton";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { Todo } from "@/src/constants/types";
import CustomInput from "@/src/pages/add/components/CustomInputText";



import { useTodoStore } from "@/src/services/useTodoStore";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";
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
  const { width } = Dimensions.get("window");
  const COMPONENT_WIDTH = width * 0.82;

  const addTodo = async () => {
    if (!todoTitle.trim()){
      Toast.show({
              type: 'error',
              text1: 'Hata',
              text2: 'Lütfen bir görev başlığı girin ⚠️'
            });
      return;
    } 

    addTodoInStore(
      todoTitle, 
      priority, 
      deadline.toISOString(), 
      description
    );

    Toast.show({
      type: 'success',
      text1: 'Başarılı! ✨',
      text2: 'Görevin listeye eklendi.',
      position: 'top',
      visibilityTime: 3000,
    });
        
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
        <CustomHeader text="Yeni Görev" user={username} showLogout={false} />

        <View style={{ width: COMPONENT_WIDTH, gap: 10 }}>
          <CustomInput 
            placeholder="Görev Başlığı" 
            value={todoTitle} 
            onChangeText={setTodoTitle} 
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