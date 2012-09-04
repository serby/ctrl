module.exports = {
  createRoutes: require('./lib/genericAdminRoutes').createRoutes,
  createViewSchema: require('./lib/genericAdminViewSchema').createViewSchema,
  setRequiredProperties: require('./lib/setRequiredProperties'),
  createViewRender: function(layout) {
    return function(req, res, view, properties) {
      res.render(view, properties);
    };
  }
};