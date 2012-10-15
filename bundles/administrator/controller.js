module.exports = function createRoutes (serviceLocator) {
  serviceLocator.admin.routes(
    serviceLocator,
    require('./admin-view-config')(serviceLocator),
    serviceLocator.administratorModel,
    {
      updateTag: 'update',
      requiredAccess: 'Administrator',
      renderFn: serviceLocator.admin.viewRender()
    }
  )
}