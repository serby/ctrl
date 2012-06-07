module.exports = {
  name: 'Image',
  version: '0.0.1',
  description: 'Create a route for manipulating images by cropping and resizing them',
  finalise: function(app, properties, serviceLocator) {
    require('./lib/controller').createRoutes(app, properties, serviceLocator);
  }
};