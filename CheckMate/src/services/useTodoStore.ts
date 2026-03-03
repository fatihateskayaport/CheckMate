import { CategoryType, Todo } from "@/src/constants/types";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { notificationService } from "./notificationService";

interface TodoState {
  todos: Todo[];
  username: string;
  userImage: string | null;
  setUsername: (name: string) => void;
  setUserImage: (uri: string | null) => void;
  addTodo: (
    title: string, 
    priority: Todo['priority'], 
    deadline: string, 
    description?: string, 
    notificationId?: string,
    category?: CategoryType 
  ) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  clearTodos: () => void;
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      todos: [],
      username: 'Misafir',
      userImage: null,

      setUsername: (name: string) => set({ username: name }),
      setUserImage: (uri) => set({ userImage: uri }),

      addTodo: (title, priority, deadline, description, notificationId?, category = 'Personal') => {
        const newTodo: Todo = {
          id: Date.now().toString(),
          title: title,
          description: description,
          priority: priority,
          deadline: deadline,
          isCompleted: false,
          createdAt: new Date().toISOString(),
          notificationId,
          category,
        };
        
        set((state) => ({ 
          todos: [newTodo, ...state.todos] 
        }));
      },

      toggleTodo: (id: string) => {
        const currentTodos = get().todos;
        const updated = currentTodos.map((todo) =>
          todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
        );

        const sorted = updated.sort((a, b) => {
          if (a.isCompleted !== b.isCompleted) {
            return a.isCompleted ? 1 : -1;
          }
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        set({ todos: sorted });
      },

      deleteTodo: async (id: string) => {
        set((state) => {
          const todoToDelete = state.todos.find((t) => t.id === id);
          if (todoToDelete?.notificationId) {
            notificationService.cancelNotification(todoToDelete.notificationId)
              .catch(err => console.log("Bildirim silinirken hata oluştu:", err));
          }
          return {
            todos: state.todos.filter((todo) => todo.id !== id),
          };
        });
      },

      clearTodos: () => set({ todos: [] }),
    }),
    {
      name: 'checkmate-storage', 
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);