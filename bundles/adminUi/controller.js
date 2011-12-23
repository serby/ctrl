var viewRenderDelegate = require('../../lib/viewRenderDelegate');

module.exports.createRoutes = function(app, properties, serviceLocator, bundleViewPath) {
	var viewRender = viewRenderDelegate.create(bundleViewPath);

	app.get('/admin/ui/form-elements',
		serviceLocator.adminAccessControl.requiredAccess('Admin UI', 'read'),
		function(req, res) {
			viewRender(req, res, 'form-elements', {
				layout: '../../admin/views/layout',
				page: {
					title: 'Form Elements / Admin / ' + properties.name,
					section: 'admin-ui'
				},
				error: '',
				javascriptSrc: []
			});
	});

	app.get('/admin/ui',
		serviceLocator.adminAccessControl.requiredAccess('Admin UI', 'read'),
		function(req, res) {
			viewRender(req, res, 'grid', {
				layout: '../../admin/views/layout',
				page: {
					title: 'Grid / Admin / ' + properties.name,
					section: 'admin-ui'
				},
				error: '',
				javascriptSrc: []
			});
	});

	app.get('/admin/ui/grid',
		serviceLocator.adminAccessControl.requiredAccess('Admin UI', 'read'),
		function(req, res) {
			viewRender(req, res, 'grid', {
				layout: '../../admin/views/layout',
				page: {
					title: 'Grid / Admin / ' + properties.name,
					section: 'admin-ui'
				},
				error: '',
				javascriptSrc: []
			});
	});

	app.get('/admin/ui/misc-ui',
		serviceLocator.adminAccessControl.requiredAccess('Admin UI', 'read'),
		function(req, res) {
			viewRender(req, res, 'misc-ui', {
				layout: '../../admin/views/layout',
				page: {
					title: 'Miscellaneous UI Elements / Admin / ' + properties.name,
					section: 'admin-ui'
				},
				error: '',
				javascriptSrc: []
			});
	});

};