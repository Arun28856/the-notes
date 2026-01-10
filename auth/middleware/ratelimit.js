import { rateLimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';


const rateLimit = require('@upstash/ratelimit');
const { Redis } = require('@upstash/redis');

//API rate limiter
const apiRateLimit = new rateLimit({
    redis: Redis,
    limiter: rateLimit.fixedWindow(100, '15m'),
    analytics: true,
    prefix: 'ratelimit:api',
});

//limiter for auth endpoints
const authRateLimit = new rateLimit({
    redis: Redis,
    limiter: rateLimit.fixedWindow(5, '15m'),
    analytics: true,
    prefix: 'ratelimit:auth',
});

//limiter for otp
const otpRateLimit = new rateLimit({
    redis: Redis,
    limiter: rateLimit.fixedWindow(2, '1 m'),
    analytics: true,
    prefix: 'ratelimit:otp',
});

//limiter for password reset
const passwordResetRateLimit = new rateLimit({
    redis: Redis,
    limiter: rateLimit.fixedWindow(3, '1 h'),
    analytics: true,
    prefix: 'ratelimit:password-reset',
});

//limter for failed login attempts
const failedLoginRateLimit = new rateLimit({
    redis: Redis,
    limiter: rateLimit.fixedWindow(3, '1 h'),
    analytics: true,
    prefix: 'ratelimit:failed-login',
});

//middleware functions
const createRateLimiter = (rateLimit, identifier ='ip') => {
    return async (req, res, next) => {
        try {
            //Get identifier
            let id;
            if (identifier === 'ip') {
                id = req.ip || req.connection.remoteAddress;
            } else if (identifier === 'user') {
                id = req.user?._id.toString();
            } else if (identifier === 'email') {
                id = req.body.email || req.ip;
            }

            //Check rate limit
            const { success, limit, reset, remaining } = await rateLimit.limit(id);

            //Set rate limit headers
            res.setHeader('X-RateLimit-Limit', limit);
            res.setHeader('X-RateLimit-Remaining', remaining);
            res.setHeader('X-RateLimit-Reset', reset);

            if (!success) {
                const retryAfter = Math.ceil((reset - Date.now()) / 1000);
                res.setHeader('Retry-After', retryAfter);

                return res.status(429).json({ 
                    error: 'Too many requests. Please try again later.',
                    retryAfter: retryAfter,
                    resetAt: new Date(reset).toISOString()
                });
            }

            next();

        } catch (error) {
            console.error('Rate limiting error:', error);
            res.status(500).json({ error: 'Internal server error' });
            next();
        }
}
};

module.exports = {
    apiRateLimiter: createRateLimiter(apiRateLimit, 'ip'),
    authRateLimiter: createRateLimiter(authRateLimit, 'email'),
    otpRateLimiter: createRateLimiter(otpRateLimit, 'email'),
    passwordResetRateLimiter: createRateLimiter(passwordResetRateLimit, 'email'),
    failedLoginRateLimiter: createRateLimiter(failedLoginRateLimit, 'ip'),

    
    customLimiter: (requests, window, prefix) => {
        const customRatelimit = new rateLimit({
          redis: Redis,
          limiter: rateLimit.slidingWindow(requests, window),
          analytics: true,
          prefix: prefix || 'ratelimit:custom',
        });
        return createRateLimiter(customRatelimit, 'ip');
    }
};