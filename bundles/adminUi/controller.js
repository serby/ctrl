var viewRenderDelegate = require('../../lib/viewRenderDelegate');

module.exports.createRoutes = function(app, properties, serviceLocator, bundleViewPath) {
  var viewRender = viewRenderDelegate.create(bundleViewPath);

  serviceLocator.compact
    .addNamespace('asset-browser-demo', __dirname + '/public')
    .addJs('js/asset-browser-demo.js');

  app.get('/admin/ui',
    serviceLocator.adminAccessControl.requiredAccess('Admin UI', 'read', '/admin/login'),
    serviceLocator.compact.js(
      ['global'],
      ['admin-common'],
      ['admin-asset-browser'],
      ['asset-browser-demo']
    ),
    function(req, res) {
      viewRender(req, res, 'index', {
        page: {
          title: 'Admin UI / ' + properties.name,
          section: 'admin-ui'
        },
        error: ''
      });
  });

  app.get('/admin/ui/form-elements',
    serviceLocator.adminAccessControl.requiredAccess('Admin UI', 'read', '/admin/login'),
    serviceLocator.compact.js(['global'], ['admin-common']),
    function(req, res) {
      viewRender(req, res, 'form-elements', {
        page: {
          title: 'Form Elements / Admin UI / ' + properties.name,
          section: 'admin-ui'
        },
        error: ''
      });
  });

  app.get('/admin/ui/tables',
    serviceLocator.adminAccessControl.requiredAccess('Admin UI', 'read', '/admin/login'),
    serviceLocator.compact.js(['global'], ['admin-common']),
    function(req, res) {
      viewRender(req, res, 'tables', {
        page: {
          title: 'Tables / Admin UI / ' + properties.name,
          section: 'admin-ui'
        },
        error: ''
      });
  });

  app.get('/admin/ui/grid',
    serviceLocator.adminAccessControl.requiredAccess('Admin UI', 'read', '/admin/login'),
    serviceLocator.compact.js(['global'], ['admin-common']),
    function(req, res) {
      viewRender(req, res, 'grid', {
        page: {
          title: 'Grid / Admin UI / ' + properties.name,
          section: 'admin-ui'
        },
        error: ''
      });
  });

  app.get('/admin/ui/misc-ui',
    serviceLocator.adminAccessControl.requiredAccess('Admin UI', 'read', '/admin/login'),
    serviceLocator.compact.js(
      ['global'],
      ['admin-common'],
      ['admin-asset-browser'],
      ['asset-browser-demo']
    ),
    function(req, res) {
      viewRender(req, res, 'misc-ui', {
        page: {
          title: 'Misc UI Elements / Admin UI / ' + properties.name,
          section: 'admin-ui'
        },
        error: ''
      });
  });

};