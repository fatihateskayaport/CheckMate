import CustomHeader from "@/src/components/CustomHeader";
import CustomInput from "@/src/components/CustomInputText";
import NiceButton from "@/src/components/NiceButton";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { centerContainer } from "@/src/constants/styles";
import { Todo } from "@/src/constants/types";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function AddScreen() {
  const [userName, setUserName] =
    useState<string>(""); /* route.params?.user ?? "Misafir" */
  const [todo, setTodo] = useState("");

  const STORAGE_KEY = "USERNAME";

  const getUserName = async () => {
    const name = await AsyncStorage.getItem(STORAGE_KEY);
    setUserName(name ?? "");
  };

  useEffect(() => {
    getUserName();
  }, []);

  const addTodo = async () => {
    if (!todo.trim()) return;

    const userName = (await AsyncStorage.getItem("USERNAME")) ?? "Misafir";
    const TODO_KEY = `TODO_${userName}`;

    const stored = await AsyncStorage.getItem(TODO_KEY);
    const existing: Todo[] = stored ? JSON.parse(stored) : [];

    const newTodo: Todo = {
      text: todo,
      completed: false,
      createdAt: Date.now(),
    };

    const updated = [newTodo, ...existing];
    await AsyncStorage.setItem(TODO_KEY, JSON.stringify(updated));
    setTodo("");
  };
  return (
    <ScreenWrapper>
      <View style={centerContainer}>
        <CustomHeader
          text="Yeni To-Do Ekle"
          user={userName}
          showLogout={false}
        />

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
