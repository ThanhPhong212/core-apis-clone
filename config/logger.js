const winston = require('winston');

const consoleConfig = [
    new winston.transports.Console({
        'colorize': true
    })
];

const loggerSuccess = winston.createLogger({
    transports: consoleConfig
});

const loggerError = winston.createLogger({
    transports: consoleConfig
});

//
// Replaces the previous transports with those in the
// new configuration wholesale.
//
const DailyRotateFile = require('winston-daily-rotate-file');


const errorLogger = loggerError;
errorLogger.configure({
    level: 'error',
    format: winston.format.json(),
    transports: [
        new DailyRotateFile({
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            dirname: 'logs',
            maxFiles: '2d' // Time to delete file
        })
    ]
});

const successLogger = loggerSuccess;
successLogger.configure({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new DailyRotateFile({
            filename: 'logs/success-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            dirname: 'logs',
            maxFiles: '2d' // Time to delete file
        })
    ]
});


module.exports = {
    errorLogger,
    successLogger
};