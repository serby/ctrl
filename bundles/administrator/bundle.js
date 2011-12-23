module.exports = {
	name: 'Administrator',
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
	register: function(app, properties, serviceLocator) {

		// Register the bundles models
		serviceLocator.register('administratorModel',
			require('./lib/administratorModel').createModel(properties, serviceLocator));
	},
	configure: function(app, properties, serviceLocator) {
		// The resource you need access of see the admin bundles
		serviceLocator.adminAccessControlList.addResource('Administrator');

		// This should be controlled in the database
		serviceLocator.adminAccessControlList.grant('*', 'Administrator', 'create');
		serviceLocator.adminAccessControlList.grant('*', 'Administrator', 'read');
		serviceLocator.adminAccessControlList.grant('*', 'Administrator', 'update');
		serviceLocator.adminAccessControlList.grant('*', 'Administrator', 'delete');
	},
	finalise: function(app, properties, serviceLocator) {
		// Create controllers
		require('./controller').createRoutes(app, properties, serviceLocator, __dirname + '/views');
	}
};