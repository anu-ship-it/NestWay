# NestWay Backend API v2

## Quick Start (local, no database needed)
```bash
npm install && cp .env.example .env && npm run dev
# http://localhost:5000
```

## Structure
```
src/
├── index.js          ← Entry point
├── config/db.js      ← MongoDB (graceful fallback to mock)
├── models/City.js    ← Mongoose schema
├── services/cityService.js  ← All data access (DB or mock)
├── middleware/       ← Logger, errorHandler, JWT auth
├── data/mockData.js  ← Chandigarh seed data
└── routes/           ← city, weather, travel, stay, compare, admin
```

## Key Endpoints
```
GET  /api/city/:city?mode=student|tourist  ← frontend uses this
GET  /api/compare?cities=a,b&mode=student
POST /api/admin/token   ← get admin JWT
POST /api/admin/seed    ← import mock data into MongoDB [auth]
```

See DEPLOY.md for full deployment guide.
