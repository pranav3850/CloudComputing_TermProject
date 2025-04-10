
import './Favorites.css';
import { useEffect, useState } from 'react';

const API_KEY = '515ed2dd8480272dece089fe1bbcf2ad'; // Replace with your OpenWeatherMap API key

const Favorite = () => {
  const [favorites, setFavorites] = useState([]);
  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(favs);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      const data = await Promise.all(
        favorites.map(async (city) => {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
          return res.ok ? res.json() : null;
        })
      );
      setWeatherData(data.filter(Boolean));
    };

    if (favorites.length > 0) fetchWeather();
  }, [favorites]);

  const removeFromFavorites = (city) => {
    const updated = favorites.filter((fav) => fav !== city);
    localStorage.setItem('favorites', JSON.stringify(updated));
    setFavorites(updated);
  };

  return (
    <div className="favorites-container">
      <h2 className="favorites-title">Your Favorite Cities</h2>
      <div className="favorites-grid">
        {weatherData.map((weather) => (
          <div className="favorite-card" key={weather.id}>
            <h3>{weather.name}</h3>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="icon"
            />
            <p>{weather.main.temp}°C</p>
            <p>{weather.weather[0].description}</p>
            <button
              className="remove-btn"
              onClick={() => removeFromFavorites(weather.name)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorite;
