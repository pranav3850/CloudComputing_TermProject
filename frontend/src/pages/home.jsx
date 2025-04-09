import { useState } from 'react';

const Home = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  
  const API_KEY = '515ed2dd8480272dece089fe1bbcf2ad'

  const fetchWeather = async () => {
    if (!city) return;

    try {
      // Current weather
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const weatherData = await weatherRes.json();

      if (!weatherRes.ok) throw new Error(weatherData.message);

      setWeather(weatherData);

      // Forecast (5-day)
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      const forecastData = await forecastRes.json();

      if (!forecastRes.ok) throw new Error(forecastData.message);

     
      const dailyForecast = forecastData.list
        .filter((item) => item.dt_txt.includes('12:00:00'))
        .slice(0, 5); 

      setForecast(dailyForecast);
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Something went wrong');
      setWeather(null);
      setForecast([]);
    }
  };

  const addToFavorites = (cityName) => {
    const stored = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!stored.includes(cityName)) {
      stored.push(cityName);
      localStorage.setItem('favorites', JSON.stringify(stored));
      alert(`${cityName} added to favorites!`);
    } else {
      alert(`${cityName} is already in favorites.`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Weather Dashboard</h2>

      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{
          padding: '8px',
          width: '200px',
          marginRight: '10px',
          borderRadius: '4px',
          border: '1px solid #ccc'
        }}
      />
      <button
        onClick={fetchWeather}
        style={{
          padding: '8px 12px',
          backgroundColor: '#28a745',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Search
      </button>

      {weather && (
        <div style={{ marginTop: '20px' }}>
          <h3>{weather.name}</h3>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Condition: {weather.weather[0].description}</p>
          <p>Humidity: {weather.main.humidity}%</p>

          <button
            onClick={() => addToFavorites(weather.name)}
            style={{
              marginTop: '10px',
              padding: '8px 12px',
              backgroundColor: '#007BFF',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Add to Favorites
          </button>
        </div>
      )}

      {forecast.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h3>5-Day Forecast</h3>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            {forecast.map((day, index) => (
              <div
                key={index}
                style={{
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  width: '140px',
                  textAlign: 'center'
                }}
              >
                <p><strong>{new Date(day.dt_txt).toLocaleDateString()}</strong></p>
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt="icon"
                  style={{ width: '50px', height: '50px' }}
                />
                <p>{day.weather[0].description}</p>
                <p>{day.main.temp}°C</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
