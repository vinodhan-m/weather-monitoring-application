import React from 'react';
//import AlertBanner from './components/AlertBanner';
import WeatherChart from './components/WeatherChart';
import DailySummary from './components/DailySummary';

function App() {
    return (
        <div>
            <h1>Weather Monitoring App</h1>
           
            <WeatherChart />
            <DailySummary summaries={[]} /> {/* Pass empty array or fetched data */}
        </div>
    );
}

export default App;
