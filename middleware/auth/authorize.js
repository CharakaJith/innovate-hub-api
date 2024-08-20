const jwt = require('jsonwebtoken');
const logger = require('../logger/logger');
const { LOG_TYPE } = require('../../enum/log');

const authorize = (...allowedRoles) => {
    checkRole = async (req, res, next) => {
        try {
            const userRole = req.user.role;
            
            if (!allowedRoles.includes(userRole)) {
                throw new Error(`Forbidden request by user ${req.user.id} | ${req.user.email}!`);
            }

            next();            
        } catch (error) {
            res.status(403).json({
                success: false,
                error: 'Forbidden request!',
            });

            logger(LOG_TYPE.ERROR, false, 403, `${error.message}`, req);
        }
    }
    
    return checkRole;
};

module.exports = authorize;