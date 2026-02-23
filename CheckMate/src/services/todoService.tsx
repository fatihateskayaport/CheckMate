import AsyncStorage from "@react-native-async-storage/async-storage";

export type Todo = {
  text: string;
  completed: boolean;
  createdAt: number;
};

const getTodoKey = (user: string) => "TODO_" + user;

export const todoService = {
  //TÜM TODOLARI GETİR-----------------------------
  getAll: async (user: string): Promise<Todo[]> => {
    const stored = await AsyncStorage.getItem(getTodoKey(user));
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
    await AsyncStorage.setItem(getTodoKey(user), JSON.stringify(updated));
    return updated;
  },

  //TODO Sil---------------------------------------
  delete: async (user: string, index: number): Promise<Todo[]> => {
    const existing = await todoService.getAll(user);
    const updated = existing.filter((_, i) => i !== index);
    await AsyncStorage.setItem(getTodoKey(user), JSON.stringify(updated));
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
    await AsyncStorage.setItem(getTodoKey(user), JSON.stringify(updated));
    return updated;
  },
};

//Kullanıcı İşlemleri----------------------------
export const userService = {
  //Kullanıcı Adını Kaydet-----------------------
  save: async (username: string): Promise<void> => {
    await AsyncStorage.setItem("USERNAME", username);
  },
  //Kullanıcı Adını Getir-----------------------
  get: async (): Promise<string> => {
    return (await AsyncStorage.getItem("USERNAME")) ?? "Misafir";
  },
  //Kullanıcı Çıkış Yap-----------------------
  clear: async (): Promise<void> => {
    await AsyncStorage.removeItem("USERNAME");
  },
};
