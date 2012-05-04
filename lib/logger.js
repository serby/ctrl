var
  winston = require('winston');

  //consoleTransport = new winston.transports.Console({ level: 'verbose', timestamp: function() { return new Date(); }, colorize: true });

module.exports.createLogger = function(properties) {

  var
    consoleTransport = new winston.transports.Console({ level: 'silly', timestamp: true, colorize: true }),
    logglyTransport = new winston.transports.Loggly({ level: 'warn', timestamp: true, subdomain: 'clock', json: true,
      inputToken: '30b09da0-953d-4c81-ad75-171ff2cb2c22' }),

    logger = new winston.Logger({
      transports: [consoleTransport, logglyTransport]
    });

  //winston.handleExceptions([consoleTransport, logglyTransport]);

  logger.exitOnError = false;

  return logger;
};