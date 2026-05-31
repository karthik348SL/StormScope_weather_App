const els = {
  searchForm: document.querySelector("#searchForm"),
  cityInput: document.querySelector("#cityInput"),
  liveLocationButton: document.querySelector("#liveLocationButton"),
  refreshButton: document.querySelector("#refreshButton"),
  notificationButton: document.querySelector("#notificationButton"),
  updatedPill: document.querySelector("#updatedPill"),
  sourcePill: document.querySelector("#sourcePill"),
  visibilityPill: document.querySelector("#visibilityPill"),
  apiPill: document.querySelector("#apiPill"),
  locationMode: document.querySelector("#locationMode"),
  placeName: document.querySelector("#placeName"),
  dateLine: document.querySelector("#dateLine"),
  weatherSymbol: document.querySelector("#weatherSymbol"),
  temperature: document.querySelector("#temperature"),
  conditionText: document.querySelector("#conditionText"),
  weatherNote: document.querySelector("#weatherNote"),
  locationHelp: document.querySelector("#locationHelp"),
  humidity: document.querySelector("#humidity"),
  precipitation: document.querySelector("#precipitation"),
  cloudCover: document.querySelector("#cloudCover"),
  pressure: document.querySelector("#pressure"),
  sunrise: document.querySelector("#sunrise"),
  sunset: document.querySelector("#sunset"),
  feelsLike: document.querySelector("#feelsLike"),
  feelsLikeText: document.querySelector("#feelsLikeText"),
  comfortTag: document.querySelector("#comfortTag"),
  humidityTag: document.querySelector("#humidityTag"),
  cloudTag: document.querySelector("#cloudTag"),
  comfortMeter: document.querySelector("#comfortMeter"),
  rainOutlook: document.querySelector("#rainOutlook"),
  rainText: document.querySelector("#rainText"),
  rainMeter: document.querySelector("#rainMeter"),
  windGust: document.querySelector("#windGust"),
  windText: document.querySelector("#windText"),
  windSustained: document.querySelector("#windSustained"),
  pressureTag: document.querySelector("#pressureTag"),
  windMeter: document.querySelector("#windMeter"),
  daylight: document.querySelector("#daylight"),
  daylightText: document.querySelector("#daylightText"),
  uvTag: document.querySelector("#uvTag"),
  visibilityTag: document.querySelector("#visibilityTag"),
  daylightMeter: document.querySelector("#daylightMeter"),
  savedCities: document.querySelector("#savedCities"),
  recentPlaces: document.querySelector("#recentPlaces"),
  liveBadge: document.querySelector("#liveBadge"),
  layerTabs: document.querySelector("#layerTabs"),
  layerDescription: document.querySelector("#layerDescription"),
  mapTemp: document.querySelector("#mapTemp"),
  mapUpdated: document.querySelector("#mapUpdated"),
  mapCaption: document.querySelector("#mapCaption"),
  hourlyStrip: document.querySelector("#hourlyStrip"),
  forecastList: document.querySelector("#forecastList"),
  uvIndex: document.querySelector("#uvIndex"),
  uvText: document.querySelector("#uvText"),
  uvMeter: document.querySelector("#uvMeter"),
  humidityDetail: document.querySelector("#humidityDetail"),
  humidityText: document.querySelector("#humidityText"),
  humidityMeter: document.querySelector("#humidityMeter"),
  windDetail: document.querySelector("#windDetail"),
  windDirection: document.querySelector("#windDirection"),
  compassSpeed: document.querySelector("#compassSpeed"),
  compassNeedle: document.querySelector("#compassNeedle"),
  visibilityDetail: document.querySelector("#visibilityDetail"),
  visibilityText: document.querySelector("#visibilityText"),
  visibilityMeter: document.querySelector("#visibilityMeter"),
  sunLabel: document.querySelector("#sunLabel"),
  sunMainTime: document.querySelector("#sunMainTime"),
  sunriseArc: document.querySelector("#sunriseArc"),
  solarNoon: document.querySelector("#solarNoon"),
  sunsetArc: document.querySelector("#sunsetArc"),
  sunCountdown: document.querySelector("#sunCountdown"),
  airQuality: document.querySelector("#airQuality"),
  airQualityText: document.querySelector("#airQualityText"),
  airQualityMeter: document.querySelector("#airQualityMeter"),
  insightList: document.querySelector("#insightList"),
};

const savedCities = [
  { name: "Bengaluru", country: "India" },
  { name: "London", country: "United Kingdom" },
];

const layerCopy = {
  temperature: "Surface temperature field",
  clouds: "Cloud cover and sky opacity",
  wind: "Wind flow and movement",
  precipitation: "Rain and precipitation focus",
};

const layerOverlay = {
  temperature: "linear-gradient(90deg, rgba(50,112,255,.24), rgba(84,218,228,.22), rgba(255,221,82,.24), rgba(255,96,66,.28))",
  clouds: "linear-gradient(90deg, rgba(218,226,232,.26), rgba(112,132,148,.28), rgba(238,242,246,.22))",
  wind: "repeating-linear-gradient(115deg, rgba(85,216,246,.2) 0 18px, rgba(123,116,255,.22) 18px 36px)",
  precipitation: "linear-gradient(90deg, rgba(30,98,255,.26), rgba(45,210,255,.28), rgba(83,235,180,.2))",
};

const weatherCodes = {
  0: ["Clear sky", "SUN"],
  1: ["Mainly clear", "SUN"],
  2: ["Partly cloudy", "PCL"],
  3: ["Overcast", "CLD"],
  45: ["Fog", "FOG"],
  48: ["Rime fog", "FOG"],
  51: ["Light drizzle", "DRZ"],
  53: ["Drizzle", "DRZ"],
  55: ["Dense drizzle", "DRZ"],
  61: ["Slight rain", "RAN"],
  63: ["Rain", "RAN"],
  65: ["Heavy rain", "STM"],
  71: ["Slight snow", "SNW"],
  73: ["Snow", "SNW"],
  75: ["Heavy snow", "SNW"],
  80: ["Rain showers", "RSH"],
  81: ["Heavy showers", "RSH"],
  82: ["Violent showers", "STM"],
  95: ["Thunderstorm", "STM"],
  96: ["Thunderstorm with hail", "STM"],
  99: ["Severe thunderstorm", "STM"],
};

const DEFAULT_POSTAL_COUNTRY = "IN";
const SUGGESTION_DISPLAY_LIMIT = 80;
const POSTAL_COUNTRY_CANDIDATES = [
  "IN", "US", "GB", "CA", "AU", "DE", "FR", "IT", "ES", "NL",
  "BE", "CH", "AT", "SE", "NO", "DK", "FI", "IE", "PT", "BR",
  "MX", "JP", "KR", "SG", "MY", "TH", "PH", "ID", "ZA", "AE",
  "NZ", "CN", "RU", "PL", "TR", "GR", "RO", "CZ", "HU", "AR",
  "CL", "CO", "VN", "PK", "BD", "LK", "NP"
];

let currentLocation = null;
let currentPayload = null;
let map = null;
let mapMarker = null;
let mapTileLayer = null;
let currentMapLayer = 'temperature';

function isPostalQuery(query) {
  const value = (query || '').toString().trim();
  const digits = (value.match(/\d/g) || []).length;
  const letters = (value.match(/[a-zA-Z]/g) || []).length;
  const compact = value.replace(/[\s,-]/g, '');
  const ukPostcode = /^[A-Z]{1,2}\d[A-Z\d]?\d[A-Z]{2}$/i.test(compact);
  const canadaPostcode = /^[A-Z]\d[A-Z]\d[A-Z]\d$/i.test(compact);
  return (digits >= 3 && digits >= letters) || ukPostcode || canadaPostcode;
}

function normalizePostalQuery(query) {
  return (query || '').toString().trim().replace(/,/g, ' ').replace(/\s+/g, ' ');
}

function getPostalCodeOnly(query) {
  let value = normalizePostalQuery(query);
  for (const code of POSTAL_COUNTRY_CANDIDATES) {
    value = value.replace(new RegExp(`\\b${code}\\b`, 'ig'), ' ');
  }
  [
    'india', 'united states', 'usa', 'america', 'united kingdom', 'uk',
    'canada', 'australia', 'germany', 'france', 'italy', 'spain',
    'netherlands', 'japan', 'singapore'
  ].forEach((countryName) => {
    value = value.replace(new RegExp(`\\b${countryName}\\b`, 'ig'), ' ');
  });
  return value.replace(/\s+/g, '');
}

function getCountryHints(query) {
  const value = normalizePostalQuery(query);
  const explicitCodes = (value.match(/\b[A-Za-z]{2}\b/g) || []).map(code => code.toUpperCase());
  const knownCodes = explicitCodes.filter(code => POSTAL_COUNTRY_CANDIDATES.includes(code));
  if (knownCodes.length) return [...new Set(knownCodes)];

  const lower = value.toLowerCase();
  const namedHints = [
    ['india', 'IN'], ['united states', 'US'], ['usa', 'US'], ['america', 'US'],
    ['united kingdom', 'GB'], ['uk', 'GB'], ['canada', 'CA'], ['australia', 'AU'],
    ['germany', 'DE'], ['france', 'FR'], ['italy', 'IT'], ['spain', 'ES'],
    ['netherlands', 'NL'], ['japan', 'JP'], ['singapore', 'SG'],
  ];
  const matches = namedHints.filter(([name]) => lower.includes(name)).map(([, code]) => code);
  return matches.length ? [...new Set(matches)] : [];
}

function getPostalLookupCountries(query) {
  const hints = getCountryHints(query);
  return hints.length ? hints : POSTAL_COUNTRY_CANDIDATES;
}

function compactText(value) {
  return (value || '').toString().trim().replace(/\s+/g, ' ');
}

