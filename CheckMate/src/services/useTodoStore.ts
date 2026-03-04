import { CategoryType, Todo } from "@/src/constants/types";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { notificationService } from "./notificationService";

interface TodoState {
  todos: Todo[];
  username: string;
  userImage: string | null;
  selectedDate: string;
  setUsername: (name: string) => void;
  setUserImage: (uri: string | null) => void;
  setSelectedDate: (date: string) => void;
  addTodo: (
    title: string, 
    priority: Todo['priority'], 
    deadline: string, 
    description?: string, 
    notificationId?: string,
    category?: CategoryType,
    targetDate?: string | null,    
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
      selectedDate: new Date().toISOString().split('T')[0],

      setUsername: (name: string) => set({ username: name }),
      setUserImage: (uri) => set({ userImage: uri }),
      setSelectedDate: (date: string) => set({ selectedDate: date }),

      addTodo: (title, priority, deadline, description, notificationId?, category = 'Personal', targetDate?) => {
        const dateNow = new Date();
        const newTodo: Todo = {
          id: Date.now().toString(),
          title,
          description,
          priority,
          deadline,
          isCompleted: false,
          createdAt: dateNow.toISOString(),
          targetDate: targetDate || null,
          notificationId,
          category,
        };
        
        set((state) => ({ 
          todos: [newTodo, ...state.todos] 
        }));
      },

      toggleTodo: (id: string) => {
        const updated = get().todos.map((todo) =>
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
        const todoToDelete = get().todos.find((t) => t.id === id);

        if (todoToDelete?.notificationId) {
          try {
            await notificationService.cancelNotification(todoToDelete.notificationId);
          } catch (err) {
            console.log("Bildirim iptal hatası:", err);
          }
        }
        
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        }));
      },

      clearTodos: () => set({ todos: [] }),
    }),
    {
      name: 'checkmate-storage', 
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);