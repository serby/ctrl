module.exports = {
  name: 'Asset Library',
  version: '0.0.1',
  description: 'Upload and manage assets',
  initialize: [
    function(serviceLocator, done) {
      serviceLocator.adminAccessControlList.addResource('Asset');
      done();
    },
    function(serviceLocator, done) {
      serviceLocator.register('assetModel',
        require('./lib/assetModel')
        .createModel(serviceLocator.properties, serviceLocator));
      done();
    },
    function (serviceLocator, done) {
      require('./controller').createRoutes(
        serviceLocator.app,
        serviceLocator.properties,
        serviceLocator
      );
      done();
    }
  ]
};