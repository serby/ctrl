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
        error: '',
        changed: req.query.changed
      });
    }
  );

  app.get('/admin/request-password-change', compact.js(['global'], ['admin-common']), ensureSetup,
    function (req, res) {
      viewRender(req, res, 'requestPasswordChange', {
        page: {
          title: 'Request Password Change / Admin / ' + properties.name,
          section: 'login'
        },
        error: ''
      });
    }
  );

  app.post('/admin/request-password-change', ensureSetup,
    function(req, res, next) {
      var email = req.body.emailAddress;

      function renderFailure() {
        viewRender(req, res, 'requestPasswordChange', {
          page: {
            title: 'Request Password Change / Admin / ' + properties.name,
            section: 'login'
          },
          error: 'Unknown e-mail address'
        });
      }

      if (email) {
        serviceLocator.administratorModel.findOne({ emailAddress: email }, function(err, admin) {
          if (!admin) {
            return renderFailure();
          }

          serviceLocator.administratorModel.requestPasswordChange(admin, function(err) {
            if (err) {
              return next(err);
            }

            res.redirect('/admin/login?changed=' + encodeURI(email));
          });
        });
      } else {
        renderFailure();
      }
    }
  );

  app.get('/admin/change-password', ensureSetup, compact.js(['global'], ['admin-common']),
    function(req, res, next) {
      serviceLocator.administratorModel.findByHash(req.query.token, function(err, entity) {
        if (err) {
          return next(err);
        }

        viewRender(req, res, 'changePassword', {
          page: {
            title: 'Change Your Password / Admin / ' + properties.name,
            section: 'login'
          },
          error: '',
          entity: entity
        });
      });
    }
  );

  app.post('/admin/change-password', ensureSetup, compact.js(['global'], ['admin-common']),
    function(req, res, next) {
      serviceLocator.administratorModel.findByHash(req.query.token, function(err, entity) {
        if (err) {
          return next(err);
        }

        if (!entity) {
          return next('Invalid token');
        }

        var password = req.body.password;
        if (!password || password === '') {
          viewRender(req, res, 'changePassword', {
            page: {
              title: 'Change Your Password / Admin / ' + properties.name,
              section: 'login'
            },
            error: 'Invalid password',
            entity: entity
          });
          return;
        }

        serviceLocator.administratorModel.update(entity._id.toString(), { password: password }, { tag: 'password' },
          function(err, updated) {
            if (err) {
              return next(err);
            }

            res.redirect('/admin/login');
          }
        );
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