# StormScope Weather App

StormScope is an advanced weather dashboard built with Vanilla JavaScript on the frontend and Express/Mongoose on the backend. It integrates OpenWeatherMap APIs for live weather, forecast, air quality, and UV index data, while also providing a resilient persistence layer that falls back to a local JSON file when MongoDB is unavailable.

## Key Features

- Live city search with OpenWeatherMap geocoding suggestions
- Current weather display with temperature, humidity, pressure, cloud cover, visibility, and wind
- UV index monitoring from OpenWeatherMap One Call API
- Air quality and pollution metrics
- 5-day / 40-point forecast and hourly outlook
- Interactive weather compass with wind direction
- Local backup persistence via `weather-backup.json` when MongoDB Atlas is unreachable
- MongoDB Atlas support via `MONGO_URI` environment variable
- Responsive dark dashboard UI with animated weather icons and search dropdown

## Project Structure

- `index.html` — frontend dashboard markup
- `styles.css` — UI styling for the weather dashboard
- `app.js` — client-side logic, API calls, search, rendering, and map layer controls
- `config.js` — OpenWeatherMap API key and app settings
- `server.js` — Express server, persistence layer, MongoDB fallback logic
- `.env` — environment variables for `MONGO_URI` and `PORT`
- `weather-backup.json` — local fallback storage for saved weather records

## Prerequisites

- Node.js installed
- npm available
- Optional: MongoDB Atlas or local MongoDB for database persistence

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env`:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/stormscope?retryWrites=true&w=majority
   PORT=4174
   ```

3. Open `config.js` and set your OpenWeatherMap API key:
   ```js
   const CONFIG = {
     OPENWEATHERMAP_API_KEY: "YOUR_OPENWEATHERMAP_API_KEY",
     DEFAULT_CITY: "Bengaluru",
     TEMPERATURE_UNIT: "metric",
     ENABLE_AIR_QUALITY: true,
     ENABLE_NOTIFICATIONS: true,
     AUTO_REFRESH_INTERVAL: 600000,
   };
   ```

## Running the App

Start the backend server:

```bash
npm start
```

Then open:

```
http://127.0.0.1:4174
```

## Persistence Behavior

- If MongoDB connects successfully, weather save requests are stored in Atlas under the `weather` collection.
- If MongoDB fails or is not configured, the server falls back to local JSON persistence in `weather-backup.json`.
- The app logs connection status on startup and uses the fallback automatically.

## Troubleshooting

- `MongoDB connection error querySrv ECONNREFUSED ...` means the Atlas DNS lookup failed. This is usually a network or DNS issue, not a frontend bug.
- If MongoDB fails, the app still works and saves data locally.
- Make sure your IP is whitelisted in MongoDB Atlas network access, and `MONGO_URI` is correct.
- If you do not need Atlas persistence, use the local backup behavior as the default.

## Notes for Report

StormScope demonstrates a full-stack weather solution with:

- client-side API orchestration for multiple OpenWeatherMap endpoints
- resilient backend persistence using MongoDB + local fallback
- live search autocomplete with geo-coordinate lookups
- a modern dashboard UX for key weather metrics
- robust error handling and graceful degradation when external services fail

## Deep Architecture Overview

### Purpose and Scope
StormScope is designed to provide a resilient weather dashboard using live external APIs, local persistence, and a compact frontend dashboard. It targets usability, data reliability, and graceful failure handling.

### Frontend Architecture

- `index.html` defines the page layout and component structure.
- `styles.css` provides the dashboard theme, responsive cards, search dropdown, and wind compass styling.
- `app.js` handles user events, search autocomplete, weather fetch orchestration, rendering logic, and feature toggles.
- `config.js` centralizes the OpenWeatherMap API key, default city, temperature unit, and feature flags.

#### UI Components
- Search input with OpenWeatherMap geocoding suggestions.
- Current weather panel showing temperature, humidity, pressure, visibility, clouds, wind, and weather description.
- UV index card with risk interpretation.
- Wind compass dial and direction arrow.
- Forecast and hourly summary cards.
- Map support for location visualization.

#### Data Flow
1. User types a city name.
2. Frontend calls geocoding to resolve coordinates.
3. Weather fetches are performed using the resolved latitude/longitude.
4. The dashboard renders current weather, forecast, and additional metrics.
5. The app sends the latest weather record to the backend persistence endpoint.

### Backend Architecture

- `server.js` runs an Express server that serves static files and persistence APIs.
- Primary persistence uses MongoDB Atlas via `MONGO_URI`.
- If Atlas is unavailable, the server automatically falls back to local JSON storage in `weather-backup.json`.
- API endpoints include:
  - `POST /api/weather/save` to save weather snapshots.
  - `GET /api/weather/latest` to retrieve the last saved record.

#### Resilience Strategy
- On startup, the server attempts MongoDB connection and logs the result.
- If MongoDB is unreachable, the app still functions normally with local backup storage.
- This design ensures demos and reports remain valid even in restricted network environments.

### OpenWeatherMap API Integration

StormScope uses OpenWeatherMap to provide:

- Geocoding for city name lookup.
- Current weather data for temperature, conditions, humidity, pressure, clouds, visibility, and wind.
- One Call API for UV index, hourly forecast, and optional air quality metrics.
- Air pollution data when enabled in the configuration.

#### Data Interpretation
- Wind direction degrees are converted into compass labels.
- UV index values are mapped to safety categories.
- Forecast results are displayed as user-friendly daily/hourly cards.

### Resilience and Fault Tolerance

- MongoDB fallback preserves functionality when Atlas cannot connect.
- Frontend fetch logic is designed to degrade gracefully when some API calls fail.
- Local backup enables persistence without depending on external database access.

### Recommended Report Structure

For your report, consider these sections:
1. Introduction and project goals.
2. Key features and user experience.
3. Frontend architecture and component design.
4. Backend architecture and persistence strategy.
5. External API integration and data flow.
6. Resilience, fallback handling, and troubleshooting.
7. Future improvements and potential enhancements.

## Dependencies

- `express`
- `mongoose`
- `cors`
- `dotenv`

## License

This project is provided for academic/demo use and can be extended for production with proper API key management, security, and deployment steps.
