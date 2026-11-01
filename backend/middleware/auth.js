const jwt = require('jsonwebtoken');
function auth(req, res, next) {
    const match = /^Bearer (.+)$/.exec(req.headers.authorization || '');
    if (!match)
        return res.status(401).json({ error: 'Missing bearer token' });
    try {
        req.user = jwt.verify(match[1], process.env.JWT_SECRET);
        next();
    }
    catch {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}
module.exports = { auth };
