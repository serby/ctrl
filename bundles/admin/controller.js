var viewRenderDelegate = require('../../lib/viewRenderDelegate');

module.exports.createRoutes = function(app, properties, serviceLocator, bundleViewPath) {

  var viewRender = viewRenderDelegate.create(bundleViewPath)
    , compact = serviceLocator.compact;

  function renderSetup(res, req, errors) {
    viewRender(req, res, 'setup', {
      page: {
        title: 'Setup / Admin / ' + properties.name,
        section: 'admin'
      },
      error: errors
    });
  }

  function ensureSetup(req, res, next) {
    serviceLocator.administratorModel.count({}, function(errors, count) {
      if (count === 0) {
        return renderSetup(res, req, errors);
      }
      next();
    });
  }

  app.post('/admin/setup', function(req, res, next) {
    serviceLocator.administratorModel.count({}, function(error, count) {
      if (count === 0) {
        serviceLocator.administratorModel.createWithFullAccess(req.body, function(errors, item) {
          if (errors) {
            return renderSetup(res, req, errors);
          }
          res.redirect('/admin');
        });
      } else {
        next(new Error('Forbidden'));
      }
    });
  });

  app.get(
    '/admin',
    ensureSetup,
    compact.js(['global'], ['admin-common']),
    serviceLocator.adminAccessControl.requiredAccess('Admin', 'read', properties.siteUrl + '/admin/login'),
    function(req, res) {

      viewRender(req, res, 'index', {
        page: {
          title: 'Admin / ' + properties.name,
          section: 'admin'
        }
      });
    }
  );

  app.get(
    '/admin/login',
    compact.js(['global'], ['admin-common']),
    ensureSetup,
    function (req, res) {
      viewRender(req, res, 'login', {
        page: {
          title: 'Login / Admin / ' + properties.name,
          section: 'login'
        },
        error: ''
      });
    }
  );

  app.get('/admin/logout', function(req, res) {
    serviceLocator.adminAccessControl.destroy(req, res);
    res.redirect('/admin/login');
  });

  app.post('/admin/login', function(req, res, next) {
    serviceLocator.adminAccessControl.authenticate(req, res, req.body, function(error, user) {

      if (error === null) {
        res.redirect('/admin');
      } else if (error instanceof Error) {

        viewRender(req, res, 'login', {
          page: {
            title: 'Login / Admin / ' + properties.name,
            section: 'login'
          },
          error: error.message
        });
      }
    });
  });

};