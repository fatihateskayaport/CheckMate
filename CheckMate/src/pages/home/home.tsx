import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";


import { RootStackParamList } from "@/App";
import { theme } from "@/src/constants";
import { useTodoStore } from "@/src/services/useTodoStore";


import CustomHeader from "@/src/components/CustomHeader";
import NiceButton from "@/src/components/NiceButton";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import TodoList from "@/src/pages/home/components/TodoList";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function Home({ route, navigation }: Props) {
  const user = route.params?.user ?? "Misafir";

  
  const todos = useTodoStore((state) => state.todos);
  const setUsername = useTodoStore((state) => state.setUsername);
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);


  useEffect(() => {
    setUsername(user);
  }, [user, setUsername]);

  const isEmpty = todos.length === 0;

  return (
    <ScreenWrapper>
      <View style={styles.headerContainer}>
        <CustomHeader user={user} showLogout={false} />
      </View>

      <View style={styles.mainContainer}>
        <GestureHandlerRootView style={styles.flex1}>
          {isEmpty ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons 
                name="clipboard-text-outline" 
                size={80} 
                color={theme.colors.border} 
              />
              <Text style={styles.emptyText}>Henüz bir görev eklemedin.</Text>
              <Text style={styles.emptySubText}>Hadi, plan yapmaya başla!</Text>
            </View>
          ) : (
            <TodoList
              todos={todos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          )}
          <View style={styles.fabContainer}>
            <NiceButton 
              title="Yeni Görev Ekle" 
              status="default" 
              onPress={() => navigation.navigate("Add")}
            />
          </View>
        </GestureHandlerRootView>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  headerContainer: {
    marginBottom: theme.layout.spacing.xs,
  },
  mainContainer: {
    flex: 1,
    width: "100%",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.layout.spacing.xl,
  },
  emptyText: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.textPrimary,
    marginTop: theme.layout.spacing.md,
  },
  emptySubText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.layout.spacing.xs,
    textAlign: "center",
  },
  fabContainer: {
    position: "absolute",
    bottom: theme.layout.spacing.lg,
    left: theme.layout.spacing.lg,
    right: theme.layout.spacing.lg,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
});