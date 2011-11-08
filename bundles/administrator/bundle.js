module.exports = {
	name: 'Administrator',
	description: 'Manage the user who administer the site',
	adminNav: [{
			label: 'Administrators',
			url: '/admin/administrator'
		}
	],
	bootstrap: function(app, properties, serviceLocator) {

		// Register the bundles models
		serviceLocator.register('administratorModel',
			require('./lib/administratorModel').createModel(properties, serviceLocator));
	},
	configure: function(app, properties, serviceLocator) {
		// The resource you need access of see the admin bundles
		serviceLocator.adminAccessControlList.addResource('administrator');

		// This should be controlled in the database
		serviceLocator.adminAccessControlList.grant('admin', 'administrator', 'read');
		serviceLocator.adminAccessControlList.grant('admin', 'administrator', 'update');
		serviceLocator.adminAccessControlList.grant('admin', 'administrator', 'write');
		serviceLocator.adminAccessControlList.grant('admin', 'administrator', 'delete');
	},
	finalise: function(app, properties, serviceLocator) {
		// Create controllers
		require('./controller').createRoutes(app, properties, serviceLocator, __dirname + '/views');
	}
};