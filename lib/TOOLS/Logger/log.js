let exp =  module.exports;

const winston = require('winston');

const logConfiguration = {
    'transports' : [
        new winston.transports.File({
            filename: './logs/altas.log'
        })
    ]
};

const logger = winston.createLogger(logConfiguration);

exp.logger = logger;