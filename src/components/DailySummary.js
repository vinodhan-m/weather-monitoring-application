import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DailySummary.css';

const DailySummary = () => {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];

  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        const promises = cities.map(city =>
          axios.get('http://localhost:5000/weather', { params: { city } })
        );

        const results = await Promise.all(promises);
        const allSummaries = results.flatMap(response => response.data);
        const uniqueSummaries = Array.from(new Map(allSummaries.map(item => [`${item.city}-${item.date}`, item])).values());

        setSummaries(uniqueSummaries);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSummaries();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data: {error}</div>;

  return (
    <div className="summary-page">
      <h2>Weather Daily Summaries</h2>
      <div className="summary-grid">
        {summaries.length === 0 ? (
          <p>No data available.</p>
        ) : (
          summaries.map((summary) => (
            <div key={`${summary.city}-${summary.date}`} className="summary-card">
              <div className="city-info">
                <h3>{summary.city}</h3>
                <p>{summary.date}</p>
              </div>
              <div className="temperature-info">
                <p>Avg Temp: {summary.avg_temp}°C</p>
                <p>Max Temp: {summary.max_temp}°C</p>
                <p>Min Temp: {summary.min_temp}°C</p>
              </div>
              <p className="condition">Condition: {summary.dominant_condition}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DailySummary;
