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

    /* if (!Device.isDevice) {
      console.log("UYARI: Simülatörde bildirim kısıtlı olabilir.");
      return true;
    } */
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    console.log("existingStatus",existingStatus)
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  },

  configure: async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Varsayılan Kanal',
        importance: Notifications.AndroidImportance.MAX, 
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      });
    }
  },

  // 3. Bildirim Planlama
scheduleTodoNotification: async (title: string, date: Date) => {
  const triggerDate = new Date(date);
  triggerDate.setSeconds(0);
  triggerDate.setMilliseconds(0);

  const now = Date.now();
  const target = triggerDate.getTime();
  const secondsToTrigger = Math.floor((target - now) / 1000);

  console.log(`BİLDİRİM PLANI: Hedef -> ${triggerDate.toLocaleTimeString()} (Kalan: ${secondsToTrigger} sn)`);

  if (secondsToTrigger < 2) {
    console.log("⚠️ BİLDİRİM İPTAL: Hedef zaman geçmişte.");
    return null;
  }

  let trigger: Notifications.NotificationTriggerInput;

  if (Platform.OS === 'ios') {
    trigger = {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
    } as Notifications.DateTriggerInput;
  } else {
    trigger = {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: secondsToTrigger,
      repeats: false, 
    } as Notifications.TimeIntervalTriggerInput;
  }

  return await Notifications.scheduleNotificationAsync({
    content: {
      title: "CheckMate Hatırlatıcı! ⏰",
      body: `"${title}" vakti geldi.`,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
      ...(Platform.OS === 'android' && { channelId: 'default' }), 
    },
    trigger,
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