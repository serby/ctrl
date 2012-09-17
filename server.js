module.exports = function createServer(serviceLocator) {

  var properties = serviceLocator.properties
    , databaseAdaptor = require('./lib/database')(serviceLocator)
    , sessionDatabaseAdaptor = require('./lib/database')(serviceLocator)
    , bundled
    , app
    , bundles = require('./bundles.json')
    , versionator = require('versionator').createBasic('v' + properties.version)
    , compact = require('compact').createCompact({
      srcPath: __dirname + '/public/',
      destPath: __dirname + '/public/js/compact/',
      webPath: versionator.versionPath('/js/compact/'),
      debug: properties.debug
    })
    ;

  // Register the global services needed by your entire application
  serviceLocator
    .register('uploadDelegate', require('fileupload').createFileUpload(properties.dataPath))
    .register('bundled', bundled = require('bundled')(serviceLocator, { logger: serviceLocator.logger }))
    .register('widgetManager', require('./lib/widget-manager/widget-manager').createWidgetManager({ logger: serviceLocator.logger }))
    .register('viewHelpers', {})
    .register('compact', compact)
    .register('versionator', versionator)
    ;

  serviceLocator.logger.info('Starting \'' + properties.name + '\'');

  bundled.addBundles(__dirname + '/bundles/',
    bundles
  );

  app = require('./lib/express-application')(serviceLocator, sessionDatabaseAdaptor);

  serviceLocator.register('app', app);
  serviceLocator.register('router', app);

  databaseAdaptor.createConnection(function(connection) {

    serviceLocator
      .register('databaseConnections', {
        main: connection
    });

    bundled.initialize(function(error) {

      // Make the bundle manager available to views
      app.locals(
        { bundled: bundled
        , serviceLocator: serviceLocator
        , properties: properties
        });

      // Add helpers
      require('./lib/view-helpers.js')(serviceLocator, app);

      app.start();

    });

  });
};