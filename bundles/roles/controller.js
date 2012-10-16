module.exports = function createRoutes (serviceLocator) {

  serviceLocator.admin.routes(
    serviceLocator,
    require('./admin-view-config')(serviceLocator),
    serviceLocator.roleModel,
    {
      requiredAccess: 'Role',
      renderFn: serviceLocator.admin.viewRender()
    }
  )
}