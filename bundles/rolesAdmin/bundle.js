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

		function reloadAcl() {
			serviceLocator.logger.info('Reloading admin ACL');
			serviceLocator.adminAccessControlList.clearGrants();
			serviceLocator.roleModel.loadAcl(serviceLocator.adminAccessControlList);
		}

		reloadAcl();

		serviceLocator.roleModel.on('onCreate', reloadAcl);
		serviceLocator.roleModel.on('onUpdate', reloadAcl);

		// The main admin account needs this role to have ultimate power.
		serviceLocator.roleModel.ensureRootRoleExisits(function(error, role) {

			if (error) {
				return serviceLocator.logger.warn('Unable to create root role', error);
			}
			if (role) {
				serviceLocator.logger.info('Role \'root\' created. ' +
					'This role has ultimate access to all resources and actions.');
			} else {
				serviceLocator.logger.info('Role \'root\' exists as expected');
			}
		});

		// Create controllers
		require('./controller').createRoutes(app, properties, serviceLocator, __dirname + '/views');
	}
};