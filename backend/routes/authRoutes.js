const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const wrap = require('../utils/wrap');
const clean = u => ({ _id: u._id, name: u.name, email: u.email, role: u.role });
router.post('/register', wrap(async (req, res) => {
    const { name, email, password, role } = req.body;
    if (typeof name !== 'string' || !name.trim() || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email) || typeof password !== 'string' || password.length < 8)
        return res.status(400).json({ error: 'Valid name, email and password (8+ characters) required' });
    if (await User.exists({ email: email.toLowerCase().trim() }))
        return res.status(409).json({ error: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name: name.trim(), email: email.toLowerCase().trim(), password: hash, role: role === 'dealer' ? 'dealer' : 'buyer' });
    res.status(201).json({ user: clean(user) });
}));
router.post('/login', wrap(async (req, res) => {
    const user = await User.findOne({ email: String(req.body.email || '').toLowerCase().trim() }).select('+password');
    if (!user || !await bcrypt.compare(String(req.body.password || ''), user.password))
        return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: clean(user) });
}));
router.get('/me', auth, wrap(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user)
        return res.status(401).json({ error: 'User not found' });
    res.json(clean(user));
}));
module.exports = router;
