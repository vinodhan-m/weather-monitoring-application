### Real-Time Weather Monitoring System with Daily Summaries

This project is a real-time weather monitoring system that retrieves and displays daily weather summaries for major cities in India using data from the OpenWeatherMap API. It includes a responsive frontend interface and a backend with APIs for weather data retrieval, storage, and display.

### Table of Contents

          -Introduction
          -Features
          -Technologies Used
          -Getting Started
          -Project Structure
          -Usage
          -Contributing
          -License
          
### Introduction

The Weather Monitoring System collects and processes real-time weather data from OpenWeatherMap API and generates daily summaries. The system calculates daily averages, maximums, minimums, and dominant weather conditions for each city, providing users with concise weather insights.

### Features

      Real-time Weather Data: Retrieves weather data for selected cities.
      Daily Summaries: Calculates average, max, and min temperatures, along with dominant weather conditions.
      Visual Interface: Presents daily summaries in a responsive, card-style layout.
      Error Handling: Displays appropriate error messages if data retrieval fails.
      
### Technologies Used

      Frontend: React, HTML, CSS
      Backend: Node.js, Express
      Database: SQLite
      API: OpenWeatherMap API
      Styling: CSS for layout and styling
      
### Getting Started

### Prerequisites

      Node.js and npm installed
      OpenWeatherMap API Key (register at OpenWeatherMap)
      
### Installation

1. Clone the Repository:
          ```
          git clone https://github.com/vinodhan-m/real-time-weather-monitoring.git
          cd real-time-weather-monitoring 

2. Backend Setup:
      -Navigate to the backend directory:
          ```
          cd backend 
   
      -Install dependencies:
          ```
          npm install 

      -Create a .env file with the OpenWeatherMap API Key:
        -API_KEY=your_openweathermap_api_key
        
      -Start the backend server:
          ```
          node index.js 
          
3. Frontend Setup:
      -Navigate to the frontend directory:
          ```
          cd ../frontend 
          
      -Install dependencies:
          ```
          npm install 
          
      -Start the React frontend:
          ```
          npm start
   
      -Access the Application:
      Open your browser and go to http://localhost:3000 to view the weather summaries.
   
### Project Structure
```php
real-time-weather-monitoring
├── backend
│   ├── index.js                # Backend server setup
│   ├── db.sqlite               # SQLite database file
│   ├── weatherService.js       # Module for fetching and processing weather data
│   └── .env                    # Environment variables
└── frontend
    ├── src
    │   ├── components
    │   │   └── DailySummary.js # Main component for displaying daily summaries
    │   └── App.js              # Main React App
    ├── public
    │   └── index.html
    ├── DailySummary.css        # Styling for DailySummary component
    └── README.md
```
### Usage

The app continuously fetches real-time weather data and updates the daily summaries.
Use the card view on the homepage to view each city’s weather summary, including average, max, and min temperatures.

### Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve functionality or design.

### License

This project is licensed under the MIT License.
