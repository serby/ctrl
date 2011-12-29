module.exports = {
	name: 'Admin UI',
	description: 'Examples of the admin UI',
	adminNav: [{
		label: 'Admin UI',
		url: '/admin/ui',
		section: 'admin-ui',
		items: [
			{
				label: 'Form Elements',
				url: '#form-elements',
				section: 'admin-ui'
			},
			{
				label: 'Tables',
				url: '#tables',
				section: 'admin-ui'
			},
			{
				label: 'Misc UI',
				url: '#misc-ui',
				section: 'admin-ui',
				items: [
					{
						label: 'Tooltips',
						url: '#tooltips',
						section: 'admin-ui'
					},
					{
						label: 'Notifications',
						url: '#notifications',
						section: 'admin-ui'
					},
					{
						label: 'Buttons',
						url: '#buttons',
						section: 'admin-ui'
					},
					{
						label: 'Overlays',
						url: '#overlays',
						section: 'admin-ui'
					}
				]
			},
			{
				label: 'Grid',
				url: '#grid',
				section: 'admin-ui'
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