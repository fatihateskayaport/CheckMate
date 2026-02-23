import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { RootStackParamList } from "@/App";
import ScreenWrapper from "@/components/ScreenWrapper";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import CustomHeader from "@/components/CustomHeader";
import TodoList from "@/components/TodoList";
import { Todo, todoService, userService } from "@/src/services/todoService";
import { useFocusEffect } from "@react-navigation/native";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function Home({ navigation, route }: Props) {
  const user = route.params?.user ?? "Misafir";
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      todoService.getAll(user).then(setTodoList);
    }, [user]),
  );
  const deleteTodo = async (index: number) => {
    const updated = await todoService.delete(user, index);
    setTodoList(updated);
  };

  const toggleTodo = async (index: number) => {
    const updated = await todoService.toggle(user, index);
    setTodoList(updated);
  };

  const handleLogout = async () => {
    await userService.clear();
    navigation.replace("Login", { logout: true });
  };

  return (
    <ScreenWrapper>
      <View style={{ paddingTop: insets.top }}>
        <CustomHeader user={user} onLogout={handleLogout} />
      </View>
      <View style={{ flex: 1, width: "100%" }}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <TodoList
            todos={todoList}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        </GestureHandlerRootView>
      </View>
    </ScreenWrapper>
  );
}
