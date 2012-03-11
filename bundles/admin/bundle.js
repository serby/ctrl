module.exports = {
	name: 'Admin',
	version: '0.0.1',
	description: 'Admin section for the site',
	middleware: [
		function(serviceLocator) {
			return function(req, res, next) {
				serviceLocator.adminAccessControl.isAllowed(req, res, 'Admin Bar', 'read', function(error, allowed) {
					if (allowed) {
						res.bodyStart = [__dirname + '/views/adminBar.jade'];
					}
					next();
				});
			};
		}
	],
	initialize: [
		function(serviceLocator, done) {

			// Adding this bundle registers the admin acl
			serviceLocator.register('adminAccessControlList',
				require('../../lib/secure/accessControlList').createAccessControlList(serviceLocator.logger));
			done();
		},
		function(serviceLocator, done) {

			// The resource you need access of see the admin bundles
			serviceLocator.adminAccessControlList.addResource('Admin');
			serviceLocator.adminAccessControlList.addResource('Admin Bar');

			// This controls the authentication and authorisation of the admin
			serviceLocator.register('adminAccessControl',
				require('../../lib/secure/accessControl').createAccessControl(
					serviceLocator.administratorModel, serviceLocator.adminAccessControlList,
					{}, 'admin', serviceLocator.logger));
			done();
		},
		function(serviceLocator, done) {
			// Create controller
			require('./controller').createRoutes(serviceLocator.app, serviceLocator.properties, serviceLocator, __dirname + '/views');
			done();
		}
	]
};