module.exports.createServer = function(properties, serviceLocator) {

  var databaseAdaptor = require('./lib/database').createDatabaseAdaptor(properties, serviceLocator)
    , sessionDatabaseAdaptor = require('./lib/database').createDatabaseAdaptor(properties, serviceLocator)
    , Application = require('./lib/expressApplication')
    , bundled
    , app
    , bundles = require('./bundles.json')
    , globalViewHelpers = require('./viewHelpers/global')
    , versionator = require('versionator').createBasic('v' + properties.version)
    , compact = require('compact').createCompact({
      srcPath: __dirname + '/public/',
      destPath: __dirname + '/public/js/compact/',
      webPath: versionator.versionPath('/js/compact/'),
      debug: properties.debug
    });

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

  app = Application.createApplication(properties, serviceLocator, sessionDatabaseAdaptor);

  serviceLocator.register('app', app);

  compact.addNamespace('global')
    .addJs('js/module.js');

  databaseAdaptor.createConnection(function(connection) {

    serviceLocator
      .register('databaseConnections', {
        main: connection
    });

    bundled.initialize(function(error) {

      // Make the bundle manager available to views
      app.configure(function() {
        app.dynamicHelpers({
          bundled: function(req, res) {
            return bundled;
          },
          serviceLocator: function(req, res) {
            return serviceLocator;
          }
        });
      });

      // Add helpers
      globalViewHelpers.createHelpers(serviceLocator, properties, app);

      app.start();

    });

  });
};