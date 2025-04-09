import { useEffect, useState } from 'react';

const API_KEY = '515ed2dd8480272dece089fe1bbcf2ad'; // Replace with your OpenWeatherMap API key

const Favorites = () => {
  const [favoritesData, setFavoritesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedCities = JSON.parse(localStorage.getItem('favorites')) || [];

    const fetchFavoritesWeather = async () => {
      const validData = [];

      for (const city of storedCities) {
        try {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
          const data = await res.json();

          if (res.ok && data.main && data.weather) {
            validData.push({
              city,
              temp: data.main.temp,
              description: data.weather[0].description,
              icon: data.weather[0].icon
            });
          } else {
            console.warn(`Skipping city "${city}" due to API error:`, data.message);
          }
        } catch (error) {
          console.error(`Failed to fetch weather for "${city}":`, error);
        }
      }

      setFavoritesData(validData);
      setLoading(false);
    };

    fetchFavoritesWeather();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>My Favorites</h2>

      {loading ? (
        <p>Loading...</p>
      ) : favoritesData.length === 0 ? (
        <p>No valid favorites to show.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {favoritesData.map((fav, index) => (
            <div
              key={index}
              style={{
                border: '1px solid #ccc',
                borderRadius: '10px',
                padding: '15px',
                width: '180px',
                textAlign: 'center',
                backgroundColor: 'transparent'
              }}
            >
              <h4>{fav.city}</h4>
              {fav.icon && (
                <img
                  src={`https://openweathermap.org/img/wn/${fav.icon}@2x.png`}
                  alt="icon"
                  style={{ width: '50px', height: '50px' }}
                />
              )}
              <p>{fav.temp}°C</p>
              <p>{fav.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
