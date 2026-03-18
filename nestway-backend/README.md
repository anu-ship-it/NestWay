# NestWay Backend API

> "One search. Every answer. Any city."

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create your .env file
cp .env.example .env
# Open .env and set USE_MOCK_DATA=true for now

# 3. Run in development mode (auto-restarts on save)
npm run dev

# Server starts at http://localhost:5000
```

---

## Project Structure

```
nestway-backend/
├── src/
│   ├── index.js              ← Entry point, server setup
│   ├── middleware/
│   │   └── index.js          ← Logger, error handler, asyncHandler
│   ├── data/
│   │   └── mockData.js       ← All city data (add new cities here)
│   └── routes/
│       ├── city.js           ← Master summary route (use this in frontend)
│       ├── weather.js        ← Weather + best time to visit
│       ├── travel.js         ← Train / bus / cab / flight fares
│       └── stay.js           ← Hotels, PG listings, student budget
├── .env.example              ← Copy to .env and fill in keys
└── package.json
```

---

## All API Endpoints

### Health check
```
GET http://localhost:5000/
```

---

### City (Master endpoint — use this in your frontend)
```
GET /api/city
→ List all available cities

GET /api/city/chandigarh
→ Full data for Chandigarh (all modes)

GET /api/city/chandigarh?mode=student
→ Student view: PG listings, budget, travel, weather

GET /api/city/chandigarh?mode=tourist
→ Tourist view: hotels, travel, weather
```

---

### Weather
```
GET /api/weather/chandigarh
→ Current weather + best months to visit + seasonal tip
```

---

### Travel Fares
```
GET /api/travel/chandigarh
→ All travel routes TO Chandigarh + local transport

GET /api/travel/chandigarh/from/delhi
→ Trains, buses, cabs, flights from Delhi to Chandigarh

GET /api/travel/chandigarh/local
→ Auto, bus, Ola/Uber fares within Chandigarh
```

---

### Stay
```
GET /api/stay/chandigarh/hotels
→ All hotels

GET /api/stay/chandigarh/hotels?type=budget
→ Filter by type: budget | mid-range | luxury | hostel

GET /api/stay/chandigarh/hotels?stars=3
→ Filter by star rating

GET /api/stay/chandigarh/pg
→ All PG and flat listings

GET /api/stay/chandigarh/pg?gender=girls
→ Filter by gender: girls | boys | any

GET /api/stay/chandigarh/pg?verified=true
→ Only verified listings

GET /api/stay/chandigarh/pg?area=sector 14
→ Filter by area name

GET /api/stay/chandigarh/budget
→ Monthly student cost breakdown (rent + food + transport)
```

---

## Adding a New City

Open `src/data/mockData.js` and copy the `chandigarh` block.
Change the key and fill in the new city's data. That's it — all routes automatically work for the new city.

```js
const cities = {
  chandigarh: { ... },  // already exists
  pune: {               // new city
    name: "Pune",
    state: "Maharashtra",
    weather: { ... },
    travel: { ... },
    hotels: [ ... ],
    pg_and_rent: { ... },
    food: { ... },
  }
};
```

---

## Switching from Mock Data to Real APIs

1. Set `USE_MOCK_DATA=false` in your `.env`
2. Add your API keys to `.env`
3. Each route file has a `// REAL API PATH` comment block — fill in the API call there
4. The response shape stays the same so your frontend doesn't need to change

---

## Tech Stack

| Layer | Tool |
|-------|------|
| Runtime | Node.js v20 |
| Framework | Express.js |
| HTTP client | Axios |
| Environment | dotenv |
| Dev server | Nodemon |
| Weather API | OpenWeatherMap (free tier) |
| Train / flight | RapidAPI |
| Database (next step) | MongoDB Atlas |
