// =========================================
// OpenWeatherMap API Configuration
// =========================================
// 
// TO GET YOUR FREE API KEY:
// 1. Go to https://openweathermap.org/api
// 2. Create a free account
// 3. Get your API key from https://openweathermap.org/api/one-call-api
// 4. Paste your API key below
//
// Free tier includes:
// - 60 calls/minute
// - 1 million calls/month
// =========================================

const CONFIG = {
  // Replace with your OpenWeatherMap API key
  OPENWEATHERMAP_API_KEY: "b705b852e5a0cd45722ef5f15fb287b0",
  
  // App settings
  DEFAULT_CITY: "Bengaluru",
  TEMPERATURE_UNIT: "metric", // "metric" for Celsius, "imperial" for Fahrenheit
  
  // Feature flags
  ENABLE_AIR_QUALITY: true,
  ENABLE_NOTIFICATIONS: true,
  AUTO_REFRESH_INTERVAL: 600000, // 10 minutes in milliseconds
};

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
