var winston = require('winston')
  ;

module.exports = function createLogger (properties) {

  var consoleTransport = new winston.transports.Console({ level: 'silly', timestamp: true, colorize: true })
    , logglyTransport = new winston.transports.Loggly({ level: 'warn', timestamp: true, subdomain: 'clock', json: true
    , inputToken: 'GET THIS FROM LOGGLY' })
    , transports = [consoleTransport, logglyTransport]
    , logger;

  // Only log to console in development
  if (properties.env === 'development') {
    transports = [consoleTransport];
  }


  logger = new winston.Logger(
  { transports: transports
  });

  //winston.handleExceptions([consoleTransport, logglyTransport]);

  logger.exitOnError = false;

  return logger;
};