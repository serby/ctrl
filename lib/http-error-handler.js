// Exports
module.exports = errorHandler
errorHandler.NotFound = NotFound

var http = require('http')

/*
 * Create error handling middleware
 */
function errorHandler(serviceLocator) {

  return function(err, req, res, next) {

    if (typeof err.statusCode === 'undefined') {
      err.statusCode = 500
      // This prevents specific error info
      // from leaking to the http client
      err.message = 'Internal Server Error'
      serviceLocator.logger.error('Unexpected Exception', {
        stack: err.stack, req: only(['url', 'method', 'body', 'session'], req) })
    }

    if (!serviceLocator.errorPage) {

      // No error page defined
      // so send plain text http error
      res.status(err.code)
      res.setHeader('content-type', 'text/plain')
      res.end(http.STATUS_CODES[err.statusCode] + '\n')

    } else {

      if (err.statusCode && err.message) {
        res
          .status(err.code)
          .render(serviceLocator.errorPage,
            { status: err.statusCode
            , message: err.message })
      } else {
        res
          .status(500)
          .render(serviceLocator.errorPage,
            { status: 500
            , message: 'Internal server Error' })
      }

      if (err.stack) {
        serviceLocator.logger.error(err.stack)
      } else {
        serviceLocator.logger.error(err)
      }

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

/*
 * Helper to retrieve only certain
 * properties of an object
 */
function only(keys, object) {
  var returnObject = {}
  keys.forEach(function(key) {
    returnObject[key] = object[key]
  })
  return returnObject
}