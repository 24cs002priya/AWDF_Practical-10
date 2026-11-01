const router = require('express').Router();
const mongoose = require('mongoose');
const Car = require('../models/Car');
const wrap = require('../utils/wrap');
const { auth } = require('../middleware/auth');
const cache = require('../utils/cache');
const events = require('../events/events');
require('../events/listeners');
const validId = (req, res, next) => mongoose.isValidObjectId(req.params.id) ? next() : res.status(400).json({ error: 'Invalid car ID' });
const jsonOnly = (req, res, next) => req.is('application/json') ? next() : res.status(415).json({ error: 'Content-Type must be application/json' });
const valid = (req, res, next) => {
    if (typeof req.body.title !== 'string' || !req.body.title.trim() || !Number.isFinite(Number(req.body.price)) || Number(req.body.price) <= 0)
        return res.status(400).json({ error: 'Title and positive price required' });
    next();
};
const input = b => ({ title: b.title, brand: b.brand, description: b.description, price: b.price, year: b.year, priority: b.priority });
router.get('/', wrap(async (req, res) => {
    const key = req.user ? `cars:${req.user.id}` : 'cars:public';
    const value = cache.cache.get(key);
    if (value !== undefined) {
        cache.stats.hits++;
        res.set('X-Cache', 'HIT');
        return res.json(value);
    }
    cache.stats.misses++;
    const cars = await Car.find().sort({ createdAt: -1 });
    cache.cache.set(key, cars);
    res.set('X-Cache', 'MISS');
    res.json(cars);
}));
router.get('/cache/stats', (req, res) => res.json(cache.stats));
router.get('/:id', validId, wrap(async (req, res) => {
    const key = `car:${req.params.id}`;
    const cached = cache.cache.get(key);
    if (cached !== undefined) {
        cache.stats.hits++;
        res.set('X-Cache', 'HIT');
        return res.json(cached);
    }
    cache.stats.misses++;
    const car = await Car.findById(req.params.id);
    if (!car)
        return res.status(404).json({ error: 'Car not found' });
    cache.cache.set(key, car);
    res.set('X-Cache', 'MISS');
    res.json(car);
}));
router.post('/', auth, jsonOnly, valid, wrap(async (req, res) => { const car = await Car.create({ ...input(req.body), owner: req.user.id }); cache.cache.flushAll(); res.status(201).json(car); console.log('[API] Response sent at', new Date().toISOString()); events.emit('car-created', car); }));
router.put('/:id', auth, validId, jsonOnly, valid, wrap(async (req, res) => {
    const car = await Car.findById(req.params.id);
    if (!car)
        return res.status(404).json({ error: 'Car not found' });
    if (String(car.owner) !== String(req.user.id) && req.user.role !== 'admin')
        return res.status(403).json({ error: 'Only the owner can modify this listing' });
    Object.assign(car, input(req.body));
    await car.save();
    cache.cache.flushAll();
    res.json(car);
}));
router.delete('/:id', auth, validId, wrap(async (req, res) => {
    const car = await Car.findById(req.params.id);
    if (!car)
        return res.status(404).json({ error: 'Car not found' });
    if (String(car.owner) !== String(req.user.id) && req.user.role !== 'admin')
        return res.status(403).json({ error: 'Only the owner can modify this listing' });
    await car.deleteOne();
    cache.cache.flushAll();
    res.json({ success: true });
    events.emit('car-deleted', car);
}));
module.exports = router;
