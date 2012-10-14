var express = require('express')
  , path = require('path')
  , stylus = require('stylus')
  , nib = require('nib')
  , MongoStore = require('connect-mongodb')
  , expressValidator = require('express-validator')
  , http = require('http')
  , st = require('st')
  , send = require('send')
  , url = require('url')

module.exports = function createApplication(serviceLocator, databaseAdaptor) {

  var app = express()
    , properties = serviceLocator.properties
    , dbAuth = properties.database.auth

  // Register a global viewRender function. This will be able to take the view
  // path.
  serviceLocator.register('viewRender', require('./view-render'))

  serviceLocator.register('stylusWatch', require('./stylus-watch/watch'))

  serviceLocator.register('stylusCompile', function stylusCompile(str, path) {
    return stylus(str)
      .use(nib({ logger: serviceLocator.logger }))
      .set('filename', path)
      .set('warn', true)
      .set('compress', true)
      .define('versionPath', function(urlPath) {
        return new stylus.nodes.Literal('url(' + serviceLocator.versionator.versionPath(urlPath) + ')')
      })
  })

  // Register
  serviceLocator.register('httpErrorHandler', require('./http-error-handler'))

  // General middleware stack
  app
    .locals({ versionPath: serviceLocator.versionator.versionPath })

  app.set('views', __dirname + '/views')
  app.set('view engine', 'jade')

  if (properties.env === 'development') {
    app.use(express.logger('dev'))
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
    .use(function(req, res, next) {
      res.locals.session = req.session

      res.locals.includes = {
        bodyStart: res.bodyStart || []
      }
      next()
    })

  // Middleware
  serviceLocator.bundled.forEach('middleware', function(middleware) {
    app.use(middleware(serviceLocator))
  })

  app.use(app.router)
    .use(serviceLocator.versionator.middleware)

  // Add any public folders from the bundles
  serviceLocator.bundled.forEach('publicRoute', function(publicRoute, bundle) {
    var bundlePath = path.normalize(bundle.path)
    publicRoute = path.normalize(publicRoute)

    serviceLocator.logger.verbose('Adding public folder from: ' + bundle.name +
      ' path: ' + bundlePath + '/public - route: ' + publicRoute)

    if (properties.env === 'development') {
      // In development don't cache static assets. This allows for stylus to be
      // recompiled and server without restarting node process
      app.use(function(req, res, next) {
        var p = url.parse(req.url).pathname
        if (publicRoute === p.substring(0, publicRoute.length)) {
          send(req, p.substring(publicRoute.length))
            .root(bundlePath + '/public').pipe(res)
        } else {
          next()
        }
      })
    } else {
      // For all other envs use st's aggressive default caching
      app.use(st({ path: bundlePath + '/public', url: publicRoute }))
    }
  })

  function errorHandler(err, req, res) {

    if (typeof err.code === 'undefined') {
      err.code = 500
    } else if (typeof err.message === 'undefined') {
      err.message = 'Internal server error'
    } else if (!serviceLocator.errorPage) {

      res.status(err.code)
      res.setHeader('content-type', 'text/plain')
      res.end(http.STATUS_CODES[err.code || 500] + '\n')

    } else {

      if (err.code && err.message) {
        res.status(err.code)
            res.render(serviceLocator.errorPage,
              { status: err.code
              , message: err.message })
      } else {
        res.status(500).render(serviceLocator.errorPage,
          { status: 500
          , message: 'Internal server Error' })
      }

    }

    if (err.stack) {
      serviceLocator.logger.error(err.stack)
    } else {
      serviceLocator.logger.error(err)
    }

  }

  function notfound(req, res, next) {
    var err = new Error('NotFound')
    err.code = 404
    err.message = 'Not Found'
    next(err)
  }

  app.use(notfound)
  app.use(errorHandler)

  app.start =  function() {

    app.listen(properties.port)

    serviceLocator.logger.info(properties.name + ' app starting in ' +
      properties.env + ' mode at ' + properties.siteUrl +
      ' (pid: ' + process.pid + ')')

  }

  return app
}