import { Todo } from "@/src/constants/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../constants/storageKeys";

export const todoService = {
  //TÜM TODOLARI GETİR-----------------------------
  getAll: async (user: string): Promise<Todo[]> => {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.TODO(user));
    return stored ? JSON.parse(stored) : [];
  },

  //TODO EKLE--------------------------------------
  add: async (user: string, text: string): Promise<Todo[]> => {
    const existing = await todoService.getAll(user);
    const newTodo: Todo = {
      text,
      completed: false,
      createdAt: Date.now(),
    };
    const updated = [newTodo, ...existing];
    await AsyncStorage.setItem(
      STORAGE_KEYS.TODO(user),
      JSON.stringify(updated),
    );
    return updated;
  },

  //TODO Sil---------------------------------------
  delete: async (user: string, index: number): Promise<Todo[]> => {
    const existing = await todoService.getAll(user);
    const updated = existing.filter((_, i) => i !== index);
    await AsyncStorage.setItem(
      STORAGE_KEYS.TODO(user),
      JSON.stringify(updated),
    );
    return updated;
  },

  //TODO Tamamla veya Geri al----------------------
  toggle: async (user: string, index: number): Promise<Todo[]> => {
    const existing = await todoService.getAll(user);
    const updated = existing
      .map((item, i) =>
        i === index ? { ...item, completed: !item.completed } : item,
      )
      .sort((a, b) => {
        if (a.completed !== b.completed) {
          return Number(a.completed) - Number(b.completed);
        }
        return b.createdAt - a.createdAt;
      });
    await AsyncStorage.setItem(
      STORAGE_KEYS.TODO(user),
      JSON.stringify(updated),
    );
    return updated;
  },
};

//Kullanıcı İşlemleri----------------------------
export const userService = {
  //Kullanıcı Adını Kaydet-----------------------
  save: async (username: string): Promise<void> => {
    await AsyncStorage.setItem(STORAGE_KEYS.USERNAME, username);
  },
  //Kullanıcı Adını Getir-----------------------
  get: async (): Promise<string> => {
    return (await AsyncStorage.getItem(STORAGE_KEYS.USERNAME)) ?? "Misafir";
  },
  //Kullanıcı Çıkış Yap-----------------------
  clear: async (): Promise<void> => {
    await AsyncStorage.removeItem("USERNAME");
  },
};
