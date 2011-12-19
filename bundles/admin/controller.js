var viewRenderDelegate = require('../../lib/viewRenderDelegate');

module.exports.createRoutes = function(app, properties, serviceLocator, bundleViewPath) {
	var viewRender = viewRenderDelegate.create(bundleViewPath);

	function renderSetup(res, req, errors) {
		viewRender(req, res, 'setup', {
			layout: 'setupLayout',
			page: {
				title: 'Setup / Admin / ' + properties.name,
				section: 'admin'
			},
			error: errors,
			javascriptSrc: []
		});
	}

	function ensureSetup(req, res, next) {
		serviceLocator.administratorModel.count({}, function(errors, count) {
			if (count === 0) {
				return renderSetup(res, req, errors);
			}
			next();
		});
	}

	app.post('/admin/setup', function(req, res, next) {
		serviceLocator.administratorModel.count({}, function(error, count) {
			if (count === 0) {
				serviceLocator.administratorModel.createWithFullAccess(req.body, function(errors, item) {
					if (errors) {
						return renderSetup(res, req, errors);
					}
					res.redirect('/admin');
				});
			} else {
				next(new Error('Forbidden'));
			}
		});
	});

	app.get('/admin', ensureSetup,
		serviceLocator.adminAccessControl.requiredAccess('admin', 'read', '/admin/login'), function(req, res) {

		viewRender(req, res, 'index', {
			layout: 'layout',
			page: {
				title: 'Admin / ' + properties.name,
				section: 'admin'
			},
			javascriptSrc: []
		});
	});

	app.get('/admin/login', ensureSetup, function(req, res) {
		viewRender(req, res, 'login', {
			layout: 'loginLayout',
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
					layout: 'loginLayout',
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

	/** Temporary Pages **/

	app.get('/admin/form-elements',
		serviceLocator.adminAccessControl.requiredAccess('admin', 'read', '/admin/login'), function(req, res) {
			viewRender(req, res, 'ui/form-elements', {
				layout: '../layout',
				page: {
					title: 'Form Elements / Admin / ' + properties.name,
					section: 'form-elements'
				},
				error: '',
				javascriptSrc: []
			});
	});

	app.get('/admin/grid',
		serviceLocator.adminAccessControl.requiredAccess('admin', 'read', '/admin/login'), function(req, res) {
			viewRender(req, res, 'ui/grid', {
				layout: '../layout',
				page: {
					title: 'Grid / Admin / ' + properties.name,
					section: 'grid'
				},
				error: '',
				javascriptSrc: []
			});
	});

};