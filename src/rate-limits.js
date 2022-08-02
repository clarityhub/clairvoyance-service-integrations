const RateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('service-claire/services/redis');

const limiter = new RateLimit({
  windowMs: /* 10 second */ 10000,
  max: 50, // 50 requests per 10 seconds
  delayMs: 0,
  store: new RedisStore({
    expiry: /* 10 seconds */ 10,
    client: redis,
    prefix: 'rl-integrations:',
  }),
});

const unlimited = new RateLimit({
  windowMs: /* 10 second */ 10000,
  max: 1000, // 1000 requests per 10 seconds
  delayMs: 0,
  store: new RedisStore({
    expiry: /* 10 seconds */ 10,
    client: redis,
    prefix: 'rl-integrations-unlimited:',
  }),
});


module.exports = limiter;
module.exports.unlimited = unlimited;
