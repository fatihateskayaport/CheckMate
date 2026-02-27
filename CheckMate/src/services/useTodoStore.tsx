import { Todo } from "@/src/constants/types";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface TodoState {
  todos: Todo[];
  username: string;
  userImage: string | null;
  setUsername: (name: string) => void;
  setUserImage: (uri: string | null) => void;
  addTodo: (title: string, priority: 'Low' | 'Medium' | 'High', deadline: string, description?: string) => void;
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

      addTodo: (title, priority, deadline, description) => {
        const newTodo: Todo = {
          id: Date.now().toString(),
          title: title,
          description: description,
          priority: priority,
          deadline: deadline,
          isCompleted: false,
          createdAt: new Date().toISOString(),
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

        // Sıralama mantığı: Tamamlanmayanlar her zaman üstte
        const sorted = updated.sort((a, b) => {
          if (a.isCompleted !== b.isCompleted) {
            return a.isCompleted ? 1 : -1;
          }
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        set({ todos: sorted });
      },

      deleteTodo: (id: string) => {
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