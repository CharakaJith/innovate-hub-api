const loggerIndex = require('./index');
const { LOG_TYPE }= require('../../enum/log');

const logger = (logType, resStatus, statusCode, message, req = {}, stack) => {
    const logBody = {
        logType: logType,
        endpoint: req.originalUrl || 'N/A', 
        request: {
            request: `${req.protocol || 'http'}://${req.get ? req.get('host') : 'localhost'}${req.originalUrl || ''}`,
            method: req.method || 'N/A', 
            body: req.body || {}, 
        },
        response: {
            success: resStatus,
            statusCode: statusCode,
            message: {
                message,
            },
            ...(stack && {
                stack: stack,
            })
        },
    };

    const logString = JSON.stringify(logBody).split('\n');

    if (logType === LOG_TYPE.INFO) {
        loggerIndex.info(logString);
    } else if (logType === LOG_TYPE.DEBUG) {
        loggerIndex.debug(logString);
    } else {
        loggerIndex.error(logString);
    }
};

module.exports = logger;
