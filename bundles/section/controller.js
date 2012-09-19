module.exports = function createRoutes (serviceLocator, bundleViewPath) {

  serviceLocator.admin.routes(
    serviceLocator,
    require('./section-view-schema')(serviceLocator),
    serviceLocator.sectionModel,
    {
      updateTag: 'update',
      requiredAccess: 'Section',
      renderFn: serviceLocator.admin.viewRender()
    }
  );

  serviceLocator.router.get('/:section', function(req, res, next) {
    serviceLocator.sectionModel.find( { slug: req.params.section}, function(error, section) {
      if (error) {
        next(error);
      }
      if (section.length === 0) {
        return next();
      }
      res.send(section[0].name);
      res.end();
    });
  });

};