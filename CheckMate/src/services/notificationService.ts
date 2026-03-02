import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const notificationService = {
  // 1. İzin İsteme
  requestPermissions: async () => {

    if (!Device.isDevice) {
      console.log("UYARI: Simülatörde bildirim kısıtlı olabilir.");
      return true;
    }
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    console.log("BİLDİRİM İZNİ DURUMU:", finalStatus);
    return finalStatus === 'granted';
  },

  // 2. Android Kanal Yapılandırması (Kritik!)
  configure: async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Varsayılan Kanal',
        importance: Notifications.AndroidImportance.MAX, // Bildirimin yukarıdan düşmesi için MAX
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      });
    }
  },

  // 3. Bildirim Planlama
  scheduleTodoNotification: async (title: string, date: Date) => {
    const now = Date.now();
    const target = date.getTime();
    const secondsToTrigger = Math.round((target - now) / 1000);

    console.log(`BİLDİRİM HESAPLAMA: Fark ${secondsToTrigger} saniye.`);

    // Eğer 2 saniyeden azsa kurma
    if (secondsToTrigger < 2) {
      console.log("⚠️ BİLDİRİM İPTAL: Hedef zaman çok yakın veya geçmişte.");
      return null;
    }

    return await Notifications.scheduleNotificationAsync({
      content: {
        title: "CheckMate Hatırlatıcı! ⏰",
        body: `"${title}" vakti geldi.`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH, // Android için
        // Android'de bildirimin görünmesi için oluşturduğumuz kanala bağlıyoruz:
        ...(Platform.OS === 'android' && { categoryIdentifier: 'default' }),
      },
      trigger: Platform.OS === 'ios'
        ? {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: date
        } as Notifications.DateTriggerInput
        : {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: secondsToTrigger,
        } as Notifications.TimeIntervalTriggerInput,
    });
  },

  // 4. İptal Etme
  cancelNotification: async (id: string) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(id);
      console.log(`Bildirim iptal edildi: ${id}`);
    } catch (error) {
      console.log("Bildirim iptal hatası:", error);
    }
  }
};