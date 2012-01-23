var
	properties = require('./properties').getProperties(),
	serviceLocator = require('service-locator').createServiceLocator(),
	nodemailer = require('nodemailer'),
	databaseAdaptor = require('./lib/database').createDatabaseAdaptor(properties, serviceLocator),
	Application = require('./lib/expressApplication'),
	bundleManager = require('./lib/bundled/bundleManager').createBundleManager(serviceLocator),
	app,
	globalViewHelpers = require('./viewHelpers/global');

// Register the global services needed by your entire application
serviceLocator
	.register('mailer', nodemailer.send_mail)
	.register('logger', require('./lib/logger').createLogger(properties))
	.register('fileupload', require('fileupload').createFileUpload(properties.dataPath));

bundleManager.addBundles(__dirname + '/bundles/', [
		'home',
		'administrator',
		'admin',
		'rolesAdmin',
		'generic',
		'adminUi'
		// 'promo',
		// 'promoAdmin',
		// 'editableContent',
		// 'editableContentAdmin',
		// 'recommendation'
]);

module.exports = app = Application.createApplication(properties, serviceLocator, bundleManager, databaseAdaptor);

databaseAdaptor.createConnection(function(connection) {

	serviceLocator
		.register('databaseConnections', {
			main: connection
	});

	bundleManager.initBundles(app, properties);

	// Make the bundle manager avaialbe to views
	app.configure(function() {
		app.dynamicHelpers({
			bundleManager: function(req, res) {
				return bundleManager;
			},
			serviceLocator: function(req, res) {
				return serviceLocator;
			}
		});
	});

	// Add helpers
	globalViewHelpers.createHelpers(properties, app);

	app.start();
});