var
	properties = require('./properties').getProperties(),
	serviceLocator = require('./lib/utils/serviceLocator').createServiceLocator(),
	nodemailer = require('nodemailer'),
	databaseAdaptor = require('./lib/database').createDatabaseAdaptor(properties),
	Application = require('./lib/expressApplication'),
	Controllers = require('./lib/bundled/controllers'),
	DomainModels = require('./lib/bundled/domainModels'),
	bundleManager = require('./lib/bundled/bundleManager').createBundleManager(serviceLocator),
	app,
	globalViewHelpers = require('./viewHelpers/global');

// Register the global services needed by your entire application
serviceLocator
	.register('mailer', nodemailer.send_mail)
	.register('logger', require('./lib/logger').createLogger(properties));

bundleManager.addBundles(__dirname + '/bundles/', [
		'home',
		'administrator',
		'admin',
		'rolesAdmin'
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
		app
			.dynamicHelpers({
				bundleManager: function(req, res) {
					return bundleManager;
				}
		});
	});

	// Add helpers
	globalViewHelpers.createHelpers(properties, app);

	app.start();
});