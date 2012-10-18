module.exports = createLogger

var winston = require('winston')
  , Loggly = require('winston-loggly').Loggly

// Free advice: Log everything!

// Define how you want your application to log. By default everything will be
// shown sent to stdout and everything above a warn will be set to loggly. You
// should set this up on a per application bases.

function createLogger (properties) {

  var consoleTransport = new winston.transports.Console({ level: 'silly', timestamp: true, colorize: true })
    , logglyTransport = new winston.transports.Loggly(
        { level: 'warn'
        , timestamp: true
        , subdomain: 'clock'
        , json: true
        , inputToken: 'GET THIS FROM LOGGLY'
        })
    , transports = [consoleTransport, logglyTransport]
    , logger

  // Only log to console in development
  if (properties === undefined || properties.env === 'development') {
    transports = [consoleTransport]
  }

  logger = new winston.Logger({ transports: transports })

  logger.exitOnError = false

  return logger
}