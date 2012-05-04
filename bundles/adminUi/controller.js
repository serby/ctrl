var viewRenderDelegate = require('../../lib/viewRenderDelegate');

module.exports.createRoutes = function(app, properties, serviceLocator, bundleViewPath) {
  var viewRender = viewRenderDelegate.create(bundleViewPath);

  app.get('/admin/ui',
    serviceLocator.adminAccessControl.requiredAccess('Admin UI', 'read'),
    function(req, res) {
      viewRender(req, res, 'index', {
        layout: '../../admin/views/layout',
        page: {
          title: 'Admin UI / ' + properties.name,
          section: 'admin-ui'
        },
        error: ''
      });
  });

  app.get('/admin/ui/form-elements',
    serviceLocator.adminAccessControl.requiredAccess('Admin UI', 'read'),
    function(req, res) {
      viewRender(req, res, 'form-elements', {
        layout: '../../admin/views/layout',
        page: {
          title: 'Form Elements / Admin UI / ' + properties.name,
          section: 'admin-ui'
        },
        error: ''
      });
  });

  app.get('/admin/ui/tables',
    serviceLocator.adminAccessControl.requiredAccess('Admin UI', 'read'),
    function(req, res) {
      viewRender(req, res, 'tables', {
        layout: '../../admin/views/layout',
        page: {
          title: 'Tables / Admin UI / ' + properties.name,
          section: 'admin-ui'
        },
        error: ''
      });
  });

  app.get('/admin/ui/grid',
    serviceLocator.adminAccessControl.requiredAccess('Admin UI', 'read'),
    function(req, res) {
      viewRender(req, res, 'grid', {
        layout: '../../admin/views/layout',
        page: {
          title: 'Grid / Admin UI / ' + properties.name,
          section: 'admin-ui'
        },
        error: ''
      });
  });

  app.get('/admin/ui/misc-ui',
    serviceLocator.adminAccessControl.requiredAccess('Admin UI', 'read'),
    function(req, res) {
      viewRender(req, res, 'misc-ui', {
        layout: '../../admin/views/layout',
        page: {
          title: 'Misc UI Elements / Admin UI / ' + properties.name,
          section: 'admin-ui'
        },
        error: ''
      });
  });

};