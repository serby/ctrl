module.exports = function createRoutes (serviceLocator, bundleViewPath) {

  var viewRender = serviceLocator.viewRender(bundleViewPath)
    , compact = serviceLocator.compact


  function renderSetup(res, req, errors) {
    viewRender(req, res, 'setup', {
      page: {
        title: 'Setup / Admin / ' + serviceLocator.properties.name,
        section: 'admin'
      },
      errors: errors,
      admin: req.body
    })
  }

  function ensureSetup(req, res, next) {
    serviceLocator.administratorModel.count({}, function(error, count) {
      if (error) {
        return next(error)
      }
      if (count === 0) {
        return renderSetup(res, req, {})
      }
      next()
    })
  }

  serviceLocator.router.post('/admin/setup', function(req, res, next) {
    serviceLocator.administratorModel.count({}, function(error, count) {
      if (count === 0) {
        serviceLocator.administratorModel.createWithFullAccess(req.body,
          function(error) {

          if (error) {
            return renderSetup(res, req, error.errors)
          }
          res.redirect('/admin')
        })
      } else {
        next(new Error('Forbidden'))
      }
    })
  })

  serviceLocator.router.get(
    '/admin',
    ensureSetup,
    compact.js(['global'], ['admin']),
    serviceLocator.adminAccessControl.requiredAccess('Admin', 'read',
      serviceLocator.properties.siteUrl + '/admin/login'),

    function(req, res) {
      viewRender(req, res, 'index', {
        page: {
          title: 'Admin / ' + serviceLocator.properties.name,
          section: 'admin'
        }
      })
    }
  )

  serviceLocator.router.get(
    '/admin/login',
    compact.js(['global'], ['admin']),
    ensureSetup,
    function (req, res) {
      viewRender(req, res, 'login', {
        page: {
          title: 'Login / Admin / ' + serviceLocator.properties.name,
          section: 'login'
        },
        error: '',
        changed: req.query.changed
      })
    }
  )

  serviceLocator.router.post('/admin/login', function(req, res) {
    serviceLocator.adminAccessControl.authenticate(req, res, req.body,
      function(error) {

      if (error === null) {
        res.redirect('/admin')
      } else if (error instanceof Error) {

        viewRender(req, res, 'login', {
          page: {
            title: 'Login / Admin / ' + serviceLocator.properties.name,
            section: 'login'
          },
          error: error.message,
          changed: false
        })
      }
    })
  })

  serviceLocator.router.get('/admin/request-password-change',
    compact.js(['global'], ['admin']), ensureSetup,

    function (req, res) {
      viewRender(req, res, 'request-password-change', {
        page: {
          title: 'Request Password Change / Admin / ' +
            serviceLocator.properties.name,
          section: 'login'
        },
        error: ''
      })
    }
  )

  serviceLocator.router.post('/admin/request-password-change', ensureSetup,
    function(req, res, next) {
      var email = req.body.emailAddress

      function renderFailure(error) {
        viewRender(req, res, 'request-password-change', {
          page: {
            title: 'Request Password Change / Admin / ' +
            serviceLocator.properties.name,

            section: 'login'
          },
          error: error.message
        })
      }

      if (email) {
        serviceLocator.administratorModel.findOne({ emailAddress: email },
          function(err, admin) {

          if (!admin) {
            return renderFailure(new Error('Unknown email address'))
          }

          serviceLocator.administratorModel.requestPasswordChange(admin,
            function(err) {

            if (err) {
              return next(err)
            }

            res.redirect('/admin/login?changed=' + encodeURI(email))
          })
        })
      } else {
        renderFailure(new Error('No email address entered'))
      }
    }
  )

  serviceLocator.router.get('/admin/change-password', ensureSetup,
    compact.js(['global'], ['admin']),
    function(req, res, next) {
      serviceLocator.administratorModel.findByHash(req.query.token,
        function(err, entity) {

        if (err) {
          return next(err)
        }

        viewRender(req, res, 'change-password', {
          page: {
            title: 'Change Your Password / Admin / ' +
            serviceLocator.properties.name,
            section: 'login'
          },
          error: '',
          entity: entity
        })
      })
    }
  )

  serviceLocator.router.post('/admin/change-password', ensureSetup,
    compact.js(['global'], ['admin']),
    function(req, res, next) {
      serviceLocator.administratorModel.findByHash(req.query.token,
        function(err, entity) {

        if (err) {
          return next(err)
        }

        if (!entity) {
          return next('Invalid token')
        }

        var password = req.body.password
        if (!password || password === '') {
          viewRender(req, res, 'change-password', {
            page: {
              title: 'Change Your Password / Admin / ' +
                serviceLocator.properties.name,
              section: 'login'
            },
            error: 'Invalid password',
            entity: entity
          })
          return
        }

        serviceLocator.administratorModel.update(entity._id.toString(),
          { password: password }, { tag: 'password' },
          function(err) {
            if (err) {
              return next(err)
            }

            res.redirect('/admin/login')
          }
        )
      })
    }
  )

  serviceLocator.router.get('/admin/logout', function(req, res) {
    serviceLocator.adminAccessControl.destroy(req, res)
    res.redirect('/admin/login')
  })

}