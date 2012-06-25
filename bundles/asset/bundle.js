module.exports = {
  name: 'Asset Library',
  version: '0.0.1',
  description: 'Upload and manage assets',
  initialize: [
    function(serviceLocator) {
      serviceLocator.register('assetModel',
        require('./lib/assetModel')
        .createModel(serviceLocator.properties, serviceLocator));
    },
    function(serviceLocator) {
      serviceLocator.adminAccessControlList.addResource('Asset');
    }
  ]
};