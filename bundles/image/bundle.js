module.exports = {
	name: 'Image',
	description: 'Create a route for manipulating images by cropping and resizing them',
	finalise: function(app, properties, serviceLocator) {
		require('./lib/controller').createRoutes(app, properties, serviceLocator);
	}
};