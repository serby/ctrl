var formHelper = require('../../lib/utils/formHelper')
  , viewRenderDelegate = require('../../lib/viewRenderDelegate')
  ;

module.exports.createRoutes = function(serviceLocator, bundleViewPath) {

  serviceLocator.admin.routes(
    serviceLocator,
    require('./genericViewSchema')(serviceLocator),
    serviceLocator.roleModel,
    {
      requiredAccess: 'Role',
      renderFn: serviceLocator.admin.viewRender('../../admin/views/layout')
    }
  );
};