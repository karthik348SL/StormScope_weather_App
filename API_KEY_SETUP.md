# OpenWeatherMap API Setup Guide

## Getting Your API Key

1. **Visit OpenWeatherMap**: Go to [https://openweathermap.org/api](https://openweathermap.org/api)
2. **Create an Account**: Sign up for a free account at [https://openweathermap.org/users/register](https://openweathermap.org/users/register)
3. **Generate API Key**: After logging in, go to your API keys page
4. **Copy Your Key**: Copy the default API key provided

## Adding Your API Key to StormScope

### Option 1: Update app.js (Recommended for Development)

Open `app.js` and find the two lines with `YOUR_OPENWEATHERMAP_API_KEY`:

**Line 1** - In `geocodeCity()` function:
```javascript
const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY"; // Replace with your API key
```

**Line 2** - In `loadWeather()` function:
```javascript
const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY"; // Replace with your API key
```

Replace both instances with your actual API key:
```javascript
const API_KEY = "your_actual_api_key_here";
```

### Option 2: Use Environment Variables (Recommended for Production)

Create a `.env` file in the project root:
```
OPENWEATHERMAP_API_KEY=your_api_key_here
```

### Option 3: Add Key via Browser Console

Open the browser console (F12) and set:
```javascript
window.OPENWEATHER_API_KEY = "your_api_key_here";
```

## Free vs Paid Plans

- **Free Plan**: Up to 60 API calls per minute, 1 million calls per month
- **Premium Plans**: Higher rate limits and additional endpoints

## API Endpoints Used by StormScope

The app uses the following OpenWeatherMap API endpoints:

1. **Geocoding API** - Search for cities
   - `https://api.openweathermap.org/geo/1.0/direct`

2. **Current Weather API** - Get real-time weather
   - `https://api.openweathermap.org/data/2.5/weather`

3. **5-Day Forecast API** - Get hourly forecasts
   - `https://api.openweathermap.org/data/2.5/forecast`

4. **Air Pollution API** - Get air quality data
   - `https://api.openweathermap.org/data/2.5/air_pollution`

## Features Enabled

✅ Live location detection  
✅ Multi-city weather search  
✅ Real-time weather updates  
✅ Hourly forecasts (5-day)  
✅ Air quality monitoring  
✅ Weather alerts and notifications  
✅ Interactive weather maps  

## Troubleshooting

### "API Failed" Error
- Verify your API key is correct
- Check if you have remaining API calls
- Ensure your internet connection is active

### City Not Found
- Try searching with the full city name including country
- Example: "Bangalore, India" instead of just "Bangalore"

### Air Quality Shows "Unavailable"
- Air quality data requires a premium plan or may not be available for all locations
- The app will still show all other weather data

## Support

For more information, visit:
- [OpenWeatherMap Documentation](https://openweathermap.org/api/one-call-api)
- [Weather API Documentation](https://openweathermap.org/current)
- [Air Pollution Documentation](https://openweathermap.org/api/air-pollution)