function escapeAttr(value) {
  return compactText(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function uniqueValues(values) {
  return [...new Set(values.map(compactText).filter(Boolean))];
}

function countryNameToCode(country) {
  const value = compactText(country).toLowerCase();
  const countryMap = {
    india: 'IN',
    'united states': 'US',
    usa: 'US',
    'united kingdom': 'GB',
    uk: 'GB',
    canada: 'CA',
    australia: 'AU',
  };
  return countryMap[value] || (value.length === 2 ? value.toUpperCase() : country);
}

function getPlaceKey(place) {
  const lat = Number.isFinite(place.lat) ? roundThree(place.lat) : '';
  const lon = Number.isFinite(place.lon) ? roundThree(place.lon) : '';
  return [
    compactText(place.name).toLowerCase(),
    compactText(place.state).toLowerCase(),
    compactText(place.country).toLowerCase(),
    lat,
    lon,
  ].join('|');
}

function mergeUniquePlaces(...groups) {
  const seen = new Set();
  const merged = [];
  for (const group of groups) {
    for (const place of group || []) {
      if (!place?.name) continue;
      const key = getPlaceKey(place);
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(place);
    }
  }
  return merged;
}

function cleanIndiaPostName(name) {
  return compactText(name)
    .replace(/\b(B\.?O|S\.?O|H\.?O|Sub Office|Branch Office|Head Office)\b/ig, '')
    .replace(/\bExtn\b/ig, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function isUsefulIndiaPostPart(value) {
  const cleaned = compactText(value);
  return cleaned && !/^na$/i.test(cleaned) && !/^not available$/i.test(cleaned);
}

function makeIndiaPostPlace(name, parts, country, postalCode, sourceDetail = '') {
  const cleanName = cleanIndiaPostName(name);
  if (!cleanName) return null;
  const contextParts = parts.filter(Boolean);
  return {
    name: cleanName,
    state: contextParts.join(', '),
    country,
    population: 0,
    source: 'india-post',
    sourceDetail,
    postalCode,
    geocodeQuery: [cleanName, ...contextParts, country].filter(Boolean).join(', '),
  };
}

function getIndiaNameAliases(name) {
  const pairs = [
    ['Ranibennur', 'Ranebennur'],
    ['Davanagere', 'Davangere'],
    ['Bengaluru', 'Bangalore'],
    ['Mysuru', 'Mysore'],
    ['Mangaluru', 'Mangalore'],
    ['Tumakuru', 'Tumkur'],
    ['Belagavi', 'Belgaum'],
    ['Vijayapura', 'Bijapur'],
    ['Hubballi', 'Hubli'],
    ['Shivamogga', 'Shimoga'],
    ['Kalaburagi', 'Gulbarga'],
  ];
  const aliases = [name];
  for (const [official, common] of pairs) {
    const officialRegex = new RegExp(`\\b${official}\\b`, 'ig');
    const commonRegex = new RegExp(`\\b${common}\\b`, 'ig');
    if (officialRegex.test(name)) aliases.push(name.replace(officialRegex, common));
    if (commonRegex.test(name)) aliases.push(name.replace(commonRegex, official));
  }
  return uniqueValues(aliases);
}

function expandIndiaPostAliases(place) {
  if (!place || place.country.toLowerCase() !== 'india') return [place].filter(Boolean);
  return getIndiaNameAliases(place.name).map(aliasName => ({
    ...place,
    name: aliasName,
    geocodeQuery: [aliasName, place.state, place.country].filter(Boolean).join(', '),
    sourceDetail: aliasName === place.name ? place.sourceDetail : `${place.sourceDetail}-alias`,
  }));
}

async function fetchOpenWeatherPostalSuggestion(query, countryCode = DEFAULT_POSTAL_COUNTRY) {
  const API_KEY = CONFIG?.OPENWEATHERMAP_API_KEY || "YOUR_OPENWEATHERMAP_API_KEY";
  if (API_KEY === "YOUR_OPENWEATHERMAP_API_KEY") return [];

  const postalCode = getPostalCodeOnly(query);
  const url = new URL("https://api.openweathermap.org/geo/1.0/zip");
  url.searchParams.set("zip", `${postalCode},${countryCode}`);
  url.searchParams.set("appid", API_KEY);

  const response = await fetchWithTimeout(url, 5000);
  if (!response.ok) return [];
  const place = await response.json();
  if (!Number.isFinite(place.lat) || !Number.isFinite(place.lon)) return [];

  return [{
    name: compactText(place.name) || postalCode,
    state: postalCode,
    country: place.country || countryCode,
    lat: place.lat,
    lon: place.lon,
    population: 0,
    source: 'openweather-zip',
    postalCode,
    geocodeQuery: [compactText(place.name), postalCode, place.country || countryCode].filter(Boolean).join(', '),
  }];
}

async function fetchOpenWeatherPostalSuggestions(query, countryCodes) {
  const lookups = countryCodes.map(code => fetchOpenWeatherPostalSuggestion(query, code));
  const results = await Promise.allSettled(lookups);
  return results.flatMap(result => result.status === 'fulfilled' ? result.value : []);
}

async function fetchZippopotamPostalSuggestions(query, countryCodes) {
  const postalCode = getPostalCodeOnly(query);
  if (!postalCode) return [];

  const lookups = countryCodes.map(async (code) => {
    const response = await fetchWithTimeout(`https://api.zippopotam.us/${code.toLowerCase()}/${encodeURIComponent(postalCode)}`, 5000);
    if (!response.ok) return [];
    const data = await response.json();
    const places = Array.isArray(data.places) ? data.places : [];
    return places.map(place => ({
      name: compactText(place['place name']) || postalCode,
      state: [compactText(place.state), compactText(place['state abbreviation']), postalCode].filter(Boolean).join(', '),
      country: data.country || code,
      lat: Number(place.latitude),
      lon: Number(place.longitude),
      population: 0,
      source: 'zippopotam',
      postalCode,
      geocodeQuery: [compactText(place['place name']), compactText(place.state), data.country || code, postalCode].filter(Boolean).join(', '),
    })).filter(place => Number.isFinite(place.lat) && Number.isFinite(place.lon));
  });

  const results = await Promise.allSettled(lookups);
  return results.flatMap(result => result.status === 'fulfilled' ? result.value : []);
}

async function fetchIndiaPostSuggestions(query) {
  const postalCode = getPostalCodeOnly(query);
  if (!/^\d{6}$/.test(postalCode)) return [];

  let response = await fetchWithTimeout(`/api/postal/india/${postalCode}`, 8000).catch(() => null);
  if (!response?.ok) {
    response = await fetchWithTimeout(`https://api.postalpincode.in/pincode/${postalCode}`, 8000);
  }
  if (!response.ok) return [];
  const payload = await response.json();
  const offices = payload?.[0]?.PostOffice || [];
  if (!Array.isArray(offices) || !offices.length) return [];

  const localityGroups = new Map();
  const postOfficePlaces = offices.map((office) => {
    const district = compactText(office.District);
    const state = compactText(office.State);
    const officeName = compactText(office.Name);
    const country = compactText(office.Country) || 'India';
    const block = compactText(office.Block);
    const divisionTown = cleanIndiaPostName((compactText(office.Division) || '').replace(/\bDivision\b/ig, ''));
    const regionTown = cleanIndiaPostName((compactText(office.Region) || '').replace(/\bRegion\b/ig, ''));
    const stateParts = [district, state, postalCode].filter(Boolean);

    [block, divisionTown, regionTown].forEach((locality) => {
      if (!isUsefulIndiaPostPart(locality)) return;
      const place = makeIndiaPostPlace(locality, stateParts, country, postalCode, 'locality');
      const key = `${place.name}|${place.state}`;
      if (!localityGroups.has(key)) localityGroups.set(key, place);
    });

    const cleanedOfficeName = cleanIndiaPostName(officeName);
    if (cleanedOfficeName && !cleanedOfficeName.toLowerCase().includes('post office')) {
      const baseNames = uniqueValues([
        cleanedOfficeName,
        cleanedOfficeName.replace(/\b(Bazar|Rural|Urban|College|Market|Extn|Extension|Road|Camp)\b/ig, '').trim(),
      ]);
      for (const baseName of baseNames) {
        if (baseName && baseName.length > 2) {
          const place = makeIndiaPostPlace(baseName, stateParts, country, postalCode, 'post-office-root');
          const key = `${place.name}|${place.state}`;
          if (!localityGroups.has(key)) localityGroups.set(key, place);
        }
      }
    }

    return makeIndiaPostPlace(officeName || block || district, stateParts, country, postalCode, 'post-office');
  }).filter(Boolean);

  const districtPlaces = offices.map((office) => {
    const district = compactText(office.District);
    const state = compactText(office.State);
    const country = compactText(office.Country) || 'India';
    return makeIndiaPostPlace(district, [state, postalCode].filter(Boolean), country, postalCode, 'district');
  }).filter(Boolean);

  return mergeUniquePlaces([...localityGroups.values()], postOfficePlaces, districtPlaces)
    .flatMap(expandIndiaPostAliases);
}

async function fetchPostalSuggestions(query, limit) {
  const postalCode = getPostalCodeOnly(query);
  const countryCodes = getPostalLookupCountries(query);
  const [openWeatherZip, zippopotamPlaces, indiaPost] = await Promise.all([
    fetchOpenWeatherPostalSuggestions(postalCode, countryCodes).catch(() => []),
    fetchZippopotamPostalSuggestions(postalCode, countryCodes).catch(() => []),
    fetchIndiaPostSuggestions(postalCode).catch(() => []),
  ]);

  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('postalcode', postalCode);
  if (countryCodes.length === 1) {
    url.searchParams.set('countrycodes', countryCodes[0].toLowerCase());
  }
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('addressdetails', '1');
  url.searchParams.set('limit', String(limit));
  const response = await fetchWithTimeout(url, 8000).catch(() => null);
  const data = response?.ok ? await response.json() : [];
  let nominatimData = data || [];
  if (nominatimData.length < limit) {
    const broadUrl = new URL('https://nominatim.openstreetmap.org/search');
    broadUrl.searchParams.set('q', postalCode);
    broadUrl.searchParams.set('format', 'jsonv2');
    broadUrl.searchParams.set('addressdetails', '1');
    broadUrl.searchParams.set('limit', String(limit));
    const broadResponse = await fetchWithTimeout(broadUrl, 8000).catch(() => null);
    const broadData = broadResponse?.ok ? await broadResponse.json() : [];
    nominatimData = nominatimData.concat(broadData || []);
  }
  const nominatimPlaces = nominatimData.map(p => {
    const address = p.address || {};
    const placeName = address.city || address.town || address.village || address.hamlet || address.suburb || (p.display_name || '').split(',')[0] || p.name || '';
    const stateName = address.state || address.county || address.region || address.state_district || '';
    const countryName = address.country || '';
    const postcode = address.postcode || '';
    return {
      name: placeName,
      state: postcode ? `${stateName}${stateName ? ', ' : ''}${postcode}` : stateName,
      country: countryName,
      lat: parseFloat(p.lat),
      lon: parseFloat(p.lon),
      population: p.extratags?.population ? Number(p.extratags.population) : 0,
      source: 'nominatim-postal',
      postalCode: postcode || postalCode,
      geocodeQuery: [placeName, stateName, countryName, postcode || postalCode].filter(Boolean).join(', '),
    };
  });

  return mergeUniquePlaces(openWeatherZip, zippopotamPlaces, indiaPost, nominatimPlaces).slice(0, limit);
}

async function loadPostalCode(query) {
  const suggestions = await fetchPostalSuggestions(query, 10).catch(() => []);
  if (suggestions.length) {
    const first = suggestions[0];
    const displayName = [first.name, first.state, first.country].filter(Boolean).join(', ');
    const location = Number.isFinite(first.lat) && Number.isFinite(first.lon)
      ? {
          name: first.name || query,
          country: countryNameToCode(first.country),
          admin1: first.state,
          latitude: first.lat,
          longitude: first.lon,
          source: 'postal',
        }
      : await geocodeCity(first.geocodeQuery || displayName);
    await loadCity({
      name: first.name || location.name || query,
      country: location.country || first.country,
      admin1: first.state || location.admin1,
      latitude: location.latitude,
      longitude: location.longitude,
      source: 'postal',
    });
    return true;
  }
  return false;
}

els.searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const city = els.cityInput.value.trim();
  if (!city) return;

  if (isPostalQuery(city)) {
    const loaded = await loadPostalCode(city);
    if (loaded) {
      document.getElementById('searchSuggestions').style.display = 'none';
      return;
    }
  }

  loadCity(city);
  document.getElementById('searchSuggestions').style.display = 'none';
});

let searchSuggestionsTimeout;
els.cityInput.addEventListener('input', async (event) => {
  const query = event.target.value.trim();
  const suggestionsEl = document.getElementById('searchSuggestions');
  
  clearTimeout(searchSuggestionsTimeout);
  
  if (!query || query.length < 2) {
    suggestionsEl.style.display = 'none';
    return;
  }
  
  searchSuggestionsTimeout = setTimeout(async () => {
    try {
      const API_KEY = CONFIG?.OPENWEATHERMAP_API_KEY || "YOUR_OPENWEATHERMAP_API_KEY";
      if (API_KEY === "YOUR_OPENWEATHERMAP_API_KEY") return;
      
      let sorted = [];
      const postalSearch = isPostalQuery(query);

      if (postalSearch) {
        try {
          sorted = await fetchPostalSuggestions(query, SUGGESTION_DISPLAY_LIMIT);
        } catch (e) {
          console.warn('Postal search failed, falling back to direct geocode', e);
        }
      }

      if (!postalSearch || !sorted.length) {
        const url = new URL("https://api.openweathermap.org/geo/1.0/direct");
        url.searchParams.set("q", query);
        url.searchParams.set("limit", String(SUGGESTION_DISPLAY_LIMIT));
        url.searchParams.set("appid", API_KEY);
        
        const response = await fetchWithTimeout(url, 5000);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length) {
            sorted = mergeUniquePlaces(sorted, data.map(place => ({
              name: place.name || '',
              state: place.state || '',
              country: place.country || '',
              lat: place.lat,
              lon: place.lon,
              population: place.population || 0,
              source: 'openweather-direct',
            })));
          }
        }
      }

      if (!sorted.length) {
        suggestionsEl.innerHTML = '<li class="no-results">No results found</li>';
        suggestionsEl.style.display = 'block';
        return;
      }
      // Sort candidates by population when available (descending) to show more relevant cities first
      sorted = sorted.slice(0, SUGGESTION_DISPLAY_LIMIT).sort((a, b) => (b.population || 0) - (a.population || 0));

      // If OWM returned fewer than the desired number of results and query is not postal-only, try Nominatim fallback
      if (!postalSearch && sorted.length < SUGGESTION_DISPLAY_LIMIT) {
        try {
          const nomUrl = new URL('https://nominatim.openstreetmap.org/search');
          nomUrl.searchParams.set('q', query);
          nomUrl.searchParams.set('format', 'jsonv2');
          nomUrl.searchParams.set('limit', String(SUGGESTION_DISPLAY_LIMIT));
          nomUrl.searchParams.set('addressdetails', '1');

          const nomRes = await fetchWithTimeout(nomUrl, 8000).catch(() => null);
          if (nomRes?.ok) {
            const nomData = await nomRes.json();
            const nomPlaces = nomData.map(p => ({
              name: (p.display_name || '').split(',')[0] || p.name || '',
              state: (p.address && (p.address.state || p.address.county)) || '',
              country: p.address?.country || p.country || '',
              lat: parseFloat(p.lat),
              lon: parseFloat(p.lon),
              population: p.extratags?.population ? Number(p.extratags.population) : 0,
              source: 'nominatim',
            }));

            sorted = mergeUniquePlaces(sorted, nomPlaces);
          }
        } catch (e) {
          console.warn('Nominatim fallback failed', e);
        }
      }

      // Rank suggestions by relevance:
      // - exact prefix match on name/state (highest)
      // - contains match on name/state
      // - country match
      // - population boost
      // - boost for India when country indicates India
      const qnorm = (query || '').toString().trim().toLowerCase();
      function norm(s) { return (s || '').toString().toLowerCase(); }

      function scorePlace(p) {
        const name = norm(p.name || '');
        const state = norm(p.state || '');
        const country = norm(p.country || '');
        const compactName = name.replace(/[^a-z0-9]/g, '');
        const compactQuery = qnorm.replace(/[^a-z0-9]/g, '');
        let score = 0;
        if (!qnorm) score += 1;
        if (postalSearch && String(p.postalCode || p.state || '').replace(/\s+/g, '').includes(compactQuery)) score += 180;
        if (p.source === 'openweather-zip') score += 75;
        if (p.source === 'zippopotam') score += 65;
        if (p.source === 'india-post') score += 55;
        if (p.sourceDetail === 'locality' || p.sourceDetail === 'post-office-root') score += 45;
        if (p.sourceDetail === 'district') score -= 20;
        if (Number.isFinite(p.lat) && Number.isFinite(p.lon)) score += 20;
        if (name.startsWith(qnorm) || compactName.startsWith(compactQuery)) score += 140;
        else if (state.startsWith(qnorm) || (p.state && p.state.toLowerCase().replace(/[^a-z0-9]/g,'').startsWith(compactQuery))) score += 110;
        else if (name.includes(qnorm) || compactName.includes(compactQuery)) score += 80;
        else if (state.includes(qnorm)) score += 50;
        if (country.includes(qnorm)) score += 30;
        // population contributes up to +20
        score += Math.min((p.population || 0) / 1000000, 20);
        // boost Indian matches slightly so local towns bubble up when relevant
        if (country.includes('india') || String(p.country).toUpperCase() === 'IN') score += 15;
        return score;
      }

      const scored = sorted.map(p => ({ p, score: scorePlace(p) }));
      scored.sort((a, b) => b.score - a.score);
      const top = scored.filter(s => s.score > 0).slice(0, SUGGESTION_DISPLAY_LIMIT).map(s => s.p);
      const resultsToShow = top.length ? top : sorted.slice(0, SUGGESTION_DISPLAY_LIMIT);

      suggestionsEl.innerHTML = resultsToShow.map((place) => {
        const region = place.state ? `${place.state}, ` : '';
        const country = place.country || 'Unknown Country';
        const population = place.population ? ` - pop ${place.population.toLocaleString()}` : '';
        const sourceLabelText = place.source === 'india-post'
          ? 'PIN match'
          : place.source === 'openweather-zip' || place.source === 'zippopotam'
            ? 'Postal match'
            : 'Search match';
        const coordinateText = Number.isFinite(place.lat) && Number.isFinite(place.lon)
          ? `Lat ${roundThree(place.lat)} - Lon ${roundThree(place.lon)}`
          : 'Coordinates load after selecting';
        return `
          <li data-name="${escapeAttr(place.name)}" data-country="${escapeAttr(place.country || '')}" data-state="${escapeAttr(place.state || '')}" data-geocode="${escapeAttr(place.geocodeQuery || '')}" data-lat="${place.lat}" data-lon="${place.lon}" data-pop="${place.population || ''}">
            <div class="suggestion-main"><strong>${escapeAttr(place.name)}</strong><small>${escapeAttr(region)}${escapeAttr(country)}${escapeAttr(population)}</small></div>
            <div class="suggestion-sub">${sourceLabelText} - ${coordinateText}</div>
          </li>
        `;
      }).join('');

      suggestionsEl.style.display = 'block';

      suggestionsEl.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', () => {
          const name = li.dataset.name;
          const state = li.dataset.state;
          const country = li.dataset.country;
          const geocodeQuery = li.dataset.geocode;
          const latitude = parseFloat(li.dataset.lat);
          const longitude = parseFloat(li.dataset.lon);
          const displayText = [name, state, country].filter(Boolean).join(', ');
          els.cityInput.value = displayText;
          suggestionsEl.style.display = 'none';

          if (!Number.isNaN(latitude) && !Number.isNaN(longitude)) {
            loadCity({
              name: displayText,
              country,
              admin1: state,
              latitude,
              longitude,
              geocodeQuery,
              source: 'search',
            });
          } else {
            loadCity({
              name: displayText || name,
              country,
              admin1: state,
              geocodeQuery: geocodeQuery || displayText || name,
              source: 'search',
            });
          }
        });
      });
    } catch (err) {
      console.warn('Search suggestions error:', err);
    }
  }, 400);
});

