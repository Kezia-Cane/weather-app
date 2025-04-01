import axios from 'axios';
import React, { useState } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiKey = '42200e93c249bf9f7bd91376aa5ee1f5'; // Your OpenWeatherMap API key
  const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError(null);
    setWeatherData(null); // Clear previous data
    try {
      const response = await axios.get(apiUrl, {
        params: {
          q: cityName,
          appid: apiKey,
          units: 'metric' // Use metric units (Celsius)
        }
      });
      setWeatherData(response.data);
    } catch (err) {
      console.error("API Error:", err); // Log the full error for debugging
      let errorMessage = 'An error occurred while fetching weather data.';
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error Response Data:", err.response.data);
        console.error("Error Response Status:", err.response.status);
        console.error("Error Response Headers:", err.response.headers);
        if (err.response.status === 401) {
          errorMessage = 'API key error. Please check if the key is correct and active.';
        } else if (err.response.status === 404) {
          errorMessage = `City "${cityName}" not found. Please try again.`;
        } else if (err.response.data && err.response.data.message) {
          // Use the message from the API if available
          errorMessage = `API Error: ${err.response.data.message}`;
        }
      } else if (err.request) {
        // The request was made but no response was received
        console.error("Error Request:", err.request);
        errorMessage = 'Network error: Could not reach the weather service.';
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error', err.message);
        errorMessage = `Error: ${err.message}`;
      }
      setError(errorMessage);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission page reload
    if (city.trim()) {
      fetchWeather(city.trim());
    } else {
      setError('Please enter a city name.');
    }
  };

  return (
    <div className="App">
      <h1>Weather App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Get Weather'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {weatherData && (
        <div className="weather-info">
          <h2>{weatherData.name}, {weatherData.sys.country}</h2>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>Conditions: {weatherData.weather[0].description}</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Wind Speed: {weatherData.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
}

export default App;
