# 🌤️ StormScope - Quick Start Guide

## Get Started in 3 Steps

### Step 1: Get Your Free API Key (2 minutes)
1. Go to https://openweathermap.org/api
2. Click "Sign Up" and create a free account
3. After signing in, go to https://openweathermap.org/api/keys
4. Copy your API key (it starts with numbers/letters)

### Step 2: Add API Key to Project (1 minute)
1. Open `config.js` file
2. Find this line:
   ```javascript
   OPENWEATHERMAP_API_KEY: "YOUR_OPENWEATHERMAP_API_KEY",
   ```
3. Replace with your key:
   ```javascript
   OPENWEATHERMAP_API_KEY: "abc123xyz789...",
   ```
4. Save the file

### Step 3: Run the App (1 minute)
```bash
# In your terminal, run:
node server.js

# Then open: http://127.0.0.1:4173
```

✅ **Done!** Your weather app is live!

---

## What Can You Do?

### 🎯 Live Location
- Click "Use live location" to see weather at your GPS location
- Automatically updates when you refresh

### 🔍 Search Cities
- Type any city name (e.g., "London", "Tokyo", "Sydney")
- Choose from saved cities in the watchlist
- Recently viewed locations appear in "Jump back in"

### 📊 See Weather Details
- **Now**: Temperature, feels-like, wind, humidity
- **Today**: Hourly forecast with rain probability
- **This Week**: 5-day extended outlook
- **Air Quality**: Pollution levels and AQI

### 📍 Interactive Map
- View temperature heatmap
- Switch to cloud, wind, or precipitation layers
- Zoom in/out to see regional weather

---

## Features Included

✅ Real-time weather data  
✅ Live GPS location detection  
✅ Multi-city search  
✅ 5-day hourly forecasts  
✅ Air quality monitoring  
✅ Interactive weather maps  
✅ Weather alerts setup  
✅ Sunrise/sunset tracking  
✅ Dark mode interface  
✅ Mobile responsive design  

---

## Free API Limits

**What you get free:**
- 60 API calls per minute
- 1 million API calls per month
- All weather, forecast, and air quality data

**Perfect for:**
- Personal weather apps
- Small projects
- Testing and development

---

## Common Questions

**Q: Will this cost money?**
A: No! OpenWeatherMap free tier is completely free. No credit card required.

**Q: Does live location need special permission?**
A: Yes, your browser will ask for location permission. Click "Allow" to enable GPS weather.

**Q: Can I add more cities?**
A: Yes! Edit `savedCities` array in `app.js` or use the search to add any city.

**Q: What if air quality shows "unavailable"?**
A: That's normal for some locations. Weather data will still work perfectly.

**Q: How often does data update?**
A: Data is live from OpenWeatherMap. Click "Refresh" for latest updates anytime.

---

## Customization

### Change Default City
In `config.js`:
```javascript
DEFAULT_CITY: "Bengaluru",  // Change to any city
```

### Change Temperature Unit
In `config.js`:
```javascript
TEMPERATURE_UNIT: "metric",  // "metric" for Celsius, "imperial" for Fahrenheit
```

### Add Cities to Watchlist
In `app.js`, find `savedCities` and add:
```javascript
const savedCities = [
  { name: "London", country: "United Kingdom" },
  { name: "New York", country: "United States" },
  { name: "Tokyo", country: "Japan" },
];
```

---

## Troubleshooting

### API Key Error
❌ "Please configure your OpenWeatherMap API key"
✅ Make sure you edited `config.js` and saved it

### City Not Found
❌ "No location found for [city]"
✅ Try full name: "London, United Kingdom" instead of just "London"

### No Location Access
❌ "GPS is not available"
✅ Click "Use live location" button to allow browser location access

### Air Quality Unavailable
❌ Air quality shows "--"
✅ Some locations don't have air quality data, but weather still works

---

## Next Steps

- 📖 Read [INTEGRATION.md](INTEGRATION.md) for detailed docs
- 🚀 [Upgrade to Pro](https://openweathermap.org/price) for unlimited calls
- 🔧 Check [API_KEY_SETUP.md](API_KEY_SETUP.md) for advanced setup
- 💬 Visit [OpenWeatherMap Community](https://openweathermap.org/find)

---

## Support

Need help?
- **Official Docs**: https://openweathermap.org/api
- **API Reference**: https://openweathermap.org/current
- **FAQ**: https://openweathermap.org/faq

---

**Ready? Let's go!** 🚀

1. Get your API key from https://openweathermap.org/api
2. Update `config.js` with your key
3. Run `node server.js`
4. Open http://127.0.0.1:4173
5. Enjoy live weather! 🌤️

---

**Tip**: Bookmark this page for quick reference!
