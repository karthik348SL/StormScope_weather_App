# StormScope - OpenWeatherMap Integration

## Overview

StormScope has been successfully updated to use **OpenWeatherMap API** with full support for:
- ✅ Live location detection and tracking
- ✅ Multi-city weather search
- ✅ Real-time weather data
- ✅ 5-day hourly forecasts
- ✅ Air quality monitoring
- ✅ Interactive weather maps
- ✅ Weather alerts and notifications

## Quick Start

### 1. Get Your OpenWeatherMap API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a **FREE account**
3. Go to your [API Keys page](https://openweathermap.org/api/keys)
4. Copy your default API key

### 2. Configure the API Key

Open `config.js` in the project directory and replace:

```javascript
OPENWEATHERMAP_API_KEY: "YOUR_OPENWEATHERMAP_API_KEY",
```

With your actual API key:

```javascript
OPENWEATHERMAP_API_KEY: "abc123def456xyz789...",
```

### 3. Start the Server

Run the server:
```bash
node server.js
```

Then open your browser to `http://127.0.0.1:4173`

## Features

### Live Location
- **Automatic Detection**: Uses browser geolocation API
- **Fallback**: Uses IP-based location if GPS is blocked
- **Continuous Updates**: Click "Refresh" to get latest weather

### Multi-City Support
- **Search**: Type any city name to search
- **Saved Cities**: Pre-configured watchlist (Bengaluru, London, etc.)
- **Recent Places**: Automatically tracks last visited locations
- **Edit**: Modify `app.js` to change default cities

### Weather Data
- **Current Conditions**: Temperature, feels-like, humidity, pressure, wind
- **Hourly Forecast**: Next 24-48 hours with precipitation probability
- **Daily Forecast**: 5-day extended outlook
- **Air Quality**: PM2.5, PM10, and AQI readings

### Interactive Maps
- **Temperature Layer**: Color-coded temperature visualization
- **Cloud Cover**: Cloud density mapping
- **Wind Patterns**: Wind flow visualization
- **Precipitation**: Rain and snow tracking

## Configuration Options

Edit `config.js` to customize:

```javascript
const CONFIG = {
  // Your OpenWeatherMap API key
  OPENWEATHERMAP_API_KEY: "your_key_here",
  
  // Default city on startup
  DEFAULT_CITY: "Bengaluru",
  
  // Temperature unit: "metric" (Celsius) or "imperial" (Fahrenheit)
  TEMPERATURE_UNIT: "metric",
  
  // Feature flags
  ENABLE_AIR_QUALITY: true,
  ENABLE_NOTIFICATIONS: true,
  
  // Auto-refresh interval in milliseconds (10 minutes)
  AUTO_REFRESH_INTERVAL: 600000,
};
```

## API Endpoints Used

### Geocoding API
```
https://api.openweathermap.org/geo/1.0/direct?q={city}&limit=1&appid={API_KEY}
```
Converts city names to coordinates

### Current Weather API
```
https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=metric&appid={API_KEY}
```
Gets real-time weather data

### 5-Day Forecast API
```
https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&units=metric&appid={API_KEY}
```
Provides 5-day hourly forecasts (40+ data points)

### Air Pollution API
```
https://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={API_KEY}
```
Returns air quality index and pollutant levels

## File Structure

```
project/
├── index.html           # Main HTML markup
├── app.js              # Main application logic (now with OpenWeatherMap)
├── styles.css          # Styling and layout
├── server.js           # Node.js server
├── config.js           # API key and configuration (NEW)
├── API_KEY_SETUP.md    # Setup guide (NEW)
└── INTEGRATION.md      # This file
```

## Weather Codes Mapping

OpenWeatherMap uses these codes:

| Icon | Condition | Description |
|------|-----------|-------------|
| SUN  | Clear Sky | ☀️ |
| PCL  | Partly Cloudy | ⛅ |
| CLD  | Cloudy | ☁️ |
| DRZ  | Drizzle | 🌦️ |
| RAN  | Rain | 🌧️ |
| STM  | Thunderstorm | ⛈️ |
| SNW  | Snow | ❄️ |
| FOG  | Fog | 🌫️ |

## Data Points Displayed

### Current Conditions
- Temperature (°C or °F)
- Feels-like temperature
- Weather condition
- Cloud cover (%)
- Humidity (%)
- Pressure (hPa)
- Visibility (km)
- Wind speed (km/h)
- Wind direction (degrees)
- Precipitation (mm)

### Forecast Data
- Hourly temperature
- Precipitation probability
- Wind speed
- Weather conditions
- Cloud cover

### Air Quality
- AQI (Air Quality Index)
- PM2.5 and PM10 levels
- Health impact rating

## Troubleshooting

### "Please configure your OpenWeatherMap API key"
**Solution**: Edit `config.js` and add your API key

### "City search API failed"
**Solution**: 
- Check internet connection
- Verify API key is correct
- Ensure you're using the full city name (e.g., "Bangalore, India")

### "Weather API failed"
**Solution**:
- Check if API calls have exceeded quota (1M/month free)
- Verify coordinates are valid
- Wait a moment and try refreshing

### "Live location not working"
**Solution**:
- Allow browser location permission
- Check if browser supports geolocation
- Use "Use live location" button to request permission

### Air Quality Shows "Unavailable"
**Note**: Air quality data requires additional API subscription or may not be available for all locations. Weather data will still display normally.

## Performance Tips

1. **API Rate Limiting**: Free tier allows 60 calls/minute
   - Each weather search = 1-4 API calls
   - Plan accordingly for high-usage scenarios

2. **Caching**: Results are stored in browser localStorage
   - Recent locations cache automatically
   - Reduce redundant API calls

3. **Optimization**:
   - Debounce search input to reduce calls
   - Batch forecast requests
   - Cache air quality data

## Upgrading to Paid Plan

For higher limits and more features:
- Visit [OpenWeatherMap Pricing](https://openweathermap.org/price)
- Current free tier: 1M calls/month, 60 calls/min
- Professional tier: Unlimited calls, priority support

## Testing Locations

Try these cities to test multi-city support:

- **Bengaluru, India** - Tropical climate
- **London, United Kingdom** - Temperate climate
- **New York, United States** - Continental climate
- **Tokyo, Japan** - Seasonal variations
- **Sydney, Australia** - Southern hemisphere
- **Dubai, United Arab Emirates** - Desert climate
- **Moscow, Russia** - Cold climate

## Browser Compatibility

✅ Chrome/Edge (latest)
✅ Firefox (latest)
✅ Safari (latest)
✅ Mobile browsers

*Note: Geolocation requires HTTPS in production, but works over HTTP on localhost*

## Security Notes

- **API Key**: Keep your key private, don't commit to version control
- **CORS**: OpenWeatherMap allows requests from any origin
- **Rate Limiting**: Implement rate limiting on production servers
- **.env Files**: For production, use environment variables

Example `.env` setup:
```bash
OPENWEATHERMAP_API_KEY=your_secret_key_here
```

Load in Node.js:
```javascript
require('dotenv').config();
const apiKey = process.env.OPENWEATHERMAP_API_KEY;
```

## API Migration Notes

### From Open-Meteo to OpenWeatherMap

**Key Changes:**
1. Different data structure
2. Weather codes use icon strings (e.g., "01d") instead of integers
3. Forecast data comes as array objects instead of arrays
4. Air quality format changed

**Data Mapping Examples:**

Open-Meteo:
```javascript
current.temperature_2m      // → OpenWeatherMap: current.main.temp
current.apparent_temperature // → current.main.feels_like
hourly.weather_code[i]       // → hourly[i].weather[0].icon
```

## Support & Resources

- **Official Docs**: https://openweathermap.org/api
- **API Reference**: https://openweathermap.org/current
- **Forecast API**: https://openweathermap.org/forecast5
- **Air Pollution**: https://openweathermap.org/api/air-pollution
- **Community**: https://openweathermap.org/find

## Contributing

Have improvements? Consider:
- Caching strategies
- Additional weather data points
- Performance optimization
- UI/UX enhancements
- Localization support

## License

This project uses OpenWeatherMap API for weather data.
See [OpenWeatherMap Terms](https://openweathermap.org/terms) for usage rights.

---

**Last Updated**: May 2026
**API Integration**: OpenWeatherMap v2.5
**Status**: ✅ Production Ready
