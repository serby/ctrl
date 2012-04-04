module.exports = {
	createRoutes: require('./lib/genericAdminRoutes').createRoutes,
	createViewSchema: require('./lib/genericAdminViewSchema').createViewSchema,
	setRequiredProperties: require('./lib/setRequiredProperties'),
	createViewRender: function(layout) {
		return function(req, res, view, properties) {
			// Used the defined layout if not explictly set
			properties.layout = properties.layout || layout;
			res.render(view, properties);
		};
	}
};