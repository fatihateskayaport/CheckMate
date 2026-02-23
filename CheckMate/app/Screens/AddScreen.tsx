import CustomHeader from "@/components/CustomHeader";
import CustomInput from "@/components/CustomInputText";
import NiceButton from "@/components/niceButton";
import ScreenWrapper from "@/components/ScreenWrapper";
import { centerContainer } from "@/constants/styles";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Todo } from "./types";

type Props = NativeStackScreenProps<any, any>;

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
    console.log(userName);
  }, []);

  const addTodo = async () => {
    if (!todo.trim()) return;

    const userName = (await AsyncStorage.getItem("USERNAME")) ?? "Misafir";
    const TODO_KEY = `TODO_${userName}`;
    console.log("AddScreen TODO_KEY:", TODO_KEY);

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
