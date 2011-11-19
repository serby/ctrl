module.exports = {
	name: 'Home',
	description: 'Home',
	publicFolder: 'public',
	configure: function(app, properties, serviceLocator) {
		require('./controller').createRoutes(app, properties, serviceLocator, __dirname + '/views');
	}
};