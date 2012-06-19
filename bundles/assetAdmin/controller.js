var viewRenderDelegate = require('../../lib/viewRenderDelegate');

function createRoutes(app, properties, serviceLocator, viewPath) {

  var viewRender = viewRenderDelegate.create(viewPath)
    , compact = serviceLocator.compact;

  app.get('/admin/asset', function (req, res) {
    viewRender(req, res, 'assetAdmin', {
    });
  });

}

module.exports.createRoutes = createRoutes;