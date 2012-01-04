module.exports = {
	name: 'Roles',
	description: 'Manage the user who administer the site',
	adminNav: [{
		label: 'Roles',
		url: '/admin/role',
		section: 'role',
		items: [
			{
				label: 'Add Role',
				url: '/admin/role/new'
			}
		]
	}],
	register: function(app, properties, serviceLocator) {

		// Register the bundles models
		serviceLocator.register('roleModel',
			require('./lib/roleModel').createModel(properties, serviceLocator));
	},
	configure: function(app, properties, serviceLocator) {
		// The resource you need access of see the admin bundles
		serviceLocator.adminAccessControlList.addResource('Role');
	},
	finalise: function(app, properties, serviceLocator) {
		// Create controllers
		require('./controller').createRoutes(app, properties, serviceLocator, __dirname + '/views');
	}
};