import React, { useState } from 'react';
import axios from 'axios';
import './Weather.css';

const Weather = () => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setCity(e.target.value);
    };

    const getWeather = async () => {
        if (!city) {
            setError('Please enter a city name.');
            return;
        }

        try {
            // Step 1: Get latitude and longitude from the city name using Nominatim API
            const geocodeResponse = await axios.get('https://nominatim.openstreetmap.org/search', {
                params: {
                    q: city,
                    format: 'json',
                    limit: 1,
                },
            });

            if (geocodeResponse.data.length === 0) {
                setError('City not found. Please enter a valid city name.');
                return;
            }

            const { lat, lon } = geocodeResponse.data[0];

            // Step 2: Use the Open-Meteo API to get weather data using latitude and longitude
            const weatherResponse = await axios.get('https://api.open-meteo.com/v1/forecast', {
                params: {
                    latitude: lat,
                    longitude: lon,
                    current_weather: true,
                },
            });

            // Extracting the weather data from the response
            const { temperature, windspeed, weathercode, humidity, pressure } = weatherResponse.data.current_weather;

            // Mapping weather code to description
            const weatherDescriptions = {
                0: 'Clear sky',
                1: 'Partly cloudy',
                2: 'Cloudy',
                3: 'Overcast',
                45: 'Fog',
                48: 'Depositing rime fog',
                51: 'Drizzle',
                53: 'Moderate drizzle',
                55: 'Heavy drizzle',
                56: 'Freezing drizzle',
                57: 'Heavy freezing drizzle',
                61: 'Showers of rain',
                63: 'Moderate rain showers',
                65: 'Heavy rain showers',
                66: 'Freezing rain showers',
                67: 'Heavy freezing rain showers',
                71: 'Snow fall',
                73: 'Moderate snow fall',
                75: 'Heavy snow fall',
                77: 'Snow grains',
                80: 'Rain showers',
                81: 'Heavy rain showers',
                82: 'Very heavy rain showers',
                85: 'Snow showers',
                86: 'Heavy snow showers',
                95: 'Thunderstorms',
                96: 'Thunderstorms with hail',
                99: 'Thunderstorms with heavy hail',
            };

            const description = weatherDescriptions[weathercode] || 'Unknown weather code';

            // Update weather data with default values if any data is missing
            setWeatherData({
                temperature: temperature || 'N/A',
                windspeed: windspeed || 'N/A',
                weathercode: weathercode || 'N/A',
                humidity: humidity !== undefined ? `${humidity}%` : 'N/A',
                pressure: pressure !== undefined ? `${pressure} hPa` : 'N/A',
                description: description,
            });

            setError('');
        } catch (err) {
            console.error("Error fetching weather data:", err);
            setError('Could not fetch weather data. Please try again.');
        }
    };

    return (
        <div className="weather-container">
            <h1 className="weather-header">Weather Now</h1>

            <div className="weather-input-group">
                <input
                    type="text"
                    value={city}
                    onChange={handleChange}
                    placeholder="Enter city name"
                    className="weather-input"
                />
                <button
                    onClick={getWeather}
                    className="weather-button"
                >
                    Get Weather
                </button>
            </div>

            {error && <p className="error-message">{error}</p>}

            {weatherData && (
                <div className="weather-details">
                    <h2 className="weather-header">Weather in {city}</h2>
                    <div className="weather-detail">Temperature: {weatherData.temperature}°C</div>
                    <div className="weather-detail">Wind Speed: {weatherData.windspeed} km/h</div>
                    <div className="weather-detail">Weather Code: {weatherData.weathercode}</div>
                    <div className="weather-detail">Humidity: {weatherData.humidity}</div>
                    <div className="weather-detail">Pressure: {weatherData.pressure}</div>
                    <div className="weather-detail">Description: {weatherData.description}</div>
                </div>
            )}
        </div>
    );
};

export default Weather;