els.cityInput.addEventListener('blur', () => {
  setTimeout(() => {
    document.getElementById('searchSuggestions').style.display = 'none';
  }, 200);
});

els.liveLocationButton.addEventListener("click", useLiveLocation);
els.refreshButton.addEventListener("click", () => {
  if (currentLocation) {
    loadWeather(currentLocation);
  } else {
    useLiveLocation();
  }
});

els.notificationButton.addEventListener("click", async () => {
  if (!("Notification" in window)) {
    els.notificationButton.textContent = "Not supported";
    return;
  }

  const permission = await Notification.requestPermission();
  els.notificationButton.textContent = permission === "granted" ? "Permission enabled" : "Permission blocked";
});

els.layerTabs.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-layer]");
  if (!button) return;
  setLayer(button.dataset.layer);
});

function setLayer(layer) {
  document.querySelectorAll("#layerTabs button").forEach((button) => {
    button.classList.toggle("active", button.dataset.layer === layer);
  });
  els.layerDescription.textContent = layerCopy[layer];
  document.querySelector("#weatherMap").style.setProperty("--map-overlay", layerOverlay[layer]);
  currentMapLayer = layer;
  // If map is initialized, switch tile overlay to OpenWeatherMap tiles
  if (map && CONFIG?.OPENWEATHERMAP_API_KEY) {
    const layerMap = {
      temperature: 'temp_new',
      clouds: 'clouds_new',
      wind: 'wind_new',
      precipitation: 'precipitation_new'
    };
    const tileId = layerMap[layer] || 'temp_new';
    const apiKey = CONFIG.OPENWEATHERMAP_API_KEY;
    const tileUrl = `https://tile.openweathermap.org/map/${tileId}/{z}/{x}/{y}.png?appid=${apiKey}`;
    if (mapTileLayer) {
      map.removeLayer(mapTileLayer);
      mapTileLayer = null;
    }
    try {
      mapTileLayer = L.tileLayer(tileUrl, { opacity: 0.6, attribution: '&copy; OpenWeatherMap', maxZoom: 18 }).addTo(map);
      if (currentLocation) {
        els.mapCaption.textContent = `${currentLocation.name} - Lat ${roundThree(currentLocation.latitude)} - Lon ${roundThree(currentLocation.longitude)} - ${layer.charAt(0).toUpperCase() + layer.slice(1)} layer loaded`;
      }
    } catch (e) {
      console.warn('Failed to load tile layer', e);
    }
  }
}

function renderCityButtons() {
  els.savedCities.innerHTML = savedCities
    .map(
      (city) => `
        <button type="button" data-city="${city.name}">
          <b>${city.name}</b>
          <small>${city.country}</small>
        </button>
      `
    )
    .join("");

  els.savedCities.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => loadCity(button.dataset.city));
  });

  renderRecentPlaces();
}

function renderRecentPlaces() {
  const recent = JSON.parse(localStorage.getItem("stormscope:recent") || "[]");
  const rows = [{ name: "Your location", country: "Live", live: true }, ...recent].slice(0, 6);
  els.recentPlaces.innerHTML = rows
    .map(
      (place) => `
        <button type="button" data-city="${place.live ? "" : place.name}" data-live="${place.live ? "true" : "false"}">
          <b>${place.name}</b>
          <small>${place.country || "Recent"}</small>
        </button>
      `
    )
    .join("");

  els.recentPlaces.querySelectorAll("button").forEach((button) => {
    if (button.dataset.live === "true") {
      button.addEventListener("click", useLiveLocation);
    } else {
      button.addEventListener("click", () => loadCity(button.dataset.city));
    }
  });
}

