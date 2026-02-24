import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useState } from "react";
import { View } from "react-native";

import { RootStackParamList } from "@/App";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import CustomHeader from "@/src/components/CustomHeader";
import TodoList from "@/src/pages/home/components/TodoList";
import { todoService } from "@/src/services/todoService";
import { useFocusEffect } from "@react-navigation/native";
import { Todo } from "../../constants/types";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function Home({ navigation, route }: Props) {
  const user = route.params?.user ?? "Misafir";
  const [todoList, setTodoList] = useState<Todo[]>([]);

  useFocusEffect(
    useCallback(() => {
      todoService.getAll(user).then(setTodoList);
    }, [user]),
  );
  const deleteTodo = async (id: string) => {
    const updated = await todoService.delete(user, id);
    setTodoList(updated);
  };

  const toggleTodo = async (id: string) => {
    const updated = await todoService.toggle(user, id);
    setTodoList(updated);
  };


  return (
    <ScreenWrapper>
      <View style={{}}>
        <CustomHeader user={user}  showLogout={false}/>
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
