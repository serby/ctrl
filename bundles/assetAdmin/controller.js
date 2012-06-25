var viewRenderDelegate = require('../../lib/viewRenderDelegate');

function createRoutes(app, properties, serviceLocator, viewPath) {

  var viewRender = viewRenderDelegate.create(viewPath)
    , compact = serviceLocator.compact;

  compact.addNamespace('admin-asset', __dirname + '/public')
    .addJs('js/deps/jquery.iframe-transport.js')
    .addJs('js/deps/jquery.fileupload.js')
    .addJs('js/app.js');

  /*
   * Admin routes
   */
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

  /*
   * API routes
   */
  app.get(
    '/admin/asset/api/list',
    function (req, res) {
      serviceLocator.assetModel.list(function (err, results) {
        if (!err) {
          res.end(JSON.stringify(results));
        } else {
          res.status(500).end();
        }
      });
    }
  );

  app.post(
    '/admin/asset/api/new',
    serviceLocator.uploadDelegate.middleware,
    function (req, res) {

      var response = []
        , countdown = req.body.files.length;

      if (countdown === 0) {
        return res.end(JSON.stringify(response));
      }

      req.body.files.forEach(function (file) {

        serviceLocator.assetModel.create(file, function (err, result) {
          response.push({
            name: file.basename,
            size: file.size,
            url: '/todo'
          });
          countdown--;
          if (countdown === 0) {
            res.end(JSON.stringify(response))
          }
        });

      });

    }
  );

  app.delete('/admin/asset/api/:id', function (req, res) {

    var id = req.params.id;
    serviceLocator.assetModel.delete(id, function (err) {
      console.log(err);
      res.end('' + err);
    });

  });

}

module.exports.createRoutes = createRoutes;