function rememberPlace(location) {
  if (location.live || location.source === "approximate") return;
  const recent = JSON.parse(localStorage.getItem("stormscope:recent") || "[]");
  const next = [
    { name: location.name, country: location.country || location.admin1 || "" },
    ...recent.filter((place) => place.name.toLowerCase() !== location.name.toLowerCase()),
  ].slice(0, 5);
  localStorage.setItem("stormscope:recent", JSON.stringify(next));
  renderRecentPlaces();
}

async function useLiveLocation() {
  if (!navigator.geolocation) {
    setStatus("GPS is not available. Trying approximate live location...");
    setLocationSource("Approximate location", "GPS unavailable in this browser.");
    loadApproximateLocation();
    return;
  }

  setStatus("Waiting for live location permission...");
  els.liveBadge.textContent = "Requesting location";
  setLocationSource("Requesting GPS", "Allow browser location for precise local weather.");

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      const place = await reverseGeocode(latitude, longitude);
      const location = {
        name: place.name,
        country: place.country,
        latitude,
        longitude,
        live: true,
        source: "gps",
      };
      els.liveBadge.textContent = "Live location active";
      setLocationSource("Precise GPS location", "Using browser GPS coordinates for this forecast.");
      await loadWeather(location);
    },
    () => {
      setStatus("Precise location was blocked. Showing weather while approximate location loads...");
      els.liveBadge.textContent = "Using approximate location";
      setLocationSource("Approximate IP location", "Browser GPS was blocked, so StormScope is using a city-level location.");
      loadApproximateLocation();
    },
    { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
  );
}

async function loadApproximateLocation() {
  try {
    const response = await fetchWithTimeout("https://ipapi.co/json/", 4500);
    if (!response.ok) throw new Error("Approximate location API failed.");
    const data = await response.json();
    if (!data.latitude || !data.longitude) throw new Error("Approximate location is unavailable.");

    await loadWeather({
      name: data.city || "Approximate location",
      country: data.country_name || "IP location",
      latitude: data.latitude,
      longitude: data.longitude,
      live: true,
      source: "approximate",
    });
  } catch (error) {
    setStatus("Approximate location did not answer. Showing Bengaluru weather from API.", true);
    els.liveBadge.textContent = "Live location unavailable";
    setLocationSource("Manual fallback", "Live location failed. Search a city or enable browser location.");
    loadCity("Bengaluru");
  }
}

async function reverseGeocode(latitude, longitude) {
  try {
    const url = new URL("https://api.bigdatacloud.net/data/reverse-geocode-client");
    url.searchParams.set("latitude", latitude);
    url.searchParams.set("longitude", longitude);
    url.searchParams.set("localityLanguage", "en");
    const response = await fetch(url);
    if (!response.ok) throw new Error("Reverse geocode unavailable.");
    const data = await response.json();
    return {
      name: data.city || data.locality || data.principalSubdivision || "Live location",
      country: data.countryName || "GPS",
    };
  } catch {
    return { name: "Live location", country: "GPS" };
  }
}

async function loadCity(cityOrSuggestion) {
  try {
    const isLocationObject = cityOrSuggestion && typeof cityOrSuggestion === 'object';
    const location = isLocationObject && Number.isFinite(cityOrSuggestion.latitude) && Number.isFinite(cityOrSuggestion.longitude)
      ? {
          name: cityOrSuggestion.name || 'Selected location',
          country: cityOrSuggestion.country || '',
          admin1: cityOrSuggestion.admin1 || cityOrSuggestion.state || '',
          latitude: cityOrSuggestion.latitude,
          longitude: cityOrSuggestion.longitude,
          geocodeQuery: cityOrSuggestion.geocodeQuery || '',
          source: cityOrSuggestion.source || 'search',
        }
      : await (async () => {
          const query = isLocationObject
            ? cityOrSuggestion.geocodeQuery || [cityOrSuggestion.name, cityOrSuggestion.admin1 || cityOrSuggestion.state, cityOrSuggestion.country].filter(Boolean).join(', ')
            : cityOrSuggestion;
          setStatus(`Searching ${query}...`);
          const location = await geocodeCity(query);
          if (isLocationObject) {
            location.name = cityOrSuggestion.name || location.name;
            location.country = cityOrSuggestion.country || location.country;
            location.admin1 = cityOrSuggestion.admin1 || cityOrSuggestion.state || location.admin1;
            location.source = cityOrSuggestion.source || 'search';
          }
          return location;
        })();

    location.source = location.source || 'search';
    await loadWeather(location);
  } catch (error) {
    setStatus(error.message, true);
  }
}

async function geocodeCity(city) {
  // Using OpenWeatherMap Geocoding API
  const API_KEY = CONFIG?.OPENWEATHERMAP_API_KEY || "YOUR_OPENWEATHERMAP_API_KEY";
  if (API_KEY === "YOUR_OPENWEATHERMAP_API_KEY") {
    throw new Error("Please configure your OpenWeatherMap API key in config.js");
  }
  
  const url = new URL("https://api.openweathermap.org/geo/1.0/direct");
  url.searchParams.set("q", city);
  url.searchParams.set("limit", "1");
  url.searchParams.set("appid", API_KEY);

  const response = await fetchWithTimeout(url, 9000);
  if (!response.ok) throw new Error("City search API failed. Try again.");

  const data = await response.json();
  if (!data?.length) throw new Error(`No location found for "${city}".`);
  
  const place = data[0];
  return {
    name: place.name || city,
    country: place.country || "",
    latitude: place.lat,
    longitude: place.lon,
    admin1: place.state || ""
  };
}

async function loadWeather(location) {
  currentLocation = location;
  setStatus(`Loading live API data for ${location.name}...`);

  const API_KEY = CONFIG?.OPENWEATHERMAP_API_KEY || "YOUR_OPENWEATHERMAP_API_KEY";
  if (API_KEY === "YOUR_OPENWEATHERMAP_API_KEY") {
    throw new Error("Please configure your OpenWeatherMap API key in config.js");
  }
  
  const weatherUrl = new URL("https://api.openweathermap.org/data/2.5/forecast");
  weatherUrl.searchParams.set("lat", location.latitude);
  weatherUrl.searchParams.set("lon", location.longitude);
  weatherUrl.searchParams.set("appid", API_KEY);
  weatherUrl.searchParams.set("units", "metric");
  
  const currentUrl = new URL("https://api.openweathermap.org/data/2.5/weather");
  currentUrl.searchParams.set("lat", location.latitude);
  currentUrl.searchParams.set("lon", location.longitude);
  currentUrl.searchParams.set("appid", API_KEY);
  currentUrl.searchParams.set("units", "metric");

  const pollutionUrl = new URL("https://api.openweathermap.org/data/2.5/air_pollution");
  pollutionUrl.searchParams.set("lat", location.latitude);
  pollutionUrl.searchParams.set("lon", location.longitude);
  pollutionUrl.searchParams.set("appid", API_KEY);

  try {
    const onecallUrlV2 = new URL("https://api.openweathermap.org/data/2.5/onecall");
    onecallUrlV2.searchParams.set("lat", location.latitude);
    onecallUrlV2.searchParams.set("lon", location.longitude);
    onecallUrlV2.searchParams.set("exclude", "minutely,alerts");
    onecallUrlV2.searchParams.set("appid", API_KEY);
    onecallUrlV2.searchParams.set("units", "metric");

    const [currentResponse, forecastResponse, pollutionResponse, onecallResponseV2] = await Promise.all([
      fetchWithTimeout(currentUrl, 9000),
      fetchWithTimeout(weatherUrl, 9000),
      fetchWithTimeout(pollutionUrl, 9000).catch(() => null),
      fetchWithTimeout(onecallUrlV2, 9000).catch(() => null),
    ]);
    
    if (!currentResponse.ok || !forecastResponse.ok) throw new Error("Weather API failed.");
    
    const current = await currentResponse.json();
    const forecast = await forecastResponse.json();
    const pollution = pollutionResponse?.ok ? await pollutionResponse.json() : null;
    let onecall = onecallResponseV2?.ok ? await onecallResponseV2.json() : null;

    if (!onecall) {
      const onecallUrlV3 = new URL("https://api.openweathermap.org/data/3.0/onecall");
      onecallUrlV3.searchParams.set("lat", location.latitude);
      onecallUrlV3.searchParams.set("lon", location.longitude);
      onecallUrlV3.searchParams.set("exclude", "minutely,alerts");
      onecallUrlV3.searchParams.set("appid", API_KEY);
      onecallUrlV3.searchParams.set("units", "metric");

      const onecallResponseV3 = await fetchWithTimeout(onecallUrlV3, 9000).catch(() => null);
      if (onecallResponseV3?.ok) {
        onecall = await onecallResponseV3.json();
      }
    }

    if (!onecall || onecall?.current?.uvi === undefined) {
      const uvUrl = new URL("https://api.openweathermap.org/data/2.5/uvi");
      uvUrl.searchParams.set("lat", location.latitude);
      uvUrl.searchParams.set("lon", location.longitude);
      uvUrl.searchParams.set("appid", API_KEY);

      const uvResponse = await fetchWithTimeout(uvUrl, 9000).catch(() => null);
      if (uvResponse?.ok) {
        const uvData = await uvResponse.json();
        if (uvData?.value || uvData?.uvi !== undefined) {
          onecall = onecall || { current: {} };
          onecall.current = onecall.current || {};
          onecall.current.uvi = uvData.value ?? uvData.uvi;
        }
      }
    }
    // If OneCall data is completely unavailable, synthesize a minimal onecall-like
    // structure from the 3-hour forecast so the UI can render hourly/daily views.
    if (!onecall) {
      function synthesizeOneCall(current, forecast) {
        const cityTz = (forecast?.city?.timezone) || 0; // seconds
        const now = current.dt || Math.floor(Date.now() / 1000);

        // helper to pick nearest forecast item for a target epoch
        function nearestFor(epoch) {
          let best = null;
          let bestDiff = Infinity;
          (forecast.list || []).forEach(item => {
            const diff = Math.abs(item.dt - epoch);
            if (diff < bestDiff) { bestDiff = diff; best = item; }
          });
          return best;
        }

        const hourly = [];
        for (let h = 0; h < 24; h++) {
          const target = now + h * 3600;
          const nearest = nearestFor(target) || {};
          hourly.push({
            dt: target,
            temp: nearest.main?.temp ?? nearest.temp ?? current.main?.temp,
            weather: nearest.weather ?? current.weather,
            pop: nearest.pop ?? 0,
            wind_speed: nearest.wind?.speed ?? nearest.wind_speed ?? current.wind?.speed ?? 0,
            wind_gust: nearest.wind?.gust ?? nearest.wind_gust ?? current.wind?.gust ?? null,
            wind_deg: nearest.wind?.deg ?? nearest.wind_deg ?? current.wind?.deg ?? 0,
            // preserve original shape if present
            main: nearest.main || undefined,
          });
        }

        // synthesize daily by grouping forecast items by local day
        const daysMap = {};
        (forecast.list || []).forEach(item => {
          const localMid = new Date((item.dt + cityTz) * 1000);
          const key = `${localMid.getUTCFullYear()}-${localMid.getUTCMonth()+1}-${localMid.getUTCDate()}`;
          if (!daysMap[key]) daysMap[key] = [];
          daysMap[key].push(item);
        });

        const daily = Object.values(daysMap).slice(0, 7).map(items => {
          const temps = items.map(i => i.main?.temp ?? i.temp ?? 0);
          const pops = items.map(i => i.pop ?? 0);
          const winds = items.map(i => i.wind?.speed ?? i.wind_speed ?? 0);
          const sample = items[Math.floor(items.length/2)];
          return {
            dt: sample.dt,
            temp: { max: Math.max(...temps), min: Math.min(...temps) },
            pop: Math.max(...pops),
            wind_speed: Math.max(...winds),
            weather: sample.weather || current.weather,
          };
        });

        return {
          timezone_offset: cityTz,
          current: { ...current, uvi: null },
          hourly,
          daily,
        };
      }

      onecall = synthesizeOneCall(current, forecast);
    }
    
    currentPayload = { current, forecast, pollution, onecall };
    renderWeather(location, current, forecast, pollution, onecall);
    // persist latest weather to backend (optional)
    saveWeatherToServer(location, current, forecast, pollution, onecall).catch(() => {});
    rememberPlace(location);
    setStatus(`Updated ${formatTime(new Date(current.dt * 1000))} - ${sourceLabel(location)}`);
  } catch (error) {
    setStatus(`${error.message} Please check your internet connection.`, true);
  }
}

