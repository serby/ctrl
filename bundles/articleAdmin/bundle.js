module.exports = {
	name: 'Article Admin',
	version: '0.0.1',
	description: 'Manage the articles on the site',
	adminNav: [{
			label: 'Article',
			url: '/admin/article',
			section: 'article',
			items: [
				{
					label: 'Add Article',
					url: '/admin/article/new'
				}
			]
		}
	],
	publicRoute: '/',
	initialize: [
		function(serviceLocator) {
		},
		function(serviceLocator) {
		},
		function(serviceLocator) {
			// Create controllers
			require('./controller').createRoutes(serviceLocator.app, serviceLocator.properties, serviceLocator, __dirname + '/views');
		}
	]
};