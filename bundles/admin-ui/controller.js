module.exports = function createRoutes (serviceLocator, bundleViewPath) {

  var viewRender = serviceLocator.viewRender(bundleViewPath);

  serviceLocator.compact
    .addNamespace('asset-browser-demo', __dirname + '/public')
    .addJs('js/asset-browser-demo.js');

  serviceLocator.router.get('/admin/ui',
    serviceLocator.adminAccessControl.requiredAccess('Admin UI', 'read'),
    serviceLocator.compact.js(
      ['global'],
      ['admin']
    ),
    function(req, res) {
      viewRender(req, res, 'index', {
        page: {
          title: 'Admin UI / ' + serviceLocator.properties.name,
          section: 'admin-ui'
        },
        error: ''
      });
  });

  serviceLocator.router.get('/admin/ui/form-elements',
    serviceLocator.adminAccessControl.requiredAccess('Admin UI', 'read'),
    serviceLocator.compact.js(['global'], ['admin']),
    function(req, res) {
      viewRender(req, res, 'form-elements', {
        page: {
          title: 'Form Elements / Admin UI / ' + serviceLocator.properties.name,
          section: 'admin-ui'
        },
        error: ''
      });
  });

  serviceLocator.router.get('/admin/ui/tables',
    serviceLocator.adminAccessControl.requiredAccess('Admin UI', 'read'),
    serviceLocator.compact.js(['global'], ['admin']),
    function(req, res) {
      viewRender(req, res, 'tables', {
        page: {
          title: 'Tables / Admin UI / ' + serviceLocator.properties.name,
          section: 'admin-ui'
        },
        error: ''
      });
  });

  serviceLocator.router.get('/admin/ui/grid',
    serviceLocator.adminAccessControl.requiredAccess('Admin UI', 'read'),
    serviceLocator.compact.js(['global'], ['admin']),
    function(req, res) {
      viewRender(req, res, 'grid', {
        page: {
          title: 'Grid / Admin UI / ' + serviceLocator.properties.name,
          section: 'admin-ui'
        },
        error: ''
      });
  });

  serviceLocator.router.get('/admin/ui/misc-ui',
    serviceLocator.adminAccessControl.requiredAccess('Admin UI', 'read'),
    serviceLocator.compact.js(
      ['global'],
      ['admin']
    ),
    function(req, res) {
      viewRender(req, res, 'misc-ui', {
        page: {
          title: 'Misc UI Elements / Admin UI / ' + serviceLocator.properties.name,
          section: 'admin-ui'
        },
        error: ''
      });
  });

};