async function saveWeatherToServer(location, current, forecast, pollution, onecall) {
  try {
    await fetch('/api/weather/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location, current, forecast, pollution, onecall, fetchedAt: new Date().toISOString() }),
    });
  } catch (e) {
    console.warn('Could not save weather to server', e);
  }
}

function renderWeather(location, current, forecast, pollution, onecall) {
  const hourly = onecall?.hourly?.slice(0, 24) || forecast.list; // preferred hourly data when available
  const daily = onecall?.daily || null;
  const condition = getWeatherDescription(current.weather[0]);
  // Determine visibility using the best available source (current, onecall, forecast)
  function resolveVisibilityKm(current, onecall, forecast) {
    if (current && typeof current.visibility === 'number') return current.visibility / 1000;
    if (onecall && typeof onecall.current?.visibility === 'number') return onecall.current.visibility / 1000;
    if (forecast && Array.isArray(forecast.list) && forecast.list.length) {
      // pick nearest forecast item (smallest time diff to current.dt)
      const now = current?.dt || Math.floor(Date.now() / 1000);
      let best = null;
      let bestDiff = Infinity;
      for (const item of forecast.list) {
        if (typeof item.visibility === 'number') {
          const diff = Math.abs((item.dt || 0) - now);
          if (diff < bestDiff) { bestDiff = diff; best = item; }
        }
      }
      if (best) return best.visibility / 1000;
    }
    return null; // unknown
  }
  let visibilityKm = resolveVisibilityKm(current, onecall, forecast);
  const nextSix = hourly.slice(0, 6);
  const rainPeak = Math.max(...nextSix.map(h => h.pop || 0)) * 100;

  // If the API gave 10 km (10000 m) which often means ">=10km", estimate a more realistic
  // visibility when there are signs of reduced visibility (rain, fog, high humidity).
  function estimateVisibilityFromConditions(current, forecast, hourly) {
    const visRaw = (current && typeof current.visibility === 'number') ? current.visibility : null;
    const apiSaysUnlimited = visRaw === 10000 || visibilityKm === 10;
    if (!apiSaysUnlimited) return visibilityKm;

    const pop = (hourly && hourly[0]?.pop) ?? (forecast?.list?.[0]?.pop) ?? 0;
    const rain1h = current?.rain?.['1h'] || 0;
    const snow1h = current?.snow?.['1h'] || 0;
    const humidity = current?.main?.humidity ?? 0;
    const clouds = current?.clouds?.all ?? 0;
    const windMs = current?.wind?.speed ?? 0;

    // Heuristic rules (conservative): return a lower visibility estimate when conditions suggest fog/rain
    if (rain1h >= 2 || snow1h >= 2 || pop >= 0.75) return 1.0; // heavy precipitation -> ~1 km
    if (rain1h >= 0.5 || pop >= 0.5) return 3.0; // moderate precipitation -> ~3 km
    if (humidity >= 90 && clouds >= 80) return 1.5; // likely fog -> ~1.5 km
    if (humidity >= 80) return 5.0; // humid -> visibility reduced moderately
    if (windMs >= 10 && (clouds > 60)) return 6.0; // strong wind + clouds
    // otherwise keep as 10 km (clear)
    return 10.0;
  }

  // Apply estimator when API returns the unlimited value
  if (visibilityKm === 10) {
    const est = estimateVisibilityFromConditions(current, forecast, hourly);
    visibilityKm = est;
  }
  const windDeg = current.wind?.deg ?? onecall?.current?.wind_deg ?? 0;
  const windSpeed = current.wind?.speed ?? onecall?.current?.wind_speed ?? 0;
  const windGustSpeed = current.wind?.gust ?? onecall?.current?.wind_gust ?? windSpeed;
  const windDirection = directionLabel(windDeg);
  const windKmh = Number((windSpeed * 3.6).toFixed(0));
  const windGustKmh = Number((windGustSpeed * 3.6).toFixed(0));
  
  // Timezone-aware sunrise/sunset calculations
  const tzOffset = (current.timezone ?? onecall?.timezone_offset ?? (forecast?.city?.timezone || 0)); // seconds
  const sunriseEpoch = current.sys.sunrise; // seconds
  const sunsetEpoch = current.sys.sunset; // seconds
  // Keep Date objects for display (converted to local wall-clock by adding tzOffset)
  const sunrise = new Date((sunriseEpoch + tzOffset) * 1000);
  const sunset = new Date((sunsetEpoch + tzOffset) * 1000);
  const daylightMinutes = Math.round(((sunsetEpoch - sunriseEpoch)) / 60);
  const nowEpoch = Math.floor(Date.now() / 1000); // UTC epoch seconds
  const nextSunrise = new Date((sunriseEpoch + 86400 + tzOffset) * 1000);
  // Compute progress using UTC epochs (both sunrise/sunset are UTC epoch seconds from API)
  const dayProgress = (sunsetEpoch > sunriseEpoch)
    ? clamp((nowEpoch - sunriseEpoch) / (sunsetEpoch - sunriseEpoch), 0, 1)
    : 0;
  
  const uvValueRaw = onecall?.current?.uvi ?? onecall?.uvi ?? onecall?.value ?? onecall?.data?.[0]?.value ?? current.uvi ?? null;
  const uvValue = uvValueRaw !== null && uvValueRaw !== undefined ? Math.round(uvValueRaw * 10) / 10 : null;
  // Sanity-check UV value: plausible range 0..15. Treat outliers as unavailable.
  let uvSanitized = uvValue;
  if (uvSanitized !== null && (isNaN(uvSanitized) || uvSanitized < 0 || uvSanitized > 15)) {
    console.warn('Suspicious UV value, ignoring:', uvSanitized);
    uvSanitized = null;
  }
  const uvData = uvSanitized !== null && uvSanitized >= 0
    ? { value: uvSanitized, label: uvLabel(uvSanitized) }
    : { value: null, label: "UV data unavailable" };
  
  const airAqi = getAirQuality(pollution);

  els.locationMode.textContent = location.live ? "Current API weather - detected location" : "Current API weather - selected city";
  els.placeName.textContent = location.name;
  els.dateLine.textContent = formatLongDateTZ(current.dt, tzOffset);
  els.weatherSymbol.innerHTML = getWeatherSVG(condition.icon);
  els.temperature.textContent = Math.round(current.main.temp);
  els.conditionText.textContent = condition.text;
  els.weatherNote.textContent = `Feels like ${Math.round(current.main.feels_like)} C with wind moving ${windDirection} at ${windKmh} km/h.`;
  els.locationHelp.textContent = location.source === "gps"
    ? "Precise live location is active."
    : location.source === "approximate"
      ? "Using approximate city-level location because precise browser location is blocked."
      : "Showing weather for the searched city.";
  els.humidity.textContent = `${Math.round(current.main.humidity)}%`;
  // Resolve precipitation (mm) from multiple possible sources:
  function resolvePrecipitationMm(current, onecall, forecast, hourly) {
    // Prefer explicit 1h values from the current weather
    const curRain1 = current?.rain?.['1h'] ?? 0;
    const curSnow1 = current?.snow?.['1h'] ?? 0;
    if (curRain1 || curSnow1) return Number((curRain1 + curSnow1).toFixed(1));

    // Check OneCall hourly first-hour rain/snow
    const ocFirst = onecall?.hourly?.[0];
    if (ocFirst) {
      const ocRain1 = ocFirst?.rain?.['1h'] ?? ocFirst?.rain ?? 0;
      const ocSnow1 = ocFirst?.snow?.['1h'] ?? ocFirst?.snow ?? 0;
      if (ocRain1 || ocSnow1) return Number((ocRain1 + ocSnow1).toFixed(1));
    }

    // Fall back to forecast list nearest entry (usually 3h buckets) and normalize to per-hour
    if (Array.isArray(forecast?.list) && forecast.list.length) {
      const now = current?.dt || Math.floor(Date.now() / 1000);
      let best = null;
      let bestDiff = Infinity;
      for (const item of forecast.list) {
        const hasRain = (item?.rain?.['3h'] ?? item?.rain) || (item?.snow?.['3h'] ?? item?.snow);
        if (!hasRain) continue;
        const diff = Math.abs((item.dt || 0) - now);
        if (diff < bestDiff) { bestDiff = diff; best = item; }
      }
      if (best) {
        const r3 = best?.rain?.['3h'] ?? best?.rain ?? 0;
        const s3 = best?.snow?.['3h'] ?? best?.snow ?? 0;
        const perHour = (Number(r3) + Number(s3)) / 3;
        return Number(perHour.toFixed(1));
      }
    }

    return 0.0;
  }

  const precipMm = resolvePrecipitationMm(current, onecall, forecast, hourly);
  els.precipitation.textContent = `${precipMm.toFixed(1)} mm`;
  els.cloudCover.textContent = `${Math.round(current.clouds.all)}%`;
  els.pressure.textContent = `${Math.round(current.main.pressure)} hPa`;
  els.sunrise.textContent = formatTimeTZ(sunriseEpoch, tzOffset);
  els.sunset.textContent = formatTimeTZ(sunsetEpoch, tzOffset);

  els.updatedPill.textContent = `Updated ${formatTimeTZ(current.dt, tzOffset)} - ${sourceLabel(location)}`;
  els.sourcePill.textContent = location.source === "gps" ? "Precise GPS" : location.source === "approximate" ? "Approximate location" : "City search";
  els.visibilityPill.textContent = visibilityKm !== null ? `Visibility ${visibilityKm.toFixed(1)} km` : `Visibility --`;
  els.apiPill.textContent = "Live OpenWeatherMap API";

  els.feelsLike.textContent = `${Math.round(current.main.feels_like)} C`;
  els.feelsLikeText.textContent = `${Math.abs(Math.round(current.main.feels_like - current.main.temp))} C difference from the measured air temperature right now.`;
  els.comfortTag.textContent = comfortLabel(current.main.feels_like, current.main.humidity);
  els.humidityTag.textContent = `Humidity ${Math.round(current.main.humidity)}%`;
  els.cloudTag.textContent = `Cloud cover ${Math.round(current.clouds.all)}%`;
  els.comfortMeter.style.width = `${clamp(current.main.humidity, 10, 100)}%`;

  els.rainOutlook.textContent = `${Math.round(rainPeak)}%`;
  els.rainText.textContent = `${(nextSix.reduce((sum, h) => sum + (h.rain?.["3h"] || 0), 0) / 2).toFixed(1)} mm expected across the next 6 hours.`;
  els.rainMeter.style.width = `${clamp(rainPeak, 4, 100)}%`;

  els.windGust.textContent = `${windGustKmh} km/h`;
  els.windText.textContent = current.wind.gust
    ? `Wind coming from ${windDirection} at ${windKmh} km/h, gusting to ${windGustKmh} km/h.`
    : `Wind coming from ${windDirection} at ${windKmh} km/h.`;
  els.windSustained.textContent = `Sustained ${windKmh} km/h`;
  els.pressureTag.textContent = `${Math.round(current.main.pressure)} hPa`;
  els.windMeter.style.width = `${clamp(windKmh / 2, 8, 100)}%`;

  els.daylight.textContent = formatDuration(daylightMinutes);
  els.daylightText.textContent = `Sunrise ${formatTimeTZ(sunriseEpoch, tzOffset)} - Sunset ${formatTimeTZ(sunsetEpoch, tzOffset)}`;
  els.uvTag.textContent = `UV --`;
  els.visibilityTag.textContent = `Visibility ${visibilityKm.toFixed(1)} km`;
  els.daylightMeter.style.width = `${clamp((daylightMinutes / 900) * 100, 20, 100)}%`;

  els.mapTemp.textContent = `${Math.round(current.main.temp)} C`;
  els.mapUpdated.textContent = `Updated ${formatTimeTZ(current.dt, tzOffset)}`;
  els.mapCaption.textContent = `${location.name} - Lat ${roundThree(location.latitude)} - Lon ${roundThree(location.longitude)} - Temperature layer loaded`;

  els.uvIndex.textContent = uvData.value === null ? "--" : uvData.value;
  els.uvText.textContent = uvData.label;
  els.uvTag.textContent = uvData.value === null ? "UV --" : `UV ${uvData.value}`;
  els.uvMeter.style.width = uvData.value === null ? "0%" : `${clamp((uvData.value / 11) * 100, 6, 100)}%`;
  els.humidityDetail.textContent = `${Math.round(current.main.humidity)}%`;
  els.humidityText.textContent = humidityLabel(current.main.humidity);
  els.humidityMeter.style.width = `${current.main.humidity}%`;
  els.windDetail.textContent = `${windKmh} km/h`;
  els.windDirection.textContent = `${windDirection} - ${Math.round(current.wind.deg)}°`;
  
  const windArrow = document.querySelector('#windArrow');
  if (windArrow) windArrow.style.transform = `rotate(${current.wind.deg}deg)`;
  document.getElementById('compassSpeed').textContent = `${windKmh} km/h`;
  
  els.visibilityDetail.textContent = visibilityKm !== null ? `${visibilityKm.toFixed(1)} km` : '--';
  els.visibilityText.textContent = visibilityKm === null ? "Unknown" : (visibilityKm > 10 ? "Excellent" : visibilityKm > 4 ? "Good" : "Reduced");
  els.visibilityMeter.style.width = visibilityKm === null ? `6%` : `${clamp((visibilityKm / 35) * 100, 5, 100)}%`;

  let sunLabelText;
  let sunMainEpoch;
  let countdownTargetEpoch;
  let countdownMessage;

  // Compare using UTC epochs to determine phase relative to sunrise/sunset
  if (nowEpoch < sunriseEpoch) {
    sunLabelText = "Sunrise";
    sunMainEpoch = sunriseEpoch;
    countdownTargetEpoch = sunriseEpoch;
    countdownMessage = "until sunrise";
  } else if (nowEpoch < sunsetEpoch) {
    sunLabelText = "Sunset";
    sunMainEpoch = sunsetEpoch;
    countdownTargetEpoch = sunsetEpoch;
    countdownMessage = "left for sunset";
  } else {
    sunLabelText = "Next sunrise";
    sunMainEpoch = sunriseEpoch + 86400;
    countdownTargetEpoch = sunriseEpoch + 86400;
    countdownMessage = "until sunrise";
  }

  els.sunLabel.textContent = sunLabelText;
  els.sunMainTime.textContent = formatTimeTZ(sunMainEpoch, tzOffset);
  els.sunriseArc.textContent = formatTimeTZ(sunriseEpoch, tzOffset);
  els.sunsetArc.textContent = formatTimeTZ(sunsetEpoch, tzOffset);
  const solarNoonEpoch = Math.floor((sunriseEpoch + sunsetEpoch) / 2);
  els.solarNoon.textContent = formatTimeTZ(solarNoonEpoch, tzOffset);
  els.sunCountdown.textContent = timeUntilTZ(countdownTargetEpoch, tzOffset, countdownMessage);

  const sunPath = document.querySelector('#sunPath');
  if (sunPath) sunPath.style.width = `${Math.round(dayProgress * 100)}%`;

  // Enhanced AQI display with color-coded indicator, health recommendations, and pollutant levels
  els.airQuality.textContent = airAqi.value ?? "--";
  els.airQuality.style.color = airAqi.color || '#999';
  els.airQuality.style.fontWeight = 'bold';
  
  els.airQualityText.textContent = `${airAqi.label} — ${airAqi.recommendation}`;
  els.airQualityText.style.fontSize = '0.9rem';
  els.airQualityText.style.color = airAqi.color || '#999';
  
  // Color-coded meter indicator
  els.airQualityMeter.style.width = `${clamp((airAqi.value || 0) / 5, 4, 100)}%`;
  els.airQualityMeter.style.backgroundColor = airAqi.color || '#999';
  
  // Display pollutant levels if available
  if (airAqi.pollutants) {
    const pollutantDetails = document.querySelector('#pollutantDetails') || 
      (() => {
        const div = document.createElement('div');
        div.id = 'pollutantDetails';
        div.style.cssText = 'margin-top: 0.5rem; font-size: 0.85rem; color: var(--muted);';
        const parent = els.airQualityMeter.parentElement;
        if (parent) parent.appendChild(div);
        return div;
      })();
    
    const pollutantStr = `
      PM2.5: ${airAqi.pollutants.pm25} µg/m³ | PM10: ${airAqi.pollutants.pm10} µg/m³ | 
      NO₂: ${airAqi.pollutants.no2} ppb | SO₂: ${airAqi.pollutants.so2} ppb | 
      O₃: ${airAqi.pollutants.o3} ppb | CO: ${airAqi.pollutants.co} ppm
    `.trim();
    
    if (pollutantDetails) {
      pollutantDetails.innerHTML = `<strong>Pollutant Levels:</strong> ${pollutantStr}`;
    }
  }

  // Display sensitive group alert if AQI warrants it
  if (airAqi.sensitiveWarning && airAqi.value && airAqi.value > 100) {
    const sensitiveAlert = document.querySelector('#sensitiveAlert') || 
      (() => {
        const div = document.createElement('div');
        div.id = 'sensitiveAlert';
        div.style.cssText = `
          margin-top: 0.75rem; 
          padding: 0.75rem; 
          background: rgba(${airAqi.color === '#EF4444' ? '239, 68, 68' : airAqi.color === '#F97316' ? '249, 115, 22' : '155, 89, 182'}, 0.2);
          border-left: 3px solid ${airAqi.color};
          border-radius: 4px;
          font-size: 0.85rem;
          color: var(--text);
        `;
        const parent = els.airQualityMeter.parentElement;
        if (parent) parent.appendChild(div);
        return div;
      })();
    
    if (sensitiveAlert) {
      sensitiveAlert.innerHTML = airAqi.sensitiveWarning;
    }
  }

  renderHourly(hourly, tzOffset);
  renderForecast(daily, hourly, tzOffset);
  renderInsights({ current, hourly, visibilityKm, rainPeak, sunrise, sunset, tzOffset });
  updateMap(location, current);
}

