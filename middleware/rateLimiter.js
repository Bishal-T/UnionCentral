const rateLimit = require('express-rate-limit');

exports.loginLimiter = rateLimit({
    windowMs: 60*1000, //1 minute
    max: 5,
    handler: (req, res, next) => {
        let err = new Error('Too many login attempts. Please try again later');
        err.status = 429;
        return next(err);
    }
})