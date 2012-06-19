module.exports = {
  name: 'Asset Library Admin',
  version: '0.0.1',
  description: 'Upload and manage assets (admin frontend)',
  adminNav: [{
    label: 'Asset',
    url: '/admin/asset',
    section: 'asset'
  }],
  initialize: [
    function(serviceLocator) {
      // The resource you need access of see the admin bundles
      serviceLocator.adminAccessControlList.addResource('Asset');
    },
    function(serviceLocator) {
      // Create controller
      require('./controller').createRoutes(
        serviceLocator.app,
        serviceLocator.properties,
        serviceLocator,
        __dirname + '/views'
      );
    }
  ]
};