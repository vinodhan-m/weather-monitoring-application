const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');

// Load configuration from config.json
const configPath = path.join(__dirname, 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const CITIES = config.cities;
const ALERT_THRESHOLD = config.alert_threshold;
const INTERVAL = 300000; // Interval in milliseconds (5 minutes)

const app = express();
app.use(cors({ origin: 'http://localhost:3000' })); // Enable CORS for frontend
const PORT = 5000;

// SQLite Database setup
const db = new sqlite3.Database('weather_data.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    }
});

// Create the daily_summaries table if it doesn't exist
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS daily_summaries (
            id INTEGER PRIMARY KEY,
            city TEXT,
            date TEXT,
            avg_temp REAL,
            max_temp REAL,
            min_temp REAL,
            dominant_condition TEXT
        )
    `);
});

// Weather Data Storage
let weatherData = {};
let previousTemps = {};

// Fetch weather data function
async function fetchWeatherData() {
    for (const city of CITIES) {
        try {
            const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${config.api_key}&units=metric`;
            const response = await axios.get(apiUrl);
            const data = response.data;

            if (data.main && data.weather) {
                const temperature = data.main.temp;
                const feelsLike = data.main.feels_like;
                const weatherCondition = data.weather[0].main;
                const currentTime = new Date();

                // Store data
                if (!weatherData[city]) {
                    weatherData[city] = {
                        timestamps: [],
                        temperatures: [],
                        feels_like: [],
                        weather_conditions: [],
                        summaries: []
                    };
                }

                weatherData[city].timestamps.push(currentTime);
                weatherData[city].temperatures.push(temperature);
                weatherData[city].feels_like.push(feelsLike);
                weatherData[city].weather_conditions.push(weatherCondition);

                console.log(`Fetched data for ${city}: ${temperature}°C, feels like ${feelsLike}°C`);

                // Check for temperature alerts
                checkAlerts(city, temperature);

                // Update daily summary
                updateDailySummary(city, temperature, feelsLike, weatherCondition);
            }
        } catch (error) {
            console.log(`Error fetching data for ${city}:`, error.message);
        }
    }
}

// Check for alerts
function checkAlerts(city, currentTemp) {
    if (!previousTemps[city]) {
        previousTemps[city] = [];
    }

    previousTemps[city].push(currentTemp);
    if (previousTemps[city].length > 2) {
        previousTemps[city].shift(); // Keep only the last two temperatures
    }

    if (previousTemps[city].length === 2 && previousTemps[city].every(temp => temp > ALERT_THRESHOLD)) {
        const alertMessage = `ALERT: ${city} - Temperature exceeded ${ALERT_THRESHOLD}°C for two consecutive updates!`;
        console.log(alertMessage);

        // Send email alert if enabled
        if (config.email_alert_enabled) {
            sendEmailAlert(alertMessage);
        }
    }
}

// Send email alert
function sendEmailAlert(message) {
    const mailOptions = {
        from: process.env.EMAIL_SENDER,
        to: config.email_recipient,
        subject: 'Weather Alert',
        text: message,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error sending email:', error);
        }
        console.log('Alert email sent:', info.response);
    });
}

// Update daily summary
function updateDailySummary(city, temp, feels_like, weather_condition) {
    const date = new Date().toISOString().split('T')[0];

    const dailySummary = {
        temp,
        feels_like,
        condition: weather_condition,
        date,
    };

    if (!weatherData[city].summaries) {
        weatherData[city].summaries = [];
    }

    weatherData[city].summaries.push(dailySummary);

    if (weatherData[city].summaries.length > 1) {
        calculateDailyAggregates(city);
    }
}

// Calculate and save daily summary to SQLite
function calculateDailyAggregates(city) {
    const todaySummaries = weatherData[city].summaries.filter(s => s.date === new Date().toISOString().split('T')[0]);

    if (todaySummaries.length > 0) {
        const avgTemp = todaySummaries.reduce((acc, s) => acc + s.temp, 0) / todaySummaries.length;
        const maxTemp = Math.max(...todaySummaries.map(s => s.temp));
        const minTemp = Math.min(...todaySummaries.map(s => s.temp));
        const dominantCondition = todaySummaries
            .map(s => s.condition)
            .sort((a, b) => todaySummaries.filter(v => v === a).length - todaySummaries.filter(v => v === b).length)
            .pop();

        db.run(
            `INSERT INTO daily_summaries (city, date, avg_temp, max_temp, min_temp, dominant_condition) VALUES (?, ?, ?, ?, ?, ?)`,
            [city, date, avgTemp, maxTemp, minTemp, dominantCondition],
            (err) => {
                if (err) {
                    return console.log(`Error inserting daily summary for ${city}:`, err.message);
                }
                console.log(`Daily summary saved for ${city}`);
            }
        );

        weatherData[city].summaries = []; // Reset after saving
    }
}

// API endpoint to fetch weather data
app.get('/weather', (req, res) => {
    const city = req.query.city || 'Bangalore'; // Default city if not provided
    const date = new Date().toISOString().split('T')[0]; // Current date

    db.all(
        `SELECT city, date, avg_temp, max_temp, min_temp, dominant_condition FROM daily_summaries WHERE city = ? AND date = ?`,
        [city, date],
        (err, rows) => {
            if (err) {
                console.error('Error fetching data:', err.message);
                return res.status(500).send('Error fetching weather data');
            }
            res.json(rows);
        }
    );
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Main loop to fetch data every INTERVAL
setInterval(fetchWeatherData, INTERVAL);
