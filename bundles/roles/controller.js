var formHelper = require('../../lib/utils/formHelper')
  , viewRenderDelegate = require('../../lib/viewRenderDelegate')
  ;

module.exports.createRoutes = function(serviceLocator, bundleViewPath) {

  serviceLocator.generic.createRoutes(
    serviceLocator,
    require('./genericViewSchema')(serviceLocator),
    serviceLocator.roleModel,
    {
      requiredAccess: 'Role',
      renderFn: serviceLocator.generic.createViewRender('../../admin/views/layout')
    }
  );
};