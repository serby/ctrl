var
  util = require('util');

var NotFound = module.exports.NotFound = function(message) {
  this.name = 'NotFound';
  Error.call(this, message);
  Error.captureStackTrace(this, arguments.callee);
};

var Forbidden = module.exports.Forbidden = function(message) {
  this.name = 'Forbidden';
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
    var page
      , statusCode
      ;

    switch(error.name) {
      case 'NotFound':
        page = 'pages/error/404';
        statusCode = 404;
        break;
      case 'Forbidden':
        page = 'pages/error/403';
        statusCode = 403;
        break;
      default:
        page = 'pages/error/500';
        statusCode = 500;
        serviceLocator.logger.error('Unexpected Exception', {
          stack: error.stack, req: only(['url', 'method', 'body', 'session'], req) });
    }

    //TODO: Adding JSON accepts handle
    res.render(page, {
      status: statusCode
    , page: {
        title: pageTitle
      }
    });
  };
};
