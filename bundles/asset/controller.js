var viewRenderDelegate = require('../../lib/viewRenderDelegate'),
    generic = require('../generic');

function createRoutes(app, properties, serviceLocator, viewPath) {

  var viewRender = viewRenderDelegate.create(viewPath)
    , compact = serviceLocator.compact;

  var viewSchema = generic.createViewSchema({
    groups: [{
      name: 'Asset',
      description: 'Blah',
      properties: {
        path: {
          list: true,
          view: true,
          editForm: true,
          createForm: true,
          searchType: 'text'
        },
        created: {
          list: true,
          view: true
        }
      }
    }],
    title: 'title'
  });

  // generic.createRoutes(
  //   app,
  //   generic.createViewRender('../../admin/views/layout'),
  //   viewSchema,
  //   serviceLocator.assetModel,
  //   serviceLocator,
  //   {
  //     requiredAccess: 'Asset'
  //   }
  // );


  app.get(
    '/admin/asset',
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
    '/admin/asset/new',
    serviceLocator.uploadDelegate.middleware,
    function (req, res) {
      req.body.files.forEach(function (file) {
        serviceLocator.assetModel.create(file, function (err, results) {
          if (!err) {
            res.end(JSON.stringify(results));
          } else {
            res.status(500).end();
          }
        });
      });
    }
  );

  app.delete('/admin/asset/:id', function (req, res) {

    var id = req.params.id;
    serviceLocator.assetModel.delete(id, function (err) {
      console.log(err);
      res.end('' + err);
    });

  });

}

module.exports.createRoutes = createRoutes;