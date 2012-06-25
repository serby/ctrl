var viewRenderDelegate = require('../../lib/viewRenderDelegate');

function createRoutes(app, properties, serviceLocator, viewPath) {

  var viewRender = viewRenderDelegate.create(viewPath)
    , compact = serviceLocator.compact;

  compact.addNamespace('admin-asset', __dirname + '/public')
    .addJs('js/deps/fileuploader.js')
    .addJs('js/app.js');

  app.get(
    '/admin/asset',
    compact.js(['global'], ['admin-common'], ['admin-asset']),
    function (req, res) {
      viewRender(req, res, 'assetAdmin', {
        page: {
          title: 'Asset Manager',
          section: 'asset'
        }
      });
    }
  );

}

module.exports.createRoutes = createRoutes;