module.exports = {
	name: 'Administrator',
	version: '0.0.1',
	description: 'Manage the user who administer the site',
	adminNav: [{
			label: 'Administrators',
			url: '/admin/administrator',
			section: 'administrator',
			items: [
				{
					label: 'Add Administrator',
					url: '/admin/administrator/new'
				}
			]
		}
	],
	initialize: [
		function(serviceLocator) {

			// Register the bundles models
			serviceLocator.register('administratorModel',
				require('./lib/administratorModel').createModel(serviceLocator.properties, serviceLocator));
		},
		function(serviceLocator) {
			// The resource you need access of see the admin bundles
			serviceLocator.adminAccessControlList.addResource('Administrator');

		},
		function(serviceLocator) {
			// Create controllers
			require('./controller').createRoutes(serviceLocator.app,
				serviceLocator.properties, serviceLocator, __dirname + '/views');
		}
	]
};