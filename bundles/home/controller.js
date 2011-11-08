var
	viewRenderDelegate = require('../../lib/viewRenderDelegate');

module.exports.createRoutes = function(app, properties, models, bundleViewPath) {
	var viewRender = viewRenderDelegate.create(bundleViewPath);

	app.get('/', function(req, res) {
		viewRender(req, res, 'index', {
			page: {
				layoutType: 'feature',
				title: 'Home ',
				section: 'home'
			},
			javascriptSrc: []
		});
	});

};