const NodeCache = require("node-cache");

// Cache expires in 30 seconds for the Week 14 lab challenge.
const cache = new NodeCache({ stdTTL: 30, checkperiod: 60 });

module.exports = cache;
