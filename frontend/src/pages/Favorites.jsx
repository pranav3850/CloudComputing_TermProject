import { useEffect, useState } from 'react';
import './Favorites.css';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [weatherData, setWeatherData] = useState({});
  const API_KEY = '515ed2dd8480272dece089fe1bbcf2ad'; // Replace if needed

  
  const fetchFavorites = async () => {
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:5000/api/favorites', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const cities = await res.json();

      // ✅ Validate backend response
      if (!Array.isArray(cities)) {
        console.error('❌ Backend did not return an array:', cities);
        return;
      }

      console.log('✅ Loaded cities:', cities);
      setFavorites(cities);

      // Fetch weather for each favorite city
      const weatherPromises = cities.map(async (city) => {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await res.json();
        return { city, data };
      });

      const allWeather = await Promise.all(weatherPromises);
      const weatherMap = {};
      allWeather.forEach(({ city, data }) => {
        weatherMap[city] = data;
      });

      setWeatherData(weatherMap);
    } catch (err) {
      console.error('❌ Error fetching favorites:', err);
    }
  };

  const handleRemove = async (city) => {
    const token = localStorage.getItem('token');

    try {
      await fetch(`http://localhost:5000/api/favorites/${city}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh favorites
      fetchFavorites();
    } catch (err) {
      console.error(`❌ Error removing ${city}:`, err);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div className="favorites-page">
      <h2>Your Favorite Cities</h2>
      <div className="favorites-list">
        {favorites.map((city) => {
          const weather = weatherData[city];
          return (
            <div key={city} className="favorite-card">
              <h3>{city}</h3>
              {weather ? (
                <>
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                    alt={weather.weather[0].description}
                  />
                  <p>{weather.weather[0].description}</p>
                  <p>{weather.main.temp}°C</p>
                </>
              ) : (
                <p>Loading weather...</p>
              )}
              <button onClick={() => handleRemove(city)}>Remove</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Favorites;
