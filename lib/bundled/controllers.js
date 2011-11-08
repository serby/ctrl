module.exports.createControllers = function(app, properties, serviceLocator, bundleManager) {
	bundleManager.forEachProperty('controllerFactories', function(bundle, factory) {
		serviceLocator.logger.verbose('Adding controllers from: ' + bundle.name);
		factory(app, properties, serviceLocator, bundle.path + '/views');
	});

	// Make the bundle manager avaialbe to views
	app.configure(function() {
		app
			.dynamicHelpers({
				bundleManager: function(req, res) {
					return bundleManager;
				}
		});
	});
};