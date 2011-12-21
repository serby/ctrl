module.exports = {
	name: 'Home',
	description: 'Home',
	publicRoute: '/home',
	configure: function(app, properties, serviceLocator) {
		require('./controller').createRoutes(app, properties, serviceLocator, __dirname + '/views');
	}
};