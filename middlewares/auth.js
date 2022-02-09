const admin = require('../firebase');

exports.authCheck = async (req, res, next) => {
    try {
        req.user = await admin
            .auth()
            .verifyIdToken(req.headers.authtoken)
        await next();
    } catch (err) {
        await res.status(401).json({
            err: 'Invalid or expired token',
        });
    }
};
