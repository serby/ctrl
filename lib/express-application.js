var _ = require('lodash')
  , express = require('express')
  , fs = require('fs')
  , path = require('path')
  , stylus = require('stylus')
  , nib = require('nib')
  , MongoStore = require('connect-mongodb')
  , expressValidator = require('express-validator')
  , st = require('st')
  ;

module.exports = function createApplication(serviceLocator, databaseAdaptor) {

  var app = express()
    , properties = serviceLocator.properties
    ;


  app.configure(function() {
  // Register a global viewRender function. This will be able to take the view
  // path.
  serviceLocator.register('viewRender', require('./view-render'));

  serviceLocator.register('stylusWatch', require('./stylus-watch/watch'));

  serviceLocator.register('stylusCompile', function stylusCompile(str, path) {
    return stylus(str)
      .use(nib({ logger: serviceLocator.logger }))
      .set('filename', path)
      .set('warn', true)
      .set('compress', true)
      .define('versionPath', function(urlPath) {
        return new stylus.nodes.Literal('url(' + serviceLocator.versionator.versionPath(urlPath) + ')');
      });
  });

  // Register
  serviceLocator.register('httpErrorHandler', require('./http-error-handler'));

  // Define the static gzip middleware
  function staticGzip(path, options) {
    var defaultOptions =
    { maxAge: 1728000000
    , clientMaxAge: 1728000000
    };

    _.extend(defaultOptions, options);

    return require('gzippo').staticGzip(path, defaultOptions);
  }

  // Environment specific configurations


  // General middleware stack
  app
    .locals({ versionPath: serviceLocator.versionator.versionPath });


  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  //app.engine('jade', require('jade').__express);

  app
    .use(express.bodyParser())
    .use(expressValidator)
    .use(express.cookieParser())
    .use(express.logger('dev'))
    .use(express.methodOverride())
    .use(express.session(
      { secret: 'your secret here'
      , store: new MongoStore({ db: databaseAdaptor.db })
      }
    ));

  app
    .use(function(req, res, next) {
      res.locals.session = req.session;

      res.locals.includes = {
        bodyStart: res.bodyStart || []
      };
      next();
    });

  // Middleware
  serviceLocator.bundled.forEach('middleware', function(middleware, bundle) {
    app.use(middleware(serviceLocator));
  });

  app.use(app.router);

  app.use(serviceLocator.versionator.middleware)
    //.use(staticGzip(__dirname + '/../public'))
    //.use(staticGzip(properties.dataPath, { prefix: '/binary' }))
    ;

  // Add any public folders from the bundles
  serviceLocator.bundled.forEach('publicRoute', function(publicRoute, bundle) {
    var bundlePath = path.normalize(bundle.path);
    publicRoute = path.normalize(publicRoute);

    serviceLocator.logger.verbose('Adding public folder from: ' + bundle.name +
      ' path: ' + bundlePath + '/public - route: ' + publicRoute);

    //app
    //app.use(staticGzip(bundlePath + '/public', { prefix: publicRoute }));
    //app.use(st({ path: bundlePath + '/public', url: '/static/' + publicRoute }));

  });

  app.use(function errorHandler(err, req, res, next) {
      res.status(500);
      res.render('error', { error: err });
    });
  });

  app.start =  function() {

    app.listen(properties.port);

    serviceLocator.logger.info(properties.name + ' app starting in ' +
      app.settings.env + ' mode at ' + properties.siteUrl +
      ' (pid: ' + process.pid + ')');

  };

  return app;
};