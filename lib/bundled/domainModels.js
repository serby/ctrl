var
	path = require('path');

module.exports.createDomainModels = function(properties, serviceLocator, bundleManager) {
	var self = {};

	bundleManager.get('modelFactories').forEach(function(model) {

		serviceLocator.logger.verbose('Registering Model: ' + model.name);

		serviceLocator.register(model.name,
			model.factory(properties, serviceLocator, serviceLocator.databaseConnections.main));

	});

	return self;
};