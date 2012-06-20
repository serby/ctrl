var _ = require('underscore')
  , express = require('express')
  , fs = require('fs')
  , path = require('path')
  , stylus = require('stylus')
  , nib = require('nib')
  , cluster = require('cluster')
  , MongoStore = require('connect-mongodb')
  , httpErrorHandler = require('./httpErrorHandler')
  , expressValidator = require('express-validator')
  , sessionStore
  ;

module.exports.createApplication = function(properties, serviceLocator, databaseAdaptor) {

  var app = express.createServer();

  function staticGzip(path, options) {
    var defaultOptions = 
    { maxAge: 1728000000
    , clientMaxAge: 1728000000
    };

    _.extend(defaultOptions, options);

    return require('gzippo').staticGzip(path, defaultOptions);
  }

  function stylusCompile(str, path) {
    return stylus(str)
      .use(nib())
      .set('filename', path)
      .set('warn', true)
      .set('compress', true)
      .define('versionPath', function(urlPath) {
        return new stylus.nodes.Literal('url(' + serviceLocator.versionator.versionPath(urlPath) + ')');
      });
  }

  // First the environment specific configuration

  // Setup verbose error reporting on development
  app.configure('development', function() {
    app.error(httpErrorHandler.errorHandler(serviceLocator, properties.pageTitle));
  });

  app.configure('testing', function() {
    app.error(httpErrorHandler.errorHandler(serviceLocator, properties.pageTitle));
  });

  app.configure('production', 'errors', 'staging', function() {
    //var logStream  = fs.createWriteStream(properties.logPath + '/http.log', { flags: 'a', encoding: null, mode: '0666' });
    //console.info('Writing http logs to: %s', properties.logPath + '/http.log');
    app
      .error(httpErrorHandler.errorHandler(serviceLocator, properties.pageTitle));
      //.use(express.logger({ stream : logStream }));
  });

  // Then the more general config
  app.configure(function() {

    app
      .helpers({ versionPath: serviceLocator.versionator.versionPath })
      .use(serviceLocator.versionator.middleware)
      .use(stylus.middleware(
        { src: __dirname + '/../public/'
        , compile: stylusCompile
        }
      ))
      .use(staticGzip(__dirname + '/../public'))
      .use(staticGzip(properties.dataPath, { prefix: '/binary' }));

    // Add any public folders from the bundles
    serviceLocator.bundled.forEach('publicRoute', function(publicRoute, bundle) {
      var bundlePath = path.normalize(bundle.path);
      publicRoute = path.normalize(publicRoute);

      serviceLocator.logger.verbose('Adding public folder from: ' + bundle.name +
        ' path: ' + bundlePath + '/public - route: ' + publicRoute);

      app
        .use(staticGzip(bundlePath + '/public', { prefix: publicRoute }));
    });

    app
      .set('view engine', 'jade')
      .set('view options', { layout: false })
      .use(express.bodyParser())
      .use(expressValidator)
      .use(express.cookieParser())
      .use(express.methodOverride())
      .use(express.session(
        { secret: 'your secret here'
        , store: new MongoStore({ db: databaseAdaptor.db })
        }
      ));

    // Middleware
    serviceLocator.bundled.forEach('middleware', function(middleware, bundle) {
      app.use(middleware(serviceLocator));
    });

    app
      .set('views', __dirname + '/../views')
      .use(app.router)
      .use(function(req, res, next) {
        throw new httpErrorHandler.NotFound('404', req);
      });

  });

  app.start =  function() {

    app.listen(properties.port);

    serviceLocator.logger.info(properties.name + ' app starting in ' + app.settings.env + ' mode at ' + properties.siteUrl +
      ' (pid: ' + process.pid +
        //(cluster.isMaster ? ', master' : '') +
      ')');

  };

  return app;
};