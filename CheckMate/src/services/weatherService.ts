import * as Location from 'expo-location';

export const getWeatherData = async () => {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return null;

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
    const data = await res.json();
    const weather = data.current_weather;

    // Kodları isimlere çeviriyoruz
    const interpretCode = (code: number) => {
        if (code === 0) return { txt: 'Güneşli', icon: 'weather-sunny' };
        if (code <= 3) return { txt: 'Parçalı Bulutlu', icon: 'weather-cloudy' };
        if (code >= 51 && code <= 67) return { txt: 'Yağmurlu', icon: 'weather-rainy' };
        return { txt: 'Bulutlu', icon: 'weather-partly-cloudy' };
    };

    const { txt, icon } = interpretCode(weather.weathercode);

    return {
      temp: Math.round(weather.temperature),
      condition: txt,
      icon: icon
    };
  } catch (e) {
    return null;
  }
};