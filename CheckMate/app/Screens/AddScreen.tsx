import CustomInput from "@/components/CustomInputText";
import NiceButton from "@/components/niceButton";
import ScreenWrapper from "@/components/ScreenWrapper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Todo } from "./types";

type Props = NativeStackScreenProps<any, any>;

export default function AddScreen() {
  const [userName, setUserName] =
    useState<string>(""); /* route.params?.user ?? "Misafir" */
  const [todo, setTodo] = useState("");
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const STORAGE_KEY = "USERNAME";

  const getUserName = async () => {
    const name = await AsyncStorage.getItem(STORAGE_KEY);
    console.log("name", name);
    setUserName(name ?? "");
  };

  useEffect(() => {
    getUserName();
    console.log("user", userName);
  }, []);

  const addTodo = async () => {
    if (!todo.trim()) return;
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const existing: Todo[] = stored ? JSON.parse(stored) : [];
    const newTodo: Todo = {
      text: todo,
      completed: false,
      createdAt: Date.now(),
    };
    const updated = [newTodo, ...existing];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setTodo("");
  };

  return (
    <ScreenWrapper>
      <View style={styles.center}>
        <Text style={styles.text}>Ekle Sayfası</Text>
        <CustomInput
          placeholder="Yeni To-Do"
          value={todo}
          onChangeText={setTodo}
          maxLength={50}
          error={todo.length > 50 ? "Todo çok uzun!" : undefined}
        />
        <NiceButton title="Ekle" status="default" onPress={addTodo} />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 18, fontWeight: "600", color: "#6366F1" },
});
