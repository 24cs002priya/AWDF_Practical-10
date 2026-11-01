const app = require('./app');
const port = Number(process.env.PORT) || 5000;
const mongoose = require('mongoose');
if (!process.env.MONGO_URI)
    throw new Error('Set MONGO_URI in backend/.env');
mongoose.connect(process.env.MONGO_URI).then(() => { console.log('MongoDB connected'); app.listen(port, () => console.log(`nexTrip API on ${port}`)); }).catch(e => { console.error('MongoDB connection failed:', e.message); process.exit(1); });
