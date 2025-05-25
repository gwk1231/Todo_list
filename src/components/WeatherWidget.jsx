import { useEffect, useState } from 'react';
import axios from 'axios';
import './WeatherWidget.css';

// const API_KEY = 'ceaa8cedd06c217040de645885505aa3';
const API_KEY = 'd5adc8ce05e9e4cd506e8886305da11e';

function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=kr&appid=${API_KEY}`
          );
          setWeather(res.data);
        } catch (err) {
          setError(true);
        }
      },
      () => setError(true)
    );
  }, []);

  if (error) return <div className="weather-widget error"><p>🌐 날씨 정보를 가져올 수 없습니다</p></div>;
  if (!weather) return <div className="weather-widget loading"><p>⏳ 날씨 불러오는 중...</p></div>;

  return (
    <div className="weather-widget">
      <h3>📍 {weather.name}</h3>
      <p>{weather.weather[0].description} / {weather.main.temp}°C</p>
    </div>
  );
}

export default WeatherWidget;
