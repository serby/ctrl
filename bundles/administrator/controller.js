var formHelper = require('../../lib/utils/formHelper')
  , viewRenderDelegate = require('../../lib/viewRenderDelegate')
  ;

module.exports.createRoutes = function(serviceLocator, bundleViewPath) {

  serviceLocator.generic.createRoutes(
    serviceLocator,
    require('./genericViewSchema')(serviceLocator),
    serviceLocator.administratorModel,
    {
      updateTag: 'update',
      requiredAccess: 'Administrator',
      renderFn: serviceLocator.generic.createViewRender('../../admin/views/layout')
    }
  );
};