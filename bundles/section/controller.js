// Creates the routes

module.exports = function createRoutes (serviceLocator, viewPath) {

  var viewRender = serviceLocator.viewRender(viewPath)

  // The admin bundle provides a crud based generic route controller that can
  // take a model and a view-schema.
  serviceLocator.admin.routes(
    serviceLocator,
    require('./admin-view-config')(serviceLocator),
    serviceLocator.sectionModel,
      // What ACL role is needed to preform the crud actions
      { requiredAccess: 'Section'
      // Render function for the templates
      , renderFn: serviceLocator.admin.viewRender()
      }
  )

  // ### Custom Routes
  // Catch all route for matching to sections in the system.
  serviceLocator.router.get('/:section', function(req, res, next) {

    // Does the section match any of the slugs?
    serviceLocator.sectionModel.findOne( { slug: req.params.section}, function(error, section) {
      if (error) {
        next(error)
      }
      // If no section is found move on.
      if (section === null) {
        return next()
      }
      viewRender(req, res, 'index', {
        page: {
          title: section.name ,
          section: section.slug
        },
        section: section
      })
    })
  })

}