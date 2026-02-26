import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { Button, View } from "react-native";

import { RootStackParamList } from "@/App";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import CustomHeader from "@/src/components/CustomHeader";
import TodoList from "@/src/pages/home/components/TodoList";
import { useTodoStore } from "@/src/services/useTodoStore";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function Home({route }: Props) {
  const user = route.params?.user ?? "Misafir";
  

  const todos = useTodoStore((state) => state.todos);
  const setUserName = useTodoStore((state) => state.setUsername);
  const toggleToggle = useTodoStore((state) => state.toggleTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);
  const addTodo = useTodoStore((state) => state.addTodo);

  useEffect(() => {
    setUserName(user);
  }, [user])
  useEffect(() => {
  console.log("Güncel Store Todoları:", todos);
}, [todos]);
  


  return (
    <ScreenWrapper>
      <View style={{}}>
        <CustomHeader user={user}  showLogout={false}/>
      </View>
      <View style={{ flex: 1, width: "100%" }}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <TodoList
            todos={todos}
            onToggle={toggleToggle}
            onDelete={deleteTodo}
          />
          <Button 
  title="Acil Test Ekle" 
  onPress={() => addTodo("Test Başlığı", "High", "2024-12-31", "Açıklama")} 
/>
        </GestureHandlerRootView>
      </View>
    </ScreenWrapper>
  );
}
