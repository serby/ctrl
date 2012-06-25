module.exports = {
  name: 'Image',
  version: '0.0.1',
  description: 'Create a route for manipulating images by cropping and resizing them',
  initialize: [function(serviceLocator) {
    require('./lib/controller').createRoutes(
      serviceLocator.app,
      serviceLocator.properties,
      serviceLocator
    );
  }]
};