function setLocationSource(title, help) {
  els.sourcePill.textContent = title;
  els.locationHelp.textContent = help;
}

function sourceLabel(location) {
  if (location.source === "gps") return "Precise live location";
  if (location.source === "approximate") return "Approximate location";
  if (location.source === "search") return location.name;
  return location.live ? "Live location" : location.name;
}

function renderHourly(hourly, tzOffset) {
  els.hourlyStrip.innerHTML = hourly.slice(0, 24).map((item) => {
    const condition = getWeatherDescription(item.weather?.[0] || item.weather[0]);
    const timeText = formatHourStackTZ(item.dt, tzOffset);
    const temp = item.main?.temp ?? item.temp ?? 0;
    return `
      <article class="hour-card">
        <time>${timeText}</time>
        <span class="hour-icon">${getWeatherSVG(condition.icon)}</span>
        <b>${Math.round(temp)} C</b>
        <small>${Math.round((item.pop || 0) * 100)}% rain risk</small>
      </article>
    `;
  }).join("");
}

function renderForecast(daily, hourly, tzOffset) {
  if (daily && daily.length) {
    els.forecastList.innerHTML = daily.slice(0, 7).map((day) => {
      const condition = getWeatherDescription(day.weather[0]);
      const maxTemp = day.temp.max;
      const minTemp = day.temp.min;
      const maxWind = (day.wind_gust || day.wind_speed || 0) * 3.6;
      const maxRain = Math.round((day.pop || 0) * 100);
      const dayLabel = formatWeekdayTZ(day.dt, tzOffset);

      return `
        <article class="forecast-row">
          <span class="forecast-icon">${getWeatherSVG(condition.icon)}</span>
          <div>
            <b>${dayLabel}</b>
            <span>${condition.text}</span>
          </div>
          <strong>${maxRain}% rain - ${Math.round(maxWind)} km/h - ${Math.round(maxTemp)} C/${Math.round(minTemp)} C</strong>
        </article>
      `;
    }).join("");
    return;
  }

  const grouped = {};
  hourly.forEach((item) => {
    const dayKey = formatWeekdayTZ(item.dt, tzOffset);
    if (!grouped[dayKey]) {
      grouped[dayKey] = {
        name: dayKey,
        items: [],
        temps: [],
        winds: [],
        rains: []
      };
    }
    grouped[dayKey].items.push(item);
    grouped[dayKey].temps.push(item.main?.temp ?? item.temp ?? 0);
    grouped[dayKey].winds.push(item.wind?.speed ?? item.wind_speed ?? 0);
    grouped[dayKey].rains.push(item.pop || 0);
  });

  els.forecastList.innerHTML = Object.values(grouped).slice(0, 7).map((day) => {
    const condition = getWeatherDescription(day.items[0].weather[0]);
    const maxTemp = Math.max(...day.temps);
    const minTemp = Math.min(...day.temps);
    const maxWind = Math.max(...day.winds) * 3.6;
    const maxRain = Math.round(Math.max(...day.rains) * 100);
    
    return `
      <article class="forecast-row">
        <span class="forecast-icon">${getWeatherSVG(condition.icon)}</span>
        <div>
          <b>${day.name}</b>
          <span>${condition.text}</span>
        </div>
        <strong>${maxRain}% rain - ${Math.round(maxWind)} km/h - ${Math.round(maxTemp)} C/${Math.round(minTemp)} C</strong>
      </article>
    `;
  }).join("");
}

