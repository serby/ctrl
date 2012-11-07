// Exports
module.exports = errorHandler
errorHandler.NotFound = NotFound

var http = require('http')

/*
 * Create error handling middleware
 */
function errorHandler(serviceLocator) {

  return function(err, req, res, next) {

    // Unless the error is a 404, log it
    if (err.statusCode !== 404) {
      serviceLocator.logger.error(err.stack || err)
    }

    if (typeof err.statusCode === 'undefined') {
      err.statusCode = 500
      // Mask specific error from the http client
      // (The error message has already been logged)
      err.message = 'Internal Server Error'
    }

    if (!serviceLocator.errorPage) {

      // No error page defined
      // so send plain text http error
      res
        .status(err.code)
        .setHeader('content-type', 'text/plain')
        .end(http.STATUS_CODES[err.statusCode] + '\n')

    } else {

      res
        .status(err.statusCode)
        .render(serviceLocator.errorPage,
          { status: err.statusCode || 500
          , message: err.message || 'Internal Server Error'
          })

    }
  }
}

/*
 * Constructor for 404s
 */
function NotFound() {
  Error.call(this)
  Error.captureStackTrace(this, arguments.callee)
  this.statusCode = 404
  this.message = 'Not Found'
}

NotFound.prototype = new Error()