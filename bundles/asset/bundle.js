module.exports = {
  name: 'Asset Library',
  version: '0.0.1',
  description: 'Upload and manage assets',
  adminNav: [{
    label: 'Assets',
    url: '/admin/asset',
    section: 'asset'
  }],
  initialize: [
    function(serviceLocator) {
      serviceLocator.register('assetModel',
        require('./lib/assetModel').createModel(serviceLocator.properties,
          serviceLocator));
    },
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