module.exports.createServer = function(properties, serviceLocator) {

  var databaseAdaptor = require('./lib/database').createDatabaseAdaptor(properties, serviceLocator)
    , sessionDatabaseAdaptor = require('./lib/database').createDatabaseAdaptor(properties, serviceLocator)
    , Application = require('./lib/expressApplication')
    , bundled
    , app
    , globalViewHelpers = require('./viewHelpers/global')
    , compact = require('compact').createCompact({
        srcPath: __dirname + '/public/',
        destPath: __dirname + '/public/js/compact/',
        webPath: '/js/compact/',
        debug: true
      });

  // Register the global services needed by your entire application
  serviceLocator
    .register('uploadDelegate', require('fileupload').createFileUpload(properties.dataPath))
    .register('bundled', bundled = require('bundled')(serviceLocator, { logger: serviceLocator.logger }))
    .register('widgetManager', require('./lib/widget-manager/widget-manager').createWidgetManager({ logger: serviceLocator.logger }))
    .register('viewHelpers', {})
    .register('compact', compact);

  serviceLocator.logger.info('Starting \'' + properties.name + '\'');

  bundled.addBundles(__dirname + '/bundles/', [
    'home',
    'administrator',
    'admin',
    'rolesAdmin',
    'generic',
    'adminUi',
    'image',
    'section',
    'articleAdmin',
    'article'
  ]);


  app = Application.createApplication(properties, serviceLocator, sessionDatabaseAdaptor);

  serviceLocator.register('app', app);

  databaseAdaptor.createConnection(function(connection) {

    serviceLocator
      .register('databaseConnections', {
        main: connection
    });

    bundled.initialize();

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
};