# StormScope Weather Platform

StormScope is a full-stack weather application starter inspired by the richer, information-dense experience of products like AccuWeather. This first version ships with:

- automatic live-location lookup
- current conditions, hourly outlook, and 7-day forecast
- air-quality monitoring
- smart weather insights and watchlist alerts
- favorite cities
- recent locations and remembered unit preferences
- location map panel for the active forecast
- browser notifications for rain, heat, cold, and AQI triggers
- an Express backend that aggregates forecast and geocoding data

## Stack

- `apps/web`: React + TypeScript + Vite
- `apps/api`: Express + TypeScript
- External data: Open-Meteo forecast, geocoding, and air-quality APIs

## Run locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the API and web app together:

   ```bash
   npm run dev
   ```

3. Open `http://localhost:5173`

## Notes

- Browser notifications work without third-party push infrastructure, so alerts can be shown while the app is active and the service worker is registered. True closed-app push delivery would require a push subscription service and VAPID keys.
- The backend persists favorites and notification settings in `apps/api/data/preferences.json` so you can later swap in a real database without changing the frontend shape.
