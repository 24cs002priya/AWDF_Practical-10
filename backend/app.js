require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());
app.use((req, res, next) => { console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`); next(); });
app.get('/api/health', (req, res) => res.json({ success: true, app: 'nexTrip', status: 'ok' }));
if (!process.env.JWT_SECRET)
    throw new Error('Set JWT_SECRET in backend/.env');
app.use('/', require('./routes/authRoutes'));
app.use('/cars', require('./routes/carRoutes'));
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((err, req, res, next) => {
    console.error(err);
    if (err.name === 'ValidationError')
        return res.status(400).json({ error: 'Validation failed', details: Object.values(err.errors).map(e => e.message) });
    if (err.name === 'CastError')
        return res.status(400).json({ error: 'Invalid identifier' });
    if (err.code === 11000)
        return res.status(409).json({ error: 'Email already registered' });
    res.status(err.status || 500).json({ error: err.status ? err.message : 'Something went wrong' });
});
module.exports = app;
