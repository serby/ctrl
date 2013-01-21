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
    function (req, res) {
      viewRender(req, res, 'index', {
        page: {
          title: 'Admin UI / ' + serviceLocator.properties.name,
          section: 'admin-ui'
        },
        error: ''
      });
  });

  serviceLocator.router.get('/admin/ui/debug',
    serviceLocator.adminAccessControl.requiredAccess('Admin UI', 'read'),
    serviceLocator.compact.js(['global'], ['admin']),
    function (req, res) {
      viewRender(req, res, 'debug', {
        page: {
          title: 'Debug Mode / Admin UI / ' + serviceLocator.properties.name,
          section: 'admin-ui'
        },
        error: ''
      });
  });

};