function renderInsights(data) {
  const { current, hourly, visibilityKm, rainPeak, sunrise, sunset, tzOffset, onecall, pollution } = data;

  const next24 = (hourly || []).slice(0, 24);
  const next6 = next24.slice(0, 6);
  const avgPop = next6.length ? Math.round((next6.reduce((s, h) => s + (h.pop || 0), 0) / next6.length) * 100) : 0;
  const warmest = next24.length ? Math.max(...next24.map(h => h.main?.temp ?? h.temp ?? 0)) : (current.main?.temp || 0);
  const warmestTime = next24.find(h => (h.main?.temp ?? h.temp) === warmest) || next24[0] || { dt: current.dt };
  const nextWindsKmh = next24.map(h => (h.wind?.speed ?? h.wind_speed ?? 0) * 3.6);
  const calmest = nextWindsKmh.length ? Math.min(...nextWindsKmh) : 0;
  const calmestTime = next24.find(h => Math.round((h.wind?.speed ?? h.wind_speed ?? 0) * 3.6) === Math.round(calmest)) || next24[0] || { dt: current.dt };

  const uv = (onecall && typeof onecall.current?.uvi === 'number') ? onecall.current.uvi : null;
  const aqi = getAirQuality(pollution);
  const windNowKmh = (current.wind?.speed ?? 0) * 3.6;
  const tempNow = current.main?.temp;
  const isNight = (() => {
    const now = Math.floor(Date.now() / 1000);
    return now < (current.sys?.sunrise || 0) || now > (current.sys?.sunset || 0);
  })();

  const insights = [];

  // Outdoor activity decision
  if (avgPop >= 60 || rainPeak >= 60) {
    insights.push(["Outdoor activity", `High chance of rain in the next few hours (${avgPop}%); postpone outdoor exercise or move it indoors.`]);
  } else if (avgPop >= 30 || rainPeak >= 30) {
    insights.push(["Outdoor activity", `Light rain possible (${avgPop}%). Carry a waterproof jacket or umbrella.`]);
  } else if (tempNow !== undefined && tempNow <= 0) {
    insights.push(["Outdoor activity", `Temperature is at ${Math.round(tempNow)}°C. Risk of frost; dress warmly if going outside.`]);
  } else {
    insights.push(["Outdoor activity", `Conditions look suitable for outdoor activities in the near term.`]);
  }

  // Travel and safety
  if (visibilityKm < 1) {
    insights.push(["Travel safety", `Very low visibility (${visibilityKm.toFixed(1)} km). Drive slowly, use lights, and allow extra time for travel.`]);
  } else if (windNowKmh >= 60) {
    insights.push(["Travel safety", `Strong winds (${Math.round(windNowKmh)} km/h) right now — expect difficult driving for high-profile vehicles.`]);
  } else if (Math.max(...nextWindsKmh, 0) >= 50) {
    insights.push(["Travel safety", `Windy conditions expected later today; secure loose outdoor items and exercise caution on elevated roads.`]);
  } else {
    insights.push(["Travel safety", `No major travel hazards expected from wind or visibility.`]);
  }

  // UV guidance
  if (uv !== null) {
    const uvRound = Math.round(uv * 10) / 10;
    if (uvRound >= 8) insights.push(["UV advisory", `Very high UV (${uvRound}). Wear SPF, sunglasses, and limit direct sun exposure.`]);
    else if (uvRound >= 6) insights.push(["UV advisory", `High UV (${uvRound}). Use sun protection and stay hydrated.`]);
    else if (uvRound >= 3) insights.push(["UV advisory", `Moderate UV (${uvRound}). Apply sunscreen if you'll be outside for extended periods.`]);
    else insights.push(["UV advisory", `Low UV (${uvRound}). Minimal sun protection needed for short outdoor exposure.`]);
  }

  // Air quality
  if (aqi.value !== null) {
    if (aqi.value > 150) {
      insights.push(["Air quality", `Air quality is poor (${aqi.label}). Limit strenuous outdoor activities and consider masks for sensitive individuals.`]);
    } else if (aqi.value > 100) {
      insights.push(["Air quality", `Air quality is moderate/unhealthy for sensitive groups (${aqi.label}). Take precautions if you have respiratory conditions.`]);
    } else {
      insights.push(["Air quality", `Air quality is ${aqi.label}. Safe for outdoor activities.`]);
    }
  }

  // Temperature-related commute note
  if (isNight && tempNow !== undefined && tempNow <= 2) {
    insights.push(["Commute note", `Nighttime low (${Math.round(tempNow)}°C) may cause slippery roads; allow extra commute time.`]);
  }

  // Peak warmth and best window
  insights.push(["Peak warmth", `The warmest upcoming hour is around ${formatTimeTZ(warmestTime.dt, tzOffset)}, near ${Math.round(warmest)}°C.`]);
  insights.push(["Best outdoor window", `Calmer winds expected near ${formatTimeTZ(calmestTime.dt, tzOffset)} with about ${Math.round(calmest)} km/h winds and ${visibilityKm.toFixed(1)} km visibility.`]);

  els.insightList.innerHTML = insights.map(([title, body]) => `<article><b>${title}</b><p>${body}</p></article>`).join("");
}

function updateMap(location, current) {
  if (!window.L) {
    document.querySelector("#weatherMap").textContent = "Map library could not load, but weather API data is active.";
    return;
  }

  if (!map) {
    map = L.map("weatherMap", { zoomControl: true }).setView([location.latitude, location.longitude], 7);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);
  } else {
    map.setView([location.latitude, location.longitude], 7);
  }

  if (mapMarker) mapMarker.remove();
  mapMarker = L.circleMarker([location.latitude, location.longitude], {
    radius: 9,
    color: "#dff8ff",
    weight: 3,
    fillColor: "#55d8f6",
    fillOpacity: 0.85,
  }).addTo(map);
  const tempText = typeof current.main?.temp === 'number' ? `${Math.round(current.main.temp)} C` : "--";
  mapMarker.bindPopup(`${location.name}: ${tempText}`).openPopup();

  // Ensure map tile overlay is applied (if setLayer was called before map creation)
  if (!mapTileLayer && currentMapLayer && CONFIG?.OPENWEATHERMAP_API_KEY) {
    setLayer(currentMapLayer);
  }
}

