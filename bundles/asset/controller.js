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

  function handleStream(req, res, next) {

    var data
      , calledNext = false;

    function processChunk(chunk) {
      if (!data) {
        data = chunk;
      } else {
        data += chunk;
      }
    }

    function end() {
      console.log('end');
      console.log(req.query.qqfile);
      serviceLocator.uploadDelegate.put(data, function(err, file) {
        if (!calledNext) {
          next(err, file);
          calledNext = true;
        }
      });
    }

    function close() {
      console.log('data');
      req.removeListener('end', end);
      if (!calledNext) {
        next(new Error('Connection closed'));
        calledNext = true;
      }
    }

    function error() {
      console.log('error');
      req.removeListener('end', end);
      if (!calledNext) {
        next(new Error('Connection error'));
        calledNext = true;
      }
    }

    req.on('data', processChunk);
    req.on('end', end);
    req.on('close', close);
    req.on('error', error);

  }


  app.post(
    '/admin/asset/api/new',
    serviceLocator.uploadDelegate.middleware,
    function (req, res) {

      if (req.body.files) {

        console.log(req.body.files);

      }  else {

        handleStream(req, res, function (err, file) {
          console.log(err, file);
          console.log('got it');
        });

      }

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