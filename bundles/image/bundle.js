module.exports = {
	name: 'Image',
	description: 'Create a route for manipulating images by cropping and resizing them',
	controllerFactories: [require('./controller').createRoutes]
};