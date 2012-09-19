// Creates the routes

module.exports = function createRoutes (serviceLocator, bundleViewPath) {

  // The admin bundle provides a crud based generic route controller that can
  // take a model and a view-schema.
  serviceLocator.admin.routes(
    serviceLocator,
    require('./section-view-schema')(serviceLocator),
    serviceLocator.sectionModel,
      // What ACL role is needed to preform the crud actions
      { requiredAccess: 'Section'
      // Render function for the templates
      , renderFn: serviceLocator.admin.viewRender()
      }
  );

  // ### Custom Routes
  // Catch all route for matching to sections in the system.
  serviceLocator.router.get('/:section', function(req, res, next) {

    // Does the section match any of the slugs?
    serviceLocator.sectionModel.find( { slug: req.params.section}, function(error, section) {
      if (error) {
        next(error);
      }
      // If no section is found move on.
      if (section.length === 0) {
        return next();
      }
      res.send(section[0].name);
      res.end();
    });
  });

};