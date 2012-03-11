module.exports = {
	name: 'Home',
	description: 'Home',
  version: '0.0.1',
	publicRoute: '/home',
	initialize: function(serviceLocator) {
		require('./controller').createRoutes(serviceLocator.app, serviceLocator.properties, serviceLocator, __dirname + '/views');
	}
};