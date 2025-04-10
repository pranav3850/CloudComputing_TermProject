import './Home.css';
import { useState } from 'react';

const API_KEY = '515ed2dd8480272dece089fe1bbcf2ad';

const Home = () => {
  const [city, setCity] = useState('');
  const [forecast, setForecast] = useState([]);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem('favorites')) || []
  );

  const fetchWeather = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) throw new Error('City not found');

      const data = await response.json();

      // Extract one forecast per day at 12:00:00
      const dailyForecast = [];
      const usedDates = new Set();

      for (let forecast of data.list) {
        const [date, time] = forecast.dt_txt.split(' ');
        if (time === '12:00:00' && !usedDates.has(date)) {
          dailyForecast.push(forecast);
          usedDates.add(date);
        }
      }

      setForecast(dailyForecast);
    } catch (err) {
      alert('City not found');
      console.error(err);
    }
  };

  const handleAddToFavorites = () => {
    if (!favorites.includes(city)) {
      const updated = [...favorites, city];
      localStorage.setItem('favorites', JSON.stringify(updated));
      setFavorites(updated);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeather();
  };

  return (
    <div className="home-container">
      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <button type="submit">Search</button>
      </form>

      {forecast.length > 0 && (
        <>
          <button className="fav-btn" onClick={handleAddToFavorites}>
            Add to Favorites
          </button>
          <div className="forecast-container">
            {forecast.map((day) => (
              <div key={day.dt} className="forecast-card">
                <h3>{new Date(day.dt_txt).toLocaleDateString()}</h3>
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt={day.weather[0].description}
                />
                <p>{day.main.temp}°C</p>
                <p>{day.weather[0].description}</p>
                
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
