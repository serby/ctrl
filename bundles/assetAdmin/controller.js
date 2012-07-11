var viewRenderDelegate = require('../../lib/viewRenderDelegate')
  , createPagination = require('../../lib/utils/pagination').createPagination;

function createRoutes(app, properties, serviceLocator, viewPath) {

  var viewRender = viewRenderDelegate.create(viewPath)
    , compact = serviceLocator.compact
    , pagination = createPagination(
        serviceLocator.assetModel.count, 3
      );

  compact.addNamespace('admin-asset', __dirname + '/public')
    .addJs('js/deps/underscore.js')
    .addJs('js/deps/backbone.js')
    .addJs('js/deps/backbone.paginator.js')
    .addJs('js/deps/jquery.iframe-transport.js')
    .addJs('js/deps/jquery.fileupload.js')
    .addJs('js/models/AssetManagerModel.js')
    .addJs('js/models/AssetItemModel.js')
    .addJs('js/collections/AssetItemCollection.js')
    .addJs('js/collections/PaginatedCollection.js')
    .addJs('js/views/AssetManagerView.js')
    .addJs('js/views/FileUploadView.js')
    .addJs('js/views/AssetItemView.js')
    .addJs('js/views/AssetItemDetailsView.js')
    .addJs('js/views/PaginationView.js')
    .addJs('js/notification.js')
    .addJs('js/assetManager.js');

  compact.addNamespace('admin-asset-browser', __dirname + '/public')
    .addJs('js/assetBrowser.js');

  function assetAccess(action) {
    return serviceLocator.adminAccessControl
      .requiredAccess('Asset', action, '/admin/login');
  }


  /*
   * API routes
   */
  app.get(
    '/admin/asset/api',
    assetAccess('read'),
    function (req, res) {

      var list = req.query.type === 'image'
        ? serviceLocator.assetModel.listImages
        : serviceLocator.assetModel.list;

      if (req.query.paginate) {

        pagination(req, res, function () {

          list(req.searchOptions, function (err, results) {
            if (!err) {
              res.json({
                pagination: res.local('pagination'),
                results: results
              });
            } else {
              res.status(500).end('Format not supported');
            }
          });

        });

      } else {

        list(function (err, results) {
          if (!err) {
            if (!req.query.format) {
              res.json(results);
            } else if (req.query.format === 'redactor') {
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
            res.status(500).end('Format not supported');
          }
        });
      }
    }
  );

  app.post(
    '/admin/asset/api',
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

  /*
   * Admin routes
   */
  app.get(
    '/admin/asset*',
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

}

module.exports.createRoutes = createRoutes;
