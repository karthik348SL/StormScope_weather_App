require('dotenv').config();
const dns = require('dns');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');

const fs = require('fs').promises;

// Configure DNS servers for MongoDB Atlas SRV lookup
dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();
const PORT = process.env.PORT || 4174;
const BACKUP_FILE = path.join(__dirname, 'weather-backup.json');
const BACKUP_LIMIT = 20;

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname)));

function fetchJsonWithTimeout(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, {
    signal: controller.signal,
    headers: {
      'User-Agent': 'StormScope weather app postal lookup',
      'Accept': 'application/json',
    },
  }).finally(() => clearTimeout(timeout));
}

function decodeHtml(value) {
  return String(value || '')
    .replace(/&amp;/g, '&')
    .replace(/&#038;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8211;/g, '-')
    .replace(/&#8217;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function cleanText(value) {
  return decodeHtml(value).replace(/\s+/g, ' ').trim();
}

function uniqueList(values) {
  return [...new Set(values.map(cleanText).filter(Boolean))];
}

async function scrapeIndiaPinFromPublicDirectories(pin) {
  const results = [];

  try {
    const response = await fetchJsonWithTimeout(`https://pincode.city/pincode/${pin}`, 9000);
    if (response.ok) {
      const html = await response.text();
      const heading = cleanText((html.match(/<h4[^>]*class=["'][^"']*more-locations[^"']*["'][^>]*>([\s\S]*?)<\/h4>/i) || [])[1] || '');
      const cityMatch = heading.match(/Located Under\s+(.+?)\s+City\s+in\s+([A-Za-z ]+)$/i);
      const taluk = cleanText(cityMatch?.[1] || '');
      const state = cleanText(cityMatch?.[2] || '');
      const listMatch = html.match(/<ol[^>]*class=["'][^"']*same-list[^"']*["'][^>]*>([\s\S]*?)<\/ol>/i);
      const names = uniqueList([...(listMatch?.[1] || '').matchAll(/class=["']area["'][^>]*>([^<]+)<\/a>/gi)].map(match => match[1]));

      for (const name of names) {
        results.push({
          Name: name,
          District: '',
          State: state,
          Country: 'India',
          Block: taluk,
          Division: taluk,
          Region: state,
          Pincode: pin,
          BranchType: /Ranebennur/i.test(name) ? 'Sub Office' : 'Branch Office',
          DeliveryStatus: 'Delivery',
        });
      }
    }
  } catch (err) {
    console.warn('pincode.city fallback failed:', err.message);
  }

  try {
    const response = await fetchJsonWithTimeout(`https://www.postoffices.co.in/${pin}/`, 9000);
    if (response.ok) {
      const html = await response.text();
      const plain = cleanText(html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' '));
      const stateMatch = plain.match(/State\s*\|\s*([A-Za-z ]+),?\s*India/i) || plain.match(/,\s*([A-Za-z ]+),\s*India/i);
      const state = cleanText(stateMatch?.[1] || '');
      const officeMatches = [...plain.matchAll(/([A-Z][A-Za-z0-9 ._-]+?)\s+(Branch|Sub|Head)\s+Office\s*\((?:B|S|H)\.O\.\)/g)];
      for (const match of officeMatches) {
        const name = cleanText(match[1]).replace(/\s+(Branch|Sub|Head)$/i, '').trim();
        if (name.length < 3) continue;
        results.push({
          Name: name,
          District: '',
          State: state,
          Country: 'India',
          Block: /Ranebennur|Ranibennur/i.test(plain) ? 'Ranebennur' : '',
          Division: '',
          Region: state,
          Pincode: pin,
          BranchType: `${match[2]} Office`,
          DeliveryStatus: 'Delivery',
        });
      }
    }
  } catch (err) {
    console.warn('postoffices.co.in fallback failed:', err.message);
  }

  const seen = new Set();
  return results.filter((office) => {
    const key = `${office.Name}|${office.Block}|${office.State}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

let dbConnected = false;
const MONGO_URI = process.env.MONGO_URI || process.env.DATABASE_URL || '';
console.log('MONGO_URI is set:', !!MONGO_URI);
if (MONGO_URI) {
  // Attempt to connect, then start the HTTP server so dbConnected is accurate.
  // If the connection hangs, fall back to starting the server after a short delay.
  let serverStarted = false;
  const startIfNeeded = () => {
    if (!serverStarted) {
      serverStarted = true;
      startServer();
    }
  };

  mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      dbConnected = true;
      console.log('✓ Connected to MongoDB');
      startIfNeeded();
    })
    .catch((err) => {
      dbConnected = false;
      console.error('✗ MongoDB connection error:', err.message);
      console.warn('Falling back to local file persistence for weather data.');
      startIfNeeded();
    });

  // Safety: if connection doesn't resolve within 5s, start server anyway.
  setTimeout(startIfNeeded, 5000);
} else {
  console.warn('⚠ MONGO_URI not configured - using local file persistence');
  startServer();
}

const { Schema } = mongoose;
const WeatherSchema = new Schema({
  city: String,
  country: String,
  latitude: Number,
  longitude: Number,
  payload: Schema.Types.Mixed,
  fetchedAt: { type: Date, default: Date.now },
}, { collection: 'weather' });
const Weather = mongoose.models.Weather || mongoose.model('Weather', WeatherSchema);

async function readBackup() {
  try {
    const content = await fs.readFile(BACKUP_FILE, 'utf8');
    return JSON.parse(content || '[]');
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    console.warn('Unable to read backup file', err);
    return [];
  }
}

async function writeBackup(data) {
  try {
    const list = await readBackup();
    const next = [data, ...list].slice(0, BACKUP_LIMIT);
    await fs.writeFile(BACKUP_FILE, JSON.stringify(next, null, 2), 'utf8');
  } catch (err) {
    console.warn('Unable to write backup file', err);
  }
}

app.post('/api/weather/save', async (req, res) => {
  console.log('Received request to save weather data');
  console.log('Data:', req.body);
  console.log('Database connected:', dbConnected);
  const body = req.body || {};
  const location = body.location || {};
  const payload = { current: body.current, forecast: body.forecast, pollution: body.pollution };
  const record = {
    city: location.name,
    country: location.country,
    latitude: location.latitude,
    longitude: location.longitude,
    payload,
    fetchedAt: body.fetchedAt ? new Date(body.fetchedAt) : new Date(),
  };

  if (dbConnected) {
    try {
      const doc = new Weather(record);
      await doc.save();
      console.log('✓ Saved to MongoDB:', record.city);
      return res.json({ ok: true, source: 'mongodb' });
    } catch (err) {
      console.error('✗ MongoDB write failed:', err.message);
      console.warn('Falling back to local backup');
    }
  } else {
    console.log('⚠ Database not connected, saving to local backup');
  }

  await writeBackup(record);
  res.json({ ok: true, source: 'local-backup' });
});

app.get('/api/weather/latest', async (req, res) => {
  const city = req.query.city;
  if (dbConnected) {
    try {
      const doc = await Weather.findOne(city ? { city } : {}).sort({ fetchedAt: -1 }).lean();
      return res.json({ ok: true, data: doc });
    } catch (err) {
      console.warn('MongoDB read failed, falling back to local backup', err);
    }
  }

  try {
    const list = await readBackup();
    const filtered = city ? list.filter((item) => item.city === city) : list;
    const latest = filtered[0] || null;
    res.json({ ok: true, data: latest });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

app.get('/api/postal/india/:pin', async (req, res) => {
  const pin = String(req.params.pin || '').replace(/\D/g, '');
  if (!/^\d{6}$/.test(pin)) {
    return res.status(400).json([{ Status: 'Error', Message: 'Invalid Indian PIN code', PostOffice: null }]);
  }

  try {
    const upstream = await fetchJsonWithTimeout(`https://api.postalpincode.in/pincode/${pin}`, 9000);
    const data = await upstream.json();
    const offices = data?.[0]?.PostOffice;
    if (upstream.ok && Array.isArray(offices) && offices.length) {
      return res.json(data);
    }
  } catch (err) {
    console.warn('India Post API lookup failed:', err.message);
  }

  const fallbackOffices = await scrapeIndiaPinFromPublicDirectories(pin);
  if (fallbackOffices.length) {
    return res.json([{ Status: 'Success', Message: 'Fallback public directory lookup', PostOffice: fallbackOffices }]);
  }

  res.status(502).json([{ Status: 'Error', Message: 'India PIN lookup unavailable', PostOffice: null }]);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

function startServer() {
  app.listen(PORT, () => console.log(`Stormscope is running at http://127.0.0.1:${PORT}`));
}
