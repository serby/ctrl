module.exports = createApplication

var express = require('express')
  , path = require('path')
  , stylus = require('stylus')
  , nib = require('nib')
  , MongoStore = require('connect-mongodb')
  , expressValidator = require('express-validator')
  , errorHandler = require('./http-error-handler')
  , st = require('st')
  , viewRender = require('./view-render')
  , stylusWatch = require('./stylus-watch/watch')
  , requestLogger = require('./request-logger')

function createApplication(serviceLocator, databaseAdaptor) {

  var app = express()
    , properties = serviceLocator.properties
    , dbAuth = properties.database.auth

  // Register a global viewRender function. This will be
  // able to take the view path.
  serviceLocator.register('viewRender', viewRender)

  serviceLocator.register('stylusWatch', stylusWatch)

  serviceLocator.register('stylusCompile', function stylusCompile(str, path) {
    return stylus(str)
      .use(nib())
      .set('filename', path)
      .set('warn', true)
      .set('compress', true)
      .define('versionPath', function (urlPath) {
        return new stylus.nodes.Literal('url(' + serviceLocator.versionator.versionPath(urlPath) + ')')
      })
  })

  // Register
  serviceLocator.register('httpErrorHandler', errorHandler(serviceLocator))

  // General middleware stack
  app.locals({ versionPath: serviceLocator.versionator.versionPath })

  app.set('views', __dirname + '/views')
  app.set('view engine', 'jade')

  if (properties.env === 'development') {
    app.use(requestLogger(serviceLocator))
  }

  app
    .use(express.bodyParser())
    .use(expressValidator)
    .use(express.cookieParser())
    .use(express.methodOverride())
    .use(express.session(
      { secret: 'your secret here'
      , store: new MongoStore(
          { db: databaseAdaptor.db
          , username: dbAuth ? dbAuth.username : null
          , password: dbAuth ? dbAuth.password : null
          })
      }
    ))
    .use(function (req, res, next) {
      res.locals.session = req.session

      res.locals.includes = {
        bodyStart: res.bodyStart || []
      }
      next()
    })

  // Middleware
  serviceLocator.bundled.forEach('middleware', function (middleware) {
    app.use(middleware(serviceLocator))
  })

  app
    .use(app.router)
    .use(serviceLocator.versionator.middleware)

  // Add any public folders from the bundles
  serviceLocator.bundled.forEach('publicRoute', function (publicRoute, bundle) {
    var bundlePath = path.normalize(bundle.path)
    publicRoute = path.normalize(publicRoute)

    serviceLocator.logger.debug('Adding public folder from: ' + bundle.name +
      ' path: ' + bundlePath + '/public - route: ' + publicRoute)

    var stfn

    if (properties.env !== 'development') {
      // Use aggressive caching any env that isn't development
      stfn = st(
        { path: bundlePath + '/public'
        , url: publicRoute
        , passthrough: true
        })
    } else {
      // In development, cache nothing
      stfn = st(
      { path: bundlePath + '/public'
      , url: publicRoute
      , cache: false
      , passthrough: true
      })

    }

    app.use(stfn)

  })


  function notfound(req, res, next) {
    next(new errorHandler.NotFound())
  }

  app.use(notfound)
  app.use(serviceLocator.httpErrorHandler)

  app.start = function () {

    app.listen(properties.port)

    serviceLocator.logger.info(properties.name + ' app starting in ' +
      properties.env + ' mode at ' + properties.siteUrl +
      ' (pid: ' + process.pid + ')')

  }

  return app
}
