import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const WeatherChart = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [city, setCity] = useState('Delhi'); // Default city
  const [currentTemp, setCurrentTemp] = useState(null);

  // List of cities to display
  const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];

  useEffect(() => {
    // Fetch weather data for the selected city
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/weather?city=${city}`);
        setWeatherData(response.data);
        if (response.data.length > 0) {
          // Set the current temperature (latest data)
          setCurrentTemp(response.data[response.data.length - 1].avg_temp);
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();
    const interval = setInterval(fetchWeatherData, 300000); // Fetch data every 5 minutes
    return () => clearInterval(interval); // Clean up on component unmount
  }, [city]);

  // Prepare data for the chart
  const chartData = {
    labels: weatherData.map((entry) => entry.date),
    datasets: [
      {
        label: `Avg Temp (${city})`,
        data: weatherData.map((entry) => entry.avg_temp),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4, // Smoothing the lines
      },
      {
        label: `Max Temp (${city})`,
        data: weatherData.map((entry) => entry.max_temp),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: `Min Temp (${city})`,
        data: weatherData.map((entry) => entry.min_temp),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Dropdown change handler for city selection
  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  return (
    <div>
      <h2>Weather Data for {city}</h2>

      {/* Dropdown to select city */}
      <label htmlFor="city-select">Select City: </label>
      <select id="city-select" value={city} onChange={handleCityChange}>
        {cities.map((cityName) => (
          <option key={cityName} value={cityName}>
            {cityName}
          </option>
        ))}
      </select>

      {/* Render line chart with reduced size */}
      <div style={{ width: '70%', height: '300px', margin: 'auto' }}>
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: `Temperature Overview for ${city}`,
                font: {
                  size: 16,
                },
              },
              legend: {
                display: true,
                position: 'top',
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Date',
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Temperature (°C)',
                },
                ticks: {
                  callback: (value) => `${value}°C`, // Append degree Celsius to y-axis values
                },
              },
            },
          }}
        />
      </div>

      {/* Thermometer Gauge for current temperature */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <h3>Current Temperature: {currentTemp}°C</h3>
        <div
          style={{
            height: '200px',
            width: '50px',
            margin: '0 auto',
            backgroundColor: '#ddd',
            borderRadius: '25px',
            position: 'relative',
            border: '1px solid #ccc',
          }}
        >
          <div
            style={{
              height: `${Math.min(Math.max(currentTemp, 0), 100)}%`,
              width: '100%',
              backgroundColor: currentTemp >= 30 ? 'red' : 'blue', // Red for hot, blue for cold
              borderBottomLeftRadius: '25px',
              borderBottomRightRadius: '25px',
              position: 'absolute',
              bottom: '0',
              transition: 'height 0.5s ease',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default WeatherChart;
