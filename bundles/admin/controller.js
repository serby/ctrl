var viewRenderDelegate = require('../../lib/viewRenderDelegate');

module.exports.createRoutes = function(app, properties, serviceLocator, bundleViewPath) {
	var viewRender = viewRenderDelegate.create(bundleViewPath);

	app.get('/admin', serviceLocator.adminAccessControl.access('admin home', 'read'), function(req, res) {
		viewRender(req, res, 'index', {
			layout: 'admin/layout',
			page: {
				title: 'Admin / ' + properties.name,
				section: 'admin'
			},
			javascriptSrc: []
		});
	});

	app.get('/admin/login', function(req, res) {
		viewRender(req, res, 'login', {
			layout: 'admin/loginLayout',
			page: {
				title: 'Login / Admin / ' + properties.name,
				section: 'login'
			},
			error: '',
			javascriptSrc: []
		});
	});

	app.get('/admin/logout', function(req, res) {
		serviceLocator.adminAccessControl.destroy(req, res);
		res.redirect('/admin/login');
	});

	app.post('/admin/login', function(req, res, next) {
		serviceLocator.adminAccessControl.authenticate(req, res, req.body, function(error, user) {

			if (error === null) {
				res.redirect('/admin');
			} else if (error instanceof Error) {

				viewRender(req, res, 'login', {
					layout: 'admin/loginLayout',
					page: {
						title: 'Login / Admin / ' + properties.name,
						section: 'login'
					},
					error: error.message,
					javascriptSrc: []
				});
			}
		});
	});
};