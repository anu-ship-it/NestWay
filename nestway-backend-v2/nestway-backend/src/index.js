require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const { connectDB }                   = require('./config/db');
const { requestLogger, errorHandler } = require('./middleware');

const cityRoutes    = require('./routes/city');
const weatherRoutes = require('./routes/weather');
const travelRoutes  = require('./routes/travel');
const stayRoutes    = require('./routes/stay');
const adminRoutes   = require('./routes/admin');
const compareRoutes = require('./routes/compare');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get('/', (req, res) => {
  const { isDBConnected } = require('./config/db');
  res.json({ app: 'NestWay API', version: '2.0.0', status: 'running', db_connected: isDBConnected() });
});

app.use('/api/city',    cityRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/travel',  travelRoutes);
app.use('/api/stay',    stayRoutes);
app.use('/api/compare', compareRoutes);
app.use('/api/admin',   adminRoutes);

app.use((req, res) => res.status(404).json({ success: false, error: `${req.method} ${req.originalUrl} not found.` }));
app.use(errorHandler);

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    const { isDBConnected } = require('./config/db');
    console.log(`\n  NestWay API v2 — http://localhost:${PORT}\n  DB: ${isDBConnected() ? 'MongoDB ✓' : 'Mock data mode'}\n`);
  });
};

start();
