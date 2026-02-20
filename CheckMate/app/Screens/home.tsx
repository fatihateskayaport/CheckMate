import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { RootStackParamList } from "@/App";
import ScreenWrapper from "@/components/ScreenWrapper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomHeader from "../../components/CustomHeader";
import TodoList from "../../components/TodoList";
import { centerContainer, screenContainer } from "../../constants/styles";
import { Todo } from "./types";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function Home({ navigation, route }: Props) {
  const user = route.params?.user ?? "Misafir";

  const [todo, setTodo] = useState("");
  const [todoList, setTodoList] = useState<Todo[]>([]);

  const STORAGE_KEY = `TODO_${user}`;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const loadTodos = async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) setTodoList(JSON.parse(stored));
    };
    loadTodos();
  }, [STORAGE_KEY]);

  const deleteTodo = async (index: number) => {
    const updated = todoList.filter((_, i) => i !== index);
    setTodoList(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const toggleTodo = async (index: number) => {
    const updated = todoList
      .map((item, i) =>
        i === index ? { ...item, completed: !item.completed } : item,
      )
      .sort((a, b) => {
        if (a.completed !== b.completed) {
          return Number(a.completed) - Number(b.completed);
        }
        return b.createdAt - a.createdAt;
      });
    setTodoList(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleLogout = () => {
    navigation.replace("Login", { logout: true });
  };

  return (
    <View style={[screenContainer, { paddingTop: insets.top }]}>
      <ScreenWrapper>
        <View style={centerContainer}>
          <CustomHeader user={user} onLogout={handleLogout} />
        </View>
        <View style={{ flex: 1, width: "100%" }}>
          <GestureHandlerRootView>
            <TodoList
              todos={todoList}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          </GestureHandlerRootView>
        </View>
      </ScreenWrapper>
    </View>
  );
}
