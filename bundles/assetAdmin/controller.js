var viewRenderDelegate = require('../../lib/viewRenderDelegate');

function createRoutes(app, properties, serviceLocator, viewPath) {

  var viewRender = viewRenderDelegate.create(viewPath)
    , compact = serviceLocator.compact;

  compact.addNamespace('admin-asset', __dirname + '/public')
    .addJs('js/deps/underscore.js')
    .addJs('js/deps/jquery.iframe-transport.js')
    .addJs('js/deps/jquery.fileupload.js')
    .addJs('js/assetListView.js')
    .addJs('js/assetItemModel.js')
    .addJs('js/notifier.js')
    .addJs('js/assetManager.js');

  compact.addNamespace('admin-asset-browser', __dirname + '/public')
    .addJs('js/assetBrowser.js');

  function assetAccess(action) {
    return serviceLocator.adminAccessControl
      .requiredAccess('Asset', action, '/admin/login');
  }

  /*
   * Admin routes
   */
  app.get(
    '/admin/asset',
    assetAccess('read'),
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
    assetAccess('read'),
    function (req, res) {

      var list = req.query.type === 'image'
        ? serviceLocator.assetModel.listImages
        : serviceLocator.assetModel.list;

      list(function (err, results) {
        if (!err) {
          if (req.query.format !== 'redactor') {
            res.json(results);
          } else {
            var redactorResponse = [];
            results.forEach(function (result) {
              redactorResponse.push({
                thumb: '/asset/thumb/' + result._id + '/' + result.basename,
                image: '/asset/' + result._id + '/' + result.basename
              });
            });
            res.json(redactorResponse);
          }
        } else {
          res.status(500).end();
        }
      });
    }
  );

  app.post(
    '/admin/asset/api/new',
    assetAccess('create'),
    serviceLocator.uploadDelegate.middleware,
    function (req, res) {

      var fileField;

      (['file', 'files']).some(function (field) {
        if (req.body[field]) {
          fileField = field;
          return true;
        } else {
          return false;
        }
      });

      // We can accept multiple files, but
      // redactor can only send one
      var response = req.query.format === 'redactor' ? {} : []
        , countdown = req.body[fileField].length;

      // No files were found
      if (countdown === 0) {
        return res.json(response);
      }

      req.body[fileField].forEach(function (file) {

        serviceLocator.assetModel.create(file, function (err, result) {
          if (req.query.format === 'redactor') {
            response.filelink = '/asset/' + result._id + '/' + result.basename;
          } else {
            response.push(result);
          }
          countdown--;
          if (countdown === 0) {

            if (req.query.format === 'redactor') {

              // Even though we're sending json,
              // the redactor plugin fails unless
              // the content type is set to text/html

              res.header('Content-Type', 'text/html');
              res.end(JSON.stringify(response));

            } else {
              res.json(response);
            }
          }
        });

      });

    }
  );

  app.get(
    '/admin/asset/api/:id',
    serviceLocator.adminAccessControl.requiredAccess('Asset', 'read'),
    function(req, res) {
      serviceLocator.assetModel.read(req.params.id, function(err, file) {
        if (err) {
          res.status(500);
          res.end(JSON.stringify({ error: err }));
        }
        else {
          res.end(JSON.stringify(file));
        }
      })
    }
  );

  app.delete(
    '/admin/asset/api/:id',
    serviceLocator.adminAccessControl.requiredAccess('Asset', 'delete'),
    function (req, res) {

      var id = req.params.id;
      serviceLocator.assetModel.delete(id, function (err) {
        res.json({
          success: !err
        });
      });

    }
  );

  app.put(
    '/admin/asset/api/:id',
    serviceLocator.adminAccessControl.requiredAccess('Asset', 'update'),
    function (req, res) {

      var id = req.params.id;
      serviceLocator.assetModel.update(id, req.body, function (err) {
        res.json({
          success: !err
        });
      });

    }
  );

}

module.exports.createRoutes = createRoutes;
