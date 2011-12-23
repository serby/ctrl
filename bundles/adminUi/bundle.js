module.exports = {
	name: 'Admin UI',
	description: 'Examples of the admin UI',
	adminNav: [{
		label: 'Admin UI',
		url: '/admin/ui',
		section: 'admin-ui',
		items: [
			{
				label: 'Grid',
				url: '/admin/ui/grid',
				section: 'admin-ui'
			},
			{
				label: 'Form Elements',
				url: '/admin/ui/form-elements',
				section: 'admin-ui'
			},
			{
				label: 'Misc UI',
				url: '/admin/ui/misc-ui',
				section: 'admin-ui',
				items: [
					{
						label: 'Thrid level menu items',
						url: '/admin/ui/misc-ui',
						section: 'admin-ui'
					}
				]
			}
		]
	}],
	register: function(app, properties, serviceLocator) {

	},
	configure: function(app, properties, serviceLocator) {

		// The resource you need access of see the admin bundles
		serviceLocator.adminAccessControlList.addResource('Admin UI');

		serviceLocator.adminAccessControlList.grant('*', 'Admin UI', 'read');
	},
	finalise: function(app, properties, serviceLocator) {
		// Create controller
		require('./controller').createRoutes(app, properties, serviceLocator, __dirname + '/views');
	}
};