function capitalizeText(value) {
  if (!value || typeof value !== 'string') return '';
  return value
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function getWeatherDescription(weather) {
  // OpenWeatherMap weather codes to icon mapping
  const iconMap = {
    "01d": { icon: "SUN", text: "Clear sky" },
    "01n": { icon: "SUN", text: "Clear night" },
    "02d": { icon: "PCL", text: "Partly cloudy" },
    "02n": { icon: "PCL", text: "Partly cloudy" },
    "03d": { icon: "CLD", text: "Cloudy" },
    "03n": { icon: "CLD", text: "Cloudy" },
    "04d": { icon: "CLD", text: "Overcast" },
    "04n": { icon: "CLD", text: "Overcast" },
    "09d": { icon: "DRZ", text: "Drizzle" },
    "09n": { icon: "DRZ", text: "Drizzle" },
    "10d": { icon: "RAN", text: "Rain" },
    "10n": { icon: "RAN", text: "Rain" },
    "11d": { icon: "STM", text: "Thunderstorm" },
    "11n": { icon: "STM", text: "Thunderstorm" },
    "13d": { icon: "SNW", text: "Snow" },
    "13n": { icon: "SNW", text: "Snow" },
    "50d": { icon: "FOG", text: "Fog" },
    "50n": { icon: "FOG", text: "Fog" },
  };

  const icon = weather?.icon;
  const source = iconMap[icon] || { icon: "CLD", text: capitalizeText(weather?.main || "Weather") };
  const description = weather?.description ? capitalizeText(weather.description) : source.text;
  return { icon: source.icon, text: description };
}

function getWeatherSVG(icon) {
  // Return small inline SVG for icon keys like '01d','02n','10d' etc.
  if (!icon) return `<svg viewBox="0 0 64 64" class="icon icon-cloud"><g fill="none" stroke="#eef5ff" stroke-width="2"><path d="M20 40h24a8 8 0 0 0 0-16 10 10 0 0 0-19-3A8 8 0 0 0 20 40z" fill="#2b3b46" opacity="0.6"/></g></svg>`;

  const base = icon.slice(0,2);
  if (base === '01') {
    // Sun
    return `
      <svg viewBox="0 0 64 64" class="icon icon-sun" aria-hidden="true">
        <defs>
          <radialGradient id="g1" cx="50%" cy="35%">
            <stop offset="0%" stop-color="#ffd76b" />
            <stop offset="100%" stop-color="#ffb84d" />
          </radialGradient>
        </defs>
        <circle cx="32" cy="24" r="10" fill="url(#g1)" />
        <g stroke="#ffd76b" stroke-width="2" stroke-linecap="round">
          <line x1="32" y1="4" x2="32" y2="12" />
          <line x1="32" y1="36" x2="32" y2="52" />
          <line x1="4" y1="24" x2="12" y2="24" />
          <line x1="52" y1="24" x2="60" y2="24" />
          <line x1="12" y1="8" x2="18" y2="14" />
          <line x1="46" y1="34" x2="52" y2="40" />
        </g>
      </svg>
    `;
  }

  if (base === '09' || base === '10' || base === '11') {
    // Rain/thunder
    return `
      <svg viewBox="0 0 64 64" class="icon icon-rain" aria-hidden="true">
        <g>
          <ellipse cx="30" cy="26" rx="16" ry="10" fill="#2b3b46" opacity="0.8" />
          <g class="raindrops" stroke="#8ed1ff" stroke-width="2" stroke-linecap="round">
            <line x1="24" y1="36" x2="22" y2="44" />
            <line x1="32" y1="36" x2="30" y2="46" />
            <line x1="40" y1="36" x2="38" y2="46" />
          </g>
        </g>
      </svg>
    `;
  }

  // Clouds (03/04/50) and fallback
  return `
    <svg viewBox="0 0 64 64" class="icon icon-cloud" aria-hidden="true">
      <g>
        <ellipse cx="32" cy="30" rx="18" ry="12" fill="#2b3b46" opacity="0.85" />
        <ellipse cx="20" cy="34" rx="10" ry="6" fill="#2b3b46" opacity="0.75" />
      </g>
    </svg>
  `;
}

function getAirQuality(pollution) {
  if (!pollution?.list?.length) return { value: null, label: "Air quality API unavailable.", category: "unknown", color: "#999" };
  const current = pollution.list[0];
  const comps = current.components || {};

  function computeAQIFromPM25(pm25) {
    // EPA breakpoints for PM2.5 (µg/m3) -> AQI (0-500)
    const bps = [
      { Clow: 0.0, Chigh: 12.0, Ilow: 0, Ihigh: 50 },
      { Clow: 12.1, Chigh: 35.4, Ilow: 51, Ihigh: 100 },
      { Clow: 35.5, Chigh: 55.4, Ilow: 101, Ihigh: 150 },
      { Clow: 55.5, Chigh: 150.4, Ilow: 151, Ihigh: 200 },
      { Clow: 150.5, Chigh: 250.4, Ilow: 201, Ihigh: 300 },
      { Clow: 250.5, Chigh: 350.4, Ilow: 301, Ihigh: 400 },
      { Clow: 350.5, Chigh: 500.4, Ilow: 401, Ihigh: 500 },
    ];
    for (const bp of bps) {
      if (pm25 >= bp.Clow && pm25 <= bp.Chigh) {
        const aqi = Math.round(((bp.Ihigh - bp.Ilow) / (bp.Chigh - bp.Clow)) * (pm25 - bp.Clow) + bp.Ilow);
        return aqi;
      }
    }
    return null;
  }

  // Prefer PM2.5-based AQI if available
  const pm25 = comps.pm2_5 ?? comps.pm25 ?? null;
  let aqiValue = null;
  if (pm25 !== null && pm25 !== undefined) {
    aqiValue = computeAQIFromPM25(Number(pm25));
  } else if (current.main && current.main.aqi) {
    // Fallback: map provider AQI (1-5) to rough 0-500 scale
    aqiValue = current.main.aqi * 50;
  }

  // AQI Category with color codes and health info
  let category = 'Unknown';
  let color = '#999999';
  let recommendation = 'No data available';
  let sensitiveWarning = '';

  if (aqiValue === null) {
    category = 'Unknown';
    color = '#999999';
    recommendation = 'Air quality data unavailable';
  } else if (aqiValue <= 50) {
    category = 'Good';
    color = '#10B981';
    recommendation = '✓ Safe for all outdoor activities';
    sensitiveWarning = '';
  } else if (aqiValue <= 100) {
    category = 'Moderate';
    color = '#FBBF24';
    recommendation = '⚠ Acceptable. Sensitive groups may experience mild effects';
    sensitiveWarning = '⚠ Children, elderly, and asthma patients should limit prolonged outdoor activities';
  } else if (aqiValue <= 150) {
    category = 'Unhealthy for Sensitive Groups';
    color = '#F97316';
    recommendation = '⚠ Sensitive groups should reduce outdoor activities';
    sensitiveWarning = '🚨 ALERT: Children, elderly, and asthma patients should avoid outdoor exercise';
  } else if (aqiValue <= 200) {
    category = 'Unhealthy';
    color = '#EF4444';
    recommendation = '🚫 Everyone should reduce prolonged outdoor activities';
    sensitiveWarning = '🚨 ALERT: General population may experience health effects. Sensitive groups stay indoors.';
  } else if (aqiValue <= 300) {
    category = 'Very Unhealthy';
    color = '#991B1B';
    recommendation = '🚫 Avoid all outdoor activities, wear an N95 mask if necessary';
    sensitiveWarning = '🚨 CRITICAL: All sensitive groups must stay indoors. General population should avoid outdoor exercise.';
  } else {
    category = 'Hazardous';
    color = '#4C0519';
    recommendation = '🚫 EMERGENCY: Stay indoors, use air purifier, wear N95 mask if going outside';
    sensitiveWarning = '🚨 CRITICAL: Everyone should avoid outdoor activities. Sensitive groups should have medical assistance available.';
  }

  const label = category;

  // Pollutant levels
  const pollutants = {
    pm25: pm25 ? Number(pm25).toFixed(1) : 'N/A',
    pm10: comps.pm10 ? Number(comps.pm10).toFixed(1) : 'N/A',
    no2: comps.no2 ? Number(comps.no2).toFixed(2) : 'N/A',
    so2: comps.so2 ? Number(comps.so2).toFixed(2) : 'N/A',
    o3: comps.o3 ? Number(comps.o3).toFixed(2) : 'N/A',
    co: comps.co ? Number(comps.co).toFixed(2) : 'N/A',
    nh3: comps.nh3 ? Number(comps.nh3).toFixed(2) : 'N/A',
    pb: comps.pb ? Number(comps.pb).toFixed(3) : 'N/A',
  };

  return { 
    value: aqiValue, 
    label, 
    category,
    color,
    recommendation,
    sensitiveWarning,
    pollutants,
  };
}

function getAQICategory(value) {
  if (value === null || value === undefined) return { name: 'Unknown', color: '#999999', level: 0 };
  if (value <= 50) return { name: 'Good', color: '#10B981', level: 1 };
  if (value <= 100) return { name: 'Moderate', color: '#FBBF24', level: 2 };
  if (value <= 150) return { name: 'Unhealthy for Sensitive Groups', color: '#F97316', level: 3 };
  if (value <= 200) return { name: 'Unhealthy', color: '#EF4444', level: 4 };
  if (value <= 300) return { name: 'Very Unhealthy', color: '#991B1B', level: 5 };
  return { name: 'Hazardous', color: '#4C0519', level: 6 };
}

function getAQIHealthTips(value) {
  const tips = {
    good: ['Safe for all outdoor activities', 'Enjoy outdoor exercise', 'No restrictions'],
    moderate: ['Acceptable air quality', 'Sensitive groups may experience mild effects', 'Keep inhalers accessible'],
    poor: ['Reduce prolonged outdoor activities', 'Wear N95 mask for sensitive groups', 'Limit outdoor exercise'],
    unhealthy: ['Everyone should reduce outdoor activities', 'Sensitive groups stay indoors', 'Use air purifier indoors'],
    veryUnhealthy: ['Avoid all outdoor activities', 'Wear N95 mask if necessary', 'Stay near medical facilities'],
    hazardous: ['EMERGENCY: Stay indoors', 'Use air purifier', 'Medical assistance nearby recommended'],
  };

  if (value === null || value === undefined) return ['Data unavailable'];
  if (value <= 50) return tips.good;
  if (value <= 100) return tips.moderate;
  if (value <= 150) return tips.poor;
  if (value <= 200) return tips.unhealthy;
  if (value <= 300) return tips.veryUnhealthy;
  return tips.hazardous;
}

function getSensitiveGroupAlerts(value) {
  if (value === null || value === undefined || value <= 100) return '';
  
  const alerts = {
    poor: '⚠ Children, elderly, and asthma patients should limit prolonged outdoor activities',
    unhealthy: '🚨 ALERT: Children, elderly, and asthma patients should avoid outdoor exercise',
    veryUnhealthy: '🚨 CRITICAL: All sensitive groups must stay indoors. General population should avoid outdoor exercise.',
    hazardous: '🚨 CRITICAL: Everyone should avoid outdoor activities. Sensitive groups should have medical assistance available.',
  };

  if (value <= 150) return alerts.poor;
  if (value <= 200) return alerts.unhealthy;
  if (value <= 300) return alerts.veryUnhealthy;
  return alerts.hazardous;
}

function getCurrentAirQuality(air, currentTime) {
  if (!air?.hourly?.time?.length) return { value: null, label: "Air quality API unavailable." };
  const index = Math.max(0, air.hourly.time.findIndex((time) => time >= currentTime));
  const value = Math.round(air.hourly.us_aqi[index] || air.hourly.european_aqi[index] || 0);
  const label = value <= 50 ? "Good" : value <= 100 ? "Moderate" : value <= 150 ? "Unhealthy for sensitive groups" : "Unhealthy";
  return { value, label };
}

function setStatus(message, isError = false) {
  els.updatedPill.textContent = message;
  els.updatedPill.style.borderColor = isError ? "rgba(255, 109, 120, .55)" : "var(--line)";
  els.updatedPill.style.color = isError ? "var(--danger)" : "var(--muted)";
}

function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timeout));
}

function clamp(value, min, maxValue) {
  return Math.min(maxValue, Math.max(min, value));
}

function roundOne(value) {
  return Math.round((Number(value) || 0) * 10) / 10;
}

function roundThree(value) {
  return Math.round((Number(value) || 0) * 1000) / 1000;
}

function formatTime(value) {
  return new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

function formatTimeTZ(epochSeconds, tzOffset = 0) {
  const utcMs = (Number(epochSeconds) + Number(tzOffset)) * 1000;
  return new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit", timeZone: "UTC" }).format(new Date(utcMs));
}

function formatLongDateTZ(epochSeconds, tzOffset = 0) {
  const utcMs = (Number(epochSeconds) + Number(tzOffset)) * 1000;
  return new Intl.DateTimeFormat("en", { weekday: "long", month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(utcMs));
}

function timeUntilTZ(targetEpochSeconds, tzOffset = 0, label) {
  const nowEpoch = Math.floor(Date.now() / 1000);
  // targetEpochSeconds and nowEpoch are both UTC epoch seconds from API/system
  const diff = Math.round((Number(targetEpochSeconds) - nowEpoch) / 60);
  if (diff <= 0) return label && label.toLowerCase().includes('sunset') ? "Sunset has passed" : "Sunrise has passed";
  return `${formatDuration(diff)} ${label}`;
}

function formatHourStack(value) {
  return new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(new Date(value)).replace(" ", "\n");
}

function formatHourStackTZ(epochSeconds, tzOffset = 0) {
  const utcMs = (Number(epochSeconds) + Number(tzOffset)) * 1000;
  return new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit", timeZone: "UTC" }).format(new Date(utcMs)).replace(" ", "\n");
}

function formatWeekday(value) {
  return new Intl.DateTimeFormat("en", { weekday: "short" }).format(new Date(value));
}

function formatWeekdayTZ(epochSeconds, tzOffset = 0) {
  const utcMs = (Number(epochSeconds) + Number(tzOffset)) * 1000;
  return new Intl.DateTimeFormat("en", { weekday: "short", timeZone: "UTC" }).format(new Date(utcMs));
}

function formatLongDate(value) {
  return new Intl.DateTimeFormat("en", { weekday: "long", month: "short", day: "numeric" }).format(new Date(value));
}

function minutesBetween(start, end) {
  return Math.max(0, Math.round((new Date(end) - new Date(start)) / 60000));
}

function formatDuration(minutes) {
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

function midpointTime(start, end) {
  return new Date((new Date(start).getTime() + new Date(end).getTime()) / 2);
}

function timeUntil(target, label) {
  const diff = Math.round((new Date(target) - new Date()) / 60000);
  if (diff <= 0) return "Sunset has passed";
  return `${formatDuration(diff)} ${label}`;
}

function isBeforeNow(value) {
  return new Date(value).getTime() < Date.now();
}

function directionLabel(degrees) {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const normalized = ((degrees % 360) + 360) % 360;
  const index = Math.floor((normalized + 22.5) / 45) % 8;
  return directions[index];
}

function comfortLabel(temp, humidity) {
  if (temp >= 34 || humidity >= 80) return "Humid";
  if (temp >= 29) return "Warm";
  if (temp <= 12) return "Cold";
  return "Comfort";
}

function humidityLabel(value) {
  if (value > 75) return "Humid";
  if (value < 35) return "Dry";
  return "Comfortable";
}

function uvLabel(value) {
  if (value >= 11) return "Extreme";
  if (value >= 8) return "Very high";
  if (value >= 6) return "High";
  if (value >= 3) return "Moderate";
  return "Low";
}

renderCityButtons();
setLayer("temperature");
const initialCity = CONFIG?.DEFAULT_CITY || "Bengaluru";
loadCity(initialCity).finally(() => {
  useLiveLocation();
});
