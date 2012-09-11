var formHelper = require('../../lib/utils/formHelper')
  , viewRender = require('../../lib/viewRender')
  ;

module.exports = function createRoutes (serviceLocator, bundleViewPath) {

  serviceLocator.admin.routes(
    serviceLocator,
    require('./admin-view-schema')(serviceLocator),
    serviceLocator.administratorModel,
    {
      updateTag: 'update',
      requiredAccess: 'Administrator',
      renderFn: serviceLocator.admin.viewRender('../../admin/views/layout')
    }
  );
};