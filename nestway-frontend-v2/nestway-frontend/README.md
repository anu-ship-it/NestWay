# NestWay Frontend

## Quick Start

```bash
npm install
npm start
# Opens at http://localhost:3000
```

## Project Structure

```
src/
├── App.jsx                    ← Router (Home → /results/:city)
├── index.js                   ← Entry point
├── styles/
│   └── global.css             ← Design system, variables, animations
├── hooks/
│   └── useCityData.js         ← Fetches from backend, falls back to mock data
├── pages/
│   ├── Home.jsx / Home.css    ← Landing page with search + mode toggle
│   └── Results.jsx / Results.css  ← City results page
└── components/
    ├── WeatherCard.jsx        ← Weather + best months to visit
    ├── TravelCard.jsx         ← Train/bus/cab/flight fares
    ├── StayCard.jsx           ← Hotels (tourist) or PG listings (student)
    ├── BudgetCard.jsx         ← Monthly budget breakdown (student only)
    └── Cards.css              ← Shared card styles
```

## Connect to Backend

Create a `.env` file in this folder:

```
REACT_APP_API_URL=http://localhost:5000
```

If the backend is offline, the app automatically uses built-in mock data for Chandigarh so you always have a working demo.

## Adding a New City

1. Add the city data to `nestway-backend/src/data/mockData.js`
2. Also add a fallback entry in `src/hooks/useCityData.js` (the `FALLBACK` object) for offline mode

## User Flow

1. Home page → choose Student or Tourist mode
2. Type a city name → click Search
3. Results page shows: Weather · Travel fares · PG/Hotels · Budget
4. Can switch modes without re-searching
5. Can search a new city from the results page header
