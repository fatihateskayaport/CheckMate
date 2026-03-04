import axios from 'axios';
import * as Location from 'expo-location';

export interface WeatherData {
  temp: number;
  condition: string;
  icon: string;
}
export const getWeatherData = async (): Promise<WeatherData | null> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return null;

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;


    const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude,
        longitude,
        current_weather: true,
      },
      timeout: 5000,
    });
    const weather = response.data.current_weather;

    const interpretCode = (code: number) => {
      if (code === 0) return { txt: 'Güneşli', icon: 'weather-sunny' };
      if (code <= 3) return { txt: 'Parçalı Bulutlu', icon: 'weather-cloudy' };
      if (code >= 51 && code <= 67) return { txt: 'Yağmurlu', icon: 'weather-rainy' };
      if (code >= 71 && code <= 77) return { txt: 'Karlı', icon: 'weather-snowy' };
      return { txt: 'Bulutlu', icon: 'weather-partly-cloudy' };
    };

    const { txt, icon } = interpretCode(weather.weathercode);

    return {
      temp: Math.round(weather.temperature),
      condition: txt,
      icon: icon
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Hava Durumu API hatası:", error.message);

    } else {
      console.log("Beklenmedik hata:", error);

    }
    return null;
  }
};