module.exports = function createServer(serviceLocator) {

  var properties = serviceLocator.properties
    , createAdaptor = require('./lib/database/create-adaptor')
    , databaseAdaptor = createAdaptor(serviceLocator)
    , sessionDatabaseAdaptor = createAdaptor(serviceLocator)
    , bundled
    , app
    , bundles = require('./bundles.json')
    , versionator = require('versionator').createBasic('v' + properties.version)


  // Register the global services needed by your entire application
  serviceLocator
    .register('uploadDelegate', require('fileupload').createFileUpload(properties.dataPath))
    .register('bundled', bundled = require('bundled')(serviceLocator, { logger: serviceLocator.logger }))
    .register('widgetManager', require('./lib/widget-manager/widget-manager').createWidgetManager({ logger: serviceLocator.logger }))
    .register('viewHelpers', {})
    .register('versionator', versionator)


  serviceLocator.logger.info('Starting \'' + properties.name + '\'')

  bundled.addBundles(__dirname + '/bundles/',
    bundles
  )

  app = require('./lib/web-stack')(serviceLocator, sessionDatabaseAdaptor)

  serviceLocator.register('app', app)
  serviceLocator.register('router', app)

  databaseAdaptor.createConnection(function(error, connection) {

    if (error) {
      // Die the database can't be connected to
      process.exit(1)
    }

    serviceLocator
      .register('databaseConnections', {
        main: connection
    })

    bundled.initialize(function() {

      // Make the bundle manager available to views
      app.locals(
        { bundled: bundled
        , serviceLocator: serviceLocator
        , properties: properties
        })

      // Add helpers
      require('./lib/view-helpers.js')(serviceLocator, app)

      app.start()

    })

  })
}