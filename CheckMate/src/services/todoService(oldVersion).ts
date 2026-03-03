// import { Todo } from "@/src/constants/types";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { STORAGE_KEYS } from "../constants/storageKeys";


// const getTodoKey = (userName: string) => `${STORAGE_KEYS.TODO}_${userName}`;

// export const todoService = {
//   // TÜM TODOLARI GETİR----------------------------
//   getAll: async (userName: string): Promise<Todo[]> => {
//     try {
//       const jsonValue = await AsyncStorage.getItem(getTodoKey(userName));
//       return jsonValue != null ? JSON.parse(jsonValue) : [];
//     } catch (e) {
//       console.error("Todolar yüklenirken hata oluştu:", e);
//       return [];
//     }
//   },

//   // TODO EKLE----------------------------
//   add: async (userName: string, newTodo: Todo): Promise<void> => {
//     try {
//       const currentTodos = await todoService.getAll(userName);
//       const updatedTodos = [newTodo, ...currentTodos];
//       await AsyncStorage.setItem(getTodoKey(userName), JSON.stringify(updatedTodos));
//     } catch (e) {
//       console.error("Todo eklenirken hata oluştu:", e);
//     }
//   },

//   // TODO SİL (ID Bazlı)----------------------------
// delete: async (user: string, id: string): Promise<Todo[]> => {
//   try {
//     const existing = await todoService.getAll(user);
//     const updated = existing.filter((item) => item.id !== id);
//     await AsyncStorage.setItem(getTodoKey(user), JSON.stringify(updated));
//     return updated;
//   } catch (e) {
//     console.error("Silme işlemi sırasında hata:", e);
//     return [];
//   }
// },
//   // TODO TAMAMLA VEYA GERİ AL (ID Bazlı)----------------------------
//   toggle: async (user: string, id: string): Promise<Todo[]> => {
//     try {
//       const existing = await todoService.getAll(user);
      
//       // 1. Durumu güncelle
//       const updatedStatus = existing.map((item) =>
//         item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
//       );

//       // 2. Sıralama: Tamamlanmayanlar (false) üstte, tamamlananlar (true) altta.
//       const sorted = updatedStatus.sort((a, b) => {
//         if (a.isCompleted !== b.isCompleted) {
//           return a.isCompleted ? 1 : -1;
//         }
//         // İkisi de aynı durumdaysa tarihe göre yeniden eskiye
//         return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
//       });

//       await AsyncStorage.setItem(getTodoKey(user), JSON.stringify(sorted));
//       return sorted;
//     } catch (e) {
//       console.error("Toggle hatası:", e);
//       return [];
//     }
//   },
// };

// // KULLANICI İŞLEMLERİ----------------------------
// export const userService = {
//   save: async (username: string): Promise<void> => {
//     await AsyncStorage.setItem(STORAGE_KEYS.USERNAME, username);
//   },
//   get: async (): Promise<string> => {
//     const name = await AsyncStorage.getItem(STORAGE_KEYS.USERNAME);
//     return name ?? "Misafir";
//   },
//   clear: async (): Promise<void> => {
//     await AsyncStorage.removeItem(STORAGE_KEYS.USERNAME);
//   },
// };