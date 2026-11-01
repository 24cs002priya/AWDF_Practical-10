const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 60 });
const stats = { hits: 0, misses: 0 };
module.exports = { cache, stats };
