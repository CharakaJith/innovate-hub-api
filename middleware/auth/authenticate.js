const jwt = require('jsonwebtoken');
const logger = require('../logger/logger');
const { LOG_TYPE } = require('../../enum/log');

const authenticate = async (req, res, next) => {
    try {
        const unAuthPaths = [
            '/api/admin',
            '/api/user/login'
        ];

        if (unAuthPaths.includes(req.path)) {
            next();
        } else {
            const token = req.headers.authorization;
            
            const decode = jwt.verify(JSON.parse(token), process.env.JWT_SECRET);
            req.user = decode.tokenUser;

            next();
        }
    } catch (error) {
        res.status(401).json({
            success: false,
            error: 'Authentication failed!'
        });

        logger(LOG_TYPE.ERROR, false, 401, `${error.message}`, req);
    }
};

module.exports = authenticate;