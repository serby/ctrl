module.exports = {
	name: 'Admin',
	description: 'Admin section for the site',
	register: function(app, properties, serviceLocator) {

		// Adding this bundle registers the admin acl
		serviceLocator.register('adminAccessControlList',
			require('../../lib/secure/accessControlList').createAccessControlList(serviceLocator.logger));

	},
	configure: function(app, properties, serviceLocator) {

		// The resource you need access of see the admin bundles
		serviceLocator.adminAccessControlList.addResource('admin home');

		serviceLocator.adminAccessControlList.grant('*', 'admin home', 'read');

		// This controls the authentication and authorisation of the admin
		serviceLocator.register('adminAccessControl',
			require('../../lib/secure/accessControl').createAccessControl(
				serviceLocator.administratorModel, serviceLocator.adminAccessControlList,
				{}, 'admin', serviceLocator.logger));
	},
	finalise: function(app, properties, serviceLocator) {
		// Create controller
		require('./controller').createRoutes(app, properties, serviceLocator, __dirname + '/views');
	}
};