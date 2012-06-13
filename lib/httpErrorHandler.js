var util = require('util')
  ;

var NotFound = module.exports.NotFound = function(message) {
  this.name = 'NotFound';
  this.statusCode = 404;
  this.page = 'pages/error/404';
  Error.call(this, message);
  Error.captureStackTrace(this, arguments.callee);
};

var Forbidden = module.exports.Forbidden = function(message) {
  this.name = 'Forbidden';
  this.statusCode = 403;
  this.page = 'pages/error/403';
  Error.call(this, message);
  Error.captureStackTrace(this, arguments.callee);
};

util.inherits(Forbidden, Error);
util.inherits(NotFound, Error);

module.exports.errorHandler = function(serviceLocator, pageTitle) {

  function only(keys, object) {
    var returnObject = {};
    keys.forEach(function(key) {
      returnObject[key] = object[key];
    });
    return returnObject;
  }

  return function(error, req, res, next) {

    if (typeof error.statusCode === 'undefined') {
      error.page = 'pages/error/500';
      error.statusCode = 500;
      serviceLocator.logger.error('Unexpected Exception', {
        stack: error.stack, req: only(['url', 'method', 'body', 'session'], req) });
    }

    //TODO: Adding JSON accepts handle
    res.render(error.page,
      { status: error.statusCode
      , page:
        { title: pageTitle
        }
      }
    );
  };
};
